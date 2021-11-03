import React from "react";
import styles from "./loading-indicator.module.css";

const LoadingIndicator = () => {
  return (
    <div className={styles["lds-ring"]}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingIndicator;
