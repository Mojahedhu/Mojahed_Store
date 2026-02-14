import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { useProfileMutation } from "../../redux/features/users/usersApi";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { Loader } from "../../components/Loader";
import { Link } from "react-router";
import { FaCheck, FaUserEdit } from "react-icons/fa";
import { IoEyeOffOutline, IoEye } from "react-icons/io5";
import { handleCatchError } from "../../Utils/handleCatchError";

const Profile = () => {
  const { userInfo } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState<string>(userInfo?.username || "");
  const [email, setEmail] = useState<string>(userInfo?.email || "");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [updateFile, { isLoading: loadingUpdateFile }] = useProfileMutation();

  const dispatch = useAppDispatch();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match ⚡");
      return;
    }
    try {
      const res = await updateFile({
        _id: userInfo?._id,
        username,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully 🎉");
      console.log(res);
    } catch (err) {
      toast.error(handleCatchError(err, "Error updating profile"));
    }
  };

  return (
    <>
      <title>Mojahed Store - Profile</title>
      <div className="container mx-auto  p-4 mt-40">
        <div className="flex justify-center items-center md:flex md:space-x-4">
          <div className="w-2/3 xl:w-1/3 mb-20">
            <div className="flex justify-between">
              <h2 className="2x-l font-semibold mb-4">Update Profile</h2>
              <button
                className="bg-pink-500 text-white font-semibold px-4 py-2 rounded hover:bg-pink-700"
                onClick={() => {
                  setIsEdit((prev) => !prev);
                }}
              >
                {isEdit ? <FaCheck /> : <FaUserEdit size={20} />}
              </button>
            </div>
            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-white mb-4">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="w-full p-2 border  rounded"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isEdit}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-white mb-4">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 border  rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEdit}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-white mb-4">
                  Password
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="absolute top-[50%] -translate-y-1/2 right-2"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <IoEye /> : <IoEyeOffOutline />}
                  </button>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full p-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!isEdit}
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-white mb-4"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="absolute top-[50%] -translate-y-1/2 right-2"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <IoEye /> : <IoEyeOffOutline />}
                  </button>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full p-2 border  rounded"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={!isEdit}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="flex flex-col lg:flex-row justify-between">
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
                  disabled={loadingUpdateFile || !isEdit}
                >
                  {loadingUpdateFile ? <Loader /> : "Update"}
                </button>
                <Link
                  to={"/user-orders"}
                  className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 text-center mt-5 lg:mt-0"
                >
                  My Orders
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export { Profile };
