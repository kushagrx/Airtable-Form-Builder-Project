import React from 'react';
import { useNavigate } from 'react-router-dom';

function AuthButton() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        window.location.href = 'http://localhost:5001/api/auth/airtable';
    };

    return (
        <div className="auth-button-container">
            <h2>Welcome to the Dynamic Form Builder!</h2>
            <p>Please log in with your Airtable account to get started.</p>
            <button onClick={handleLoginClick}>Login with Airtable</button>
        </div>
    );
}

export default AuthButton;