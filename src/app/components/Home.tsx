"use client"

import { useContext, useEffect, useRef, useState } from "react"
import styles from "../page.module.css"
import { DefaultLoadingManager } from "three"
import { ButtonContext } from "./DataContext" 
import { signupSubmit, loginRequest, authenticateSession } from "../api/auth";

let sceneContext: any;

export default function Home() {
    const [ loaded, setLoaded ] = useState(false);
    const [ remove, setRemove ] = useState(false);
    const [ active, setActive ] = useState(false);

    const UsernameRef = useRef<HTMLInputElement>(null);
    const EmailRef = useRef<HTMLInputElement>(null);
    const PasswordRef = useRef<HTMLInputElement>(null);
    const DescriptionHeader = useRef<HTMLDivElement>(null);

    const UserContainer = useRef<HTMLDivElement>(null);
    const DescriptionContainer = useRef<HTMLDivElement>(null);

    sceneContext = useContext(ButtonContext)

    const loader = useRef(null);

    useEffect(() => {
        if (!UserContainer.current) return;

        UserContainer.current.style.display = "none";
    }, [UserContainer.current])

    useEffect(() => {
        DescriptionHeader.current!.textContent = ("Welcome, " + sceneContext.username) ? `Welcome, ${sceneContext.username}` : "Welcome to Gleaming";
    }, [sceneContext.username])

    function CredentialsInterface() {
        if (sceneContext.isCreatingUser.current) {
            if (DescriptionContainer.current) {
                DescriptionContainer.current.textContent = "Create Account";
                UsernameRef.current.style.display = "flex"
            }
        } else {
            if (DescriptionContainer.current) {
                DescriptionContainer.current.textContent = "Login to your account";
                UsernameRef.current.style.display = "none"
            }
        }
        
        if (UserContainer.current != null && !sceneContext.isCredentialsInterface) {
            
            UserContainer.current.style.display = "flex";
            
            setTimeout(() => {
                if (!UserContainer.current) return;
                UserContainer.current.style.opacity = "1";
            }, 100)    
            
            sceneContext.setCredentialsInterface(true);
            
        } else if (UserContainer.current != null && sceneContext.isCredentialsInterface) {
            console.log("signup false")
            
            UserContainer.current.style.opacity = "0";   
            
            setTimeout(() => {
                if (!UserContainer.current) return;
                UserContainer.current.style.display = "none";
            }, 1000)    
            
            sceneContext.setCredentialsInterface(false);
        }
    }
    
    async function SubmitCredentials() {
        const username = UsernameRef.current?.value;
        const email = EmailRef.current?.value;
        const password = PasswordRef.current?.value;
        
        if (sceneContext.isCreatingUser.current) { 
            const data = await signupSubmit(email!, password!, username!); 

        } else { 
            const data = await loginRequest(email!, password!); 
            
            console.log(data)
            sceneContext.setUsername(data.username);
        }
    }
    
    async function CheckAuth() {
        const data = await authenticateSession();

        if (data.status == 200) {
            sceneContext.setUsername(data.username);
        } else {
            sceneContext.setUsername("user");
        }
    }

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

        CheckAuth();
    }, [])

    return(
        <>
        <div ref={UserContainer} className={styles.signupContainer}>
            <div className={styles.signupInsertContainer}>
                <div className={styles.signupText}>
                    GLEAMING     
                </div>

                <div ref={DescriptionContainer} className={styles.signupinfo}>
                    Create Account
                </div>

                <div className={styles.signupInputContainer}>
                    <input ref={UsernameRef} type="text" placeholder="Username" className={styles.signupEmail}/>
                    <input ref={EmailRef} type="text" placeholder="Email" className={styles.signupEmail}/>
                    <input ref={PasswordRef} type="password" placeholder="Password" className={styles.signupPassword}/>

                    <button className={styles.singupButton} onClick={() => {
                        SubmitCredentials();
                    }}>
                        Confirm
                    </button>
                </div>   
            </div>
            <div className={styles.singupBoxContainer}>
                <div className={styles.signupBox1}/>
                <div className={styles.signupBox2}/>
            </div>
        </div>

        <header className={styles.header}>
            <div ref={DescriptionHeader} className={styles.headerText}/>
                
            <div className={styles.headerContainer}>
                <div 
                onClick={() => {
                    sceneContext.setCreatingUser(true);
                    CredentialsInterface();
                }}
                className={styles.headerButton}>
                    Sign-up  
                </div>
                <div 
                onClick={() => {
                    sceneContext.setCreatingUser(false);
                    CredentialsInterface();
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
