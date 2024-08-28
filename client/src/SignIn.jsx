import React, { useState } from "react";
import { ToastContainer,toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const SignIn = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPending, setIsPending] = useState(false);
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        setIsPending(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/signin", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData.toString(),
            });
    
            if (!response.ok) {
                if (response.status === 404) {
                    toast.error("User not Found.");
                    throw new Error("User not Found.");
                    
                }
                
                if (response.status === 401) {
                    toast.error("Invalid password.");
                    throw new Error("Invalid password.");
                }
                    
                toast.error("Failed to sign in user");
                throw new Error("Failed to sign in user");
            }
            
            const data = await response.json();
            toast.success("User Signed In successfully");
            localStorage.setItem('token', data.access_token );
            navigate('/home');
            console.log("User signed in");
        } catch (err) {
            console.log(err.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="signup">
            <h3 style={{
                textAlign: "center",
                marginTop: "50px",
            }}>Sign In</h3>

            <form onSubmit={handleSubmit}>
                <label>Username:</label>
                <input 
                    type="text"
                    value={username}
                    required 
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>Password:</label>
                <input 
                    type="password"
                    value={password}
                    required 
                    onChange={(e) => setPassword(e.target.value)}
                />
                {!isPending && <button>Sign In</button>}
                {isPending && <button disabled>Wait...</button>}
            </form>

            <ToastContainer 
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition: Flip
            />
        </div>
    );
}
 
export default SignIn;