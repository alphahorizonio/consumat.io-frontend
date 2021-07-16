import { Media } from "../../lib/api/consumat-io";
import {
  getValidWatchStatusForMediaType,
  getWatchStatusFromString,
  WatchStatus,
} from "../../types/status";
import {
  getMediaTypeFromString,
  isMovie,
  isTv,
  MediaType,
} from "../../types/media";
import { useEffect, useState } from "react";
import DetailInfoList from "./DetailInfoList";
import CastList from "./CastList";
import DetailHeader from "./DetailHeader";
import TvDetails from "./TvDetails";
import SelectButton from "../dataEntry/SelectButton";
import {
  useGetDiscover,
  useSetRating,
  useSetWatchStatus,
} from "../../hooks/DataHooks";
import GeneralInfoList from "./GeneralInfoList";
import { MediaInfo } from "./GeneralInfoList";
import ProviderList from "../dataDisplay/ProviderList";
import MediaListHorizontal from "../dataDisplay/MediaListHorizontal";

type DetailPageProps = {
  media: Media;
};

const DetailPage = ({ media }: DetailPageProps) => {
  const [mediaType, setMediaType] = useState(
    isTv(media) ? MediaType.Tv : isMovie(media) ? MediaType.Movie : null
  );
  const [selectedWatchStatus, setSelectedWatchStatus] =
    useState<WatchStatus | null>(getWatchStatusFromString(media.watchStatus));

  const [selectedRating, setSelectedRating] = useState<number | null>(
    media.ratingUser
  );

  const {
    res: {
      data: recommendedMediaData,
      loading: recommendedMediaLoading,
      error: recommendedMediaError,
    },
  } = useGetDiscover(
    getMediaTypeFromString(media.__typename),
    null,
    media.code,
    1
  );

  const [
    updateWatchStatus,
    { loading: loadingUpdateWatchStatus, error: errorUpdateWatchStatus },
  ] = useSetWatchStatus();
  const [
    updateRating,
    { loading: loadingUpdateRating, error: errorUpdateRating },
  ] = useSetRating();

  useEffect(() => {
    updateWatchStatus({
      variables: {
        code: media.code,
        type: getMediaTypeFromString(media.__typename),
        watchStatus: selectedWatchStatus,
      },
    });
  }, [selectedWatchStatus]);

  useEffect(() => {
    updateRating({
      variables: {
        code: media.code,
        type: media.__typename,
        rating: selectedRating ? selectedRating : null,
      },
    });
  }, [selectedRating]);

  const getInfosForMediaType = (mediaType: MediaType): MediaInfo[] => {
    const mediaInfo: MediaInfo[] = [];
    mediaInfo.push({ description: "Status", value: media.status });

    // Only add runtime info when available
    if (media.runtime > 0) {
      mediaInfo.push({
        description: "Runtime",
        value: `${media.runtime}min`,
      });
    }

    if (isTv(media)) {
      // Add TV-specific infos
      // Only add release info when available
      if (media.releaseInitial) {
        mediaInfo.push({
          description: "Airing Time",
          value: `${media.releaseInitial?.replaceAll("-", ".")} - ${
            media.releaseFinal ? media.releaseFinal.replaceAll("-", ".") : "?"
          }`,
        });
      }
    } else if (isMovie(media)) {
      // Add movie-specific infos
      // Only add release info when available
      if (media.releaseInitial) {
        mediaInfo.push({
          description: "Release",
          value: media.releaseInitial.replaceAll("-", "."),
        });
      }
    }

    return mediaInfo;
  };

  const statusOptions: string[] = [
    "Watch Status",
    ...getValidWatchStatusForMediaType(mediaType),
  ];

  const ratingOptions: string[] = [
    "Rating",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
  ];

  return (
    <div className="flex flex-col">
      <DetailHeader media={media} />
      <div className="sm:px-8">
        <div className="flex flex-col sm:flex-row my-4">
          <div className="flex flex-col justify-evenly w-40 mr-2 ml-8 sm:ml-0 flex-shrink-0">
            <SelectButton
              name="watchStatus"
              options={statusOptions}
              value={
                selectedWatchStatus != null
                  ? selectedWatchStatus
                  : "Watch Status"
              }
              onChange={(event) => {
                setSelectedWatchStatus(
                  getWatchStatusFromString(event.target.value)
                );
              }}
              className={`mb-1 ${loadingUpdateWatchStatus && "animate-pulse"}`}
            />

            <SelectButton
              name="rating"
              options={ratingOptions}
              value={selectedRating ? selectedRating.toString() : "Rating"}
              onChange={(event) => {
                event.target.value == "Rating"
                  ? setSelectedRating(null)
                  : setSelectedRating(parseInt(event.target.value));
              }}
              className={`${loadingUpdateRating && "animate-pulse"}`}
            />

            <a href={media.tmdbUrl} target="_blank">
              <button className="button mt-1 py-1 w-40 text-sm font-medium">
                See on TMDb
              </button>
            </a>
          </div>
          <GeneralInfoList
            infos={getInfosForMediaType(mediaType)}
            className="w-full mt-8 sm:my-0"
          />
        </div>

        <div className="cardWithShadow">
          <h3 className="cardHeading">OVERVIEW</h3>
          <p className="md:text-xl text-justify">{media.overview}</p>
        </div>

        <DetailInfoList
          title="GENRES"
          infos={media.genres.map((genre) => genre.name)}
        />

        <div className="lg:flex lg:-my-8">
          <CastList
            title={media.directors.length > 1 ? "DIRECTORS" : "DIRECTOR"}
            cast={media.directors}
            className="lg:w-29/100"
          />

          <CastList
            title="CAST"
            cast={media.cast}
            className="lg:w-7/10 lg:ml-1/100"
          />
        </div>

        {media.providers.length > 0 && (
          <div className="cardWithShadow">
            <h3 className="cardHeading">PROVIDERS</h3>
            <ProviderList providers={media.providers} />
          </div>
        )}

        <MediaListHorizontal
          title="SIMILAR TITLES"
          mediaPage={recommendedMediaData?.discover}
          loading={recommendedMediaLoading}
          error={recommendedMediaError}
        />

        {isTv(media) && <TvDetails tv={media} />}
      </div>
    </div>
  );
};

export default DetailPage;
