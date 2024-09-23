import { useNavigate } from "react-router-dom";

const verifyToken = async (navigate) => {
    
    try {
        const response = await fetch(`http://localhost:8000/verify-token`,{
            method: "POST",
            credentials: "include"
    });

        if (!response.ok) {
            throw new Error("Token verification failed");
        }
        else{
            const data = await response.json();
            console.log(data);
        }

        

    } catch (err) {
        localStorage.removeItem('userid');
        localStorage.removeItem('username');
    
        console.log(err);
        navigate('/signin');
    }
}

export default verifyToken;