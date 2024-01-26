import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './ProductCategories.css'

const ProductCategories = () => {
    const [csvData, setCsvData] = useState([]);

    useEffect(() => {
        // Load CSV data when the component mounts
        const fetchData = async () => {
            const response = await fetch('./sports.csv');
            const reader = response.body.getReader();
            const result = await reader.read();
            const text = new TextDecoder().decode(result.value);

            // Parse CSV data using PapaParse
            Papa.parse(text, {
                complete: (result) => {
                    const data = result.data.slice(1); // Excluding the header row
                    setCsvData(data);
                },
            });
        };

        fetchData();
    }, []);

    return (
        <div className="product-categories-container">
            <h2>Product Categories</h2>
            <table className="product-categories-table">
                <thead>
                    <tr>
                        <th>Product Category</th>
                        <th>Vendor</th>
                        <th>SKU name</th>
                        <th>Form factor</th>
                        <th>Metrics tracked</th>
                        <th>Pricing</th>
                        <th>Size</th>
                        <th>Weight</th>
                        <th>CE Certification</th>
                        <th>FDA Approved</th>
                        <th>Battery life</th>
                        <th>iOS compatible</th>
                        <th>Android compatible</th>
                    </tr>
                </thead>
                <tbody>
                    {csvData.map((item, index) => (
                        <tr key={index}>
                            <td>{item[0]}</td>
                            <td>{item[1]}</td>
                            <td>{item[2]}</td>
                            <td>{item[3]}</td>
                            <td>{item[4]}</td>
                            <td>{item[5]}</td>
                            <td>{item[6]}</td>
                            <td>{item[7]}</td>
                            <td>{item[8]}</td>
                            <td>{item[9]}</td>
                            <td>{item[10]}</td>
                            <td>{item[11]}</td>
                            <td>{item[12]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductCategories;
