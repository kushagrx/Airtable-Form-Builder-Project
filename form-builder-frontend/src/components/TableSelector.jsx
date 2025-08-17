import React, { useState, useEffect } from 'react';
import { getAirtableTables } from '../api/airtable'; // will uncomment this when backend is ready

function TableSelector({ baseId, onSelectTable }) {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        if (!baseId) {
            setTables([]);
            setLoading(false);
            return;
        }

        const fetchTables = async () => {
            try {
                setLoading(true);
                setError(null);
                const fetchedTables = await getAirtableTables(baseId);
                setTables(fetchedTables);
            } catch (err) {
                setError(`Failed to load tables for base ID: ${baseId}.`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, [baseId]);

    if (!baseId) return null;
    if (loading) return <p>Loading tables...</p>;
    if (error) return <p className="error">{error}</p>;
    if (tables.length === 0) return <p>No tables found in the selected base.</p>;

    return (
        <div>
            <h3>Step 2: Select a Table</h3>
            <select onChange={(e) => onSelectTable(e.target.value)}>
                <option value="">-- Select a Table --</option>
                {tables.map((table) => (
                    <option key={table.id} value={table.id}>
                        {table.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default TableSelector;