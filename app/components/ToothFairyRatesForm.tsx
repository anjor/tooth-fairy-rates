'use client';

import { useState, useEffect } from 'react';

export default function ToothFairyRatesForm() {
    const [location, setLocation] = useState('');
    const [rate, setRate] = useState('');
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of items per page
    const [searchQuery, setSearchQuery] = useState('');

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

    // Filter data based on search query
    const filteredData = data.filter((entry) =>
        entry.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate the indexes for the items to be displayed on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate the total number of pages
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageClick = (event, pageNumber) => {
        event.preventDefault();
        setCurrentPage(pageNumber);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
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

            <input
                type="text"
                placeholder="Search by Location"
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full mb-8 max-w-md mx-auto p-2 border rounded"
            />

            <table className="w-full max-w-md mx-auto border-collapse">
                <thead>
                    <tr>
                        <th className="border-b p-2">Date</th>
                        <th className="border-b p-2">Location</th>
                        <th className="border-b p-2">Rate (local currency)</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((entry) => (
                        <tr key={entry.id}>
                            <td className="border-b p-2">{new Date(entry.created_at).toLocaleDateString()}</td>
                            <td className="border-b p-2">{entry.location}</td>
                            <td className="border-b p-2">{entry.rate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 flex justify-center">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={(e) => handlePageClick(e, index + 1)}
                        className={`px-3 py-1 mx-1 ${currentPage === index + 1
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-300 text-gray-700'
                            } rounded`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
