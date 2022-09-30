import Head from "next/head";

import NavBar from "../../components/navbar/navbar.component";
import SectionCards from "../../components/section-cards/section-cards.component";

import useRedirectUser from "../../utils/redirectUser.util";

import { getMyListVideos } from "../../lib/videos.lib";

import styles from "../../styles/MyList.module.css";

export async function getServerSideProps(context) {
  const { userId, token } = await useRedirectUser(context);

  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const videos = await getMyListVideos(token, { userId });

  return {
    props: {
      myListVideos: videos,
    },
  };
}

const MyList = ({ myListVideos }) => {
  return (
    <div>
      <Head>
        <title>My list</title>
      </Head>

      <main className={styles.main}>
        <NavBar />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="My List"
            videos={myListVideos}
            size="small"
            shouldWrap={true}
            shouldScale={false}
          />
        </div>
      </main>
    </div>
  );
};

export default MyList;
