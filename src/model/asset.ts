import nano from 'nano';

export interface Asset extends nano.MaybeDocument {
  assetId: string;
  vodUrl: string;
}
