import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "../styles/navbar.css";

const NavigationBar = () => {
  return (
    <Navbar expand="lg" className="custom-navbar shadow-lg">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-uppercase brand-text">
          Memento
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="nav-link-custom">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/register" className="nav-link-custom">
              Registro
            </Nav.Link>
            <Nav.Link as={Link} to="/login" className="nav-link-custom">
              Iniciar Sesión
            </Nav.Link>
            <Nav.Link as={Link} to="/my-events" className="nav-link-custom">
              Mis Eventos
            </Nav.Link>
            <Nav.Link as={Link} to="/logout" className="nav-link-custom">
              Cerrar Sesion
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
