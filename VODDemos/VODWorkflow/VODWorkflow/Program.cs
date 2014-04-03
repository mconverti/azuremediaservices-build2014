namespace VODWorkflow
{
    using System;
    using System.Linq;
    using Microsoft.WindowsAzure.MediaServices.Client;

    class Program
    {
        static void Main(string[] args)
        {
            #region Media Services credentials
            string mediaServicesAccountName = "%MediaServicesAccountName%";
            string mediaServicesAccountKey = "%MediaServicesAccountKey%";
            #endregion

            // 1. Create context
            CloudMediaContext context = new CloudMediaContext(mediaServicesAccountName, mediaServicesAccountKey);

            Console.WriteLine("Getting the H264 Adaptive Bitrate MP4 asset...");

            // 2. Get the Adaptive Bitrate MP4 Set asset.
            IAsset mp4SetOutputAsset = context.Assets.Where(a => a.Name == "demo_mp4").FirstOrDefault();

            Console.WriteLine("Publishing the H264 Adaptive Bitrate MP4 asset...");

            // 3. Publish the output asset by creating an Origin locator for adaptive streaming, 
            //    and a SAS locator for progressive download.
            context.Locators.Create(LocatorType.OnDemandOrigin, mp4SetOutputAsset, AccessPermissions.Read, TimeSpan.FromDays(365));
            context.Locators.Create(LocatorType.Sas, mp4SetOutputAsset, AccessPermissions.Read, TimeSpan.FromDays(365));

            // 4. Generate the Smooth Streaming, HLS and MPEG-DASH URLs for adaptive streaming.
            Uri smoothStreamingUri = mp4SetOutputAsset.GetSmoothStreamingUri();
            Uri hlsUri = mp4SetOutputAsset.GetHlsUri();
            Uri mpegDashUri = mp4SetOutputAsset.GetMpegDashUri();

            Console.WriteLine(smoothStreamingUri);
            Console.WriteLine(hlsUri);
            Console.WriteLine(mpegDashUri);

            Console.WriteLine("H264 Adaptive Bitrate MP4 asset available for adaptive streaming.");
            Console.ReadLine();
        }
    }
}
