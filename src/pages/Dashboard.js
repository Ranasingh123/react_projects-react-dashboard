import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Chart from 'chart.js/auto';
import './Dashboard.css'

const Dashboard = () => {
  const [csvData, setCsvData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(null);
  const [pricingChart, setPricingChart] = useState(null);
  const [sizeChart, setSizeChart] = useState(null);
  const [weightChart, setWeightChart] = useState(null);
  const [fdaApprovedChart, setFdaApprovedChart] = useState(null);
  const [ceCertificationChart, setCeCertificationChart] = useState(null);
  const [iOSCompatibleChart, setIOSCompatibleChart] = useState(null);
  const [androidCompatibleChart, setAndroidCompatibleChart] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./sports.csv');
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV file. Status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const result = await reader.read();
        const text = new TextDecoder().decode(result.value);

        // Parsing CSV data using PapaParse
        Papa.parse(text, {
          complete: (result) => {
            // Excluding the header row
            const data = result.data.slice(1);
            setCsvData(data);
          },
        });
      } catch (err) {
        setError(err);
        console.error(`Error fetching CSV data: ${err.message}`);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Destroying existing charts before rendering new ones
    if (pricingChart) {
      pricingChart.destroy();
    }
    if (sizeChart) {
      sizeChart.destroy();
    }
    if (weightChart) {
      weightChart.destroy();
    }
    if (fdaApprovedChart) {
      fdaApprovedChart.destroy();
    }
    if (ceCertificationChart) {
      ceCertificationChart.destroy();
    }
    if (iOSCompatibleChart) {
      iOSCompatibleChart.destroy();
    }
    if (androidCompatibleChart) {
      androidCompatibleChart.destroy();
    }

    if (selectedCategory) {
      try {
        const filteredData = csvData.filter((item) => item[0] === selectedCategory);

        const vendors = filteredData.map((item) => item[1]);
        const pricingData = filteredData.map((item) => parseFloat(item[5].replace('$', '').replace(',', '')));
        const sizeData = filteredData.map((item) => parseFloat(item[6].replace(' mm', '')));
        const weightData = filteredData.map((item) => parseFloat(item[7].replace(' oz', '')));
        const fdaApprovedData = filteredData.map((item) => item[9]);
        const ceCertificationData = filteredData.map((item) => item[8]);
        const iOSCompatibleData = filteredData.map((item) => item[11]);
        const androidCompatibleData = filteredData.map((item) => item[12]);

        // Render Bar Charts
        renderBarChart('pricingChart', 'Pricing', vendors, pricingData);
        renderBarChart('sizeChart', 'Size', vendors, sizeData);
        renderBarChart('weightChart', 'Weight', vendors, weightData);

        // Render Pie Charts
        renderPieChart('fdaApprovedChart', 'FDA Approved', ['Yes', 'No'], [
          fdaApprovedData.filter((value) => value === 'Yes').length,
          fdaApprovedData.filter((value) => value === 'No').length,
        ]);

        renderPieChart('ceCertificationChart', 'CE Certification', ['Yes', 'No', 'TBD'], [
          ceCertificationData.filter((value) => value === 'Yes').length,
          ceCertificationData.filter((value) => value === 'No').length,
          ceCertificationData.filter((value) => value === 'TBD').length,
        ]);

        renderPieChart('iOSCompatibleChart', 'iOS Compatible', ['Yes', 'No'], [
          iOSCompatibleData.filter((value) => value === 'Yes').length,
          iOSCompatibleData.filter((value) => value === 'No').length,
        ]);

        renderPieChart('androidCompatibleChart', 'Android Compatible', ['Yes', 'No'], [
          androidCompatibleData.filter((value) => value === 'Yes').length,
          androidCompatibleData.filter((value) => value === 'No').length,
        ]);

      } catch (err) {
        setError(err);
        console.error(`Error processing data: ${err.message}`);
      }
    }
  }, [selectedCategory, csvData]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const renderBarChart = (canvasId, label, labels, data) => {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const newChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{ data: data, label: label }],
      },
    });

    // Setting the corresponding state variable for future destruction
    switch (canvasId) {
      case 'pricingChart':
        setPricingChart(newChart);
        break;
      case 'sizeChart':
        setSizeChart(newChart);
        break;
      case 'weightChart':
        setWeightChart(newChart);
        break;
      default:
        break;
    }
  };

  const renderPieChart = (canvasId, label, chartLabels, data) => {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const newChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: chartLabels,
        datasets: [
          {
            data: data,
            backgroundColor: ['#36A2EB', '#FF6384'],
          },
        ],
      },
      options: {
        elements: {
          arc: {
            borderWidth: 0.5,
          },
        },
        radius: '70%',
      },
    });

    // Setting the corresponding state variable for future destruction
    switch (canvasId) {
      case 'fdaApprovedChart':
        setFdaApprovedChart(newChart);
        break;
      case 'ceCertificationChart':
        setCeCertificationChart(newChart);
        break;
      case 'iOSCompatibleChart':
        setIOSCompatibleChart(newChart);
        break;
      case 'androidCompatibleChart':
        setAndroidCompatibleChart(newChart);
        break;
      default:
        break;
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      <div className="dropdown-container">
        <label htmlFor="categoryDropdown">Select Product Category:</label>
        <select id="categoryDropdown" onChange={handleCategoryChange}>
          <option value="">-- Select Category --</option>
          {Array.from(new Set(csvData.map((item) => item[0]))).map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <div className="charts-container">
          {/* Placeholder for Bar Charts */}
          <div className="chart">
            <h3>Pricing vs Vendors</h3>
            <canvas id="pricingChart"></canvas>
          </div>

          <div className="chart">
            <h3>Size vs Vendors</h3>
            <canvas id="sizeChart"></canvas>
          </div>

          <div className="chart">
            <h3>Weight vs Vendors</h3>
            <canvas id="weightChart"></canvas>
          </div>

          {/* Placeholder for Pie Charts */}
          <div className="chart">
            <h3>FDA Approved vs Vendors</h3>
            <canvas id="fdaApprovedChart"></canvas>
          </div>

          <div className="chart">
            <h3>CE Certification vs Vendors</h3>
            <canvas id="ceCertificationChart"></canvas>
          </div>

          <div className="chart">
            <h3>iOS Compatible vs Vendors</h3>
            <canvas id="iOSCompatibleChart"></canvas>
          </div>

          <div className="chart">
            <h3>Android Compatible vs Vendors</h3>
            <canvas id="androidCompatibleChart"></canvas>
          </div>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </div>
  );
};

export default Dashboard;
