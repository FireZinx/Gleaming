"use client"

import styles from "../page.module.css"
import { useEffect, useRef, useState } from "react"
import { DefaultLoadingManager } from "three"

export default function Home() {
    const [ loaded, setLoaded ] = useState(false);
    const [ remove, setRemove ] = useState(false);
    const [ active, setActive ] = useState(false);

    const loader = useRef(null);

    useEffect(() => {  
        DefaultLoadingManager.onLoad = () => {
            setTimeout(() => {
                setLoaded(true)
            }, 100) 
            setTimeout(() => {
                setRemove(true)
            }, 7000) 
        }

    }, [])

    return (
        <>
            <header className={styles.header}>
                <div className={styles.headerText}>Welcome to Gleaming</div>
            </header>
            <div data-active={active} data-remove={remove} className={styles.loadingScene}>
                <div ref={loader} data-loaded={loaded} data-remove={remove} className={styles.loading}>
                    Welcome to Gleaming
                </div>
            </div>
        </>
    )
}
