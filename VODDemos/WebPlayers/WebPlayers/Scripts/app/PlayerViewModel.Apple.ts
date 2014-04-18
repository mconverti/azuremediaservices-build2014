/// <reference path="../typings/knockout/knockout.d.ts" />
/// <reference path="../typings/dash/dash.d.ts" />
/// <reference path="Models/Asset.ts" />

module ViewModels.Apple {

    import Asset = Models.Asset;

    export class PlayerViewModel {

        private videoElement: HTMLElement;

        public selectedAsset: KnockoutObservable<Asset>;

        public streamingUrl: KnockoutObservable<string>;

        constructor(videoElement: HTMLElement) {
            this.videoElement = videoElement;

            this.selectedAsset = ko.observable<Asset>(null).subscribeTo("selectedAsset");
            this.selectedAsset.subscribe((newAsset: Asset) => {
                if (newAsset) {
                    this.setPlayerSource(newAsset);
                }
            });

            this.streamingUrl = ko.observable<string>(null);
        }

        private setPlayerSource(asset: Asset) {
            this.videoElement.setAttribute("src", asset.hlsUri); 
            this.videoElement.setAttribute("autoplay", "true");
            this.streamingUrl(asset.hlsUri);
        }
    }
}
 