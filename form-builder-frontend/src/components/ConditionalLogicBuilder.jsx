import React, { useState, useEffect } from 'react';

function ConditionalLogicBuilder({ fields, onLogicChange }) {
    const [logicRules, setLogicRules] = useState({}); // {fieldId: {triggerFieldId, condition, value}}

    useEffect(() => {
        setLogicRules({});
    }, [fields]);

    const handleAddLogic = (fieldId) => {
        setLogicRules(prev => ({
            ...prev,
            [fieldId]: { triggerFieldId: '', condition: 'equals', value: '' } // Default new rule
        }));
    };

    const handleLogicChange = (fieldId, key, value) => {
        setLogicRules(prev => {
            const updatedRules = {
                ...prev,
                [fieldId]: { ...prev[fieldId], [key]: value }
            };
            onLogicChange(updatedRules); // Notify parent
            return updatedRules;
        });
    };

    const handleRemoveLogic = (fieldId) => {
        setLogicRules(prev => {
            const updatedRules = { ...prev };
            delete updatedRules[fieldId];
            onLogicChange(updatedRules); // Notify parent
            return updatedRules;
        });
    };

    if (fields.length === 0) return null;

    const getTriggerFields = (currentFieldId) => {
        // Fields that can trigger the current field (i.e., appear before it)
        // For simplicity, we'll allow any *previously selected* field to be a trigger.
        // In a full app, you might consider order of fields in the form.
        return fields.filter(field => field.id !== currentFieldId);
    };

    return (
        <div>
            <h3>Step 4: Define Conditional Logic (Optional)</h3>
            <p>Define when a question should appear based on previous answers.</p>
            {fields.map(field => (
                <div key={field.id} style={{ border: '1px solid #eee', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
                    <h4>Logic for: "{field.name}"</h4>
                    {logicRules[field.id] ? (
                        <div>
                            Show this question only if:
                            <select
                                value={logicRules[field.id].triggerFieldId}
                                onChange={(e) => handleLogicChange(field.id, 'triggerFieldId', e.target.value)}
                                style={{ width: 'auto', margin: '0 10px' }}
                            >
                                <option value="">-- Select a Trigger Question --</option>
                                {getTriggerFields(field.id).map(triggerField => (
                                    <option key={triggerField.id} value={triggerField.id}>
                                        {triggerField.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={logicRules[field.id].condition}
                                onChange={(e) => handleLogicChange(field.id, 'condition', e.target.value)}
                                style={{ width: 'auto', margin: '0 10px' }}
                            >
                                <option value="equals">equals</option>
                                {/* Add other conditions like 'not equals', 'contains', etc. */}
                            </select>
                            <input
                                type="text"
                                placeholder="Value"
                                value={logicRules[field.id].value}
                                onChange={(e) => handleLogicChange(field.id, 'value', e.target.value)}
                                style={{ width: '150px', margin: '0 10px' }}
                            />
                            <button onClick={() => handleRemoveLogic(field.id)} style={{ backgroundColor: '#dc3545' }}>Remove Logic</button>
                        </div>
                    ) : (
                        <button onClick={() => handleAddLogic(field.id)}>Add Conditional Logic</button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ConditionalLogicBuilder;