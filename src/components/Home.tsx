import { useContext, useEffect, useRef, useState } from "react"
import styles from "../styles/Home.module.css"
import { DefaultLoadingManager } from "three"
import { ButtonContext } from "./DataContext" 

let sceneContext;

export default function Home() {
    const [loaded, setLoaded] = useState(false);
    const [remove, setRemove] = useState(false);
    const [active, setActive] = useState(false);
    const loader = useRef()

    sceneContext = useContext(ButtonContext)

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
            <div className={styles.headerText}>
                GLEAMING
            </div>
                
            <div className={styles.headerContainer}>
                <div className={styles.headerButton}>
                    Dimensions  
                </div>
            </div>
        </header>
        <div data-active={active} data-remove={remove} className={styles.loadingScene}>
            <div ref={loader} data-loaded={loaded} data-remove={remove} className={styles.loading}>
                Welcome to Gleaming
            </div>
        </div>
    </>
    )
}
