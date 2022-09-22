import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { magic } from "../lib/magic-client";

import Loading from "../components/loading/loading.component";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { asPath, query } = router;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoggedIn = async () => {
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        // route to /
        router.push("/");
      } else {
        // route to /login
        router.push("/login");
      }
    };
    handleLoggedIn();
  }, []);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };

    // I have no idea why this code works
    // I need to exam this more
    // start
    console.log("asPath: ", asPath);
    console.log("query: ", query);
    if (
      !asPath.includes("?") ||
      (asPath.includes("?") && Object.keys(query).length === 0)
    ) {
      setIsLoading(false);
    }
    // end

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return isLoading ? <Loading /> : <Component {...pageProps} />;
}

export default MyApp;
