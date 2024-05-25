import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Auth from "./Auth";
import ChangePassword from "./containers/ChangePassword";
import ForgotPassord from "./containers/ForgotPassord";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Register from "./containers/Register";
import ResetPassword from "./containers/ResetPassword";
import useCustomers from "./_actions/customerActions";
import useAdmin from "./_actions/adminActions";
import useStaff from "./_actions/staffActions";
import AdminLogin from "./Admin/AdminLogin";
import AdminSignupForm from "./Admin/AdminSignup";
import Admin from "./Admin/Admin";
import ItemMenu from "./Hero/Menu/Menu";
import AdminMenu from "./Admin/AdminMenu";
import Cart from "./Hero/Cart";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import webLogo from "./assets/img/weblogo.jpg";
import { sumBy } from "lodash";
import OrderHistory from "./Hero/OrderHistory";
import ReportPage from "./Admin/Report";
import InventoryManagement from "./Admin/Inventory";
import BookingForm from "./Hero/Bookings";
import AdminBookings from "./Admin/AdminBookings";
import AdminCatering from "./Admin/AdminCatering";
import Footer from "./Footer/Footer";
import CateringForm from "./Hero/Catering";
import ExistingBooking from "./Hero/ExistingBooking";
import ExistingCatering from "./Hero/ExistingCatering";
import EditInventory from "./Admin/EditInventory";
import StaffSignup from "./Staff/StaffSignup";
import StaffLogin from "./Staff/StaffLogin";
import AllOrders from "./Staff/Orders";
import NewsletterComposer from "./Admin/Newsletter";
import AdminCategory from "./Admin/AdminCategory";
import Feedback from "./Admin/Feedback";
function App() {
  let auth = useSelector((state) => state.customer?.auth);
  let adminAuth = useSelector((state) => state.admin?.adminAuth);
  let staffAuth = useSelector((state) => state.staff?.staffAuth);
  const cartItems = useSelector((state) => state.cart.cartItems?.cartDetails);
  const { customerLogout } = useCustomers();
  const { adminLogout } = useAdmin();
  const { staffLogout } = useStaff();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemCount = sumBy(cartItems, (item) => item?.quantity);

  const handleLogout = () => {
    dispatch(customerLogout()).then((res) => {
      if (res.payload.status) {
        localStorage.removeItem("customerToken");
        message.success({ content: "Logout Successful", duration: 3 });
      }
    });
    navigate("/");
  };

  const handleAdminLogout = () => {
    dispatch(adminLogout()).then((adminRes) => {
      if (adminRes.payload.status) {
        localStorage.removeItem("adminToken");
        message.success({ content: "Logout Successful", duration: 3 });
      }
    });
    navigate("/");
  };
  const handlestaffLogout = () => {
    dispatch(staffLogout()).then((staffRes) => {
      if (staffRes.payload.status) {
        localStorage.removeItem("staffToken");
        message.success({ content: "Logout Successful", duration: 3 });
      }
    });
    navigate("/");
  };

  const renderHeader = () => {
    if (auth && auth.status) {
      const fullName = `${auth?.data?.firstName} ${auth?.data?.lastName}`;
      return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand fw-bold fs-4">
              <img
                src={webLogo}
                alt=""
                style={{
                  height: "55px",
                  marginRight: "540%",
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
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="bookingDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Bookings
                  </Link>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <Link to="booking" className="dropdown-item">
                        New Booking
                      </Link>
                    </li>
                    <li>
                      <Link to="existing-booking" className="dropdown-item">
                        Exsisting booking
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="cateringDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Catering
                  </Link>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="cateringDropdown"
                    style={{ right: "0", left: "auto" }}
                  >
                    <li>
                      <Link to="catering" className="dropdown-item">
                        New Catering
                      </Link>
                    </li>
                    <li>
                      <Link to="existing-catering" className="dropdown-item">
                        Existing Catering
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      );
    } else if (adminAuth && adminAuth.status) {
      const adminName = `${adminAuth?.data?.firstName} ${adminAuth?.data?.lastName}`;
      return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand fs-4 fw-bold">
              <img
                src={webLogo}
                alt=""
                style={{
                  height: "55px",
                  marginRight: "500%",
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
                      <button
                        className="dropdown-item"
                        onClick={handleAdminLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    href="#"
                    className="nav-link dropdown-toggle"
                    id="menuDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Menu
                  </Link>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="cateringDropdown"
                  >
                    <li>
                      <Link to="/admin-dashboard" className="dropdown-item">
                        Add Items to Menu
                      </Link>
                    </li>
                    <li>
                      <Link to="/update-menu" className="dropdown-item">
                        Update Menu
                      </Link>
                    </li>
                    <li>
                      <Link to="/category" className="dropdown-item">
                        Add Category
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="inventoryDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Inventory
                  </Link>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="cateringDropdown"
                    style={{ right: "0", left: "auto" }}
                  >
                    <li>
                      <Link to="inventory" className="dropdown-item">
                        Add items to Inventory
                      </Link>
                    </li>
                    <li>
                      <Link to="editinventory" className="dropdown-item">
                        Update Inventory
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link to="/report" className="nav-link">
                    Report
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/booking" className="nav-link">
                    Bookings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/catering" className="nav-link">
                    Caterings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/newsletter" className="nav-link">
                    News Letter
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/feedback" className="nav-link">
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      );
    } else if (staffAuth && staffAuth.status) {
      const staffName = `${staffAuth?.data?.firstName} ${staffAuth?.data?.lastName}`;
      return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand fs-4 fw-bold">
              <img
                src={webLogo}
                alt=""
                style={{
                  height: "55px",
                  marginRight: "540%",
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
                    Hi {staffName}
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
                      <button
                        className="dropdown-item"
                        onClick={handlestaffLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link to="/update-menu" className="nav-link">
                    Update Menu
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="inventoryDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Inventory
                  </Link>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="cateringDropdown"
                    style={{ right: "0", left: "auto" }}
                  >
                    <li>
                      <Link to="inventory" className="dropdown-item">
                        Add items to Inventory
                      </Link>
                    </li>
                    <li>
                      <Link to="editinventory" className="dropdown-item">
                        Update Inventory
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link to="/order" className="nav-link">
                    Orders
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      );
    } else {
      return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand fw-bold fs-4">
              <img
                src={webLogo}
                alt=""
                style={{
                  height: "55px",
                  marginRight: "540%",
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
                  <Link to="/login" className="nav-link">
                    <span className="fw-bold fs-4">Login</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    <span className="fw-bold fs-4">Register</span>
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
    <div>
      {renderHeader()}
      <div className="app-content">
        <div className="app-wrapper" style={{ minHeight: "100vh" }}>
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
                <Auth authRoute={true} redirectTo="/">
                  <ChangePassword />
                </Auth>
              }
            />
            <Route
              path="/login"
              element={
                <Auth authRoute={true} redirectTo="/login">
                  <Login />
                </Auth>
              }
            />
            <Route
              path="/register"
              element={
                <Auth authRoute={true} redirectTo="/register">
                  <Register />
                </Auth>
              }
            />
            <Route
              path="/admin/login"
              element={
                <Auth authRoute={true} redirectTo="/admin/login">
                  <AdminLogin />
                </Auth>
              }
            />
            <Route path="/admin/signup" element={<AdminSignupForm />} />
            <Route
              path="/admin-dashboard"
              element={
                <Auth authRoute={true} redirectTo="/admin-dashboard">
                  <Admin />
                </Auth>
              }
            />
            <Route
              path="/menu"
              element={
                <Auth authRoute={true} redirectTo="/menu">
                  <ItemMenu />
                </Auth>
              }
            />
            <Route
              path="/report"
              element={
                <Auth authRoute={true} redirectTo="/report">
                  <ReportPage />
                </Auth>
              }
            />
            <Route
              path="/update-menu"
              element={
                <Auth authRoute={true} redirectTo="/update-menu">
                  <AdminMenu />
                </Auth>
              }
            />
            <Route
              path="/cart"
              element={
                <Auth authRoute={true} redirectTo="/cart">
                  <Cart />
                </Auth>
              }
            />
            <Route
              path="/orderHistory"
              element={
                <Auth authRoute={true} redirectTo="/orderHistory">
                  <OrderHistory />
                </Auth>
              }
            />

            <Route
              path="/booking"
              element={
                <Auth authRoute={true} redirectTo="/booking">
                  <BookingForm />
                </Auth>
              }
            />
            <Route
              path="/admin/booking"
              element={
                <Auth authRoute={true} redirectTo="/admin/booking">
                  <AdminBookings />
                </Auth>
              }
            />
            <Route
              path="/admin/catering"
              element={
                <Auth authRoute={true} redirectTo="/admin/catering">
                  <AdminCatering />
                </Auth>
              }
            />
            <Route
              path="/inventory"
              element={
                <Auth authRoute={true} redirectTo="/inventory">
                  <InventoryManagement />
                </Auth>
              }
            />
            <Route
              path="/catering"
              element={
                <Auth authRoute={true} redirectTo="/catering">
                  <CateringForm />
                </Auth>
              }
            />
            <Route
              path="existing-booking"
              element={
                <Auth authRoute={true} redirectTo="/existing-booking">
                  <ExistingBooking />
                </Auth>
              }
            />
            <Route
              path="existing-catering"
              element={
                <Auth authRoute={true} redirectTo="/existing-catering">
                  <ExistingCatering />
                </Auth>
              }
            />
            <Route
              path="editinventory"
              element={
                <Auth authRoute={true} redirectTo="/editinventory">
                  <EditInventory />
                </Auth>
              }
            />
            <Route
              path="staff/signup"
              element={
                <Auth authRoute={true} redirectTo="/staff/signup">
                  <StaffSignup />
                </Auth>
              }
            />
            <Route
              path="staff/login"
              element={
                <Auth authRoute={true} redirectTo="/staff/login">
                  <StaffLogin />
                </Auth>
              }
            />
            <Route
              path="order"
              element={
                <Auth authRoute={true} redirectTo="/order">
                  <AllOrders />
                </Auth>
              }
            />
            <Route
              path="/admin/newsletter"
              element={
                <Auth authRoute={true} redirectTo="/admin/newsletter">
                  <NewsletterComposer />
                </Auth>
              }
            />
            <Route
              path="/category"
              element={
                <Auth authRoute={true} redirectTo="/category">
                  <AdminCategory />
                </Auth>
              }
            />
            <Route
              path="/feedback"
              element={
                <Auth authRoute={true} redirectTo="/feedback">
                  <Feedback />
                </Auth>
              }
            />
          </Routes>
        </div>
      </div>
      <br />
      <Footer />
    </div>
  );
}

export default App;
