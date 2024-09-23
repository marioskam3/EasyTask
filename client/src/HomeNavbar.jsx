const HomeNavbar = () => {


    const handSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userid');
        localStorage.removeItem('username');
    }

    return (
        <nav className="navbar">
            <h1>EasyTask</h1>
            <div className="links">
                <a onClick={handSignOut} href="/" style={{
                    color: "white",
                    backgroundColor: "#f1356d",
                    borderRadius: "8px",
                    padding: "5px 10px",
                    display: "inline-block",
                    marginLeft: "10px"
                }}>Sign out</a>
            </div>
        </nav>
    );
}
 
export default HomeNavbar;