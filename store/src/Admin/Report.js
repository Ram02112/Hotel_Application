import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";

Chart.register(...registerables);

const Report = () => {
  const [reportData, setReportData] = useState(null);

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
        console.log("Fetched data:", responseData);

        if (responseData.status && responseData.data) {
          setReportData(responseData.data);
        } else {
          throw new Error("Invalid response data format");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderLineChart = () => {
    if (!reportData || !Array.isArray(reportData)) {
      return <div>Loading...</div>;
    }

    const labels = reportData.map((entry) => entry.orderDate);
    const amounts = reportData.map((entry) => entry.totalAmount);

    const options = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#fff", // Set legend text color to white
          },
        },
        title: {
          display: true,
          text: "Sales Report",
          font: {
            size: 16,
            color: "#fff",
          },
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
            color: "#fff",
          },
        },
        y: {
          type: "linear",
          min: 0,
          ticks: {
            color: "#fff",
          },
        },
      },
    };

    const canvas = document.getElementById("line-chart");
    if (canvas) {
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    return (
      <Line
        id="line-chart"
        options={options}
        data={{
          labels,
          datasets: [
            {
              label: "Sales Report",
              data: amounts,
              borderColor: "#fff", // Set the line color to white
              backgroundColor: "rgba(255, 255, 255, 0.1)", // Set the background color to white with opacity
              pointBackgroundColor: "#fff",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#fff",
              fill: true, // Fill the area below the line
            },
          ],
        }}
      />
    );
  };

  return (
    <div className="container mt-5">
      <div className="card bg-dark text-white">
        <div className="card-body">
          <h5 className="card-title">Sales Report</h5>
          {renderLineChart()}
        </div>
      </div>
    </div>
  );
};

export default Report;
