import { useRouter } from "next/router";

const Video = () => {
  const router = useRouter();

  return <h1>Video page {router.query.videoId}</h1>;
};

export default Video;
