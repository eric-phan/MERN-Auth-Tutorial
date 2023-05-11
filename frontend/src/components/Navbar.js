import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  // imported logout function
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Brightside</h1>
        </Link>
        <nav>
          {/* if user is logged in show this */}
          {user && (
            <div>
              <span>{user.email}</span>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/feed">Feed</Link>
              <button onClick={handleClick}>Log out</button>
            </div>
          )}
          {/* if not logged in show this */}
          {!user && (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
