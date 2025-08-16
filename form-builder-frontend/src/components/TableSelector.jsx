import React, { useState, useEffect } from 'react';
// import { getAirtableTables } from '../api/airtable'; // will uncomment this when backend is ready

function TableSelector({ baseId, onSelectTable }) {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const mockTables = {
        'appMockBase1': [{ id: 'tblMock1A', name: 'Projects List' }, { id: 'tblMock1B', name: 'Tasks' }],
        'appMockBase2': [{ id: 'tblMock2A', name: 'Customers' }, { id: 'tblMock2B', name: 'Orders' }],
        'appMockBase3': [{ id: 'tblMock3A', name: 'Events' }, { id: 'tblMock3B', name: 'Attendees' }],
    };


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
                // const fetchedTables = await getAirtableTables(baseId); // Uncomment this line
                // setTables(fetchedTables); // Uncomment this line
                setTables(mockTables[baseId] || []); // Remove this line
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