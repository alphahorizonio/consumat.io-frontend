import { Media, Movie, Tv } from "../lib/api/consumat-io";

export enum MediaType {
  Movie = "Movie",
  Tv = "TV",
}

export function isMovie(media: Media): media is Movie {
  return media.__typename === MediaType.Movie;
}

export function isTv(media: Media): media is Tv {
  return media.__typename === MediaType.Tv;
}

export function isMovieList(mediaList: Media[]): mediaList is Movie[] {
  for (const media of mediaList) {
    if (media.__typename !== MediaType.Movie) return false;
  }
  return true;
}

export function isTvList(mediaList: Media[]): mediaList is Tv[] {
  for (const media of mediaList) {
    if (media.__typename !== MediaType.Tv) return false;
  }
  return true;
}

export function getMediaTypeFromString(str: string): MediaType | null {
  switch (str) {
    case "Movie":
      return MediaType.Movie;
    case "TV":
      return MediaType.Tv;
    default:
      return null;
  }
}
