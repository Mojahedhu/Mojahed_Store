import { useState } from "react";
import styles from "./navigation.module.css";
import { Link } from "react-router";
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { useLogoutMutation } from "../../redux/features/users/usersApi";
import { logout } from "../../redux/features/auth/authSlice";
import { FavoritesCount } from "../products/FavoritesCount";
import { FiX, FiMenu } from "react-icons/fi";

const Navigation = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  console.log(cartItems.length);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useAppDispatch();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
    } catch (err) {
      console.log(err);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const closeSidebar = () => {
    setShowSidebar(false);
  };

  return (
    <>
      {/* Sidebar toggle button */}
      <button
        className="fixed top-4 left-4 z-10000 p-2 rounded-md bg-black text-white lg:hidden hover:cursor-pointer"
        onClick={toggleSidebar}
      >
        {showSidebar ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      {(showSidebar || dropdownOpen) && (
        <div
          onClick={() => {
            closeSidebar();
            setDropdownOpen(false);
          }}
          role="button"
          className="fixed inset-0 bg-black/50 z-9998 lg:hidden"
        />
      )}
      {dropdownOpen && (
        <div
          onClick={() => {
            closeSidebar();
            setDropdownOpen(false);
          }}
          className="fixed inset-0 bg-black/50 z-9998 max-lg:hidden"
        />
      )}
      <div
        className={`z-9999 
          fixed top-0 left-0 h-screen p-4 text-white bg-black 
          flex flex-col justify-between 
          transform transition-transform duration-2000 ease-in-out will-change-transform
          ${showSidebar ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0  lg:w-[6%] lg:hover:w-[15%]  
          ${styles["navigation-container"]} group`}
        id={styles["navigation-container"]}
      >
        <div className="flex flex-col justify-center space-y-4">
          <Link
            to={"/"}
            className="flex"
            onClick={() => {
              closeSidebar();
              setDropdownOpen(false);
            }}
          >
            <div
              className={`flex items-center transition-transform transform hover:translate-x-2 ${styles["nav-link"]}`}
            >
              <AiOutlineHome className="mr-2 mt-12" size={26} />
              <span className={`${styles["nav-item-name"]} mr-2 mt-12`}>
                Home
              </span>{" "}
            </div>
          </Link>
          <Link
            to={"/shop"}
            className="flex"
            onClick={() => {
              closeSidebar();
              setDropdownOpen(false);
            }}
          >
            <div
              className={`flex items-center transition-transform transform hover:translate-x-2 ${styles["nav-link"]}`}
            >
              <AiOutlineShopping className="mr-2 mt-12" size={26} />
              <span className={`${styles["nav-item-name"]} mr-2 mt-12`}>
                Shop
              </span>{" "}
            </div>
          </Link>
          <Link
            to={"/cart"}
            className="flex relative"
            onClick={() => {
              closeSidebar();
              setDropdownOpen(false);
            }}
          >
            <div
              className={`flex justify-center items-center transition-transform transform hover:translate-x-2 ${styles["nav-link"]}`}
            >
              <AiOutlineShoppingCart className="mr-2 mt-12" size={26} />
              <span className={`${styles["nav-item-name"]} mr-2 mt-12`}>
                Cart
              </span>{" "}
              <div className="absolute top-9 -left-1">
                {cartItems.length > 0 && (
                  <span>
                    <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </Link>
          <Link
            to={"/favorite"}
            className={`flex relative`}
            onClick={() => {
              closeSidebar();
              setDropdownOpen(false);
            }}
          >
            <div
              className={`flex justify-center items-center transition-transform transform hover:translate-x-2 ${styles["nav-link"]}`}
            >
              <FaHeart className="mr-2 mt-12" size={20} />
              <span className={`${styles["nav-item-name"]} mr-2 mt-12`}>
                Favorites
              </span>{" "}
              <FavoritesCount />
            </div>
          </Link>
        </div>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center text-gray-800 focus:outline-none"
          >
            {userInfo ? (
              <span className="text-white">
                {userInfo.username.slice(0, 7)}
              </span>
            ) : (
              <></>
            )}
            {userInfo && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 ${
                  dropdownOpen ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
            )}
          </button>

          {dropdownOpen && userInfo && (
            <ul
              className={`absolute right-0 mt-2 mr-14 space-y-2 bg-black text-gray-400 max-lg:-mr-25
              ${userInfo.isAdmin ? "-top-84" : "-top-24"}
              `}
            >
              {userInfo.isAdmin && (
                <>
                  <li>
                    <Link
                      to={"/admin/dashboard"}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/admin/product-list"}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/admin/category-list"}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Category
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/admin/order-list"}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/admin/user-list"}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Users
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  to="/profile"
                  className="px-4 py-2 block hover:bg-gray-700"
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={logoutHandler}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-700"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
          {!userInfo && (
            <ul>
              <li>
                <Link
                  to={"/login"}
                  className={`flex items-center transition-transform transform hover:translate-x-2 ${styles["nav-link"]}`}
                >
                  <AiOutlineLogin className="mr-2 mt-12" size={20} />
                  <span className={`${styles["nav-item-name"]} mr-2 mt-12`}>
                    Login
                  </span>{" "}
                </Link>
              </li>
              <li>
                <Link
                  to={"/register"}
                  className={`flex items-center transition-transform transform hover:translate-x-2 ${styles["nav-link"]}`}
                >
                  <AiOutlineUserAdd className="mr-2 mt-12" size={20} />
                  <span className={`${styles["nav-item-name"]} mr-2 mt-12`}>
                    REGISTER
                  </span>{" "}
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;
