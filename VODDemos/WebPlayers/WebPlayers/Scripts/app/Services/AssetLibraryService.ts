/// <reference path="../Models/Asset.ts" />

module Services {

    import Asset = Models.Asset;

    export class AssetLibraryService {

        // TODO: move this to a configuration file
        private getAssetsUrl: string = "../api/assets";
        private getAssetUrl: string = "../api/assets?assetId=";

        public getAssets(skip: number = 0, take: number = 10): JQueryXHR {

            // TODO: handle errors
            var request = $.ajax({
                url: this.getAssetsUrl + "?skip=" + skip + "&take=" + take,
                cache: false,
            });

            return request;
        }

        public getAsset(assetId: string): JQueryXHR {

            // TODO: handle errors
            var request = $.ajax({
                url: this.getAssetUrl + assetId,
                cache: false,
            });

            return request;
        }
    }
}
