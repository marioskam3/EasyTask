import { useNavigate } from "react-router-dom";

const verifyToken = async (navigate) => {

    

    const token = localStorage.getItem("token");
    
    try {
        const response = await fetch(`http://localhost:8000/verify-token`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ token: token }),  
    });

        if (!response.ok) {
            throw new Error("Token verification failed");
        }
        else{
            const data = await response.json();
            console.log(data);
        }

        

    } catch (err) {
        localStorage.removeItem("token");
        console.log(err);
        navigate('/signin');
    }
}

export default verifyToken;