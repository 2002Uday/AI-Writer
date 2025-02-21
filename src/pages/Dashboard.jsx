import { useState } from "react";
import { FaUser, FaCog, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { PiLightningFill } from "react-icons/pi";
import { MdOutlineOpenInNew } from "react-icons/md";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  const Logout = () => {
    // Clear token from cookies
    Cookies.remove("token");
    // Redirect to login page
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white w-64 p-5 shadow-md`}>
        <div className="flex w-full items-center justify-between mb-10">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            WritingAI
          </Link>
        </div>

        <ul className="space-y-4">
          <li
            className={`flex items-center p-3 rounded cursor-pointer ${
              path === "/dashboard" && "bg-blue-600 text-white"
            }`}
          >
            <FaChartBar className="mr-3" /> Dashboard
          </li>

          <p className="text-lg font-bold">AI Features :</p>
          <a href="/brainstorm">
            <li
              className={`flex items-center p-3 hover:bg-blue-100 rounded cursor-pointer justify-between`}
            >
              <p className="flex items-center">
                <PiLightningFill className="mr-3 text-xl text-amber-500" />
                Brainstorm
              </p>{" "}
              <MdOutlineOpenInNew className="h-5 w-5 text-blue-600" />
            </li>
          </a>

          <button onClick={Logout}>
            <li className="flex items-center p-3 text-red-600 hover:bg-gray-200 rounded cursor-pointer">
              <FaSignOutAlt className="mr-3" /> Logout
            </li>
          </button>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome to the Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl font-bold">9,300</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Total Sales</h3>
            <p className="text-2xl font-bold">$295.7k</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">New Subscribers</h3>
            <p className="text-2xl font-bold">608</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
