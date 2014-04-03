namespace WebPlayers
{
    using System.Web.Optimization;

    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js",
                "~/Scripts/jquery.tmpl.js"));

            bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                "~/Scripts/knockout-{version}.js",
                "~/Scripts/knockout.validation.js",
                "~/Scripts/knockout.mapping-latest.js"));

            bundles.Add(new ScriptBundle("~/bundles/app/common")
                .IncludeDirectory(directoryVirtualPath: "~/Scripts/app/Models", searchPattern: "*.js", searchSubdirectories: true)
                .IncludeDirectory(directoryVirtualPath: "~/Scripts/app/Services", searchPattern: "*.js", searchSubdirectories: true)
                .IncludeDirectory(directoryVirtualPath: "~/Scripts/app/ViewModels", searchPattern: "*.js", searchSubdirectories: true));

            bundles.Add(new ScriptBundle("~/bundles/app/desktop").Include(
                "~/Scripts/app/PlayerViewModel.Desktop.js"));

            bundles.Add(new ScriptBundle("~/bundles/app/apple").Include(
                "~/Scripts/app/PlayerViewModel.Apple.js"));

            bundles.Add(new ScriptBundle("~/bundles/app/android").Include(
                "~/Scripts/app/PlayerViewModel.Android.js"));

            bundles.Add(new StyleBundle("~/Content/css").IncludeDirectory(
                directoryVirtualPath: "~/Content", searchPattern: "*.css", searchSubdirectories: false));

            bundles.Add(new ScriptBundle("~/bundles/dash")
                .Include("~/Scripts/dash/lib/q.js")
                .Include("~/Scripts/dash/lib/xml2json.js")
                .Include("~/Scripts/dash/lib/objectiron.js")
                .Include("~/Scripts/dash/lib/dijon.js")
                .Include("~/Scripts/dash/lib/Math.js")
                .Include("~/Scripts/dash/lib/long.js")
                .Include("~/Scripts/dash/lib/base64.js")
                .Include("~/Scripts/dash/streaming/MediaPlayer.js")
                .Include("~/Scripts/dash/streaming/Context.js")
                .Include("~/Scripts/dash/dash/Dash.js")
                .Include("~/Scripts/dash/dash/DashContext.js")
                .IncludeDirectory("~/Scripts/dash/streaming", "*.js", true)
                .IncludeDirectory("~/Scripts/dash/dash", "*.js", true));
        }
    }
}
