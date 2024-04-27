import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useAdmin from "../_actions/adminActions";
import { message } from "antd";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { adminLogin } = useAdmin();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { email, password };
    dispatch(adminLogin(formData)).then((res) => {
      console.log("Response: ", res);
      if (res.payload.status) {
        const token = res.payload.data.token;
        localStorage.setItem("adminToken", token);
        message.success(res.payload.message);
        navigate("/admin-dashboard");
      } else {
        message.error(res.payload.message);
      }
    });
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-xs-12 col-sm-8 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Admin Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    E-mail
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 d-flex justify-content-between">
                  <Link to="/forgotPassword">Forgot Password</Link>
                  <Link to="/register">Create new account</Link>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
