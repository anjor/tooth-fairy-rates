'use client';

import { useState, useEffect } from 'react';

export default function ToothFairyRatesForm() {
    const [location, setLocation] = useState('');
    const [rate, setRate] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/api/rates')
            .then((response) => response.json())
            .then((data) => setData(data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/rates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location, rate }),
        });
        const newData = await response.json();
        setData([newData, ...data]);
        setLocation('');
        setRate('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="mb-8 w-full max-w-md mx-auto">
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="block w-full mb-2 p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Rate (local currency)"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="block w-full mb-2 p-2 border rounded"
                />
                <button type="submit" className="block w-full p-2 bg-blue-500 text-white rounded">
                    Submit
                </button>
            </form>

            <table className="w-full max-w-md mx-auto border-collapse">
                <thead>
                    <tr>
                        <th className="border-b p-2">Date</th>
                        <th className="border-b p-2">Location</th>
                        <th className="border-b p-2">Rate (local currency)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry) => (
                        <tr key={entry.id}>
                            <td className="border-b p-2">{new Date(entry.created_at).toLocaleDateString()}</td>
                            <td className="border-b p-2">{entry.location}</td>
                            <td className="border-b p-2">{entry.rate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
