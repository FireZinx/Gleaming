import { useEffect, useRef, useState } from "react"
import styles from "../styles/Home.module.css"
import { DefaultLoadingManager } from "three"

export default function Home() {
    const loader = useRef()

    useEffect(() => {
        DefaultLoadingManager.onLoad = () => {
            loader.current.style.color = "rgba(0, 0, 0, 1)"
        }
        }, [])

    return(
    <>
        <header className={styles.header}>
            Gleaming
        </header>
        <div className={styles.container} ref={loader}>
            Welcome
        </div>
    </>
    )
}
