import {useRef, useState, createContext, MutableRefObject} from "react"

type SceneContextData = {
    view: null | string;
    previousView: null | string;
    returning: MutableRefObject<boolean>;
    setView: (value: string) => void;
    setPreviousView: (value: string) => void;
    setReturning: (state: boolean) => void;
}

export const ButtonContext = createContext({} as SceneContextData)

export function ButtonContextProvider({ children }, props) {
    const [ currentViewPos, setCurrentViewPos ] = useState(null);
    const [ previousViewPos, setPreviousViewPos ] = useState(null);

    const returning = useRef(false);

    const setView = (value: string) => {
        setCurrentViewPos(value);
    }

    const setPreviousView = (value: string) => {
        setPreviousViewPos(value);
    }

    const setReturning = (state: boolean) => {
        returning.current = state;
    }

    return(
        <ButtonContext.Provider value={{
            view: currentViewPos,
            previousView: previousViewPos,
            returning,
            setView,
            setPreviousView,
            setReturning
        }}>
            { children }
        </ButtonContext.Provider>
    )
}