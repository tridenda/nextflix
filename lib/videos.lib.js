import videosTestData from "../data/videos.json";
import { getMyListFromHasura, getWatchedVideos } from "./db/hasura";

export const fetchVideos = async (url) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const BASE_URL = "youtube.googleapis.com/youtube/v3";

  const response = await fetch(
    `https://${BASE_URL}/${url}key=${YOUTUBE_API_KEY}`
  );

  return await response.json();
};

export const getCommonVideos = async (url) => {
  try {
    const isDev = process.env.DEVELOPMENT;
    const data = isDev ? videosTestData : await fetchVideos(url);

    if (data?.error) {
      console.log("Error retrieving the data: ", data.error);
      return videosTransform(videosTestData.items);
    }

    return videosTransform(data.items);
  } catch (error) {
    console.log("Something went wrong with video library", error);
    return [];
  }
};

export const getVideos = (searchQuery) => {
  const URL = `search?part=snippet&maxResults=15&q=${searchQuery}&type=video&`;

  return getCommonVideos(URL);
};

export const getPopularVideos = () => {
  const URL =
    "videos?part=snippet%2C%20contentDetails%2C%20statistics&chart=mostPopular&maxResults=15&regionCode=US&";

  return getCommonVideos(URL);
};

const videosTransform = (arr) => {
  return arr.map((item) => {
    const id = item.id?.videoId || item.id;
    const snippet = item.snippet;

    return {
      title: snippet.title,
      imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
      id,
      description: snippet.description,
      publishTime: snippet.publishedAt,
      channelTitle: snippet.channelTitle,
      statistics: item.statistics
        ? item.statistics
        : {
            viewCount: 0,
          },
    };
  });
};

export const getYoutubeVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;

  return getCommonVideos(URL);
};

export const getWatchItAgainVideos = async (token, stats) => {
  const videos = await getWatchedVideos(token, stats);

  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    };
  });
};

export const getMyListVideos = async (token, stats) => {
  const videos = await getMyListFromHasura(token, stats);

  return (
    videos?.map((video) => {
      return {
        id: video.videoId,
        imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
      };
    }) || []
  );
};
