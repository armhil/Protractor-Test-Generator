module ExtensionApp.Controllers
{
	export class IntroController
	{
		/** Scope variables */
		tab: number;
		url: string;
		initialized: boolean;
		propose: boolean;
		fileName: string;

		/**
		 * Dependency injection.
		 */
		static $inject = ['$scope', 'ChromeService', 'ProtractorTemplateService', 'chrome'];

		/**
		 * Constructor for events controller.
		 * @param $scope the scope
		 * @param ChromeService chrome service
		 */
		constructor(private $scope, private ChromeService: Services.ChromeService, private TemplateService: Services.TemplateService, private chrome: any)
		{
			/** If the chrome service is not initialized present the base page request experience. */
			if (!ChromeService.isInitialized)
			{
				this.initialized = false;
				this.propose = false;
				this.InitializeEventHandlers();
			}
			/** If the chrome service is initialized show the tab id and url to the user. */
			else
			{
				this.initialized = true;
				this.tab = this.ChromeService.testingTabId;
				this.url = this.ChromeService.events[0].url;
			}
		}

		/** 
		 * Initialize everything now that we know the base page and tab id.
		 */
		Initialize()
		{
			this.initialized = true;
			this.propose = false;
			this.ChromeService.Initialize(this.tab);
			this.ChromeService.AddLoadEvent({url: this.url});
			this.ChromeService.InitializeEventListeners();
		}

		/**
		 * Initialize event handlers
		 */
		InitializeEventHandlers()
		{
			var controller = this;
			this.chrome.runtime.onMessage.addListener(function TemporaryListener(msg, sender, response) {

				/** If the sender is content script */
				if (controller.ChromeService.isInitialized)
				{
					controller.chrome.runtime.onMessage.removeListener(TemporaryListener);
					return;
				}

				if (msg.from === 'content')
				{
					if (msg.subject)
					{
						/** Page load */
						if (msg.subject === 'load')
						{
							controller.tab = sender.tab.id;
							controller.url = sender.tab.url;
							controller.propose = true;
							controller.$scope.$apply();
						}
					}
				}
			});
		}

		/**
		 * Clear all
		 */
		ClearAll()
		{
			this.initialized = false;
			this.propose = false;
			this.ChromeService.ClearAll();
			this.InitializeEventHandlers();
		}

		/** Download the tests */
		Download()
		{
			this.TemplateService.DownloadFile('Recorded Tests');
		}
	}
}
