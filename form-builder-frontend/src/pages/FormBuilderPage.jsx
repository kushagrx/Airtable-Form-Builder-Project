import React, { useState } from 'react';
import BaseSelector from '../components/BaseSelector';
import TableSelector from '../components/TableSelector';
import FieldSelector from '../components/FieldSelector';
import ConditionalLogicBuilder from '../components/ConditionalLogicBuilder';

function FormBuilderPage() {
    const [selectedBaseId, setSelectedBaseId] = useState(null);
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [selectedFields, setSelectedFields] = useState([]);
    const [conditionalLogic, setConditionalLogic] = useState({});

    const handleBaseSelection = (baseId) => {
        setSelectedBaseId(baseId);
        setSelectedTableId(null);
        setSelectedFields([]);
        setConditionalLogic({});
    };

    const handleTableSelection = (tableId) => {
        setSelectedTableId(tableId);
        setSelectedFields([]);
        setConditionalLogic({});
    };

    const handleFieldsSelection = (fields) => {
        setSelectedFields(fields);
    };

    const handleConditionalLogicChange = (logic) => {
        setConditionalLogic(logic);
        console.log("Updated Conditional Logic:", logic);
    };

    useEffect(() => {
        if (selectedBaseId && selectedTableId && selectedFields.length > 0) {
            const formConfig = {
                baseId: selectedBaseId,
                tableId: selectedTableId,
                fields: selectedFields,
                conditionalLogic: conditionalLogic,
            };
            console.log("Current Form Configuration:", formConfig);

        }
    }, [selectedBaseId, selectedTableId, selectedFields, conditionalLogic]);


    return (
        <div className="container">
            <h1>Build Your Form</h1>

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
                <button style={{ marginTop: '20px' }}>Save Form Configuration</button>
            )}
        </div>
    );
}

export default FormBuilderPage;