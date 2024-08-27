const Welcome = () => {
    return (
        <div className="welcome" style={{textAlign: "center", marginTop: "100px" }}>
            <h2>Task Management...<span role="img" aria-label="clipboard">📋</span></h2>
            <h2 style={{
                position: "relative",
                left: "-50px",
            }}>Made Easy.<span role="img" aria-label="green check mark">✅</span></h2>
        </div>
    );
}
 
export default Welcome;