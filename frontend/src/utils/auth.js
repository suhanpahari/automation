import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase"; // Assuming you have a firebase.js file for Firebase configuration

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        return user;
    } catch (error) {
        console.error("Error during Google login:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error during logout:", error);
        throw error;
    }
};

export const isAuthenticated = () => {
    return auth.currentUser !== null;
};