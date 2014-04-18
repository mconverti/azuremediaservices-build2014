namespace WebPlayers
{
    using System.Web.Mvc;
    using System.Web.WebPages;

    public class DisplayModeConfig
    {
        public static void RegisterDisplayModes(DisplayModeProvider filters)
        {
            filters.Modes.Insert(
                0,
                new DefaultDisplayMode("WindowsPhone")
                {
                    ContextCondition =
                    ctx =>
                    {
                        var agent = ctx.Request.UserAgent ?? string.Empty;
                        agent = agent.ToUpperInvariant();

                        return agent.Contains("WINDOWS PHONE");
                    }
                });

            filters.Modes.Insert(
                1,
                new DefaultDisplayMode("Apple")
                {
                    ContextCondition =
                    ctx =>
                    {
                        var agent = ctx.Request.UserAgent ?? string.Empty;
                        agent = agent.ToUpperInvariant();

                        return agent.Contains("IPAD")
                            || agent.Contains("IPOD")
                            || agent.Contains("IPHONE")
                            || agent.Contains("MACINTOSH");
                    }
                });

            filters.Modes.Insert(
                2,
                new DefaultDisplayMode("Android")
                {
                    ContextCondition =
                    ctx =>
                    {
                        var agent = ctx.Request.UserAgent ?? string.Empty;
                        agent = agent.ToUpperInvariant();

                        return agent.Contains("ANDROID");
                    }
                });
        }
    }
}
