import { Artwork } from './artwork';
import { PlayParams } from './play-params';

export class SongModel {
  attributes: SongAttributes;
  id: string;
  type: string;
  href: string;
}

export class SongAttributes {
  releaseDate: string;
  albumName: string;
  artistName: string;
  durationInMillis: number;
  name: string;
  trackNumber: number;
  playParams: PlayParams;
  artwork: Artwork;
  contentRating: string;
}



