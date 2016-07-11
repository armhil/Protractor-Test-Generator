var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Event types */
        (function (EventType) {
            EventType[EventType["Load"] = 0] = "Load";
            EventType[EventType["Click"] = 1] = "Click";
            EventType[EventType["Focus"] = 2] = "Focus";
            EventType[EventType["Key"] = 3] = "Key";
        })(Controllers.EventType || (Controllers.EventType = {}));
        var EventType = Controllers.EventType;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Outcome type */
        (function (OutcomeType) {
            OutcomeType[OutcomeType["NetworkCall"] = 0] = "NetworkCall";
            OutcomeType[OutcomeType["UXChange"] = 1] = "UXChange";
            OutcomeType[OutcomeType["URLChange"] = 2] = "URLChange";
        })(Controllers.OutcomeType || (Controllers.OutcomeType = {}));
        var OutcomeType = Controllers.OutcomeType;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Abstract Event class */
        var Event = (function () {
            function Event() {
            }
            return Event;
        })();
        Controllers.Event = Event;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Base class for different outcome types. */
        var Outcome = (function () {
            function Outcome() {
            }
            return Outcome;
        })();
        Controllers.Outcome = Outcome;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Click event */
        var ClickEvent = (function (_super) {
            __extends(ClickEvent, _super);
            /** Make sure the event class + id + perhaps the element number is logged */
            function ClickEvent(elementId, elementClass) {
                _super.call(this);
                this.elementId = elementId;
                this.elementClass = elementClass;
                /** Click event type */
                this.type = Controllers.EventType.Click;
            }
            return ClickEvent;
        })(Controllers.Event);
        Controllers.ClickEvent = ClickEvent;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Load event */
        var LoadEvent = (function (_super) {
            __extends(LoadEvent, _super);
            /** Constructor */
            function LoadEvent(loadUrl) {
                _super.call(this);
                this.loadUrl = loadUrl;
                /** Type is load */
                this.type = Controllers.EventType.Load;
            }
            return LoadEvent;
        })(Controllers.Event);
        Controllers.LoadEvent = LoadEvent;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Load event */
        var KeyEvent = (function (_super) {
            __extends(KeyEvent, _super);
            /** Constructor */
            function KeyEvent(loadUrl) {
                _super.call(this);
                this.loadUrl = loadUrl;
                /** Type is load */
                this.type = Controllers.EventType.Key;
            }
            return KeyEvent;
        })(Controllers.Event);
        Controllers.KeyEvent = KeyEvent;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
