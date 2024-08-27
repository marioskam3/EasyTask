import React, { useState } from "react";
import { ToastContainer,toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";



const SignUp = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPending, setIsPending] = useState(false);
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = { username, email, password };

        setIsPending(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });
    
            if (!response.ok) {
                if (response.status === 409) {
                    toast.error("Username or email already exists.");
                    throw new Error("Username or email already exists.");
                    
                }
                else {
                    toast.error("Failed to create a new user");
                    throw new Error("Failed to create a new user");
                }
            }
            
            toast.success("Account created successfully");
            navigate('/signin');
            console.log("New user added");
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
            }}>Sign Up</h3>

            <form onSubmit={handleSubmit}>
                <label>Username:</label>
                <input 
                    type="text"
                    value={username}
                    required 
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>Email:</label>
                <input 
                    type="email"
                    value={email}
                    required 
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password:</label>
                <input 
                    type="password"
                    value={password}
                    required 
                    onChange={(e) => setPassword(e.target.value)}
                />
                {!isPending && <button>Sign Up</button>}
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
 
export default SignUp;