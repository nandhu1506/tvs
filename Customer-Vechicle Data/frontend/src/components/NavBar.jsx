import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
    toast.success("Logged Out")
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand
          style={{ fontWeight: "700", letterSpacing: "1px", cursor: "pointer" }}
          onClick={() => navigate("/home")}
        >
          My Dashboard
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              active={location.pathname === "/home"}
              onClick={() => navigate("/home")}
            >
              Home
            </Nav.Link>
            <Nav.Link
              active={location.pathname === "/customers"}
              onClick={() => navigate("/customers")}
            >
              Customers
            </Nav.Link>
            <Nav.Link
              active={location.pathname === "/vehicles"}
              onClick={() => navigate("/vehicles")}
            >
              Vehicles
            </Nav.Link>
            <Nav.Link
              active={location.pathname === "/users"}
              onClick={() => navigate("/users")}
            >
              Users
            </Nav.Link>
            <NavDropdown
              title={<><FaUserCircle className="me-1" /> {`${user?.name || "User"}`}</>}
              id="profile-dropdown"
              align="end"
              aria-label="User Profile Options"
            >
              <NavDropdown.Item onClick={()=>navigate('/profile')}>Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}