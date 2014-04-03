/// <reference path="Asset.ts" />

module Models {
    export class AssetsInfo {
        constructor(
            public assets: Array<Asset>,
            public total: number) { }
    }
}