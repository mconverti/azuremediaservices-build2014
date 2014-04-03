/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jquery.tmpl/jquery.tmpl.d.ts" />
/// <reference path="../typings/knockout/knockout.d.ts" />
/// <reference path="../typings/dash/dash.d.ts" />
/// <reference path="Models/Asset.ts" />

module ViewModels.Desktop {

    import Asset = Models.Asset;

    export class PlayerViewModel {

        private playerContainer: JQuery;

        private videoPlayer: MediaPlayer;

        public selectedAsset: KnockoutObservable<Asset>;

        public streamingUrl: KnockoutObservable<string>;

        constructor(playerContainer: JQuery) {
            this.playerContainer = playerContainer;

            this.selectedAsset = ko.observable<Asset>(null).subscribeTo("selectedAsset");
            this.selectedAsset.subscribe((newAsset: Asset) => {
                if (newAsset) {
                    this.setPlayerSource(newAsset);
                }
            });
            
            this.streamingUrl = ko.observable<string>(null);

            this.setupVideoPlayer();
        }

        public isFlashPlayerEnabled(): boolean {
            return $("#flash").hasClass("selected");
        }

        public switchToSmoothStreaming(): void {
            if (!this.isFlashPlayerEnabled()) {
                $("#dash").removeClass("selected");
                $("#flash").addClass("selected");

                var asset = this.selectedAsset();
                if (asset) {
                    this.setPlayerSource(asset, true);
                }
            }
        }

        public switchToMpegDash() {
            if (this.isFlashPlayerEnabled()) {
                $("#flash").removeClass("selected");
                $("#dash").addClass("selected");

                var asset = this.selectedAsset();
                if (asset) {
                    this.setPlayerSource(asset, true);
                }
            }
        }

        private setPlayerSource(asset: Asset, changingPlayer: boolean = false): void {
            if (!this.isFlashPlayerEnabled()) {
                var videoPlayerQuery = this.playerContainer.find("#videoPlayer");
                if ((videoPlayerQuery.length <= 0) || changingPlayer) {
                    this.playerContainer.empty();

                    var $tmpl = $("#videoPlayerTemplate");
                    $.tmpl($tmpl, {}).appendTo(this.playerContainer);

                    var videoElement = document.querySelector("#videoPlayer");
                    this.videoPlayer.attachView(videoElement);
                    this.videoPlayer.setAutoPlay(true);
                };

                this.videoPlayer.attachSource(asset.mpegDashUri);
                this.streamingUrl(asset.mpegDashUri);
            }
            else {
                this.videoPlayer.reset();
                this.playerContainer.empty();

                var playerVariables = "src=" + asset.smoothStreamingUri + "&autoPlay=true&plugin_AdaptiveStreamingPlugin=%2FContent%2FFlash%2FMSAdaptiveStreamingPlugin-v1.0.9-beta-osmf2.0.swf&AdaptiveStreamingPlugin_retryLive=true&AdaptiveStreamingPlugin_retryInterval=10"

                var $tmpl = $("#flashPlayerTemplate");
                $.tmpl($tmpl, { PlayerVariables: playerVariables }).appendTo(this.playerContainer);
                this.streamingUrl(asset.smoothStreamingUri);
            }
        }

        private setupVideoPlayer(): void {
            var context = new Dash.di.DashContext();
            this.videoPlayer = new MediaPlayer(context);
            this.videoPlayer.startup();

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
 