"use client"

import { useContext, useEffect, useRef, useState } from "react"
import styles from "../page.module.css"
import { DefaultLoadingManager } from "three"
import { ButtonContext } from "./DataContext" 

let sceneContext: any;

export default function Home() {
    const [loaded, setLoaded] = useState(false);
    const [remove, setRemove] = useState(false);
    const [active, setActive] = useState(false);

    const signupEmailRef = useRef<HTMLInputElement>(null);
    const signupPasswordRef = useRef<HTMLInputElement>(null);

    const SignupContainer = useRef<HTMLDivElement>(null);

    sceneContext = useContext(ButtonContext)

    const loader = useRef(null);

    useEffect(() => {
        if (!SignupContainer.current) return;

        SignupContainer.current.style.display = "none";
    }, [SignupContainer.current])

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

    function SignupInterface() {
        console.log(sceneContext.isSignup.current)

        if (SignupContainer.current != null && !sceneContext.isSignup.current) {
            
            SignupContainer.current.style.display = "flex";

            setTimeout(() => {
                if (!SignupContainer.current) return;
                SignupContainer.current.style.opacity = "1";
            }, 100)    
            
            sceneContext.setView(null);
            sceneContext.setSignup(true);

        } else if (SignupContainer.current != null && sceneContext.isSignup.current) {
            console.log("signup false")

            SignupContainer.current.style.opacity = "0";   

            setTimeout(() => {
                if (!SignupContainer.current) return;
                SignupContainer.current.style.display = "none";
            }, 1000)    
            
            sceneContext.setSignup(false);
            sceneContext.setView("apartment");
        }
    }

    function SubmitSignup() {
        const email = signupEmailRef.current?.value;
        const password = signupPasswordRef.current?.value;

        fetch(`/api/signupsubmit?email=${email}&password=${password}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data) {
                console.log("Signup successful: ", data);
            } else {
                console.error("Signup failed");
            }
        })
    }

    function LoginInterface() {
        
    }

    return(
    <>
        <div ref={SignupContainer} className={styles.signupContainer}>
            <div className={styles.signupInsertContainer}>
                <div className={styles.signupText}>
                    GLEAMING
                </div>

                <div className={styles.signupinfo}>
                    Create Account
                </div>

                <div className={styles.signupInputContainer}>
                    <input ref={signupEmailRef} placeholder="Email" className={styles.signupEmail}/>
                    <input ref={signupPasswordRef} placeholder="Password" className={styles.signupPassword}/>

                    <button className={styles.singupButton} onClick={() => {
                        SubmitSignup();
                    }}>
                        Submit
                    </button>
                </div>   
            </div>
            <div className={styles.singupBoxContainer}>
                <div className={styles.signupBox1}/>
                <div className={styles.signupBox2}/>
            </div>
        </div>

        <header className={styles.header}>
            <div className={styles.headerText}>
                GLEAMING
            </div>
                
            <div className={styles.headerContainer}>
                <div 
                onClick={() => {
                   SignupInterface();
                }}
                className={styles.headerButton}>
                    Sign-up  
                </div>
                <div 
                onClick={() => {
                   LoginInterface();
                }}
                className={styles.headerButton}>
                    Login
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
