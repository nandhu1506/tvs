import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Pnf() {
  const navigate = useNavigate();

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <h1 style={{ fontSize: "6rem", fontWeight: "700" }}>404</h1>
      <h3 className="mb-3">Oops! Page Not Found</h3>
      <p className="mb-4">The page you are looking for does not exist or has been moved.</p>
      <Button variant="primary" onClick={() => navigate("/home")}>
        Go to Dashboard
      </Button>
    </Container>
  );
}