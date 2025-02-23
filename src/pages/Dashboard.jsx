import { useEffect, useState } from "react";
import { FaUser, FaCog, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PiLightningFill } from "react-icons/pi";
import { MdOutlineOpenInNew, MdOpenInNew } from "react-icons/md";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";

const Dashboard = () => {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const [chatList, setChatList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = Cookies.get("token");

  const handleLogout = () => {
    try {
      Cookies.remove("token");
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/chat/list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch chat list: ${response.statusText}`);
      }

      const data = await response.json();
      // Ensure chatList is always an array
      setChatList(Array.isArray(data.chats) ? data.chats : []);
    } catch (error) {
      toast.error(error.message);
      console.error("Error fetching chats:", error);
      setChatList([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/");
      return;
    }
    fetchChats();
  }, [token, navigate]);

  const NavItem = ({ to, icon: Icon, text, external, onClick }) => {
    const isActive = path === to;
    const baseClasses = "flex items-center p-3 rounded cursor-pointer";
    const activeClasses = isActive
      ? "bg-orange-500 text-white"
      : "hover:bg-white hover:text-gray-800";

    if (external) {
      return (
        <a href={to}>
          <li className={`${baseClasses} ${activeClasses} justify-between`}>
            <p className="flex items-center">
              <Icon
                className={`mr-3 ${
                  text === "AI Script Writer" ? "text-xl text-amber-500" : ""
                }`}
              />
              {text}
            </p>
            <MdOutlineOpenInNew className="h-5 w-5 text-orange-600" />
          </li>
        </a>
      );
    }

    if (onClick) {
      return (
        <button onClick={onClick} className="w-full">
          <li className={`${baseClasses} text-red-600 hover:bg-gray-200`}>
            <Icon className="mr-3" /> {text}
          </li>
        </button>
      );
    }

    return (
      <Link to={to}>
        <li className={`${baseClasses} ${activeClasses}`}>
          <Icon className="mr-3" /> {text}
        </li>
      </Link>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white p-6 rounded-md shadow-md animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      );
    }

    if (!Array.isArray(chatList) || chatList.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No chats found</p>
          <Link
            to="/scripting"
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-xl rounded-mdtransition-colors"
          >
            <PiLightningFill className="mr-2" />
            Make New Script
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chatList.map((chat) => (
          <div
            key={chat._id}
            className="flex justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <p className="text-gray-800 line-clamp-2">
              {chat.messages?.[0]?.content || "No messages"}
            </p>
            <Link to={`/chat/${chat._id}`}>
              <button className="flex items-center gap-2 bg-orange-600 text-white text-sm px-2 py-1 rounded-full hover:bg-orange-700 transition-colors">
                <MdOpenInNew />
                View
              </button>
            </Link>
          </div>
        ))}
        <div className="text-white p-6 w-fit rounded-md shadow-md hover:shadow-xl border-2 group hover:bg-orange-500 hover:text-white border-orange-500 border-dashed">
          <Link to={`/scripting`}>
            <FaPlus className="text-4xl text-orange-500 group-hover:text-white" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="bg-neutral-900 text-white w-64 p-5 shadow-md">
        <div className="flex w-full items-center justify-between mb-10">
          <Link
            to="/"
            className="text-2xl font-bold text-orange-500 transition-colors"
          >
            WriterAI
          </Link>
        </div>

        <ul>
          <NavItem to="/dashboard" icon={FaChartBar} text="Dashboard" />

          <p className="text-lg font-bold mt-6">AI Features:</p>
          <NavItem
            to="/scripting"
            icon={PiLightningFill}
            text="AI Script Writer"
            external
          />

          <NavItem icon={FaSignOutAlt} text="Logout" onClick={handleLogout} />
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">
          Welcome to the Dashboard
        </h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
