import React, { useContext, useEffect, useState } from 'react'
import { auth } from './FirebaseConfig'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

    const localStorageUser = JSON.parse(localStorage.getItem("ISDA_USER"))
    const localStorageDriver = localStorage.getItem("ISDA_DRIVER")
    const localStorageRole = localStorage.getItem("ISDA_ROLE")

    const [currentUser, setCurrentUser] = useState(localStorageUser)
    const [currentDriver, setCurrentDriver] = useState(localStorageDriver)
    const [currentRole, setCurrentRole] = useState(localStorageRole)
    const [loading, setLoading] = useState(true)
    const [currentUserToken, setCurrentUserToken] = useState()

    const value = {
        currentUser,
        currentUserToken,
        setCurrentUser,
        currentDriver,
        setCurrentDriver,
        signup,
        login,
        logout,
        resetPassword,
        currentRole,
        setCurrentRole
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            if (user) {
                user.getIdToken().then(token => {
                    setCurrentUserToken(token)
                    localStorage.setItem("ISDA_USER", JSON.stringify(user))
                })
            }
            setLoading(false)
        })
    
        return unsubscribe
    }, [])

    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function login(email, password, callback, errorCallback) {
        return auth.signInWithEmailAndPassword(email, password).then(userCredential => {
            setCurrentUser(userCredential.user)
            userCredential.user.getIdToken().then(token => {
                setCurrentUserToken(token)
                localStorage.setItem("ISDA_USER", JSON.stringify(userCredential.user))
                callback(token)
            })
        }).catch(e => {
            errorCallback(e.message)
        })
        
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function logout() {
        setCurrentUserToken(0)
        localStorage.clear()
        return auth.signOut()
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}