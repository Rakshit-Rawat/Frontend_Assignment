import { createContext,useContext,useEffect,useState } from "react";
import {auth,googleProvider} from "../lib/firebase"
import { onAuthStateChanged,signInWithPopup,signOut } from "firebase/auth";

const AuthContext=createContext(null)

export function AuthProvider({children}){
    const [user,setUser]=useState(null)
    const [initializing,setInitializing] =useState(true)

    useEffect(()=>{
        const unsub=onAuthStateChanged(auth,(u)=>{
            setUser(u)
            setInitializing(false)
        })
        return unsub
    },[])

    const googleLogin=async()=>{
        await signInWithPopup(auth,googleProvider)
    }

    const googleLogout=()=>signOut(auth)

    return (
    <AuthContext.Provider value={{user,initializing,googleLogin,googleLogout}}>
        {children}
    </AuthContext.Provider>)
}

export const useAuth=()=>useContext(AuthContext)

