import { auth } from "@/firebase";
import { redirect } from "@/functions";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export default function SignInForm() {
    const [formValueEmail, setFormValueEmail] = useState("");
    const [formValuePassword, setFormValuePassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: any) {
        e.preventDefault();
        setLoading(true);

        await signInWithEmailAndPassword(auth, formValueEmail, formValuePassword)
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
            <form onSubmit={handleLogin}>
                <div>
                    <label>EMAIL</label>
                    <input
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
                        value={!loading ? "Sign In" : "Loading..."}
                    />
                </div>
            </form>
        </>
    );
}
