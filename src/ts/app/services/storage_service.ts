module ExtensionApp.Services {

    /** Interface for storage service */
    export interface StorageService {
        /** Store provided string data as file with given name */
        StoreFile(fileName: string, fileData: any, fileType?: string);
    }

    /** StorageService that downloads file to user machine */
    export class DownloadStorageService implements StorageService {
        /** Dependency injection */
        static $inject: string[] = ['chrome'];

        /**
         * Constructor
         * @param chrome extension access
         */
        constructor(private chrome: any) {
        }

        StoreFile(fileName: string, fileData: string, fileType: string = "text/plain") {
            var fileBlob = new Blob([fileData], {type: fileType});
            var fileUrl = URL.createObjectURL(fileBlob);

            this.chrome.downloads.download({
                url: fileUrl,
                // Provide initial name to be tests.js
                filename: fileName,
                conflictAction: "prompt",
                // Open save as dialog
                saveAs: true,
            }, function (downloadId) {
                console.log("Downloaded item with ID", downloadId);
            });
        }
    }

    /**
     * HTTPStorageService can store file to remote HTTP service.
     *
     * Endpoint should support POST method.
     */
    export class HTTPStorageService implements StorageService {

        /** Dependency injection */
        static $inject: string[] = [];

        /**
         * Constructor
         * @param endpointUrl URL of REST endpoint to store file to.
         */
        constructor(private endpointUrl: string = "http://localhost:8080") {
        }

        StoreFile(fileName: string, fileData: any, fileType: string = "text/plain") {
            let me = this;

            let fileBlob = new Blob([fileData], {type: fileType});
            let data = new FormData();
            data.append("file", fileBlob, fileName);

            let xhr = new XMLHttpRequest();
            xhr.open("POST", me.endpointUrl);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        console.log("File was successfully stored to '%s'", me.endpointUrl);
                    } else {
                        console.log("Request to '%s' failed with code %d", me.endpointUrl, xhr.status);
                    }
                }
            };
            xhr.send(data);
        }
    }
}