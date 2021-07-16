import {
  useGetByRating,
  useGetDiscover,
  useGetList,
  useGetPopular,
} from "../hooks/DataHooks";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import MetaData from "../components/MetaData";
import HomeHeader from "../components/home/HomeHeader";
import MediaList from "../components/home/MediaList";
import MediaListHorizontal from "../components/dataDisplay/MediaListHorizontal";
import { useAuthorization } from "../hooks/AuthnHooks";
import { useEffect, useState } from "react";
import { Media } from "../lib/api/consumat-io";
import { getMediaTypeFromString, MediaType } from "../types/media";
import { WatchStatus } from "../types/status";

export const getServerSideProps: GetServerSideProps = async (context) => ({
  props: { session: await getSession(context) },
});

const Home = () => {
  const [session] = useAuthorization();
  const [headerImageSource, setHeaderImageSource] = useState("");
  const [randomFavorite, setRandomFavorite] = useState<Media | null>(null);
  const [randomWatched, setRandomWatched] = useState<Media | null>(null);
  const [popularMoviesPage, setPopularMoviesPage] = useState(1);
  const [popularTvPage, setPopularTvPage] = useState(1);
  const [topRatedMoviesPage, setTopRatedMoviesPage] = useState(1);
  const [topRatedTvPage, setTopRatedTvPage] = useState(1);

  if (!session) return null;

  const {
    previousData: previousPopularMoviesData,
    data: popularMoviesData,
    loading: popularMoviesLoading,
    error: popularMoviesError,
  } = useGetPopular(MediaType.Movie, popularMoviesPage);

  const {
    previousData: previousPopularTvData,
    data: popularTvData,
    loading: popularTvLoading,
    error: popularTvError,
  } = useGetPopular(MediaType.Tv, popularTvPage);

  const {
    previousData: previousTopRatedMoviesData,
    data: topRatedMoviesData,
    loading: topRatedMoviesLoading,
    error: topRatedMoviesError,
  } = useGetByRating(
    MediaType.Movie,
    7.0,
    25,
    new Date(new Date().getFullYear(), 0, 1).toISOString(),
    topRatedMoviesPage
  );

  const {
    previousData: previousTopRatedTvData,
    data: topRatedTvData,
    loading: topRatedTvLoading,
    error: topRatedTvError,
  } = useGetByRating(
    MediaType.Tv,
    7.0,
    25,
    new Date(new Date().getFullYear(), 0, 1).toISOString(),
    topRatedTvPage
  );

  const {
    data: favoriteMoviesData,
    loading: favoriteMoviesLoading,
    error: favoriteMoviesError,
  } = useGetList(MediaType.Movie, null, true);

  const {
    data: favoriteTvData,
    loading: favoriteTvLoading,
    error: favoriteTvError,
  } = useGetList(MediaType.Tv, null, true);

  const {
    data: watchedMoviesData,
    loading: watchedMoviesLoading,
    error: watchedMoviesError,
  } = useGetList(MediaType.Movie, WatchStatus.Finished, null);

  const {
    data: watchedTvData,
    loading: watchedTvLoading,
    error: watchedTvError,
  } = useGetList(MediaType.Tv, WatchStatus.Finished, null);

  const {
    res: {
      data: recommendedBasedOnFavoriteData,
      loading: recommendedBasedOnFavoriteLoading,
      error: recommendedBasedOnFavoriteError,
    },
    skipped: recommendedBasedOnFavoriteSkipped,
  } = useGetDiscover(
    getMediaTypeFromString(randomFavorite?.__typename),
    null,
    randomFavorite?.code,
    1
  );

  const {
    res: {
      data: recommendedBasedOnWatchedData,
      loading: recommendedBasedOnWatchedLoading,
      error: recommendedBasedOnWatchedError,
    },
    skipped: recommendedBasedOnWatchedSkipped,
  } = useGetDiscover(
    getMediaTypeFromString(randomWatched?.__typename),
    null,
    randomWatched?.code,
    1
  );

  useEffect(() => {
    if (popularMoviesData && popularTvData && !headerImageSource) {
      const movieTvArray: Media[] = [
        ...popularMoviesData.popular.results,
        ...popularTvData.popular.results,
      ].filter((item) => item.backdropPath !== null);
      const randomItem =
        movieTvArray[Math.floor(Math.random() * movieTvArray.length)];
      setHeaderImageSource(randomItem?.backdropPath);
    }
  }, [popularMoviesData, popularTvData]);

  useEffect(() => {
    if (favoriteMoviesData && favoriteTvData) {
      const favorites: Media[] = [
        ...favoriteMoviesData.list,
        ...favoriteTvData.list,
      ];
      const randomFavoriteMedia =
        favorites[Math.floor(Math.random() * favorites.length)];
      setRandomFavorite(randomFavoriteMedia);
    }
  }, [favoriteMoviesData, favoriteTvData]);

  useEffect(() => {
    if (watchedMoviesData && watchedTvData) {
      const favorites: Media[] = [
        ...watchedMoviesData.list,
        ...watchedTvData.list,
      ];
      const randomWatchedMedia =
        favorites[Math.floor(Math.random() * favorites.length)];
      setRandomWatched(randomWatchedMedia);
    }
  }, [watchedMoviesData, watchedTvData]);

  return (
    <div className="md:px-4">
      <MetaData title="consumat.io | Home" />

      <HomeHeader backgroundImageSource={headerImageSource} />

      {!recommendedBasedOnFavoriteSkipped && (
        <MediaListHorizontal
          title={
            randomFavorite
              ? `BECAUSE YOU LIKED ${randomFavorite?.title.toUpperCase()}`
              : null
          }
          mediaPage={recommendedBasedOnFavoriteData?.discover}
          loading={recommendedBasedOnFavoriteLoading}
          error={recommendedBasedOnFavoriteError}
        />
      )}

      {!recommendedBasedOnWatchedSkipped && (
        <MediaListHorizontal
          title={
            randomWatched
              ? `BECAUSE YOU WATCHED ${randomWatched?.title.toUpperCase()}`
              : null
          }
          mediaPage={recommendedBasedOnWatchedData?.discover}
          loading={recommendedBasedOnWatchedLoading}
          error={recommendedBasedOnWatchedError}
        />
      )}

      <MediaList
        title="POPULAR MOVIES"
        mediaPage={popularMoviesData?.popular}
        previouslyLoadedMediaPage={previousPopularMoviesData?.popular}
        pageNumber={popularMoviesPage}
        setPage={setPopularMoviesPage}
        loading={popularMoviesLoading}
        error={popularMoviesError}
      />

      <MediaList
        title="POPULAR TV SHOWS"
        mediaPage={popularTvData?.popular}
        previouslyLoadedMediaPage={previousPopularTvData?.popular}
        pageNumber={popularTvPage}
        setPage={setPopularTvPage}
        loading={popularTvLoading}
        error={popularTvError}
      />

      <MediaList
        title={`TOP RATED MOVIES ${new Date().getFullYear().toString()}`}
        mediaPage={topRatedMoviesData?.byRating}
        previouslyLoadedMediaPage={previousTopRatedMoviesData?.byRating}
        pageNumber={topRatedMoviesPage}
        setPage={setTopRatedMoviesPage}
        loading={topRatedMoviesLoading}
        error={topRatedMoviesError}
      />

      <MediaList
        title={`TOP RATED SHOWS ${new Date().getFullYear().toString()}`}
        mediaPage={topRatedTvData?.byRating}
        previouslyLoadedMediaPage={previousTopRatedTvData?.byRating}
        pageNumber={topRatedTvPage}
        setPage={setTopRatedTvPage}
        loading={topRatedTvLoading}
        error={topRatedTvError}
      />
    </div>
  );
};

export default Home;
