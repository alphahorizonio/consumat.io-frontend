import {
  useGetMovieQuery,
  useGetTvQuery,
  useGetSearchQuery,
  useGetPopularQuery,
  useGetDiscoverQuery,
  useGetListQuery,
  useGetTvSeasonsQuery,
  useGetEpisodeQuery,
  useGetSeasonEpisodesQuery,
  useGetSeasonQuery,
  useSetWatchStatusMutation,
  useSetRatingMutation,
  useSetNumberOfWatchedEpisodesMutation,
  useSetFavoriteMutation,
  useSetCountryMutation,
  useSetLanguageMutation,
  useGetUserQuery,
  useGetByRatingQuery,
  useGetWatchTimeQuery,
  useGetWatchCountQuery,
} from "../lib/api/consumat-io";
import { MediaType } from "../types/media";
import { WatchStatus } from "../types/status";

// Queries

export function useGetMovie(code: number) {
  return useGetMovieQuery({
    variables: {
      code: code,
    },
    fetchPolicy: "network-only",
  });
}

export function useGetTv(code: number) {
  return useGetTvQuery({
    variables: {
      code: code,
    },
    fetchPolicy: "network-only",
  });
}

export function useGetSeason(code: number, seasonNumber: number) {
  return useGetSeasonQuery({
    variables: {
      code: code,
      seasonNumber: seasonNumber,
    },
    fetchPolicy: "network-only",
  });
}

export function useGetEpisode(
  code: number,
  seasonNumber: number,
  episodeNumber: number
) {
  return useGetEpisodeQuery({
    skip: code == null || seasonNumber == null || episodeNumber == null,
    variables: {
      code: code,
      seasonNumber: seasonNumber,
      episodeNumber: episodeNumber,
    },
    fetchPolicy: "network-only",
  });
}

export function useGetSearch(keyword: string | string[], page: number) {
  return useGetSearchQuery({
    skip: keyword == null || keyword === "",
    variables: {
      keyword: "" + keyword,
      page: page,
    },
    fetchPolicy: "network-only",
  });
}

export function useGetPopular(type: MediaType, page: number) {
  return useGetPopularQuery({
    variables: {
      type: type,
      page: page,
    },
    fetchPolicy: "network-only",
  });
}

export function useGetDiscover(
  type: MediaType,
  person: number,
  similarTo: number | null,
  page: number
) {
  const res = useGetDiscoverQuery({
    variables: {
      type,
      person,
      similarTo,
      page,
    },
    fetchPolicy: "network-only",
  });

  return similarTo
    ? {
        res,
        skipped: false,
      }
    : {
        res: {
          data: null,
          loading: null,
          error: null,
        },
        skipped: true,
      };
}

export function useGetByRating(
  type: MediaType,
  tmdbRating: number,
  minVotes: number,
  releasedFrom: string,
  page: number
) {
  return useGetByRatingQuery({
    variables: {
      type: type,
      tmdbRating: tmdbRating,
      minVotes: minVotes,
      releasedFrom: releasedFrom,
      page: page,
    },
    fetchPolicy: "network-only",
  });
}

export function useGetList(
  type: MediaType,
  watchStatus: WatchStatus = null,
  favorite: boolean = null
) {
  return useGetListQuery({
    variables: {
      type: type,
      watchStatus: watchStatus,
      favorite: favorite,
    },
    fetchPolicy: "network-only",
  });
}

export function useGetTvSeasons(code: number) {
  return useGetTvSeasonsQuery({
    variables: {
      code: code,
    },
    fetchPolicy: "network-only",
  });
}

export function useGetSeasonEpisodes(code: number, seasonNumber: number) {
  return useGetSeasonEpisodesQuery({
    variables: {
      code: code,
      seasonNumber: seasonNumber,
    },
    fetchPolicy: "network-only",
  });
}

export function useGetUser() {
  return useGetUserQuery({ fetchPolicy: "network-only" });
}

export function useGetWatchTime(type: MediaType) {
  return useGetWatchTimeQuery({
    variables: {
      type: type,
    },
    fetchPolicy: "cache-and-network",
  });
}

export function useGetWatchCount(type: MediaType) {
  return useGetWatchCountQuery({
    variables: {
      type: type,
    },
    fetchPolicy: "cache-and-network",
  });
}

// Mutations

export function useSetRating() {
  return useSetRatingMutation();
}

export function useSetWatchStatus() {
  return useSetWatchStatusMutation();
}

export function useSetNumberOfWatchedEpisodes() {
  return useSetNumberOfWatchedEpisodesMutation();
}

export function useSetFavorite() {
  return useSetFavoriteMutation();
}

export function useSetCountry() {
  return useSetCountryMutation();
}

export function useSetLanguage() {
  return useSetLanguageMutation();
}
