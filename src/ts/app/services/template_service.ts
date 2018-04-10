module ExtensionApp.Services {
    /** Template service */
    export abstract class TemplateService {
        /** Dependency injection */
        static $inject: string[] = ['chrome', 'ChromeService'];

        /**
         * Constructor
         * @param chrome extension access
         * @param ChromeService chrome service
         */
        constructor(private chrome: any, private ChromeService: Services.ChromeService) {
        }

        /** Get file template */
        private GetFileTemplate(): string {
            var fileTemplateUrl: string = chrome.extension.getURL('templates/file.js.template');
            return this.readTextFile(fileTemplateUrl);
        }

        /** Get test template */
        private GetTestTemplate(): string {
            var fileTemplateUrl: string = chrome.extension.getURL('templates/test.js.template');
            return this.readTextFile(fileTemplateUrl);
        }

        /** Compose file */
        public ComposeFile(testName: string): string {
            var fileTemplate = this.GetFileTemplate();

            /** File template replacement tags */
            var globalDefsPlaceholder: string = "%GLOBALDEFINITIONS%";
            fileTemplate = fileTemplate.replace(globalDefsPlaceholder, this.ComposeGlobalDefinitions().join("\n")) + "";

            var testNameReplace: string = '%NAME%';
            fileTemplate = fileTemplate.replace(testNameReplace, testName) + "";

            var testSettings: string = "%TESTSETTINGS%";
            fileTemplate = fileTemplate.replace(testSettings, this.ComposeTestsSettings().join("\n    "))

            var testTemplate: string = '%TESTTEMPLATE%';
            fileTemplate = fileTemplate.replace(testTemplate, this.ComposeTests()) + "";

            return fileTemplate;
        }

        protected ComposeGlobalDefinitions(): string[] {
            return [];
        }

        protected ComposeTestsSettings(): string[] {
            return [];
        }

        /** Compose the tests */
        private ComposeTests(): string {
            var testTemplate = this.GetTestTemplate();

            /** Test template replacement tags */
            var test: string = '%TEST%';
            var internalTests = this.ComposeSteps().join("\n        ");
            testTemplate = testTemplate.replace(test, internalTests);

            return testTemplate;
        }

        /** Compose the steps */
        private ComposeSteps(): string[] {
            var tests: string[] = [];
            var currentIndent = 1;
            this.ChromeService.events.forEach((value: any, index: number) => {
                /*if (currentIndent != value.indent)
                 {

                 }*/
                if (value.testtype === 'test' && value.type === 'load') {
                    // Verify if the url is changing.
                    tests.push(this.AddUrlChangeTest(value.url));
                }
                else if (value.type === 'load') {
                    // Replace with proper browser.get condition adding.
                    tests.push(this.AddBrowserGetStep(value.url));
                }
                else if (value.type === 'click') {
                    // Click step registry
                    tests.push(this.AddClickStep(value.id, value.path));
                }
                else if (value.type === 'key') {
                    // Key step registry
                    tests.push(this.AddTypeInStep(value.id, value.path, value.text));
                }
                else if (value.type === 'enter') {
                    // Enter step registry
                    tests.push(this.AddEnterStep(value.id));
                }
                else if (value.type === 'ensure') {
                    // Add ensure test
                    tests.push(this.AddEnsureTest(value.id, value.path));
                }
                else if (value.type === 'iframesubload') {
                    // Switch context to iframe
                    tests.push(this.SwitchToIFrameContext(value.id));
                }
            });

            return tests;
        }

        /** Format string */
        protected formatString(format: string, ...params): string {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match;
            });
        };

        /** Read file */
        private readTextFile(file): string {
            var rawFile = new XMLHttpRequest();
            var allText: string = undefined;
            rawFile.open("GET", file, false);
            rawFile.onreadystatechange = function () {
                if (rawFile.readyState === 4) {
                    if (rawFile.status === 200 || rawFile.status == 0) {
                        allText = rawFile.responseText;
                    }
                }
            };

            rawFile.send(null);
            return allText;
        }

        /** Browser get step */
        protected abstract AddBrowserGetStep(url: string): string;

        /** Click step */
        protected abstract AddClickStep(id: string, path: string): string;

        /** Add enter step */
        protected abstract AddEnterStep(id: string): string;

        /** Type in step */
        protected abstract AddTypeInStep(id: string, path: string, text: string): string;

        /** Add ensure test */
        protected abstract AddEnsureTest(id: string, path: string): string;

        /** Switch to iframe context */
        protected abstract SwitchToIFrameContext(id: string): string;

        /** Add url change test */
        protected abstract AddUrlChangeTest(url: string): string;
    }

    export class ProtractorTemplateService extends TemplateService {

        protected ComposeGlobalDefinitions(): string[] {
            return [
                `var urlChanged = function (url) {`,
                `    return function () {`,
                `        return browser.getCurrentUrl().then(function (actualUrl) {`,
                `            return url != actualUrl;`,
                `        });`,
                `    };`,
                `};`
            ];
        }

        protected ComposeTestsSettings(): string[] {
            return ["browser.ignoreSynchronization = true;"];
        }

        /** Browser get step */
        protected AddBrowserGetStep(url: string): string {
            /** Get url template */
            return this.formatString("browser.get('{0}');", url);
        }

        /** Click step */
        protected AddClickStep(id: string, path: string): string {
            if (id && id.length > 0) {
                return this.formatString("element(by.id('{0}')).click();", id);
            }
            else if (path && path.length > 0) {
                return this.formatString("element(by.css('{0}')).click();", path);
            }
        }

        /** Add enter step */
        protected AddEnterStep(id: string): string {
            if (id && id.length > 0) {
                return this.formatString("element(by.id('{0}')).sendKeys(protractor.Key.ENTER);", id);
            }
        }

        /** Type in step */
        protected AddTypeInStep(id: string, path: string, text: string): string {
            if (id && id.length > 0) {
                return this.formatString("element(by.id('{0}')).sendKeys('{1}');", id, text);
            }
            else if (path && path.length > 0) {
                return this.formatString("element(by.css('{0}')).sendKeys('{1}');", path, text);
            }
        }

        /** Add ensure test */
        protected AddEnsureTest(id: string, path: string): string {
            if (id && id.length > 0) {
                return this.formatString("expect(element(by.id('{0}')).isPresent()).toBeTruthy();", id);
            }
            else if (path && path.length > 0) {
                return this.formatString("expect(element(by.css('{0}')).isPresent()).toBeTruthy();", path);
            }
        }

        /** Switch to iframe context */
        protected SwitchToIFrameContext(id: string): string {
            if (id && id.length > 0) {
                let result = "browser.wait(protractor.ExpectedConditions.presenceOf(element(by.id('{0}'))), 2000);";
                result += "" + this.AddEnsureTest(id, undefined);
                result += "" + "browser.switchTo().frame('{0}');"
                return this.formatString(result, id);
            }
        }

        /** Add url change test */
        protected AddUrlChangeTest(url: string): string {
            return this.formatString("browser.wait(urlChanged('{0}'), 5000)", url);
        }
    }

    export class WebdriverIOTemplateService extends TemplateService {

        protected ComposeGlobalDefinitions(): string[] {
            return [`var urlChanged = function(url) { return browser.url() === url; };`];
        }

        protected ComposeTestsSettings(): string[] {
            return [
                `browser.timeouts('implicit', 2000);`,
                `browser.timeouts('page load', 5000);`
            ];
        }

        protected AddBrowserGetStep(url: string): string {
            return this.formatString("browser.url('{0}');", url);
        }

        protected AddClickStep(id: string, path: string): string {
            if (id && id.length > 0) {
                return this.formatString("browser.click('#{0}');", id);
            }
            else if (path && path.length > 0) {
                return this.formatString("browser.click('{0}');", path);
            }
            else {
                return "\/\/ AddClickStep failed due to the missing element selector;";
            }
        }

        protected AddEnterStep(id: string): string {
            if (id && id.length > 0) {
                return this.formatString("browser.element('#{0}').keys('Enter');", id);
            }
            else {
                return "\/\/ AddEnterStep failed due to the missing element selector;";
            }
        }

        protected AddTypeInStep(id: string, path: string, text: string): string {
            if (id && id.length > 0) {
                return this.formatString("browser.setValue('#{0}', '{1}');", id, text);
            }
            else if (path && path.length > 0) {
                return this.formatString("browser.element('{0}', '{1}');", path, text);
            }
            else {
                return "\/\/ AddTypeInStep failed due to the missing element selector;";
            }
        }

        protected AddEnsureTest(id: string, path: string): string {
            if (id && id.length > 0) {
                return this.formatString("expect(browser.isExisting('#{0}')).toBeTruthy();", id);
            }
            else if (path && path.length > 0) {
                return this.formatString("expect(browser.isExisting('{0}')).toBeTruthy();", path);
            }
            else {
                return "\/\/ AddEnsureTest failed due to the missing element selector;";
            }
        }

        /** Switch to iframe context */
        protected SwitchToIFrameContext(id: string): string {
            if (id && id.length > 0) {
                let result = "browser.waitForExist('#{0}', 2000);";
                result += "" + this.AddEnsureTest(id, undefined);
                result += "" + "browser.frame('#{0}');";
                return this.formatString(result, id);
            }
            else {
                return "\/\/ SwitchToIFrameContext failed due to the missing element selector;";
            }
        }

        /** Add url change test */
        protected AddUrlChangeTest(url: string): string {
            return this.formatString("browser.waitUntil(urlChanged('{0}'), 5000)", url);
        }
    }
}
