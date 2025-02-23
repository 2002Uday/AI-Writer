import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  const token = Cookies.get("token");
  return (
    <nav
      className={`bg-white fixed w-full shadow-sm z-50 ${
        path === "/dashboard" && "hidden"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-orange-500">
              WriterAI
            </Link>
          </div>

          {!token ? (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium "
              >
                Register
              </Link>
            </div>
          ) : (
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
