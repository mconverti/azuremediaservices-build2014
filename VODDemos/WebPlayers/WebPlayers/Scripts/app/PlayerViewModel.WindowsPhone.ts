/// <reference path="../typings/knockout/knockout.d.ts" />
/// <reference path="../typings/dash/dash.d.ts" />
/// <reference path="Models/Asset.ts" />

module ViewModels.WindowsPhone {

    import Asset = Models.Asset;

    export class PlayerViewModel {

        private videoElement: HTMLElement;
        private videoPlayer: MediaPlayer;

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
            this.setupVideoPlayer();
        }

        private setPlayerSource(asset: Asset) {
            this.videoPlayer.attachSource(asset.mpegDashUri);
            this.videoPlayer.setAutoPlay(true);

            this.streamingUrl(asset.mpegDashUri);
        }

        private setupVideoPlayer(): void {
            var context = new Dash.di.DashContext();
            this.videoPlayer = new MediaPlayer(context);
            this.videoPlayer.startup();
            this.videoPlayer.attachView(this.videoElement);

            // TODO: temp fix
            // remove this once the @presentationTimeOffset is in the MPD
            this.videoPlayer.addEventListener("manifestLoaded", (ev: any) => {
                var manifest = ev.data;
                if (!manifest) return;
                for (var p = 0; p < manifest.Period_asArray.length; p += 1) {
                    var period = manifest.Period_asArray[p];
                    period.start = 0;
                    for (var a = 0; a < period.AdaptationSet_asArray.length; a += 1) {
                        var adapationSet = period.AdaptationSet_asArray[a];
                        if (adapationSet.hasOwnProperty("SegmentTemplate_asArray") &&
                            adapationSet.SegmentTemplate_asArray[0].hasOwnProperty("SegmentTimeline_asArray") &&
                            !adapationSet.SegmentTemplate_asArray[0].hasOwnProperty("presentationTimeOffset") &&
                            adapationSet.SegmentTemplate_asArray[0].SegmentTimeline_asArray[0].S_asArray[0].hasOwnProperty("t")) {

                            var mediastart = adapationSet.SegmentTemplate_asArray[0].SegmentTimeline_asArray[0].S_asArray[0].t;
                            adapationSet.SegmentTemplate_asArray[0].presentationTimeOffset = mediastart;
                            for (var r = 0; r < adapationSet.Representation_asArray.length; r += 1) {
                                var representation = adapationSet.Representation_asArray[r];
                                representation.SegmentTemplate.presentationTimeOffset = mediastart;
                            }
                        }
                    }
                }
            });
        }
    }
}
 