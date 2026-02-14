import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { useLoginMutation } from "../../redux/features/users/usersApi";
import { useEffect, useState } from "react";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { Loader } from "../../components/Loader";
import { handleCatchError } from "../../Utils/handleCatchError";
import { IoEye, IoEyeOffOutline } from "react-icons/io5";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useAppSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";
  const emailFromUrl = sp.get("email") || "";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const formAction = async (formData: FormData) => {
    const email = formData.get("email");
    const password = formData.get("password");
    const params = new URLSearchParams(globalThis.location.search);
    if (!email || !password) {
      if (!email) toast.error("Email is required ✉");
      if (!password) toast.error("Password is required 🔑");
      return;
    }

    if (typeof email !== "string" || typeof password !== "string") {
      toast.error("Invalid form data");
      return;
    }

    params.set("email", email.toString());
    navigate(`?${params.toString()}`, { replace: true });

    try {
      const res = await login({
        email: email.toString().trim(),
        password: password.toString(),
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Successfully logged in 🎉");
      navigate(redirect, { replace: true });
    } catch (err) {
      console.log("login-46", err);

      toast.error(handleCatchError(err, "Error logging in"));
    }
  };

  return (
    <>
      <title>Mojahed Store - Login</title>
      <div className="container pl-25 sm:pl-0 lg:pl-18 flex justify-center">
        <section className="flex w-full justify-between px-6 gap-10 max-xl:justify-center">
          <div className="mt-20 w-full max-w-md">
            <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
            <form action={formAction} className="w-full max-w-md">
              <div className="my-8">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 p-2 border rounded w-full"
                  placeholder="Enter Email"
                  defaultValue={emailFromUrl}
                />
              </div>
              <div className="my-8">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white"
                >
                  Password
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <IoEye /> : <IoEyeOffOutline />}
                  </button>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="mt-1 p-2 border rounded w-full"
                    placeholder="Enter Password"
                  />
                </div>
              </div>
              <button
                disabled={isLoading}
                type="submit"
                className={`bg-pink-500  hover:bg-pink-700 text-white px-4 py-2  rounded cursor-pointer my-4 
                  w-full flex justify-center`}
              >
                {isLoading ? <Loader /> : "Sign In"}
              </button>
            </form>
            <div className="mt-4">
              <p className="text-white">
                New Customers?{" "}
                <Link
                  to={redirect ? `/register?redirect=${redirect}` : "/register"}
                  className="text-pink-500 hover:underline hover:text-pink-700 cursor-pointer"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
            alt=""
            className="h-180 w-[64%] xl:block hidden rounded-lg"
          />
        </section>
      </div>
    </>
  );
};

export { Login };
