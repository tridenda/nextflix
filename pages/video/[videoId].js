import { useRouter } from "next/router";

import cls from "classnames";
import Modal from "react-modal";

import Navbar from "../../components/navbar/navbar.component";

import { getYoutubeVideoById } from "../../lib/videos.lib";

import styles from "../../styles/Video.module.css";
import NavBar from "../../components/navbar/navbar.component";

Modal.setAppElement("#__next");

export async function getStaticProps(context) {
  const videoId = context.params.videoId;
  const videoArray = await getYoutubeVideoById(videoId);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
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

  return (
    <div className={styles.container}>
      <NavBar />
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
