import EmailUnverified from "@/components/EmailUnverified";
import { auth, db } from "@/firebase";
import { redirect, redirectNoUser, useEmailVerified } from "@/functions";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc } from "firebase/firestore";
import Router from "next/router";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>();
    const isEmailVerified = useEmailVerified();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const profileCollectionRef = collection(db, "profile");
                const profileDocRef = doc(profileCollectionRef, user.uid);
                const profileSnap = await getDoc(profileDocRef);

                if (profileSnap.exists()) setUserData(profileSnap.data());

                setLoading(false);
            } else {
                redirect("/signin");
            }
        });

        return unsubscribe;
    }, []);

    if (!loading && !isEmailVerified) {
        return <EmailUnverified />;
    }

    return (
        <>
            {loading ? (
                "LOADING..."
            ) : (
                <div>
                    <div>{userData?.organizationName}</div>
                </div>
            )}
        </>
    );
}
