module ExtensionApp.Controllers
{
	/** Navbar scope */
	interface INavbarScope extends ng.IScope
	{
		/** Variables */
		isActive: any;

		/** Methods */
		Back: any;
		Download: any;
	}
	export class NavbarController
	{
		/** dependency injection */
		static $inject = ['$scope', '$location', 'ProtractorTemplateService'];

		/**
		 * Constructor for the controller
		 */
		constructor(private $scope: INavbarScope, private $location: ng.ILocationService, private TemplateService: Services.TemplateService)
		{
			$scope.isActive = (viewLocation) =>
			{ 
				if ($location.path().indexOf('demo') >= 0)
				{
					return false;
				}
				return $location.path().indexOf(viewLocation) >= 0;
			};

			$scope.Back = () =>
			{
				window.history.back();
			};

			$scope.Download = () =>
			{
				this.TemplateService.DownloadFile('Recorded Test');
			}
		}
	}
}
