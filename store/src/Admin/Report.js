import React, { useState, useEffect } from "react";
import axios from "axios";

const Report = () => {
  const [reportData, setReportData] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [customerData, setCustomerData] = useState({}); // Store customer data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("adminToken");
        if (!authToken) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch("http://localhost:4000/order/report", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const responseData = await response.json();

        if (responseData.status && responseData.data) {
          const aggregatedData = aggregateData(responseData.data);
          setReportData(aggregatedData);
          const totalRevenue = calculateTotalRevenue(aggregatedData);
          setTotalRevenue(totalRevenue);
        } else {
          throw new Error("Invalid response data format");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Fetch customer data for selected date
    const fetchCustomerData = async () => {
      if (selectedDate) {
        const promises = reportData[selectedDate].orders.map(async (order) => {
          const customerResponse = await axios.get(
            `http://localhost:4000/customers/${order._customerId}`
          );
          return { [order._id]: customerResponse.data.customer };
        });
        const customers = await Promise.all(promises);
        const customerData = Object.assign({}, ...customers);
        setCustomerData(customerData);
      }
    };

    fetchCustomerData();
  }, [selectedDate, reportData]);

  const aggregateData = (data) => {
    const aggregatedData = {};
    data.forEach((entry) => {
      const date = new Date(entry.orderDate).toLocaleDateString();
      if (!aggregatedData[date]) {
        aggregatedData[date] = {
          totalOrders: 1,
          totalAmount: entry.totalAmount,
          orders: [entry], // Store all orders for this date
        };
      } else {
        aggregatedData[date].totalOrders += 1;
        aggregatedData[date].totalAmount += entry.totalAmount;
        aggregatedData[date].orders.push(entry);
      }
    });

    // Sort the data by date
    const sortedData = Object.entries(aggregatedData)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .reduce((acc, [date, values]) => {
        acc[date] = values;
        return acc;
      }, {});

    return sortedData;
  };

  const calculateTotalRevenue = (data) => {
    return Object.values(data).reduce(
      (sum, entry) => sum + entry.totalAmount,
      0
    );
  };

  const handleRowClick = (date) => {
    setSelectedDate(date);
  };

  const closeModal = () => {
    setSelectedDate(null);
  };

  return (
    <div className="container mt-5">
      <div className="card bg-dark text-white">
        <div className="card-body">
          <h5 className="card-title">Sales Report</h5>
          <table className="table table-striped table-dark mt-3">
            <thead>
              <tr>
                <th>Date</th>
                <th>Total Orders</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {reportData &&
                Object.entries(reportData).map(([date, data]) => (
                  <tr
                    key={date}
                    onClick={() => handleRowClick(date)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{date}</td>
                    <td>{data.totalOrders}</td>
                    <td>${data.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="bg-primary text-white p-3 rounded"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <h5>Total Revenue: ${totalRevenue.toFixed(2)}</h5>
      </div>
      {selectedDate && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Orders for {selectedDate}</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Name</th>
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData[selectedDate].orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>
                          {customerData[order._id]?.firstName}{" "}
                          {customerData[order._id]?.lastName}
                        </td>
                        <td>${order.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
