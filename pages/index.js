import Head from "next/head";

import NavBar from "../components/navbar/navbar.component";
import Banner from "../components/banner/banner.component";
import SectionCards from "../components/section-cards/section-cards.component";

import { getVideos, getPopularVideos } from "../lib/videos.lib";

import styles from "../styles/Home.module.css";

export async function getServerSideProps() {
  const disneyVideos = await getVideos("Disney trailer");
  const productivityVideos = await getVideos("Productivity");
  const travelVideos = await getVideos("Travel");

  const popularVideos = await getPopularVideos();

  return {
    props: { disneyVideos, popularVideos, productivityVideos, travelVideos },
  };
}

export default function Home(props) {
  const { disneyVideos, popularVideos, productivityVideos, travelVideos } =
    props;

  return (
    <div className={styles.container}>
      <Head>
        <title>Nextflix</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <NavBar />
        <Banner
          videoId="4zH5iYM4wJo"
          title="Clifford the red dog"
          subTitle="a very cute dog"
          imgUrl="/static/clifford.webp"
        />

        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney" videos={disneyVideos} size="large" />
          <SectionCards
            title="Productivity"
            videos={productivityVideos}
            size="medium"
          />
          <SectionCards title="Travel" videos={travelVideos} size="small" />
          <SectionCards title="Popular" videos={popularVideos} size="small" />
        </div>
      </div>
    </div>
  );
}
