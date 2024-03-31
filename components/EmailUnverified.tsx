import { auth } from "@/firebase";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";

export default function EmailUnverified() {
    async function handleResendEmail() {
        onAuthStateChanged(auth, (user) => {
            if (user && !user.emailVerified) {
                sendEmailVerification(user)
                    .then(() => {
                        console.log("Email Sent");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        });
    }

    return (
        <>
            <div>
                <h3>Your Email Hasn{"'"}t Been Verified</h3>
                <p>Please verify your email first, to access this page.</p>
                <div>
                    <button onClick={handleResendEmail}>Resend Email Verification</button>
                </div>
            </div>
        </>
    );
}
