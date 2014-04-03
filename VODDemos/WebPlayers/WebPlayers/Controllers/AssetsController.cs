namespace WebPlayers.Controllers
{
    using System.Configuration;
    using System.Web.Http;
    using WebPlayers.Models;
    using WebPlayers.Services;

    [RoutePrefix("api/assets")]
    public class AssetsController : ApiController
    {
        private const string MediaServicesAccountName = "MediaServicesAccountName";
        private const string MediaServicesAccountKey = "MediaServicesAccountKey";

        private IAssetService assetService;

        public AssetsController() :
            this(new WamsAssetService(
                ConfigurationManager.AppSettings[MediaServicesAccountName],
                ConfigurationManager.AppSettings[MediaServicesAccountKey]))
        {
        }

        public AssetsController(IAssetService assetService)
        {
            this.assetService = assetService;
        }

        // GET api/assets?skip=10&take=10
        [Route("")]
        [HttpGet]
        public AssetLibrary GetAssets(int skip = 0, int take = 10)
        {
            var assets = this.assetService.GetAssetsWithOriginLocator(skip, take);
            var totalAssets = this.assetService.GetAssetsWithOriginLocatorCount();

            return new AssetLibrary { Assets = assets, Total = totalAssets };
        }

        // GET api/assets?assetId={assetId}
        [Route("")]
        [HttpGet]
        public Asset GetAsset(string assetId)
        {
            return this.assetService.GetAsset(assetId);
        }
    }
}