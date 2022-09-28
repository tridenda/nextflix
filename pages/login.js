import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { magic } from "../lib/magic-client";

import styles from "../styles/Login.module.css";

const Login = () => {
  const [userMsg, setUserMsg] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete"), handleComplete;
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const handleOnChangeEmail = (e) => {
    setUserMsg("");
    e.preventDefault();
    const newEmail = e.target.value;
    setEmail(newEmail);
  };

  const handleLoginWithEmail = async (e) => {
    e.preventDefault();

    if (email) {
      // log in a user by their email
      try {
        setIsLoading(true);

        const didToken = await magic.auth.loginWithMagicLink({
          email,
        });

        if (didToken) {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${didToken}`,
              "Content-Type": "application/json",
            },
          });
          const loggedInResponse = await response.json();

          if (loggedInResponse.done) {
            router.push("/");
          } else {
            setIsLoading(false);
            setUserMsg("Something went wrong logging in");
          }
        }
      } catch (error) {
        // Handle errors if required!
        console.error("Something went wrong logging in", error);
        setIsLoading(false);
      }
    } else {
      // show user message
      setIsLoading(false);
      setUserMsg("Enter a valid email address");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Nextflix Login</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link href="/">
            <a className={styles.logoLink}>
              <span className={styles.logoWrapper}>
                <Image
                  src="/static/nextflix.png"
                  alt="Logo nextflix"
                  width="100%"
                  height="35px"
                />
              </span>
            </a>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.loginHeader}>Login</h1>
          <input
            onChange={handleOnChangeEmail}
            className={styles.emailInput}
            type="text"
            placeholder="Email adress"
          />

          <p className={styles.userMsg}>{userMsg}</p>
          <button className={styles.loginBtn} onClick={handleLoginWithEmail}>
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
