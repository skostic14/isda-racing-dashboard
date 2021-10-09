import React, { useContext, useEffect, useState } from 'react'
import { auth } from './FirebaseConfig'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [currentDriver, setCurrentDriver] = useState()
    const [currentRole, setCurrentRole] = useState()
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
        return auth.signOut()
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}