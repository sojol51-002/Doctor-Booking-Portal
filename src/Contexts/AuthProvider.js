import React, { createContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import app from '../firebase/firebase.config';

export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({children}) => {
     const [user, setUser] = useState(null)
     const [loading, setLoading] = useState(true)

     const createUser = (email, password) =>{
          setLoading(true)
          return createUserWithEmailAndPassword(auth, email, password);
     }

     const signIn = (email, password) =>{
          setLoading(true)
          return signInWithEmailAndPassword(auth, email, password);
     }

     const resetPassword = (email) =>{
          setLoading(true)
          return sendPasswordResetEmail(auth, email)
     }

     const updateuser = (userInfo) =>{
          return updateProfile(auth.currentUser, userInfo);
     }

     const logOut = () =>{
          setLoading(true)
          return signOut(auth);
     }

     useEffect(()=>{
          const unsubscribe = onAuthStateChanged(auth, currentUser =>{
               console.log('current user', currentUser)
               setUser(currentUser)
               setLoading(false)
          })
          return () => unsubscribe()
     },[])

     const authInfo = {
          createUser,
          signIn,
          resetPassword,
          updateuser,
          logOut,
          user,
          loading
     }
     return (
          <AuthContext.Provider value={authInfo}>
               {children}
          </AuthContext.Provider>
     );
};

export default AuthProvider;