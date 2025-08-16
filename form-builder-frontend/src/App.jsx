import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FormBuilderPage from './pages/FormBuilderPage';
import './styles/main.css'; // Import the main CSS file

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/builder" element={<FormBuilderPage />} />
                {/* You can add more routes here as your application grows */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;