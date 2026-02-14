import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const AdminMenu = ({
  setMenuOpen,
}: {
  setMenuOpen?: (isMenuOpen: boolean) => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (setMenuOpen) setMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <button
        className={`${
          isMenuOpen ? "top-2 right-2" : "top-5 right-7"
        } bg-[#151515] p-2 fixed rounded-lg`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <FaTimes color="white" />
        ) : (
          <>
            <div className="w-6 h-0.5 bg-white my-1 "></div>
            <div className="w-6 h-0.5 bg-white my-1 "></div>
            <div className="w-6 h-0.5 bg-white my-1 "></div>
          </>
        )}
      </button>
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={toggleMenu}
        />
      )}
      {isMenuOpen && (
        <section className="fixed p-4 top-5 right-7 bg-gray-700  rounded-lg">
          <ul className="list-none mt-2">
            <li>
              <NavLink
                className={"px-3 py-2 block mb-5 hover:bg-gray-500 rounded-sm "}
                to={"/admin/dashboard"}
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                Admin Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                className={"px-3 py-2 block mb-5 hover:bg-gray-600 rounded-sm"}
                to={"/admin/category-list"}
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                Create Category
              </NavLink>
            </li>
            <li>
              <NavLink
                className={"px-3 py-2 block mb-5 hover:bg-gray-600 rounded-sm"}
                to={"/admin/product-list"}
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                Create Product
              </NavLink>
            </li>
            <li>
              <NavLink
                className={"px-3 py-2 block mb-5 hover:bg-gray-600 rounded-sm"}
                to={"/admin/all-products-list"}
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                All Products
              </NavLink>
            </li>
            <li>
              <NavLink
                className={"px-3 py-2 block mb-5 hover:bg-gray-600 rounded-sm"}
                to={"/admin/user-list"}
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                Manage Users
              </NavLink>
            </li>
            <li>
              <NavLink
                className={"px-3 py-2 block mb-5 hover:bg-gray-600 rounded-sm"}
                to={"/admin/order-list"}
                style={({ isActive }) => ({
                  color: isActive ? "greenyellow" : "white",
                })}
              >
                Manage Orders
              </NavLink>
            </li>
          </ul>
        </section>
      )}
    </div>
  );
};

export { AdminMenu };
