import Link from "next/link";

import Card from "../card/card.component";

import styles from "./section-cards.module.css";

const SectionCards = (props) => {
  const { title, videos = [], size } = props;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
        {videos.map((video, idx) => {
          console.log(video);
          return <Card id={idx} key={idx} imgUrl={video.imgUrl} size={size} />;
        })}
      </div>
    </section>
  );
};

export default SectionCards;
