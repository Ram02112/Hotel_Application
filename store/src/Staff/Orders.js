import React, { useState, useEffect } from "react";
import axios from "axios";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("staffToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    getAllOrders();
  }, []);

  const getAllOrders = async () => {
    try {
      const response = await axios.get("http://localhost:4000/order/allOrders");
      const ordersWithData = await Promise.all(
        response.data.data.map(async (order) => {
          // Fetch customer details
          const customerResponse = await axios.get(
            `http://localhost:4000/customers/${order._customerId}`
          );
          const customer = customerResponse.data.customer;
          const customerName = `${customer.firstName} ${customer.lastName}`;

          // Fetch product details
          const orderDetailsWithData = await Promise.all(
            order.orderDetails.map(async (detail) => {
              const productResponse = await axios.get(
                `http://localhost:4000/products/${detail._product}`
              );
              const productName = productResponse.data.product.name;
              return {
                ...detail,
                productName,
              };
            })
          );

          return {
            ...order,
            customerName,
            orderDetails: orderDetailsWithData,
          };
        })
      );
      setOrders(ordersWithData);
    } catch (error) {
      console.error("Error fetching all orders:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">All Orders</h1>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Order ID</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Order Date</th>
              <th scope="col">Total Amount</th>
              <th scope="col">Payment ID</th>
              <th scope="col">Order Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.customerName}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>{order.paymentId}</td>
                <td>
                  <ul className="list-group">
                    {order.orderDetails.map((detail, index) => (
                      <li key={index} className="list-group-item">
                        Product Name: {detail.productName}
                        <br />
                        Price: ${detail.price.toFixed(2)}
                        <br />
                        Quantity: {detail.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;
