module ExtensionApp.Controllers
{
	/** Preferences scope */
	interface IPreferencesScope extends ng.IScope
	{
		/** Methods */
		Download: any;
		
		/** Modals */
		filename: string;
		url: string;
	}

	/**
	 * Preferences controller
	 */
	export class PreferencesController
	{
		/** Dependency injection */
		static $inject = ['$scope', 'WebdriverIOTemplateService'];

		/** Preferences controller */
		constructor($scope: IPreferencesScope, private TemplateService: Services.TemplateService)
		{
			$scope.Download = () =>
			{
				//TemplateService.ComposeFile();
			}
		}
	}
}
