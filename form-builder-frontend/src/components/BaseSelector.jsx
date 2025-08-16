import React, { useState, useEffect } from 'react';
// import { getAirtableBases } from '../api/airtable'; // Uncomment when backend is ready

function BaseSelector({ onSelectBase }) {
    const [bases, setBases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- MOCK DATA ---
    const mockBases = [
        { id: 'appMockBase1', name: 'Mock Project Tracker Base' },
        { id: 'appMockBase2', name: 'Mock CRM Database' },
        { id: 'appMockBase3', name: 'Mock Event Planning Base' },
    ];
    // --- END MOCK DATA ---

    useEffect(() => {
        // In a real scenario, you'd fetch bases from your backend.
        // This is currently using mock data.
        const fetchBases = async () => {
            try {
                setLoading(true);
                setError(null);
                // const fetchedBases = await getAirtableBases(); // Uncomment this line
                // setBases(fetchedBases); // Uncomment this line
                setBases(mockBases); // Remove this line when uncommenting above
            } catch (err) {
                setError("Failed to load bases. Please ensure you are logged in and your backend is running.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBases();
    }, []);

    if (loading) return <p>Loading bases...</p>;
    if (error) return <p className="error">{error}</p>;
    if (bases.length === 0) return <p>No bases found. Please log in to Airtable and create some bases.</p>;

    return (
        <div>
            <h3>Step 1: Select an Airtable Base</h3>
            <select onChange={(e) => onSelectBase(e.target.value)}>
                <option value="">-- Select a Base --</option>
                {bases.map((base) => (
                    <option key={base.id} value={base.id}>
                        {base.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default BaseSelector;