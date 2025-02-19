
import { Outlet, useNavigate } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./redux/features/auth/authSlice"; 

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth); 

  useEffect(() => {
    const checkExpiration = () => {
      const expirationTime = localStorage.getItem("expirationTime");

      if (expirationTime && new Date().getTime() > expirationTime) {
        dispatch(logout());
        navigate("/login"); 
      }
    };

    if (!userInfo) {
      navigate("/login");
    }

    const expirationTime = localStorage.getItem("expirationTime");
    if (expirationTime) {
      const timeRemaining = expirationTime - new Date().getTime();
      if (timeRemaining > 0) {
        const timeout = setTimeout(() => {
          dispatch(logout());
          navigate("/login"); 
        }, timeRemaining);

        return () => clearTimeout(timeout);
      } else {
        dispatch(logout());
        navigate("/login"); 
      }
    }

    const interval = setInterval(checkExpiration, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dispatch, navigate, userInfo]);

  return (
    <>
      <ToastContainer />
      <Navigation />
      <main className="py-3">
        <Outlet />
      </main>
    </>
  );
};

export default App;

