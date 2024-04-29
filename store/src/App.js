import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Auth from "./Auth";
import ChangePassword from "./containers/ChangePassword";
import ForgotPassord from "./containers/ForgotPassord";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Register from "./containers/Register";
import ResetPassword from "./containers/ResetPassword";
import useCustomers from "./_actions/customerActions";
import useAdmin from "./_actions/adminActions";
import AdminLogin from "./Admin/AdminLogin";
import AdminSignupForm from "./Admin/AdminSignup";
import Admin from "./Admin/Admin";
import ItemMenu from "./Hero/Menu/Menu";
import AdminMenu from "./Admin/AdminMenu";
import Cart from "./Hero/Cart";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import webLogo from "./assets/img/hotel_logo.jpeg";
import { sumBy } from "lodash";

function App() {
  let auth = useSelector((state) => state.customer?.auth);
  let adminAuth = useSelector((state) => state.admin?.adminAuth);
  const cartItems = useSelector((state) => state.cart.cartItems?.cartDetails);
  const { customerLogout } = useCustomers();
  const { adminLogout } = useAdmin();
  const dispatch = useDispatch();
  const itemCount = sumBy(cartItems, (item) => item?.quantity);

  const handleLogout = () => {
    dispatch(customerLogout()).then((res) => {
      if (res.payload.status) {
        localStorage.removeItem("customerToken");
        message.success(res.payload.message);
        dispatch(adminLogout()).then((adminRes) => {
          if (adminRes.payload.status) {
            localStorage.removeItem("adminToken");
            message.success(adminRes.payload.message);
          }
        });
      }
    });
  };

  const renderHeader = () => {
    if (auth && auth.status) {
      // Render navigation bar for authenticated user
      const fullName = `${auth?.data?.firstName} ${auth?.data?.lastName}`;
      return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand">
              <img
                src={webLogo}
                alt=""
                style={{
                  height: "50px",
                  marginRight: "5px",
                  borderRadius: "50%",
                }}
              />
              Home
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Hi {fullName}
                  </Link>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <Link to="changePassword" className="dropdown-item">
                        Change Password
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link to="menu" className="nav-link">
                    Menu
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="cart" className="nav-link">
                    Cart <span className="text-danger">[{itemCount}]</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="orderHistory" className="nav-link">
                    Order History
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      );
    } else if (adminAuth && adminAuth.status) {
      // Render navigation bar for authenticated admin
      const adminName = `${adminAuth?.data?.firstName} ${adminAuth?.data?.lastName}`;
      return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand">
              <img
                src={webLogo}
                alt=""
                style={{
                  height: "50px",
                  marginRight: "5px",
                  borderRadius: "50%",
                }}
              />
              Home
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Hi {adminName}
                  </Link>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <Link to="changePassword" className="dropdown-item">
                        Change Password
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link to="/admin-dashboard" className="nav-link">
                    Add Menu
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/update-menu" className="nav-link">
                    Update Menu
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/inventory" className="nav-link">
                    Inventory
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/report" className="nav-link">
                    Report
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      );
    } else {
      // Render navigation bar for logged out users
      return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand">
              <img
                src={webLogo}
                alt=""
                style={{
                  height: "50px",
                  marginRight: "5px",
                  borderRadius: "50%",
                }}
              />
              Home
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link to="login" className="nav-link">
                    <span className="lead">Login</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="register" className="nav-link">
                    <span className="lead">Register</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="admin/login" className="nav-link">
                    <span className="lead">Admin Login</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      );
    }
  };

  return (
    <BrowserRouter>
      <div>
        {renderHeader()}
        <div className="app-content">
          <div className="app-wrapper">
            <Routes>
              <Route
                path="/"
                element={
                  <Auth>
                    <Home />
                  </Auth>
                }
              />
              <Route path="/forgotPassword" element={<ForgotPassord />} />
              <Route path="/resetPassword/:token" element={<ResetPassword />} />
              <Route
                path="/changePassword"
                element={
                  <Auth authRoute={true} redirectTo="/login">
                    <ChangePassword />
                  </Auth>
                }
              />
              <Route
                path="/login"
                element={
                  <Auth authRoute={true} redirectTo="/">
                    <Login />
                  </Auth>
                }
              />
              <Route
                path="/register"
                element={
                  <Auth authRoute={true} redirectTo="/">
                    <Register />
                  </Auth>
                }
              />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignupForm />} />
              <Route
                path="/admin-dashboard"
                element={
                  <Auth authRoute={true} redirectTo="/admin/login">
                    <Admin />
                  </Auth>
                }
              />
              <Route
                path="/menu"
                element={
                  <Auth authRoute={true} redirectTo="/login">
                    <ItemMenu />
                  </Auth>
                }
              />
              <Route
                path="/update-menu"
                element={
                  <Auth authRoute={true} redirectTo={"/admin/login"}>
                    <AdminMenu />
                  </Auth>
                }
              />
              <Route
                path="/cart"
                element={
                  <Auth authRoute={true} redirectTo="/login">
                    <Cart />
                  </Auth>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
