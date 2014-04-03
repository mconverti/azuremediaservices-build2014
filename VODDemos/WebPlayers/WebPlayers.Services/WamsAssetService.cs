namespace WebPlayers.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using Microsoft.WindowsAzure.MediaServices.Client;

    public class WamsAssetService : IAssetService
    {
        private const string AssetIdPrefix = "nb:cid:UUID:";
        private const string ThumbnailAssetFileNameSuffix = "_2.jpg";
        private const string Mp4AssetFileNameSuffix = ".mp4";
        private const string H264VideoCodec = "H264";

        private CloudMediaContext context;

        public WamsAssetService(string accountName, string accountKey)
        {
            this.context = new CloudMediaContext(accountName, accountKey);
        }

        public WamsAssetService(CloudMediaContext context)
        {
            this.context = context;
        }

        public IEnumerable<Asset> GetAssetsWithOriginLocator(int skip, int take)
        {
            if (skip < 0)
            {
                throw new ArgumentException("The assets to skip must be greater or equal than 0.", "skip");
            }

            if (take < 0)
            {
                throw new ArgumentException("The assets to take must be greater or equal than 0.", "take");
            }

            var locators = this.context
                .Locators
                .Where(l => l.Type == LocatorType.OnDemandOrigin)
                .Skip(skip)
                .Take(take)
                .ToArray();

            var assetIds = locators
                .Select(l => l.AssetId)
                .Distinct()
                .ToArray();

            var assets = this.context
                .Assets
                .Where(CreateOrExpression<IAsset, string>("Id", assetIds))
                .ToArray();

            return assets.Select(
                asset => new Asset
                {
                    Id = asset.Id,
                    Name = asset.Name,
                    State = asset.State.ToString()
                });
        }

        public int GetAssetsWithOriginLocatorCount()
        {
            // Get the count of origin locators available
            var locatorsCount = this.context
                .Locators
                .Where(l => l.Type == LocatorType.OnDemandOrigin)
                .Count();

            return locatorsCount;
        }

        public Asset GetAsset(string assetId)
        {
            if (assetId == string.Empty)
            {
                throw new ArgumentException("assetId cannot be empty", "assetId");
            }

            var asset = this.context.Assets.Where(a => a.Id == assetId).FirstOrDefault();
            if (asset == null)
            {
                return null;
            }

            IAssetFile highQualityVideoAssetFile = null;
            IAssetFile midQualityVideoAssetFile = null;
            IAssetFile lowQualityVideoAssetFile = null;
            ILocator sasLocator = null;
            var videoAssetFiles = asset
                .AssetFiles
                .ToArray()
                .Where(af => af.Name.EndsWith(Mp4AssetFileNameSuffix, StringComparison.OrdinalIgnoreCase) && af.Name.Contains(H264VideoCodec))
                .OrderByDescending(af => af.ContentFileSize)
                .ToArray();

            var count = videoAssetFiles.Length;
            if (count > 0)
            {
                highQualityVideoAssetFile = videoAssetFiles[0];
                midQualityVideoAssetFile = videoAssetFiles[count / 2];
                lowQualityVideoAssetFile = videoAssetFiles[count - 1];
                sasLocator = asset.Locators
                    .ToArray()
                    .Where(l => l.Type == LocatorType.Sas)
                    .OrderBy(l => l.ExpirationDateTime)
                    .LastOrDefault();
            }

            return new Asset
            {
                Id = asset.Id,
                Name = asset.Name,
                State = asset.State.ToString(),
                SmoothStreamingUri = asset.GetSmoothStreamingUri(),
                MpegDashUri = asset.GetMpegDashUri(),
                HlsUri = asset.GetHlsUri(),
                Hlsv3Uri = asset.GetHlsv3Uri(),
                HighQualityMp4Uri = highQualityVideoAssetFile != null && sasLocator != null ? highQualityVideoAssetFile.GetSasUri(sasLocator) : null,
                MidQualityMp4Uri = midQualityVideoAssetFile != null && sasLocator != null ? midQualityVideoAssetFile.GetSasUri(sasLocator) : null,
                LowQualityMp4Uri = lowQualityVideoAssetFile != null && sasLocator != null ? lowQualityVideoAssetFile.GetSasUri(sasLocator) : null
            };
        }

        private static Expression<Func<T, bool>> CreateOrExpression<T, V>(string propertyName, IEnumerable<V> values)
        {
            ParameterExpression a = Expression.Parameter(typeof(T), "a");
            Expression exp = Expression.Constant(false);

            foreach (var value in values)
            {
                exp = Expression.OrElse(
                    exp,
                    Expression.Equal(Expression.Property(a, propertyName), Expression.Constant(value, typeof(V))));
            }

            var predicate = Expression.Lambda<Func<T, bool>>(exp, a);

            return predicate;
        }

        private static Uri GetThumbnailUri(Dictionary<string, Uri> thumbnailUris, string alternateId)
        {
            Uri thumbnailUri = null;
            if (!string.IsNullOrWhiteSpace(alternateId))
            {
                thumbnailUris.TryGetValue(alternateId, out thumbnailUri);
            }

            return thumbnailUri;
        }

        private static bool IsAssetId(string id)
        {
            return !string.IsNullOrWhiteSpace(id) && id.StartsWith(AssetIdPrefix, StringComparison.Ordinal);
        }
    }
}
