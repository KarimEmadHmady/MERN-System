import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials , logout  } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Webcam from "react-webcam";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const webcamRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          toast.error("فشل في تحديد الموقع الجغرافي.");
        }
      );
    } else {
      toast.error("الموقع الجغرافي غير مدعوم في هذا المتصفح.");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("يرجى التقاط صورة لتسجيل الدخول.");
      return;
    }
    if (!location) {
      toast.error("يرجى السماح بالحصول على الموقع الجغرافي.");
      return;
    }

    try {
      const res = await login({ email, password, image, location }).unwrap();
      dispatch(setCredentials({ ...res }));
      localStorage.setItem("loginTime", Date.now());
      navigate("/addserialNumber");
    } catch (err) {
      console.error("🔴 خطأ في تسجيل الدخول:", err);
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      const loginTime = localStorage.getItem("loginTime");
      const currentTime = Date.now();
      const tenHours = 10 * 60 * 60 * 1000; // 10 ساعات
  
      if (loginTime && currentTime - loginTime >= tenHours) {
        dispatch(logout());
        toast.info("انتهت جلستك، يرجى تسجيل الدخول مرة أخرى.");
        navigate("/login");
      }
    }
  }, [userInfo, dispatch, navigate]);
  
  

  return (
    <div>
      <section className="pl-[10rem] flex flex-wrap page-login-container">
        <div className="mr-[4rem] mt-[5rem]">
          <h1 className="text-2xl font-semibold mb-4">Sign In</h1>

          <form onSubmit={submitHandler} className="container w-[40rem] class-page-login-reg">
            <div className="my-[2rem]">
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="border rounded w-full"
              />
              <button
                type="button"
                onClick={capture}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Capture Image
              </button>
              {image && <img src={image} alt="User" className="mt-2 rounded w-full" />}
            </div>

            <div className="mb-4">
              <button
                type="button"
                onClick={getLocation}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Get Location
              </button>
              {location && (
                <p className="text-white mt-2">
                  Location: {location.latitude}, {location.longitude}
                </p>
              )}
            </div>

            <button disabled={isLoading} type="submit" className="bg-[#5f2476] text-white px-4 py-2 rounded cursor-pointer my-[1rem]">
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            {isLoading && <Loader />}
          </form>

          <div className="mt-4">
            <p className="text-white">
              New Customer?{" "}
              <Link to={redirect ? `/register?redirect=${redirect}` : "/register"} className="text-[#5f2476] hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
          alt=""
          className="h-[65rem] w-[59%] xl:block md:hidden sm:hidden rounded-lg login-page-img"
        />
      </section>
    </div>
  );
};

export default Login;


