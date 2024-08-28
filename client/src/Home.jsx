import { useEffect } from "react";
import verifyToken from "../functions/verifyToken";
import { useNavigate } from "react-router-dom";

const Home = () => {

    let navigate = useNavigate();
    useEffect(() => {
        verifyToken(navigate);
    }, []);

    

    return (
        <div>
            <h1>Home</h1>
            <p>Welcome to the Home page</p>
            <p>{localStorage.getItem('token')}</p>
        </div>
    );
}
 
export default Home;