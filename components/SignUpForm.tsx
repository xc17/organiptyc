import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase";
import { redirect } from "@/functions";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

export default function SignUpForm() {
    const [formValueEmail, setFormValueEmail] = useState("");
    const [formValuePassword, setFormValuePassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const profileCollectionRef = collection(db, "profile");
                const profileDocRef = doc(profileCollectionRef, user.uid);
                const profileDocSnap = await getDoc(profileDocRef);

                if (!profileDocSnap.exists()) {
                    await setDoc(profileDocRef, {
                        
                    })
                }
            }
        });
    }, []);

    async function handleSignUp(e: any) {
        e.preventDefault();
        setLoading(true);

        await createUserWithEmailAndPassword(auth, formValueEmail, formValuePassword)
            .then(() => {
                redirect("/dashboard");
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }

    return (
        <>
            <form onSubmit={handleSignUp}>
                <div>
                    <label>EMAIL</label>
                    <input
                        autoComplete="nope"
                        disabled={loading ? true : false}
                        type="email"
                        value={formValueEmail}
                        onChange={(e) => setFormValueEmail(e.target.value)}
                        placeholder="Your email address"
                    />
                </div>
                <div>
                    <label>PASSWORD</label>
                    <input
                        autoComplete="new-password"
                        disabled={loading ? true : false}
                        type="password"
                        value={formValuePassword}
                        onChange={(e) => setFormValuePassword(e.target.value)}
                        placeholder="Your password"
                    />
                </div>
                <div>
                    <input
                        disabled={loading ? true : false}
                        type="submit"
                        value={!loading ? "Sign Up" : "Loading..."}
                    />
                </div>
            </form>
        </>
    );
}
