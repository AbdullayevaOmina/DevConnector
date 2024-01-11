import Link from "../Components/Link";
import { FaArrowRightFromBracket, FaCode } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { localTokenKey } from "../constants";
import { removeUser } from "../Store/Slices/user";
import { useNavigate } from "react-router-dom";
import Avatar from "../Components/Avatar";
import "../index.css";

const Header = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem(localTokenKey);
    dispatch(removeUser());
    navigate("/login");
  }

  return (
    <header className="py-3 header-bg-color sticky-top">
      <nav className="container d-flex align-items-center justify-content-between">
        <Link className="fs-3 " to="/">
          <span className="hover">
            {" "}
            <FaCode /> DevConnector
          </span>
        </Link>
        <ul className="list-unstyled d-flex m-0 gap-5">
          <li>
            <Link to="/developer">
              <span className="hover">Developers</span>
            </Link>
          </li>
          {!user ? (
            <>
              <li>
                <Link to="/register">
                  <span className="hover">Register</span>
                </Link>
              </li>
              <li>
                <Link to="/login">
                  <span className="hover">Login</span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/posts">
                  <span className="hover">Posts</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard">
                  <span className="hover">
                    <Avatar letter={user.name[0]} bg={"light"} /> Dashboard
                  </span>
                </Link>
              </li>
              <li>
                <Link onClick={handleLogout} to="#">
                  <span className="logout">
                    <FaArrowRightFromBracket /> Logout
                  </span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
