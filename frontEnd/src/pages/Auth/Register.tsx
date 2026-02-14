import { Link, useLocation, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { useRegisterMutation } from "../../redux/features/users/usersApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Loader } from "../../components/Loader";
import { handleCatchError } from "../../Utils/handleCatchError";
import { IoEye, IoEyeOffOutline } from "react-icons/io5";
import { APP_NAME } from "../../config/constants";

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useAppSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";
  const emailFromUrl = sp.get("email") || "";
  const nameFromUrl = sp.get("name") || "";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const formAction = async (formData: FormData) => {
    const { name, email, password, confirmPassword } = Object.fromEntries(
      formData,
    ) as Record<string, string>;
    const params = new URLSearchParams(window.location.search);
    params.set("email", email.toString());
    params.set("name", name.toString());
    navigate(`?${params.toString()}`, { replace: true });
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      password !== confirmPassword
    ) {
      if (!name) toast.error("Name is required 📝");
      if (!email) toast.error("Email is required ✉");
      if (!password) toast.error("Password is required 🔑");
      if (!confirmPassword) toast.error("Confirm password is required 🔑");
      if (password !== confirmPassword)
        toast.error("Passwords do not match ⚡");
      return;
    }
    try {
      const res = await register({
        username: name.toString().trim(),
        email: email.toString().trim(),
        password: password.toString(),
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Congratulations!🎉, you've registered successfully");
      navigate(redirect, { replace: true });
    } catch (err) {
      toast.error(handleCatchError(err, "Error while registering"));
    }
  };
  return (
    <>
      <title>{APP_NAME + " - Register"}</title>
      <div className="container pl-25 sm:pl-15 lg:pl-18 flex justify-center ">
        <section className="flex w-full justify-between px-6 gap-10 max-xl:justify-center">
          <div className="w-full max-w-md mt-20">
            <h1 className="text-2xl font-semibold mb-4">Register</h1>
            <form className="w-full max-w-md" action={formAction}>
              <div className="my-8">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 border rounded w-full "
                  name="name"
                  id="username"
                  placeholder="Enter your username"
                  defaultValue={nameFromUrl}
                />
              </div>
              <div className="my-8">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 p-2 border rounded w-full "
                  name="email"
                  id="email"
                  placeholder="Enter your email"
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
                    className="absolute top-1/2 right-2 transform -translate-y-1/2"
                  >
                    {showPassword ? <IoEye /> : <IoEyeOffOutline />}
                  </button>

                  <input
                    type={showPassword ? "text" : "password"}
                    className="mt-1 p-2 border rounded w-full "
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              <div className="my-8">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-white"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2"
                  >
                    {showPassword ? <IoEye /> : <IoEyeOffOutline />}
                  </button>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="mt-1 p-2 border rounded w-full "
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              <div className="my-8">
                <button
                  type="submit"
                  className="w-full bg-pink-500 hover:bg-pink-700 text-white cursor-pointer py-2 px-4 rounded"
                >
                  {isLoading ? <Loader /> : "Register"}
                </button>
              </div>
            </form>
            <div className="mt-4">
              <p className="text-white">
                Already have an account?{" "}
                <Link
                  to={redirect ? `/login?redirect=${redirect}` : "/login"}
                  className="text-pink-500 hover:text-pink-700 hover:underline cursor-pointer"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
            alt=""
            className="h-180 w-[64%] xl:block md:hidden sm:hidden rounded-lg"
          />
        </section>
      </div>
    </>
  );
};

export { Register };
