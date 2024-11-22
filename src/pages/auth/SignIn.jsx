import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { ContextPanel } from "../../utils/ContextPanel";
import toast, { Toaster } from "react-hot-toast";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  const handleSumbit = async (e) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }

    setLoading(true);

    //create a formData object and append state values
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      // Send POST request to login API with form data
      const res = await axios.post(`${BASE_URL}/api/panel-login`, formData);

      console.log("device id", res.data);

      if (res.status === 200 && res.data?.msg === "success.") {
        const token = res.data.UserInfo?.token;
        if (token) {
          // Store the token in localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("id", res.data.UserInfo.user.user_type);
          localStorage.setItem("name", res.data.UserInfo.user.name);
          localStorage.setItem("username", res.data.UserInfo.user.mobile);
          localStorage.setItem(
            "user_type_id",
            res.data.UserInfo.user.user_type
          );

          navigate("/home");
        } else {
          toast.error("Login Failed, Token not received.");
        }
      } else {
        toast.error("Login Failed, Please check your credentials.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during login.");
    }

    setLoading(false);
  };
  return (
    <>
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
        position="top-right"
        reverseOrder={false}
      />
      <>
        <div className="bg-blue-900 absolute top-0 left-0 bg-gradient-to-b from-gray-900 via-gray-900 to-blue-800 bottom-0 leading-5 h-full w-full overflow-hidden"></div>
        <div className="relative min-h-screen sm:flex sm:flex-row justify-center bg-transparent rounded-3xl shadow-xl">
          <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
            <div className="self-start hidden lg:flex flex-col text-gray-300">
              <h1 className="my-3 font-semibold text-4xl">Welcome back</h1>
              <p className="pr-3 text-sm opacity-75">
                SingleClik empowers businesses to showcase services connect with
                customers manage inquiries chat and close deals seamlessly in
                one platform.
              </p>
            </div>
          </div>
          <div className="flex justify-center    self-center z-10">
            <div className="p-10 bg-white  shadow-xl shadow-blue-600 mx-auto rounded-3xl w-96">
              <div className="mb-7 rounded-lg   flex items-center justify-center gap-2 ">
                <img src="https://singleclik.com/draft/assets/img/logos/logo.png" alt="logo_image" className="w-12 h-12" />
                <span className=" text-3xl font-bold text-blue-900">Single Clik</span>
              </div>
              <div className="mb-7  ">
                <h3 className="font-semibold text-xl text-gray-800">
                  Sign In{" "}
                </h3>
                <p className="text-gray-600 text-xs">
                  If you are already a member, easily log in
                </p>
              </div>
              <form onSubmit={handleSumbit} method="POST">
                <div className="space-y-6">
                  <div className="">
                    <input
                      type="number"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-sm px-4 py-3 bg-white focus:bg-gray-100 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-400"
                      placeholder="123456789"
                    />
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      type={show ? "password" : "text"}
                      className="text-sm px-4 py-3 rounded-lg w-full bg-white focus:bg-gray-100 border-2 border-gray-400 focus:outline-none focus:border-blue-400"
                    />
                    <div className="flex items-center absolute inset-y-0 right-0 mr-3 text-sm leading-5">
                      {show ? (
                        <svg
                          onClick={() => setShow(!show)}
                          className="h-4 text-blue-700"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 576 512"
                        >
                          <path
                            fill="currentColor"
                            d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"
                          />
                        </svg>
                      ) : (
                        <svg
                          onClick={() => setShow(!show)}
                          className="h-4 text-blue-700"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 512"
                        >
                          <path
                            fill="currentColor"
                            d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm ml-auto">
                      <a
                        href="#"
                        className="text-blue-700 hover:text-blue-600"
                      >
                        Forgot your password?
                      </a>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                     
                      className="w-full flex justify-center bg-blue-800 hover:bg-blue-700 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500"
                    >
                      {loading ? "Checking..." : "Sign In"}
                    </button>
                  </div>

                
                </div>
              </form>
             
            </div>
          </div>
        </div>
        <footer className="bg-transparent absolute w-full bottom-0 left-0 hidden md:block lg:block z-30">
          <div className="container p-5 mx-auto flex items-center justify-between">
            <div className="flex mr-auto ">
            <span>
            Handcrafted with love by 
                  <a
                    href="https://ag-solutions.in/"
                    rel=""
                    target="_blank"
                    title="Codepen aji"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    {" "}AG-Solutions
                  </a>
                </span>
            </div>
          </div>
        </footer>
        <footer className="bg-transparent absolute w-full bottom-0 mb-12 left-0 block lg:hidden md:hidden  z-30">
          <div className="container p-5 mx-auto flex items-center justify-between">
            <div className="flex mx-auto ">
            <span>
            Handcrafted with love by 
                  <a
                    href="https://ag-solutions.in/"
                    rel=""
                    target="_blank"
                    title="Codepen aji"
                    className="text-white underline animate-pulse hover:text-blue-600"
                  >
                    {" "}AG-Solutions
                  </a>
                </span>
            </div>
          </div>
        </footer>

        <svg
          className="absolute bottom-0 left-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#fff"
            fillOpacity="1"
            d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          ></path>
        </svg>
      </>
    </>
  );
};

export default SignIn;
