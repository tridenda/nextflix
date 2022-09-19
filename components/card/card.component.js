import { useState } from "react";

import Image from "next/image";

import styles from "./card.module.css";

const Card = (props) => {
  const { imgUrl = "/static/clifford.webp", size = "medium" } = props;

  const [imgSrc, setImgSrc] = useState(imgUrl);
  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  const handleOnError = () => {
    console.log("Hii error");
    setImgSrc("/static/clifford.webp");
  };

  return (
    <div className={styles.container}>
      Card
      <div className={classMap[size]}>
        <Image
          className={styles.cardImg}
          onError={handleOnError}
          src={imgSrc}
          alt="Card photo"
          layout="fill"
        />
      </div>
    </div>
  );
};

export default Card;
