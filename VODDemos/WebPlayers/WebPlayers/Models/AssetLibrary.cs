namespace WebPlayers.Models
{
    using System.Collections.Generic;
    using WebPlayers.Services;

    public class AssetLibrary
    {
        public IEnumerable<Asset> Assets { get; set; }

        public int Total { get; set; }
    }
}