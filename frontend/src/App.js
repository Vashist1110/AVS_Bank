import './App.css';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import CreateAccount from './pages/Create_Account';
import Login from './pages/User_Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/create_account" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;