class FtosNativeBridge {

    private static readonly STATIC_ENDPOINT = "http://192.168.29.6:58866/NativeLibrary/";

    private _moduleResolverCache: { [key: string] : string } = {};
    private _isDebugEnabled = true;

    private getStaticLibrariesUrl() {
        return FtosNativeBridge.STATIC_ENDPOINT + "GetStaticLibraries";
    }

    private appendStaticLibraries() {
        return new Promise(async (resolve, reject) => {
            if (this._isDebugEnabled) {
                console.log("FtosNative:" + "loading static libraries")
            }

            let url = this.getStaticLibrariesUrl();
            const statics = await this._httpGetAsync(url);
            this._append(statics);
        })
    }

    private _httpGetAsync(url: string): Promise<string>
    {
        return new Promise((resolve, reject) => {
            var xmlHttp = new XMLHttpRequest();
    
            xmlHttp.onreadystatechange = () => { 
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                    resolve(xmlHttp.responseText);
            }
    
            xmlHttp.onerror = (error) => {
                reject(error);
            }
    
            xmlHttp.open("GET", url, true); // true for asynchronous 
            xmlHttp.send(null);
        });
    }

    private _parseLibString(libStr: string): { name: string | undefined, version: string | undefined } {
        let libCompos = libStr.split("@");
        let libVersion = libCompos.pop();
        let libName = libCompos.pop();

        return { name: libName, version: libVersion };
    };

    private _getLibFilename(libString: string) {
        let lib = this._parseLibString(libString);

        return "ftos-native." + lib.name + "_" + lib.version;
    };

    private _getDynamicLibraryUrl(libString: string) {
        let fileName = this._getLibFilename(libString);
        let fullName = FtosNativeBridge.STATIC_ENDPOINT + "Download?resource=" + fileName + ".lib.js";
        return fullName;
    }

    private _append(libString: string)
        {
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

    public appendDynamicLibrary(libString: string) {
        return new Promise(async (resolve, reject) => {
            if(!!this._moduleResolverCache[libString]) {
                if(this._isDebugEnabled) {
                    console.log("FtosNative: " + libString + " was already loaded");
                }
                resolve();
                return;
            }
            let url = this._getDynamicLibraryUrl(libString);
            try {
                this._moduleResolverCache[libString] = await this._httpGetAsync(url);
                this._append(this._moduleResolverCache[libString]);
                resolve();
            } catch(ex) {
                console.error("ERORAE")
                reject(ex);
            }
        });
    }

    async constructor() {
        this.appendStaticLibraries();
    }
}

var ftosNativeBridge = new FtosNativeBridge();
(window as any).FtosNativeBridge = ftosNativeBridge;