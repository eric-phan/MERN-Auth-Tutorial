import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// pages & components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Feed from "./pages/Feed";
import Post from "./pages/Post";
// import the login and sign up forms
import Navbar from "./components/Navbar";

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
              // route protecting:
              // if there is a user, go to the homepage, if not go to login
            />
            <Route
              path="/about"
              element={user ? <About /> : <Navigate to="/" />}
            />
            <Route
              path="/feed"
              element={user ? <Feed /> : <Navigate to="/" />}
            />
            <Route
              path="/post/:id"
              element={user ? <Post /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
              // if not user, go to login, else, go to the homepage
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
              // ibid
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
