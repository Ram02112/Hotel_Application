import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import useOrders from "../_actions/orderActions";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
    const downloadInvoice = () => {
      const input = document.getElementById(`invoice-${order._id}`);
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("invoice.pdf");
      });
    };

    return (
      <div>
        <table
          className="table table-bordered table-sm"
          id={`invoice-${order._id}`}
        >
          <thead>
            <tr>
              <th className="bg-dark text-white">Order ID</th>
              <th className="bg-dark text-white">Product</th>
              <th className="text-center bg-dark text-white">Price</th>
              <th className="text-center bg-dark text-white">Quantity</th>
              <th className="text-center bg-dark text-white">Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            {order.orderDetails.map((item) => (
              <tr key={item._id}>
                <td>{order._id}</td>
                <td>{item._product.name}</td>
                <td className="text-center">${item.price.toFixed(2)}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-center">${item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-success" onClick={downloadInvoice}>
          Download Invoice
        </button>
      </div>
    );
  };

  useEffect(() => {
    getOrderHistory();
  }, [getOrderHistory]);

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f2f5" }}>
      <h2 style={{ marginBottom: "20px", color: "#1890ff" }}>Order History</h2>
      {renderOrderList()}
    </div>
  );
};

export default OrderHistory;
