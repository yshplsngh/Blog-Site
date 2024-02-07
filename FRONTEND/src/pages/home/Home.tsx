import { Link } from "react-router-dom";
import "./home.css";

const Home = () => {
    return (
        <div className="home-container">
            <h1>Landing page</h1>
            <div className="home-links">
                <Link to="/login" className="login">Login</Link>
                <Link to="/signup" className="signup">Register</Link>
            </div>
        </div>
    );
};

export default Home;
