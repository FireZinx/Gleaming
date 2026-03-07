"use client"

import {useRef, useState, createContext, MutableRefObject, ReactNode} from "react"

type SceneContextData = {
    view: null | string;
    previousView: null | string;
    isReturning: MutableRefObject<boolean>;
    isSignup: MutableRefObject<boolean>;
    setView: (value: string) => void;
    setPreviousView: (value: string) => void;
    setReturning: (state: boolean) => void;
    setSignup: (state: boolean) => void;
}

export const ButtonContext = createContext({} as SceneContextData)

export function ButtonContextProvider({ children }: { children: ReactNode }) {
    const [ currentViewPos, setCurrentViewPos ] = useState<string | null>(null);
    const [ previousViewPos, setPreviousViewPos ] = useState<string | null>(null);

    const isReturning = useRef(false);
    const isSignup = useRef(false);

    const setView = (value: string) => {
        setCurrentViewPos(value);
    }

    const setPreviousView = (value: string) => {
        setPreviousViewPos(value);
    }

    const setReturning = (state: boolean) => {
        isReturning.current = state;
    }

    const setSignup = (state: boolean) => {
        isSignup.current = state;
    }

    return(
        <ButtonContext.Provider value={{
            view: currentViewPos,
            previousView: previousViewPos,
            isReturning,
            isSignup,
            setView,
            setPreviousView,
            setReturning,
            setSignup,
        }}>
            { children }
        </ButtonContext.Provider>
    )
}