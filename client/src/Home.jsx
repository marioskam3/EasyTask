import { useEffect } from "react";
import verifyToken from "../functions/verifyToken";
import { useNavigate } from "react-router-dom";

const Home = () => {

    let navigate = useNavigate();
    useEffect(() => {
        //verifyToken(navigate);
    }, []);

    

    return (
        <div>
            <h2 style={{
                    marginTop: "50px",
            }}>What's your vision for today ?</h2>
        </div>
    );
}
 
export default Home;