import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import MyEvents from './pages/MyEvents';
import PropTypes from 'prop-types';
import Logout from './pages/Logout';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import CreateEvent from './components/CreateEvent';
import EditEvent from './components/EditEvent';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('userId'); // Verifica si el usuario está autenticado
  return isAuthenticated ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const App = () => {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-events" element={<PrivateRoute><MyEvents /></PrivateRoute>} />
        <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/edit-event/:id" element={<EditEvent />} />
      </Routes>
    </Router>
  );
};

export default App;