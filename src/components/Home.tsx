import { useEffect, useRef, useState } from "react"
import styles from "../styles/Home.module.css"
import { DefaultLoadingManager } from "three"

export default function Home() {
    const [loaded, setLoaded] = useState(false);
    const [remove, setRemove] = useState(false);
    const [active, setActive] = useState(false);
    const loader = useRef()

    useEffect(() => {
        DefaultLoadingManager.onLoad = () => {
            setTimeout(() => {
                setLoaded(true)
            }, 100) 
            setTimeout(() => {
                setRemove(true)
            }, 7000) 
            setTimeout(() => {
                setActive(true)
            }, 8000) 
        }
    }, [])

    return(
    <>
        <header className={styles.header}>
            Gleaming
        </header>
        <div data-active={active} data-remove={remove} className={styles.container}>
            <div ref={loader} data-loaded={loaded} data-remove={remove} className={styles.loading}>
                Welcome to Gleaming
            </div>
        </div>
    </>
    )
}
