module Models {
    export class Asset {
        constructor(
            public id: string,
            public name: string,
            public status: string,
            public mpegDashUri: string,
            public hlsUri: string,
            public hlsv3Uri: string,
            public smoothStreamingUri: string,
            public thumbnailUri: string,
            public highQualityMp4Uri: string,
            public midQualityMp4Uri: string,
            public lowQualityMp4Uri: string) {
        }
    }
}