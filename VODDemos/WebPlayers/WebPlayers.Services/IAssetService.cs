namespace WebPlayers.Services
{
    using System.Collections.Generic;
    using WebPlayers.Services;

    public interface IAssetService
    {
        Asset GetAsset(string assetId);

        IEnumerable<Asset> GetAssetsWithOriginLocator(int skip, int take);

        int GetAssetsWithOriginLocatorCount();
    }
}
