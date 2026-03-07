"use client"

import { useContext} from "react"
import styles from "../page.module.css"
import { ButtonContext } from "./DataContext"

export function Buttons() {
    const sceneContext = useContext(ButtonContext);

    return(
        <>
            <div className={styles.regressContainer}>
                <div
                    onClick={() => {
                        sceneContext.setReturning(true);
                    }}
                    className={styles.button}
                >
                    <img src="Enter.png" /*data-show={props.visible}*/ className={styles.buttonImage}/>
                    Go back
                </div>
            </div>
        </>
    )
}