import { Navbar, Container, Nav } from "react-bootstrap";

export const NavBar = () => {
    return (
        <Navbar expand="lg" className="navbar-glass" sticky="top">
        <Container fluid>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto gap-5">
                <Nav.Link href="#fotos">Fotos</Nav.Link>
                <Nav.Link href="#3d">3D</Nav.Link>
                <Nav.Link href="#musica">Música</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    )
}