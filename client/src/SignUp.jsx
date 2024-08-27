import React, { useState } from "react";

const SignUp = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPending, setIsPending] = useState(false);

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
                throw new Error("Failed to create a new user");
            }
    
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
        </div>
    );
}
 
export default SignUp;