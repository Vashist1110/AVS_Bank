import './App.css';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import CreateAccount from './pages/Create_Account';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/create_account" element={<CreateAccount />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;