// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Symbol from './components/Symbol';
import './App.css';

function App() {
    const [name1, setName1] = useState('');
    const [name2, setName2] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);

    // Fetch history on component mount
    useEffect(() => {
        fetchHistory();
    }, []);

    // Corrected FLAMES Calculation Function on Frontend
    const calculateFlames = (name1, name2) => {
        // Remove spaces, convert to lowercase, and filter out non-alphabet characters
        const str1 = name1.replace(/\s+/g, '').toLowerCase().replace(/[^a-z]/g, '');
        const str2 = name2.replace(/\s+/g, '').toLowerCase().replace(/[^a-z]/g, '');

        // Convert strings to arrays
        let arr1 = str1.split('');
        let arr2 = str2.split('');

        // Remove common characters
        for (let i = 0; i < arr1.length; i++) {
            let char = arr1[i];
            let index = arr2.indexOf(char);
            if (index !== -1) {
                // Remove the matched character from both arrays
                arr1.splice(i, 1);
                arr2.splice(index, 1);
                i--; // Adjust index after removal
            }
        }

        // Total remaining characters
        const total = arr1.length + arr2.length;

        // FLAMES array
        let flames = ['F', 'L', 'A', 'M', 'E', 'S'];

        // Start the elimination process
        let position = 0;
        while (flames.length > 1) {
            // The position to remove is (total % flames.length) - 1
            position = (total % flames.length) - 1;

            if (position >= 0) {
                // Remove the element at the position
                flames.splice(position, 1);
                // Rearrange the array starting from the next element
                flames = flames.slice(position).concat(flames.slice(0, position));
            } else {
                // If position is negative, remove the last element
                flames.splice(flames.length - 1, 1);
            }
        }

        // Map the remaining letter to the relationship
        const flamesMap = {
            'F': 'Friends',
            'L': 'Lovers',
            'A': 'Affection',
            'M': 'Marriage',
            'E': 'Enemies',
            'S': 'Siblings'
        };

        return flamesMap[flames[0]];
    };

    const handleCalculate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult('');

        // Validate inputs
        if (!name1.trim() || !name2.trim()) {
            setError('Both names are required.');
            setLoading(false);
            return;
        }

        // Perform calculation on the frontend
        const flamesResult = calculateFlames(name1, name2);
        setResult(flamesResult);

        try {
            // Send the result to the backend to save in the database
            await axios.post(`${process.env.REACT_APP_API_URL}/flames/calculate`, {
                name1: name1.trim(),
                name2: name2.trim(),
                result: flamesResult,
            });
            // Fetch updated history
            fetchHistory();
        } catch (err) {
            console.error('Error saving to database:', err);
            setError('Failed to save the result. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/flames/history`);
            setHistory(res.data);
        } catch (err) {
            console.error('Error fetching history:', err);
            setError('Failed to fetch history.');
            // Optionally set an error state here
        }
    };

    return (
        <div className="App">
            <h1>FLAMES Calculator</h1>
            <form onSubmit={handleCalculate}>
                <input
                    type="text"
                    placeholder="Your Name"
                    value={name1}
                    onChange={(e) => setName1(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Partner's Name"
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Calculating...' : 'Calculate'}
                </button>
            </form>

            {error && <p className="error">{error}</p>}

            {result && (
                <motion.div
                    className="result"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2>Your Relationship: {result}</h2>
                    <Symbol type={result} />
                </motion.div>
            )}

            <div className="history">
                <h3>Recent Calculations</h3>
                {history.length === 0 ? (
                    <p>No history available.</p>
                ) : (
                    <ul>
                        {history.map((item) => (
                            <li key={item._id}>
                                <strong>{item.name1}</strong> &amp; <strong>{item.name2}</strong>: {item.result}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
                {/* Footer Section */}
            <footer className="App-footer">
                <p>&copy; {new Date().getFullYear()} All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default App;
