import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useCustomers from "./_actions/customerActions";
import useAdmin from "./_actions/adminActions";

function Auth({ authRoute, redirectTo, children }) {
  let auth = useSelector((state) => state.customer.auth);
  let adminAuths = useSelector((state) => state.admin.adminAuth);
  const { customerAuth } = useCustomers();
  const { adminAuth } = useAdmin();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  useEffect(() => {
    dispatch(customerAuth(), adminAuth()).then(async (res) => {
      if (!res.payload.status) {
        if (authRoute) {
          navigate(redirectTo);
        }
      } else {
        if (!authRoute) {
          navigate(redirectTo);
        }
      }
    });
  }, [dispatch, auth?.status, adminAuths?.status]);

  return children;
}

export default Auth;
