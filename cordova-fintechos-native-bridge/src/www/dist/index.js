"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class FtosNativeBridge {
    constructor() {
        this._moduleResolverCache = {};
        this._isDebugEnabled = true;
        this.appendStaticLibraries();
    }
    getStaticLibrariesUrl() {
        return FtosNativeBridge.STATIC_ENDPOINT + "GetStaticLibraries";
    }
    appendStaticLibraries() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this._isDebugEnabled) {
                console.log("FtosNative:" + "loading static libraries");
            }
            let url = this.getStaticLibrariesUrl();
            const statics = yield this._httpGetAsync(url);
            this._append(statics);
        }));
    }
    _httpGetAsync(url) {
        return new Promise((resolve, reject) => {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = () => {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                    resolve(xmlHttp.responseText);
            };
            xmlHttp.onerror = (error) => {
                reject(error);
            };
            xmlHttp.open("GET", url, true); // true for asynchronous 
            xmlHttp.send(null);
        });
    }
    _parseLibString(libStr) {
        let libCompos = libStr.split("@");
        let libVersion = libCompos.pop();
        let libName = libCompos.pop();
        return { name: libName, version: libVersion };
    }
    ;
    _getLibFilename(libString) {
        let lib = this._parseLibString(libString);
        return "ftos-native." + lib.name + "_" + lib.version;
    }
    ;
    _getDynamicLibraryUrl(libString) {
        let fileName = this._getLibFilename(libString);
        let fullName = FtosNativeBridge.STATIC_ENDPOINT + "Download?resource=" + fileName + ".lib.js";
        return fullName;
    }
    _append(libString) {
        if (this._isDebugEnabled) {
            console.log("appending library", libString);
        }
        let sTag = document.createElement("script");
        sTag.innerHTML = libString;
        document.body.appendChild(sTag);
        // let s = document.createElement("");
        // s.src = url;
        // document.body.append(s);
    }
    appendDynamicLibrary(libString) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!!this._moduleResolverCache[libString]) {
                if (this._isDebugEnabled) {
                    console.log("FtosNative: " + libString + " was already loaded");
                }
                resolve();
                return;
            }
            let url = this._getDynamicLibraryUrl(libString);
            try {
                this._moduleResolverCache[libString] = yield this._httpGetAsync(url);
                this._append(this._moduleResolverCache[libString]);
                resolve();
            }
            catch (ex) {
                console.error("ERORAE");
                reject(ex);
            }
        }));
    }
}
FtosNativeBridge.STATIC_ENDPOINT = "http://192.168.29.6:58866/NativeLibrary/";
var ftosNativeBridge = new FtosNativeBridge();
window.FtosNativeBridge = ftosNativeBridge;
