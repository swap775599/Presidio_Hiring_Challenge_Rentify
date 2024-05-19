import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import Dashboard from './components/dashboard/Dashboard';
import ClientDashboard from './components/dashboard/DashboardClient';
import Property from './components/Property';
import PropertyClient from './components/PropertyClient';
import InterestedClient from './components/InterestedClient';
import Interested from './components/Interested';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/property" element={<Property/>} />
        <Route path="/propertyClient" element={<PropertyClient/>} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboardSeller" element={<Dashboard/>} />
        <Route path="/dashboard" element={<ClientDashboard/>} />
        <Route path="/interested" element={<InterestedClient/>} />
        <Route path="/interestedSeller" element={<Interested/>} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
