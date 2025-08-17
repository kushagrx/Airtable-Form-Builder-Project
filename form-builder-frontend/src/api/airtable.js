import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

export const getAirtableBases = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/airtable/bases`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Airtable bases:", error.response?.data || error.message);
        throw error;
    }
};


export const getAirtableTables = async (baseId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/airtable/tables/${baseId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching tables for base ${baseId}:`, error.response?.data || error.message);
        throw error;
    }
};

export const getAirtableFields = async (baseId, tableId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/airtable/fields/${baseId}/${tableId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching fields for table ${tableId} in base ${baseId}:`, error.response?.data || error.message);
        throw error;
    }
};

export const saveFormConfiguration = async (formConfig) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/forms`, formConfig, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error saving form configuration:", error.response?.data || error.message);
        throw error;
    }
};
