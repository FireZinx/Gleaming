"use client"

import { useContext, useEffect, useRef, useState } from "react"
import styles from "../page.module.css"
import { DefaultLoadingManager } from "three"
import { ButtonContext } from "./DataContext" 

let sceneContext: any;

function SignUp() {
    sceneContext.setView(null);
    sceneContext.setSignup(true);
}

export default function Home() {
    const [loaded, setLoaded] = useState(false);
    const [remove, setRemove] = useState(false);
    const [active, setActive] = useState(false);

    sceneContext = useContext(ButtonContext)

    const loader = useRef(null);

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
        <div id={"signupContainer"} className={styles.signupContainer}>
        

            <div className={styles.signupBox1}/>
            <div className={styles.signupBox2}/>
        </div>

        <header className={styles.header}>
            <div className={styles.headerText}>
                GLEAMING
            </div>
                
            <div className={styles.headerContainer}>
                <div 
                onClick={() => {
                   SignUp();
                }}
                className={styles.headerButton}>
                    Sign-up  
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
