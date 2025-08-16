import React from 'react';
import AuthButton from '../components/AuthButton';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="container">
            <h1>Dynamic Airtable Form Builder</h1>
            <AuthButton />
            <p style={{ marginTop: '20px' }}>
                Once logged in, you can proceed to the form builder: <Link to="/builder">Go to Form Builder</Link>
            </p>
            <p>
                **Note:** If you've just logged in, you might need to refresh this page or click the link above to proceed.
            </p>
        </div>
    );
}

export default HomePage;