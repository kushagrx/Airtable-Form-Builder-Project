import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseSelector from '../components/BaseSelector';
import TableSelector from '../components/TableSelector';
import FieldSelector from '../components/FieldSelector';
import ConditionalLogicBuilder from '../components/ConditionalLogicBuilder';
import { saveFormConfiguration } from '../api/airtable';

function FormBuilderPage() {
    const navigate = useNavigate(); // Hook for programmatic navigation

    const [formName, setFormName] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const [selectedBaseId, setSelectedBaseId] = useState(null);
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [selectedFields, setSelectedFields] = useState([]);
    const [conditionalLogic, setConditionalLogic] = useState({});

    const handleBaseSelection = (baseId) => {
        setSelectedBaseId(baseId);
        setSelectedTableId(null);
        setSelectedFields([]);
        setConditionalLogic({});
        setFormName('');
        setStatusMessage('');
    };

    const handleTableSelection = (tableId) => {
        setSelectedTableId(tableId);
        setSelectedFields([]);
        setConditionalLogic({});
        setStatusMessage('');
    };

    const handleFieldsSelection = (fields) => {
        setSelectedFields(fields);
    };

    const handleConditionalLogicChange = (logic) => {
        setConditionalLogic(logic);
    };

    // --- NEW SAVE HANDLER ---
    const handleSaveForm = async () => {
        if (!formName.trim()) {
            setStatusMessage('Error: Please enter a name for your form.');
            return;
        }
        if (selectedFields.length === 0) {
            setStatusMessage('Error: Please select at least one field for the form.');
            return;
        }

        setIsSaving(true);
        setStatusMessage('Saving form...');

        const formConfig = {
            formName: formName.trim(),
            baseId: selectedBaseId,
            tableId: selectedTableId,
            fields: selectedFields.map(field => ({
                fieldId: field.id,
                label: field.renamedLabel || field.name,
                type: field.type,
            })),
            conditionalLogic: conditionalLogic,
        };

        try {
            const response = await saveFormConfiguration(formConfig);
            setStatusMessage(`Success! Form saved with ID: ${response.formId}`);
            setIsSaving(false);
            setTimeout(() => {

            }, 2000);
        } catch (error) {
            setStatusMessage(`Error: ${error.response?.data?.message || 'Could not save form.'}`);
            setIsSaving(false);
        }
    };

    return (
        <div className="container">
            <h1>Build Your Form</h1>

            <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                <h3>Form Name</h3>
                <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., New Project Intake Form"
                    disabled={!selectedTableId} // Disable until a table is selected
                />
            </div>

            <BaseSelector onSelectBase={handleBaseSelection} />

            {selectedBaseId && (
                <TableSelector baseId={selectedBaseId} onSelectTable={handleTableSelection} />
            )}

            {selectedBaseId && selectedTableId && (
                <FieldSelector
                    baseId={selectedBaseId}
                    tableId={selectedTableId}
                    onSelectFields={handleFieldsSelection}
                />
            )}

            {selectedFields.length > 0 && (
                <ConditionalLogicBuilder
                    fields={selectedFields}
                    onLogicChange={handleConditionalLogicChange}
                />
            )}

            {selectedBaseId && selectedTableId && selectedFields.length > 0 && (
                <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                    <button onClick={handleSaveForm} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Form Configuration'}
                    </button>
                </div>
            )}

            {statusMessage && (
                <p style={{ marginTop: '20px', fontWeight: 'bold', color: statusMessage.startsWith('Error') ? 'red' : 'green' }}>
                    {statusMessage}
                </p>
            )}
        </div>
    );
}

export default FormBuilderPage;