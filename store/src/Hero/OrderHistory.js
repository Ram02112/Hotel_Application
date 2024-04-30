import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import useOrders from "../_actions/orderActions";

const OrderHistory = () => {
  const { getOrderHistory } = useOrders();
  const orderHistory = useSelector((state) => state.order?.orderHistory);
  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRow = (rowId) => {
    const newExpandedRows = [...expandedRows];
    if (newExpandedRows.includes(rowId)) {
      newExpandedRows.splice(newExpandedRows.indexOf(rowId), 1);
    } else {
      newExpandedRows.push(rowId);
    }
    setExpandedRows(newExpandedRows);
  };

  const renderOrderList = () => {
    return (
      <table className="table table-bordered table-striped custom-table">
        <thead>
          <tr>
            <th
              className="text-center bg-dark text-white"
              style={{ width: "20%" }}
            >
              ID
            </th>
            <th className="text-center bg-dark text-white">DATE</th>
            <th
              className="text-center bg-dark text-white"
              style={{ width: "20%" }}
            >
              TOTAL AMOUNT ($)
            </th>
          </tr>
        </thead>
        <tbody>
          {orderHistory &&
            orderHistory.map((order) => (
              <React.Fragment key={order._id}>
                <tr
                  onClick={() => toggleRow(order._id)}
                  style={{ cursor: "pointer" }}
                  className="text-center"
                >
                  <td className="text-center">{order._id}</td>
                  <td className="text-center">
                    {moment(order.orderDate).format("DD-MM-YYYY")}
                  </td>
                  <td className="text-right">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                </tr>
                {expandedRows.includes(order._id) && (
                  <tr>
                    <td colSpan="3" className="text-center">
                      {renderExpandedRow(order)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
        </tbody>
      </table>
    );
  };

  const renderExpandedRow = (order) => {
    return (
      <table className="table table-bordered table-sm">
        <thead>
          <tr>
            <th className="bg-dark text-white">Product</th>
            <th className="text-center bg-dark text-white">Price</th>
            <th className="text-center bg-dark text-white">Quantity</th>
            <th className="text-center bg-dark text-white">Amount ($)</th>
          </tr>
        </thead>
        <tbody>
          {order.orderDetails.map((item) => (
            <tr key={item._id}>
              <td>{item._product.name}</td>
              <td className="text-center">${item.price.toFixed(2)}</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-center">${item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  useEffect(() => {
    getOrderHistory();
  }, []);

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f2f5" }}>
      <h2 style={{ marginBottom: "20px", color: "#1890ff" }}>Order History</h2>
      {renderOrderList()}
    </div>
  );
};

export default OrderHistory;
