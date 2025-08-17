const express = require('express');
const router = express.Router();


const mockData = {
    bases: [
        { id: 'appMockBase1', name: 'Mock Projects DB' },
        { id: 'appMockBase2', name: 'Mock CRM' },
    ],
    tables: {
        'appMockBase1': [
            { id: 'tblMock1A', name: 'Projects' },
            { id: 'tblMock1B', name: 'Tasks' },
        ],
        'appMockBase2': [
            { id: 'tblMock2A', name: 'Customers' },
            { id: 'tblMock2B', name: 'Leads' },
        ],
    },
    fields: {
        'tblMock1A': [
            { id: 'fldProjectName', name: 'Project Name', type: 'singleLineText' },
            { id: 'fldProjectDesc', name: 'Description', type: 'multilineText' },
            { id: 'fldProjectStatus', name: 'Status', type: 'singleSelect', options: { choices: [{ name: 'Pending' }, { name: 'Done' }] } },
            { id: 'fldProjectFiles', name: 'Files', type: 'multipleAttachments' },
            { id: 'fldProjectDate', name: 'Due Date', type: 'dateTime' }, // Unsupported
        ],
        'tblMock1B': [
            { id: 'fldTaskName', name: 'Task Name', type: 'singleLineText' },
            { id: 'fldTaskAssignee', name: 'Assignee', type: 'singleLineText' },
            { id: 'fldTaskType', name: 'Task Type', type: 'multipleSelects', options: { choices: [{ name: 'Development' }, { name: 'Design' }] } },
        ],
    },
};


router.use((req, res, next) => {
    console.log("Mock Auth: Allowing request to Airtable API routes");
    next();
});


router.get('/bases', (req, res) => {
    res.json(mockData.bases);
});

router.get('/tables/:baseId', (req, res) => {
    const { baseId } = req.params;
    res.json(mockData.tables[baseId] || []);
});

router.get('/fields/:baseId/:tableId', (req, res) => {
    const { tableId } = req.params;
    const fields = mockData.fields[tableId] || [];
    res.json(fields);
});

module.exports = router;
