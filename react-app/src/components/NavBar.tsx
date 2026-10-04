import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router";

export const NavBar = () => {
    return (
        <Navbar expand="lg" className="navbar-glass glass">
        <Container fluid>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto gap-5">
                <Nav.Link as={Link} to="/fotos">Fotos</Nav.Link>
                <Nav.Link as={Link} to="/3d">3D</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    )
}