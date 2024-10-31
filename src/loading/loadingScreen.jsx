import React from 'react'
import ReactLoading from "react-loading";
import styles from './loadingScreen.module.css'

export const LoadingScreen = () => {
  return (
    <div className={styles.container}>
      <ReactLoading type="spokes" color="#9ef2eb" height={100} width={50} />
    </div>
  )
}
