namespace WebPlayers.Services
{
    using System;

    public class Asset
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string State { get; set; }

        public Uri HlsUri { get; set; }

        public Uri Hlsv3Uri { get; set; }

        public Uri MpegDashUri { get; set; }

        public Uri SmoothStreamingUri { get; set; }

        public Uri HighQualityMp4Uri { get; set; }

        public Uri MidQualityMp4Uri { get; set; }

        public Uri LowQualityMp4Uri { get; set; }

        public Uri ThumbnailUri { get; set; }
    }
}
