import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu, message } from "antd";
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
import "bootstrap/dist/css/bootstrap.min.css";

const { Header, Content } = Layout;
const { SubMenu } = Menu;

function App() {
  let auth = useSelector((state) => state.customer?.auth);
  let adminAuth = useSelector((state) => state.admin?.adminAuth);
  const { customerLogout } = useCustomers();
  const { adminLogout } = useAdmin();
  const dispatch = useDispatch();

  const handleLogout = ({ key }) => {
    if (key === "logout") {
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
    }
  };

  const renderHeader = () => {
    if (auth && auth.status) {
      // Render navigation bar for authenticated user
      const fullName = `${auth?.data?.firstName} ${auth?.data?.lastName}`;
      return (
        <Header className="app-header bg-dark">
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["home"]}
            onClick={handleLogout}
          >
            <Menu.Item key="home">
              <Link to="/" className="nav-link">
                <span className="nav-link-text">Home</span>
              </Link>
            </Menu.Item>
            <SubMenu
              key="account"
              icon={<UserOutlined />}
              title={`Hi ${fullName}`}
            >
              <Menu.Item key="changePassword">
                <Link to="changePassword" className="nav-link">
                  <span className="nav-link-text">Change Password</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="logout">Logout</Menu.Item>
            </SubMenu>
            <Menu.Item key="menu">
              <Link to="menu" className="nav-link">
                <span className="nav-link-text">Menu</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="cart">
              <Link className="nav-link">
                <span className="nav-link-text">Cart</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="orderHistory">
              <Link className="nav-link">
                <span className="nav-link-text">Order History</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Header>
      );
    } else if (adminAuth && adminAuth.status) {
      // Render navigation bar for authenticated admin
      const adminName = `${adminAuth?.data?.firstName} ${adminAuth?.data?.lastName}`;
      return (
        <Header className="app-header">
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["home"]}
            onClick={handleLogout}
          >
            <Menu.Item key="home">
              <Link to="/" className="nav-link">
                <span className="nav-link-text">Home</span>
              </Link>
            </Menu.Item>
            <SubMenu
              key="account"
              icon={<UserOutlined />}
              title={`Hi ${adminName}`}
            >
              <Menu.Item key="changePassword">
                <Link to="changePassword" className="nav-link">
                  <span className="nav-link-text">Change Password</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="logout">Logout</Menu.Item>
            </SubMenu>
            <Menu.Item key="adminDashboard">
              <Link to="/admin-dashboard" className="nav-link">
                <span className="nav-link-text">Add Menu</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="menu_crud">
              <Link to="/update-menu" className="nav-link">
                <span className="nav-link-text">Update Menu</span>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link className="nav-link">
                <span className="nav-link-text">Inventory</span>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link className="nav-link">
                <span className="nav-link-text">Report</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Header>
      );
    } else {
      // Render navigation bar for logged out users
      return (
        <Header className="app-header">
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["home"]}
            onClick={handleLogout}
          >
            <Menu.Item key="home">
              <Link to="/" className="nav-link">
                <span className="nav-link-text">Home</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="login">
              <Link to="login" className="nav-link">
                <span className="nav-link-text">Login</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="register">
              <Link to="register" className="nav-link">
                <span className="nav-link-text">Register</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="admin/login">
              <Link to="admin/login" className="nav-link">
                <span className="nav-link-text">Admin Login</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Header>
      );
    }
  };

  return (
    <BrowserRouter>
      <Layout>
        {renderHeader()}
        <Content className="app-content">
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
                  <Auth redirectTo="/">
                    <Login />
                  </Auth>
                }
              />
              <Route
                path="/register"
                element={
                  <Auth redirectTo="/">
                    <Register />
                  </Auth>
                }
              />
              <Route
                path="/admin/login"
                element={
                  <Auth redirectTo="/admin-dashboard">
                    <AdminLogin />
                  </Auth>
                }
              />
              <Route
                path="/admin/signup"
                element={
                  <Auth redirectTo="/admin-dashboard">
                    <AdminSignupForm />
                  </Auth>
                }
              />
              <Route path="/admin-dashboard" element={<Admin />} />
              <Route path="/menu" element={<ItemMenu />} />
              <Route path="/update-menu" element={<AdminMenu />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
