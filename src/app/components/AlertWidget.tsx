"use client"

import { useEffect, useState } from "react"
import styles from "../page.module.css"

export default function AlertWidget() {
    const [ alertMessage, setAlertMessage ] = useState<string>("");

    const newWS = () => {
        let WSConnection = new WebSocket(`/ws/alert`)
        
        WSConnection.onmessage = (event) => {
            console.log("Received message: ", event.data);
            setAlertMessage(event.data);
        }

        WSConnection.onclose = (event) => {
            console.log("WebSocket closed: ", event);
            setTimeout(() => {
                newWS();
            }, 10000);
        }
    }

    useEffect(() => {
        newWS();
    }, [])
    
    return ( 
        <>
            <div className={styles.alertWidgetcontainer}>
                <div className={styles.alertWidget}>
                    <p>This is an alert message from server</p>
                </div>
                <div className={styles.alertWidget}>
                    <p>Received alert: {alertMessage}</p>
                </div>
            </div>
        </>
    )

}