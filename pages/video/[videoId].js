import { useRouter } from "next/router";

import cls from "classnames";
import Modal from "react-modal";

import { getYoutubeVideoById } from "../../lib/videos.lib";

import styles from "../../styles/Video.module.css";

Modal.setAppElement("#__next");

export async function getStaticProps(context) {
  const video = {
    title: "Hi cute dong",
    publishTime: "1990-01-01",
    description:
      "The change went into effect in September 2018. Since then, setting the parameter to “0” no longer disabled the related videos, which effectively reduces your control over the content people see on your website. However, there’s a silver lining: setting “rel” to “0” now displays related videos from the same channel that posted the original video. This means that if you post a video from your own channel, at least all the related videos will be yours, too, and you won’t run the risk of promoting the competition.",
    channelTitle: "Paramount Pictures",
    viewCount: 10000,
    statistics: { viewCount: 0 },
  };

  const videoId = context.params.videoId;
  const videoArray = await getYoutubeVideoById(videoId);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : video,
    },
    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths() {
  const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"];
  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));

  return { paths, fallback: "blocking" };
}

const Video = (props) => {
  const router = useRouter();
  const { videoId } = router.query;

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = props.video;

  console.log("props.video:", props.video);

  return (
    <div className={styles.container}>
      <Modal
        className={styles.modal}
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={() => router.back()}
        overlayClassName={styles.overlay}
      >
        <div className={styles.videoWrapper}>
          <iframe
            className={styles.videoPlayer}
            id="player"
            type="text/html"
            width="640"
            height="390"
            src={`http://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=http://example.com&control=0&rel=0`}
            frameborder="0"
          ></iframe>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>

            <div className={styles.col2}>
              <p className={cls(styles.subTextWrapper, styles.subText)}>
                <span className={styles.infoTextKey}>Cast: </span>
                <span className={styles.infoTextValue}>{channelTitle}</span>
              </p>
              <p className={cls(styles.subTextWrapper, styles.subText)}>
                <span className={styles.infoTextKey}>View Count: </span>
                <span className={styles.infoTextValue}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
