import { auth } from "@/firebase";
import { getUserData } from "@/functions";
import { User, onAuthStateChanged } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";

import styles from "@/styles/components/Header.module.sass";

export default function Header() {
    const [loading, setLoading] = useState<boolean>(true);
    const [userObj, setUserObj] = useState<User | null>();
    const [userData, setUserData] = useState<DocumentData | null>();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserObj(user);
            } else {
                setUserObj(null);
            }
        });

        return () => {
            unsubscribe();
            getUserData(setUserData);
            setLoading(false);
        };
    }, []);

    if (!loading && !userObj && !userData) {
        return (
            <div>
                <div>Organiptyc</div>
            </div>
        );
    }

    return (
        <div className={`${styles.containerHeader} ${styles.isUser}`}>
            <div>
                <div>Organiptyc</div>
                {/* <div>{userObj?.uid}</div> */}
            </div>
        </div>
    );
}
