import { useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
} from "firebase/auth";
import { auth, db, storage } from "@/firebase";
import { redirect } from "@/functions";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

export default function SignUpForm() {
    const [progress, setProgress] = useState("signup");

    // signup values
    const [formValueEmail, setFormValueEmail] = useState("");
    const [formValuePassword, setFormValuePassword] = useState("");

    // createProfile values
    const [organizationName, setOrganizationName] = useState("");
    const [artascFile, setArtascFile] = useState<any>();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const profileCollectionRef = collection(db, "profile");
                const profileDocRef = doc(profileCollectionRef, user.uid);
                const profileDocSnap = await getDoc(profileDocRef);

                if (!profileDocSnap.exists()) {
                    setProgress("createProfile");
                    setLoading(false);
                } else if (profileDocSnap.exists()) {
                    redirect("/dashboard");
                }
            }
        });
    }, []);

    async function handleSignUp(e: any) {
        e.preventDefault();
        setLoading(true);

        await createUserWithEmailAndPassword(auth, formValueEmail, formValuePassword)
            .then(() => {
                setProgress("createProfile");
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }

    function handleArtascChange(e: any) {
        setArtascFile(e.target.files[0]);
    }

    async function handleCreateProfile(e: any) {
        e.preventDefault();
        if (!artascFile) return;

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const storageRef = ref(
                    storage,
                    `profile/${user.uid}/artasc/${artascFile}`
                );

                const profileCollectionRef = collection(db, "profile");
                const profileDocRef = doc(profileCollectionRef, user.uid);

                try {
                    await setDoc(profileDocRef, {
                        uid: user.uid,
                        organizationName: organizationName,
                        artascFile: artascFile.name,
                        dateCreated: new Date().toDateString(),
                    });

                    await uploadBytes(storageRef, artascFile);
                    await sendEmailVerification(user);

                    console.log(
                        "Upload finished, you will be redirected to Dashboard in 3 seconds."
                    );
                    setTimeout(() => {
                        redirect("/dashboard");
                    }, 3000);
                } catch (err) {
                    console.log(err);
                }
            } else {
                console.log("No user");
            }
        });
    }

    return (
        <>
            <form onSubmit={progress === "signup" ? handleSignUp : handleCreateProfile}>
                {progress === "signup" ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <div>
                            <label>ORGANIZATION NAME</label>
                            <input
                                autoComplete="nope"
                                disabled={loading ? true : false}
                                type="string"
                                value={organizationName}
                                onChange={(e) => setOrganizationName(e.target.value)}
                                placeholder="Your Organization Name"
                            />
                        </div>
                        <div>
                            <label>ARTICLES OF ASSOCIATION</label>
                            <input type="file" onChange={handleArtascChange} />
                        </div>
                        <div>
                            <input
                                disabled={loading ? true : false}
                                type="submit"
                                value={!loading ? "Sign Up" : "Loading..."}
                            />
                        </div>
                    </>
                )}
            </form>

            <div>
                <h3>HAVE ACCOUNT?</h3>
                <button onClick={() => redirect("/signin")}>
                    {progress === "signup" ? "SIGN UP" : "COMPLETE SIGN UP"}
                </button>
            </div>
        </>
    );
}
