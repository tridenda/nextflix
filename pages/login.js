import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

import styles from "../styles/Login.module.css";

const Login = () => {
  const router = useRouter();
  const [userMsg, setUserMsg] = useState("");
  const [email, setEmail] = useState("");

  const handleOnChangeEmail = (e) => {
    setUserMsg("");
    e.preventDefault();
    const newEmail = e.target.value;
    setEmail(newEmail);
  };

  const handleLoginWithEmail = (e) => {
    e.preventDefault();

    if (email === "tridenda.nk@gmail.com") {
      // route to dashboard
      router.push("/");
    }

    if (!email) {
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
            Login
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
