import React, { createContext, useEffect, useState } from 'react'
import { useRef } from 'react'

export const AppContext = createContext()
export const AppProvider = ({ children }) => {
    let renderLimit = useRef(false)
    const [imagesData, setImagesData] = useState([])
    const API = 'http://localhost:5000'
    const handleFetch = async () => {
        try {
            const response = await fetch(`${API}/data`, {
                method: 'GET',
            })
            const data = await response.json()
            setImagesData(data)
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        handleFetch()

        if (renderLimit.current) {
            handleFetch()
            renderLimit.current = false
        }
    }, [])

    return (
        <AppContext.Provider value={{imagesData, setImagesData, handleFetch, API}}>
            {children}
        </AppContext.Provider>
    )
}