import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import useStaff from "../_actions/staffActions";
import { message } from "antd";

function StaffSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreement, setAgreement] = useState(false);
  const dispatch = useDispatch();
  const { staffRegister } = useStaff();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreement) {
      message.warning({ content: "Please accept the agreement", duration: 3 });
      return;
    }
    const data = { firstName, lastName, email, password };
    dispatch(staffRegister(data))
      .then((res) => {
        if (res.payload.status) {
          message.success(res.payload.message);
        } else {
          message.error(res.payload.message);
        }
      })
      .catch((error) => {
        message.error({ content: "Error", duration: 3, error });
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Staff Register</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
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
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="agreement"
                    checked={agreement}
                    onChange={(e) => setAgreement(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="agreement">
                    I have read the <Link to="#">agreement</Link>
                  </label>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffSignup;
