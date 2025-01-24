import { useEffect, useRef, useState, createContext, Children, ChildContextProvider, useContext} from "react"
import styles from "../styles/Home.module.css"
import { DefaultLoadingManager } from "three"
import { ButtonContext } from "./DataContext"

export function Buttons(props) {
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
                    <img src="Enter.png" data-show={props.visible} className={styles.buttonImage}/>
                    Go back
                </div>
            </div>
        </>
    )
}