import React, { useState, useEffect } from 'react';
import { getAirtableBases } from '../api/airtable';

function BaseSelector({ onSelectBase }) {
    const [bases, setBases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBases = async () => {
            try {
                setLoading(true);
                setError(null);
                const fetchedBases = await getAirtableBases();
                setBases(fetchedBases);
                setBases(mockBases);
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