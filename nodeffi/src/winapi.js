'use strict';

var ffi = require("ffi");
var ref = require("ref");
var Struct = require("ref-struct");
var arrayType = require("ref-array");

var windows = {};

/**
* A map between Windows and C types.
* https://msdn.microsoft.com/en-us/library/windows/desktop/aa383751%28v=vs.85%29.aspx
*/
windows.types = {
    "BOOL": "int",
    "INT": "int",
    "UINT": "uint",
    "ULONG": "ulong",
    "DWORD": "ulong",
    "HKL": "void*",
    "ULONG_PTR": "ulong",
    "LONG": "long",
    "HANDLE": "uint32",
    "WORD": "uint16",
    "TCHAR": "uint16"  // assuming unicode. (ASCII is char, UNICODE is WCHAR -&gt; wchar_t -&gt; unsigned short === UINT16 === uint16
};

var t = windows.types;
// https://msdn.microsoft.com/en-us/library/windows/desktop/dd183565(v=vs.85).aspx

var CCHDEVICENAME = 32;
var CCHFORMNAME = 32;

windows.DEVMODEW = new Struct([
    [arrayType(t.TCHAR, CCHDEVICENAME), "dmDeviceName"],
    [t.WORD, "dmSpecVersion"],
    [t.WORD, "dmDriverVersion"],
    [t.WORD, "dmSize"],
    [t.WORD, "dmDriverExtra"],
    [t.DWORD, "dmFields"],
    //union {   // TODO there is a ref-union npm module - but this technique is OK for now
    //  struct {
    ["short", "dmOrientation"],
    ["short", "dmPaperSize"],
    ["short", "dmPaperLength"],
    ["short", "dmPaperWidth"],
    ["short", "dmScale"],
    ["short", "dmCopies"],
    ["short", "dmDefaultSource"],
    ["short", "dmPrintQuality"],
    //  };
    //  struct {
    //      POINTL dmPosition;
    //      DWORD dmDisplayOrientation;
    //      DWORD dmDisplayFixedOutput;
    //  };
    //};
    ["short", "dmColor"],
    ["short", "dmDuplex"],
    ["short", "dmYResolution"],
    ["short", "dmTTOption"],
    ["short", "dmCollate"],
    [arrayType(t.TCHAR, CCHFORMNAME), "dmFormName"],
    [t.WORD, "dmLogPixels"],
    [t.DWORD, "dmBitsPerPel"],
    [t.DWORD, "dmPelsWidth"],
    [t.DWORD, "dmPelsHeight"],
    //union {
    [t.DWORD, "dmDisplayFlags"],
    //  DWORD dmNup;
    //};
    [t.DWORD, "dmDisplayFrequency"],
    //#if (WINVER &gt;= 0x0400)
    [t.DWORD, "dmICMMethod"],
    [t.DWORD, "dmICMIntent"],
    [t.DWORD, "dmMediaType"],
    [t.DWORD, "dmDitherType"],
    [t.DWORD, "dmReserved1"],
    [t.DWORD, "dmReserved2"],
    //#if (WINVER &gt;= 0x0500) || (_WIN32_WINNT &gt;= 0x0400)
    [t.DWORD, "dmPanningWidth"],
    [t.DWORD, "dmPanningHeight"]
    //#endif
    //#endif
]);

// Windows API constants delved from the unfathomable deeps of windows.h

windows.API_constants = {
    HKEY_CLASSES_ROOT: 0x80000000,
    HKEY_CURRENT_USER: 0x80000001,
    HKEY_LOCAL_MACHINE: 0x80000002,
    HKEY_USERS: 0x80000003,
    HKEY_CURRENT_CONFIG: 0x80000005,
    CP_UTF8: 65001,
    KEY_QUERY_VALUE: 1,
    KEY_SET_VALUE: 2,
    returnCodes: {
        0: "ERROR_SUCCESS",
        1: "ERROR_INVALID_FUNCTION",
        2: "FILE_NOT_FOUND",
        3: "PATH_NOT_FOUND",
        6: "ERROR_INVALID_HANDLE"
    },
    // https://msdn.microsoft.com/en-us/library/windows/desktop/ms684880%28v=vs.85%29.aspx
    PROCESS_TERMINATE: 0x0001,
    // http://stackoverflow.com/questions/23452271/is-max-path-always-same-size-even-if-unicode-macro-is-defined
    MAX_PATH: 260,
    ENUM_CURRENT_SETTINGS: 0xffffffff,   // ((DWORD)-1)
    DISP_CHANGE_SUCCESSFUL: 0,
    DISP_CHANGE_RESTART: 1,
    FALSE: 0,
    TRUE: 1
};

windows.user32 = ffi.Library("user32", {
    // https://msdn.microsoft.com/en-us/library/windows/desktop/dd162611(v=vs.85).aspx
    // LPCWSTR, DWORD, DEVMODE*
    "EnumDisplaySettingsW": [
        t.BOOL, ["pointer", t.DWORD, "pointer"]
    ]
});

var c = windows.API_constants;

/**
 *  Gets the current screen resolution
 *
 * @return {Object) The width and height of the screen.
 */
windows.getScreenResolution = function () {
    var dm = new windows.DEVMODEW();
    dm.ref().fill(0);
    dm.dmSize = windows.DEVMODEW.size;

    if (c.FALSE != windows.user32.EnumDisplaySettingsW(ref.NULL, c.ENUM_CURRENT_SETTINGS, dm.ref())) {
        // note for unknown reason on win 10 the returned dmSize is 188 not expected 220
        return { width: dm.dmPelsWidth, height: dm.dmPelsHeight };
    }
    return { width: 0, height: 0 };

};

export default windows;