import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, db } from "@/firebase";

const AuthForm = () => {
    const [userHook] = useAuthState(auth);

    const [activeTab, setActiveTab] = useState("login");

    async function onLogin() {

    }

    return (
        <>
            {activeTab === "login" ? (
                <form>
                    <input type="text" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <button type="submit">Login</button>
                </form>
            ) : activeTab === "signup" ? (
                <form>
                    <input type="text" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <button type="submit">Sign Up</button>
                </form>
            ) : (
                "Error"
            )}
        </>
    );
};

export default AuthForm;
