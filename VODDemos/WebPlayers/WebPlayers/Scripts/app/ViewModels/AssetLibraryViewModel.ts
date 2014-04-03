/// <reference path="../../typings/knockout/knockout.d.ts" />
/// <reference path="../../typings/knockout.postbox/knockout-postbox.d.ts" />
/// <reference path="../Models/Asset.ts" />
/// <reference path="../Models/AssetsInfo.ts" />
/// <reference path="../Services/AssetLibraryService.ts" />

module ViewModels {

    import Asset = Models.Asset;
    import AssetsInfo = Models.AssetsInfo;
    import AssetLibraryService = Services.AssetLibraryService;

    export class AssetLibraryViewModel {

        // TODO: move to a configuration file
        private pageSize: number = 4;
        private currentPage: number;
        private totalPages: number;
        private assetLibraryService: AssetLibraryService;

        public currentAssets: KnockoutObservableArray<Asset>;
        public selectedAsset: KnockoutObservable<Asset>;
        public pages: KnockoutObservableArray<PageViewModel>;
        public noAssets: KnockoutObservable<boolean>;

        public selectAsset: (asset: Asset) => void;
        public changePage: (newPage: PageViewModel) => void;

        constructor(assetLibraryService: AssetLibraryService) {
            this.assetLibraryService = assetLibraryService;
            this.currentAssets = ko.observableArray<Asset>(new Array<Asset>());
            this.selectedAsset = ko.observable<Asset>(null).syncWith("selectedAsset");
            this.pages = ko.observableArray<PageViewModel>(new Array<PageViewModel>());
            this.noAssets = ko.observable<boolean>(false);
            this.currentPage = 0;
            this.totalPages = 0;

            // Handle events
            this.selectAsset = (asset: Asset) => {
                // TODO: add error handling
                this.assetLibraryService
                    .getAsset(asset.id)
                    .done((asset: Asset) => this.selectedAsset(asset));
            };

            this.changePage = (newPage: PageViewModel) => {
                this.currentPage = newPage.pageValue();
                this.loadAssets();
            };
        }

        public loadAssets(): void {

            var skip = this.currentPage * this.pageSize;
            var take = this.pageSize;

            // TODO: add error handling
            this.assetLibraryService
                .getAssets(skip, take)
                .done((assetsInfo: AssetsInfo) => {
                    assetsInfo.assets.forEach((asset: Models.Asset) => {
                        if (!asset.thumbnailUri) {
                            asset.thumbnailUri = "/Content/Images/default-asset-thumbnail.png";
                        }
                    });

                    this.updatePages(assetsInfo.total);

                    this.currentAssets(assetsInfo.assets);
                    this.noAssets(assetsInfo.assets.length <= 0);
                });
        }

        private updatePages(totalAssets: number): void {

            this.totalPages = Math.ceil(totalAssets / this.pageSize);

            var pages = new Array<PageViewModel>();
            for (var i = 0; i < this.totalPages; i++) {
                pages.push(new PageViewModel(i + 1, i, i === this.currentPage));
            }

            this.pages(pages);
        }
    }

    export class PageViewModel {

        public pageText: KnockoutObservable<number>;
        public pageValue: KnockoutObservable<number>;
        public selected: KnockoutObservable<boolean>;

        constructor(pageText: number = 1, pageValue: number = 0, selected: boolean = true) {
            this.pageText = ko.observable<number>(pageText);
            this.pageValue = ko.observable<number>(pageValue);
            this.selected = ko.observable<boolean>(selected);
        }
    }
}
