"""Official Printful API client. Credentials stay in Windows Credential Manager."""
from __future__ import annotations

import ctypes
from ctypes import wintypes
import json
from pathlib import Path
import re
import time
import urllib.error
import urllib.parse
import urllib.request

STORE_ID = 18982909
CREDENTIAL_TARGET = "OFFSHFT_Printful_Setup"
BASE_URL = "https://api.printful.com"
PRIVATE_DIR = Path(__file__).resolve().parent / "private"


class Credential(ctypes.Structure):
    _fields_ = [
        ("Flags", wintypes.DWORD), ("Type", wintypes.DWORD),
        ("TargetName", wintypes.LPWSTR), ("Comment", wintypes.LPWSTR),
        ("LastWritten", wintypes.FILETIME),
        ("CredentialBlobSize", wintypes.DWORD),
        ("CredentialBlob", ctypes.POINTER(ctypes.c_ubyte)),
        ("Persist", wintypes.DWORD), ("AttributeCount", wintypes.DWORD),
        ("Attributes", ctypes.c_void_p), ("TargetAlias", wintypes.LPWSTR),
        ("UserName", wintypes.LPWSTR),
    ]


def read_setup_credential() -> str:
    """Read only the expressly approved credential; never enumerate the vault."""
    api = ctypes.WinDLL("advapi32", use_last_error=True)
    pointer = ctypes.POINTER(Credential)()
    api.CredReadW.argtypes = [wintypes.LPCWSTR, wintypes.DWORD,
                             wintypes.DWORD, ctypes.POINTER(ctypes.POINTER(Credential))]
    api.CredReadW.restype = wintypes.BOOL
    api.CredFree.argtypes = [ctypes.c_void_p]
    if not api.CredReadW(CREDENTIAL_TARGET, 1, 0, ctypes.byref(pointer)):
        raise RuntimeError(f"Approved setup credential unavailable (Windows {ctypes.get_last_error()})")
    try:
        raw = ctypes.string_at(pointer.contents.CredentialBlob,
                               pointer.contents.CredentialBlobSize)
        token = raw.decode("utf-16-le").rstrip("\x00")
        if len(token) < 30 or any(ch.isspace() for ch in token):
            raise RuntimeError("Approved setup credential has an unexpected format")
        return token
    finally:
        api.CredFree(pointer)


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise RuntimeError("Refusing to redirect an authenticated API request")


def get(path: str) -> dict:
    if not path.startswith("/") or path.startswith("//"):
        raise ValueError("Expected a relative official API path")
    url = BASE_URL + path
    if urllib.parse.urlsplit(url).netloc != "api.printful.com":
        raise ValueError("Unexpected API destination")
    request = urllib.request.Request(url, headers={
        "Authorization": "Bearer " + read_setup_credential(),
        "X-PF-Store-Id": str(STORE_ID),
        "Accept": "application/json",
        "User-Agent": "OFF-SHFT-catalogue-setup/1.0",
    }, method="GET")
    try:
        with urllib.request.build_opener(NoRedirect).open(request, timeout=45) as response:
            result = json.load(response)
    except urllib.error.HTTPError as exc:
        raise RuntimeError(f"Printful GET {urllib.parse.urlsplit(path).path}: HTTP {exc.code}") from None
    if result.get("code") not in (None, 200):
        raise RuntimeError("Printful returned an unsuccessful API result")
    return result


def validate_mutation(method: str, path: str, payload: dict,
                      existing_ids: set[int] | None = None) -> None:
    """Limit this setup client to artwork and fulfilment mappings only."""
    allowed = {'variant_id', 'files', 'options', 'is_ignored'}
    if method == 'POST' and path == '/files':
        if set(payload) - {'url', 'filename', 'visible'}:
            raise ValueError('Unexpected file-upload field')
        source = urllib.parse.urlsplit(payload.get('url', ''))
        if (source.scheme != 'https' or source.netloc != 'raw.githubusercontent.com'
                or not re.fullmatch(r'/bobbyvicks/offshft/[A-Za-z0-9_-]+/store/printful-setup/[A-Za-z0-9_./-]+\.png', source.path)
                or source.query or source.fragment or '/..' in source.path):
            raise ValueError('Expected a published OFF SHFT production PNG')
        return
    if method == 'PUT' and re.fullmatch(r'/sync/variant/[0-9]+', path):
        if not payload or set(payload) - allowed:
            raise ValueError('Variant update would change unrelated fields')
        return
    raise ValueError('Mutation outside the approved product/file setup scope')


def mutate(method: str, path: str, payload: dict,
           existing_ids: set[int] | None = None) -> dict:
    """No orders, prices, images or deletion; no automatic retries."""
    validate_mutation(method, path, payload, existing_ids)
    PRIVATE_DIR.mkdir(exist_ok=True)
    pacing = PRIVATE_DIR / 'last-mutation.json'
    if pacing.exists():
        delay = 7 - (time.time() - json.loads(pacing.read_text())['time'])
        if delay > 8:
            raise RuntimeError('Mutation pacing clock mismatch')
        if delay > 0:
            time.sleep(delay)
    pacing.write_text(json.dumps({'time': time.time()}), encoding='utf-8')
    request = urllib.request.Request(BASE_URL + path,
        data=json.dumps(payload).encode('utf-8'), headers={
            'Authorization': 'Bearer ' + read_setup_credential(),
            'X-PF-Store-Id': str(STORE_ID),
            'Content-Type': 'application/json', 'Accept': 'application/json',
            'User-Agent': 'OFF-SHFT-catalogue-setup/1.0',
        }, method=method)
    try:
        with urllib.request.build_opener(NoRedirect).open(request, timeout=45) as response:
            result = json.load(response)
    except urllib.error.HTTPError as exc:
        # Persist supplier diagnostics privately; never serialize request headers.
        try:
            details = json.load(exc)
            (PRIVATE_DIR / 'last-mutation-error.json').write_text(
                json.dumps(details, indent=2), encoding='utf-8')
        except (ValueError, OSError):
            pass
        raise RuntimeError(f'Printful {method} {path}: HTTP {exc.code}; see private diagnostics') from None
    if result.get('code') not in (None, 200, 201):
        raise RuntimeError('Printful returned an unsuccessful mutation result')
    return result


def snapshot() -> None:
    stores = get("/stores")
    authorized = stores.get("result", [])
    if len(authorized) != 1 or int(authorized[0]["id"]) != STORE_ID:
        raise RuntimeError("Store restriction did not match the approved OFF SHFT store")
    products = get("/sync/products?limit=100&offset=0")
    PRIVATE_DIR.mkdir(exist_ok=True)
    (PRIVATE_DIR / "stores.json").write_text(json.dumps(stores, indent=2), encoding="utf-8")
    (PRIVATE_DIR / "products.json").write_text(json.dumps(products, indent=2), encoding="utf-8")
    print(json.dumps({
        "credentialFound": True,
        "authorizedStoreId": STORE_ID,
        "authorizedStoreName": authorized[0].get("name"),
        "productCount": len(products.get("result", [])),
        "total": products.get("paging", {}).get("total"),
        "products": [{key: item.get(key) for key in
                      ("id", "external_id", "name", "variants", "synced", "is_ignored")}
                     for item in products.get("result", [])],
        "requests": "Read-only; no product mutation or order request",
    }, indent=2))


if __name__ == "__main__":
    snapshot()