/// <reference path="EventType.ts"/>
/// <reference path="OutcomeType.ts"/>
/// <reference path="Event.ts"/>
/// <reference path="Outcome.ts"/>
/// <reference path="ClickEvent.ts"/>
/// <reference path="LoadEvent.ts"/>
/// <reference path="KeyEvent.ts"/> 
var ExtensionApp;
(function (ExtensionApp) {
    var Services;
    (function (Services) {
        /**
         * Chrome service class.
         */
        var ChromeService = (function () {
            /**
             * Constructor for the chrome service.
             * @param $scope Scope
             * @param chrome Chrome runtime
             */
            function ChromeService($rootScope, timeout, chrome) {
                this.$rootScope = $rootScope;
                this.timeout = timeout;
                this.chrome = chrome;
                /** Events array */
                this.events = [];
                /** Navigation? */
                this.navigation = '';
                /** Key queue */
                this.keyQueue = [];
                this.isInitialized = false;
            }
            /**
             * Ensure that we're only looking to the same tab
             * and registering events from that tab
             */
            ChromeService.prototype.Initialize = function (tabId) {
                this.testingTabId = tabId;
                this.isInitialized = true;
            };
            ChromeService.prototype.InitializeEventListeners = function () {
                var CS = this;
                var RS = this.$rootScope;
                this.chrome.runtime.onMessage.addListener(function (msg, sender, response) {
                    /** If the sender is content script and the tab is the one that we're tracking */
                    if (msg.from === 'content' && sender.tab.id === CS.testingTabId) {
                        if (msg.subject) {
                            /** Page load */
                            if (msg.subject === 'load') {
                                CS.AddLoadEvent({ url: msg.info.url });
                            }
                            else if (msg.subject === 'click') {
                                CS.AddClickEvent({ id: msg.info.id });
                            }
                            else if (msg.subject === 'focus') {
                            }
                            else if (msg.subject === 'keyup') {
                                CS.AddKeyEvent({ id: msg.info.id, text: msg.info.text });
                            }
                        }
                    }
                    else if (msg.from === 'background') {
                        /**  */
                        if (msg.subject) {
                            if (msg.subject === 'UrlChange') {
                            }
                        }
                    }
                    RS.$apply();
                });
            };
            /** Add event */
            ChromeService.prototype.AddEvent = function (event) {
                this.events.push(event);
            };
            /** Add load event */
            ChromeService.prototype.AddLoadEvent = function (event) {
                this.events.push({ url: event.url, type: 'load' });
            };
            /** Add click event */
            ChromeService.prototype.AddClickEvent = function (event) {
                this.events.push({ id: event.id, type: 'click' });
            };
            /** Add key event */
            ChromeService.prototype.AddKeyEvent = function (event) {
                if (this.keyQueue.length === 0) {
                    this.keyQueue.push({ id: event.id, text: event.text });
                    this.events.push({ id: event.id, text: event.text, type: 'key' });
                }
                else if (this.keyQueue[this.keyQueue.length - 1].id == event.id) {
                    this.events.pop();
                    this.events.push({ id: event.id, text: event.text, type: 'key' });
                }
            };
            /** Dependency injection. */
            ChromeService.$inject = ['$rootScope', '$timeout', 'chrome'];
            return ChromeService;
        })();
        Services.ChromeService = ChromeService;
    })(Services = ExtensionApp.Services || (ExtensionApp.Services = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Services;
    (function (Services) {
        /** Template service */
        var TemplateService = (function () {
            /**
             * Constructor
             * @param chrome extension access
             */
            function TemplateService(chrome) {
                this.chrome = chrome;
            }
            /** Compose file */
            TemplateService.prototype.ComposeFile = function () {
                var fileTemplateUrl = chrome.extension.getURL('file_template.js');
                /** File template replacement tags */
                var testName = '%NAME%';
                var testTemplate = '%TESTTEMPLATE%';
                var fileContent = this.readTextFile(fileTemplateUrl);
                var formatted = this.formatString(fileContent, "testValue1", "testValue2");
                chrome.downloads.download({
                    url: "data:text/plain," + formatted,
                    filename: "tests.js",
                    conflictAction: "uniquify",
                    saveAs: false
                }, function (downloadId) {
                    console.log("Downloaded item with ID", downloadId);
                });
            };
            /** Format string */
            TemplateService.prototype.formatString = function (format) {
                var params = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    params[_i - 1] = arguments[_i];
                }
                var args = Array.prototype.slice.call(arguments, 1);
                return format.replace(/{(\d+)}/g, function (match, number) {
                    return typeof args[number] != 'undefined'
                        ? args[number]
                        : match;
                });
            };
            ;
            /** Read file */
            TemplateService.prototype.readTextFile = function (file) {
                var rawFile = new XMLHttpRequest();
                var allText;
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
            };
            /** Dependency injection */
            TemplateService.$inject = ['chrome'];
            return TemplateService;
        })();
        Services.TemplateService = TemplateService;
    })(Services = ExtensionApp.Services || (ExtensionApp.Services = {}));
})(ExtensionApp || (ExtensionApp = {}));
/// <reference path="chrome_service.ts"/>
/// <reference path="template_service.ts"/>
var ExtensionApp;
(function (ExtensionApp) {
    var Services;
    (function (Services) {
        angular.module('ExtensionApp.Services', []);
        angular.module('ExtensionApp.Services').service('ChromeService', Services.ChromeService);
        angular.module('ExtensionApp.Services').service('TemplateService', Services.TemplateService);
    })(Services = ExtensionApp.Services || (ExtensionApp.Services = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        var IntroController = (function () {
            /**
             * Constructor for events controller.
             * @param $scope the scope
             * @param ChromeService chrome service
             */
            function IntroController($scope, ChromeService, chrome) {
                this.$scope = $scope;
                this.ChromeService = ChromeService;
                this.chrome = chrome;
                /*if (!ChromeService.initialized)
                {*/
                this.InitializeEventHandlers();
                //ChromeService.initialized = true;
                //	}
            }
            /**
             * Initialize event handlers
             */
            IntroController.prototype.InitializeEventHandlers = function () {
                var _ChromeService = this.ChromeService;
                var scope = this.$scope;
                this.chrome.runtime.onMessage.addListener(function (msg, sender, response) {
                    /** If the sender is content script */
                    if (msg.from === 'content') {
                        if (msg.subject) {
                            /** Page load */
                            if (msg.subject === 'load') {
                                _ChromeService.Initialize(sender.tab.id);
                                scope.tab = sender.tab.id;
                                scope.url = msg.info.url;
                                scope.initialized = true;
                                _ChromeService.AddLoadEvent({ url: msg.info.url });
                                _ChromeService.InitializeEventListeners();
                                scope.$apply();
                            }
                        }
                    }
                    /*scope.events = _ChromeService.events;
                    scope.$apply();*/
                });
            };
            /**
             * Dependency injection.
             */
            IntroController.$inject = ['$scope', 'ChromeService', 'chrome'];
            return IntroController;
        })();
        Controllers.IntroController = IntroController;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
/// <reference path="../../../../typings/chrome/chrome.d.ts"/>
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /**
         * Events controller class.
         */
        var EventsController = (function () {
            /**
             * Constructor for events controller.
             * @param $scope the scope
             * @param ChromeService chrome service
             */
            function EventsController($scope, ChromeService, chrome) {
                this.$scope = $scope;
                this.ChromeService = ChromeService;
                this.chrome = chrome;
                $scope.events = ChromeService.events;
                $scope.menuOptions =
                    [
                        ['Mark as Setup', function ($itemScope) {
                                $itemScope.event.testtype = 'setup';
                            }], null,
                        ['Mark as Test', function ($itemScope) {
                                $itemScope.event.testtype = 'test';
                            }], null,
                        ['Mark as Result', function ($itemScope) {
                                $itemScope.event.testtype = 'result';
                            }]
                    ];
            }
            /**
             * Dependency injection.
             */
            EventsController.$inject = ['$scope', 'ChromeService', 'chrome'];
            return EventsController;
        })();
        Controllers.EventsController = EventsController;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        var NavbarController = (function () {
            /**
             * Constructor for the controller
             */
            function NavbarController($scope, $location) {
                this.$scope = $scope;
                this.$location = $location;
                $scope.isActive = function (viewLocation) {
                    if ($location.path().indexOf('demo') >= 0) {
                        return false;
                    }
                    return $location.path().indexOf(viewLocation) >= 0;
                };
                $scope.Back = function () {
                    window.history.back();
                };
            }
            /** dependency injection */
            NavbarController.$inject = ['$scope', '$location'];
            return NavbarController;
        })();
        Controllers.NavbarController = NavbarController;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /**
         * Preferences controller
         */
        var PreferencesController = (function () {
            /** Preferences controller */
            function PreferencesController($scope, TemplateService) {
                this.TemplateService = TemplateService;
                $scope.Download = function () {
                    TemplateService.ComposeFile();
                };
            }
            /** Dependency injection */
            PreferencesController.$inject = ['$scope', 'TemplateService'];
            return PreferencesController;
        })();
        Controllers.PreferencesController = PreferencesController;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
/// <reference path="intro_controller.ts"/>
/// <reference path="events_controller.ts"/>
/// <reference path="navbar_controller.ts"/>
/// <reference path="preferences_controller.ts"/>
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        angular.module('ExtensionApp.Controllers', []);
        angular.module('ExtensionApp.Controllers').controller('IntroController', Controllers.IntroController);
        angular.module('ExtensionApp.Controllers').controller('EventsController', Controllers.EventsController);
        angular.module('ExtensionApp.Controllers').controller('NavbarController', Controllers.NavbarController);
        angular.module('ExtensionApp.Controllers').controller('PreferencesController', Controllers.PreferencesController);
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/chrome/chrome.d.ts"/>
/// <reference path="app/classes/_all.ts"/>
/// <reference path="app/services/_all.ts"/>
/// <reference path="app/controllers/_all.ts"/>
var ExtensionApp;
(function (ExtensionApp) {
    angular.module('ExtensionApp', ['ngRoute', 'ExtensionApp.Controllers', 'ExtensionApp.Services', 'ui.bootstrap.contextMenu']).config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/setup', {
                templateUrl: 'build/views/intro.html',
                controller: ExtensionApp.Controllers.IntroController
            })
                .when('/tests', {
                templateUrl: 'build/views/tests.html',
                controller: ExtensionApp.Controllers.EventsController
            })
                .when('/preferences', {
                templateUrl: 'build/views/preferences.html',
                controller: ExtensionApp.Controllers.PreferencesController
            }).
                otherwise({
                redirectTo: '/setup'
            });
        }]).run(function () {
        console.log('running the app');
    });
    angular.module('ExtensionApp').constant('chrome', chrome);
})(ExtensionApp || (ExtensionApp = {}));
