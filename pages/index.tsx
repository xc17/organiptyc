import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";

import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { getUserData, redirect } from "@/functions";

export default function Home() {
    const [userHooks] = useAuthState(auth);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                redirect("/dashboard");
            } else {
                setLoading(false);
            }
        });
    }, []);

    return (
        <>
            <Head>
                <title>Organiptyc</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                {loading ? (
                    <>LOADING...</>
                ) : (
                    <>
                        <div>YOU DONT HAVE AN ACCOUNT!</div>
                        <button onClick={() => redirect("/auth")}>SIGN UP</button>
                    </>
                )}
            </main>
        </>
    );
}
