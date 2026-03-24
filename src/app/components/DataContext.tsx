"use client"

import {useRef, useState, createContext, MutableRefObject, ReactNode} from "react"

type SceneContextData = {
    username: null | string;
    isReturning: MutableRefObject<boolean>;
    isCredentialsInterface: boolean;
    isCreatingUser: MutableRefObject<boolean>;

    setUsername: (value: string) => void;
    setReturning: (state: boolean) => void;
    setCredentialsInterface: (state: boolean) => void;
    setCreatingUser: (state: boolean) => void;
}

export const ButtonContext = createContext({} as SceneContextData)

export function ButtonContextProvider({ children }: { children: ReactNode }) {
    const [ username, setUserName ] = useState<string | null>(null);
    const [isCredentialsInterface, setIsCredentialsInterface] = useState<boolean>(false);


    const isReturning = useRef(false);
    const isCreatingUser  = useRef(false);

    const setUsername = (value: string) => {
        setUserName(value);
    }

    const setReturning = (state: boolean) => {
        isReturning.current = state;
    }

    const setCredentialsInterface = (state: boolean) => {
       setIsCredentialsInterface(state);
    }

    const setCreatingUser = (state: boolean) => {
        isCreatingUser.current = state;
    }

    return(
        <ButtonContext.Provider value={{
            username,
            isReturning,
            isCredentialsInterface,
            isCreatingUser,
            setUsername,
            setReturning,
            setCredentialsInterface,
            setCreatingUser,
        }}>
            { children }
        </ButtonContext.Provider>
    )
}