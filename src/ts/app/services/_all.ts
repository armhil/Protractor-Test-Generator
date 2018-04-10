/// <reference path="chrome_service.ts"/>
/// <reference path="template_service.ts"/>
/// <reference path="storage_service.ts"/>
module ExtensionApp.Services {
    angular
        .module('ExtensionApp.Services', [])
        .service('ChromeService', ChromeService)
        .service('ProtractorTemplateService', ProtractorTemplateService)
        .service('WebdriverIOTemplateService', WebdriverIOTemplateService)
        .service('DownloadStorageService', DownloadStorageService)
        .service('HTTPStorageService', HTTPStorageService);
}
