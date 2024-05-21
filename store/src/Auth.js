import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useCustomers from "./_actions/customerActions";
import useAdmin from "./_actions/adminActions";
import useCart from "./_actions/cartActions";
import useStaff from "./_actions/staffActions";

function Auth({ authRoute, redirectTo, children }) {
  const auth = useSelector((state) => state.customer.auth);
  const adminAuth = useSelector((state) => state.admin.adminAuth);
  const staffAuth = useSelector((state) => state.staff.staffAuth);
  const { customerAuth } = useCustomers();
  const { adminAuth: fetchAdminAuth } = useAdmin();
  const { staffAuth: fetchStaffAuth } = useStaff();
  const { getCartItems } = useCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerAuthRes, adminAuthRes, staffAuthRes] = await Promise.all(
          [
            dispatch(customerAuth()),
            dispatch(fetchAdminAuth()),
            dispatch(fetchStaffAuth()),
          ]
        );

        if (
          !customerAuthRes.payload.status ||
          !adminAuthRes.payload.status ||
          !staffAuthRes.payload.status
        ) {
          if (authRoute) {
            navigate(redirectTo);
          }
        } else {
          getCartItems();
          if (!authRoute) {
            navigate(redirectTo);
          }
        }
      } catch (error) {
        console.error("Error fetching authentication data:", error);
      }
    };

    fetchData();
  }, [dispatch, auth?.status, adminAuth?.status, staffAuth?.status]);

  return children;
}

export default Auth;
