import React, { useState, useEffect } from 'react';
// import { getAirtableFields } from '../api/airtable'; // Uncomment when backend is ready

// Define supported field types from your assignment PDF
const SUPPORTED_FIELD_TYPES = [
    'singleLineText',
    'multilineText',
    'singleSelect',
    'multipleSelects',
    'multipleAttachments', // Airtable API calls this 'multipleAttachments'
];

function FieldSelector({ baseId, tableId, onSelectFields }) {
    const [fields, setFields] = useState([]);
    const [selectedFieldIds, setSelectedFieldIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- MOCK DATA ---
    const mockFields = {
        'tblMock1A': [ // For 'Projects List' table
            { id: 'fld1', name: 'Project Name', type: 'singleLineText' },
            { id: 'fld2', name: 'Description', type: 'multilineText' },
            { id: 'fld3', name: 'Status', type: 'singleSelect', options: { choices: [{ name: 'Pending' }, { name: 'In Progress' }] } },
            { id: 'fld4', name: 'Attachments', type: 'multipleAttachments' },
            { id: 'fld5', name: 'Date Created', type: 'dateTime' }, // Unsupported type
        ],
        'tblMock2A': [ // For 'Customers' table
            { id: 'fld6', name: 'Customer Name', type: 'singleLineText' },
            { id: 'fld7', name: 'Notes', type: 'multilineText' },
            { id: 'fld8', name: 'Type', type: 'multipleSelects', options: { choices: [{ name: 'New' }, { name: 'Returning' }] } },
        ],
    };
    // --- END MOCK DATA ---

    useEffect(() => {
        if (!baseId || !tableId) {
            setFields([]);
            setLoading(false);
            return;
        }

        const fetchFields = async () => {
            try {
                setLoading(true);
                setError(null);
                // const fetchedFields = await getAirtableFields(baseId, tableId); // Uncomment this line
                // setFields(fetchedFields); // Uncomment this line
                setFields(mockFields[tableId] || []); // Remove this line
                setSelectedFieldIds(new Set()); // Reset selections when table changes
            } catch (err) {
                setError(`Failed to load fields for table ID: ${tableId}.`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFields();
    }, [baseId, tableId]);

    const handleFieldToggle = (fieldId) => {
        const newSelected = new Set(selectedFieldIds);
        if (newSelected.has(fieldId)) {
            newSelected.delete(fieldId);
        } else {
            newSelected.add(fieldId);
        }
        setSelectedFieldIds(newSelected);
        // Pass the selected fields back to the parent component
        const selectedFieldsData = fields.filter(field => newSelected.has(field.id));
        onSelectFields(selectedFieldsData);
    };

    const getFilteredFields = () => {
        return fields.filter(field => SUPPORTED_FIELD_TYPES.includes(field.type));
    };

    if (!baseId || !tableId) return null;
    if (loading) return <p>Loading fields...</p>;
    if (error) return <p className="error">{error}</p>;

    const filteredFields = getFilteredFields();

    if (filteredFields.length === 0) return <p>No supported fields found in this table.</p>;

    return (
        <div>
            <h3>Step 3: Choose Fields for Your Form</h3>
            <p>Only supported field types are shown (Short text, Long text, Single select, Multi select, Attachment).</p>
            {filteredFields.map((field) => (
                <div key={field.id} style={{ marginBottom: '10px' }}>
                    <input
                        type="checkbox"
                        id={`field-${field.id}`}
                        checked={selectedFieldIds.has(field.id)}
                        onChange={() => handleFieldToggle(field.id)}
                    />
                    <label htmlFor={`field-${field.id}`}>
                        {field.name} ({field.type})
                    </label>
                    {/* Optional: Add input for renaming field label */}
                    {selectedFieldIds.has(field.id) && (
                        <input
                            type="text"
                            placeholder={`Rename "${field.name}" (optional)`}
                            style={{ marginLeft: '10px', width: '200px' }}
                            // You'll need state here to manage the renamed label
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export default FieldSelector;