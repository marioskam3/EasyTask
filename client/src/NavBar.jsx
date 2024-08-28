const Navbar = () => {
    return (
        <nav className="navbar">
            <a href="/"><h1>EasyTask</h1></a>
            <div className="links">
                <a href="/signin">Sign In</a>
                <a href="/signup">Sign Up</a>
            </div>
        </nav>
    );
}
 
export default Navbar;