import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Badge, Button, Container } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaPhone, FaUserShield, FaCalendar } from "react-icons/fa";
import NavBar from "../components/NavBar";

export default function UserProfile() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {

      const token = JSON.parse(sessionStorage.getItem("user"))?.token;

      const res = await axios.get("http://localhost:3000/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(res.data);

    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" style={{ width: "3rem", height: "3rem" }} />
      </div>
    );
  }

  if (!user) return null;

  return (
      <>
        <NavBar/>
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>

          <Card className="shadow-lg border-0" style={{ borderRadius: "15px" }}>
            
            {/* HEADER */}
            <div
              style={{
                background: "linear-gradient(to right, #667eea, #764ba2)",
                color: "#fff",
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
                padding: "20px",
                textAlign: "center"
              }}
            >
              <FaUserCircle size={60} />
              <h4 className="mt-2 mb-0">{user.name}</h4>
              <small>{user.email}</small>
            </div>

            <Card.Body>

              <div className="d-flex justify-content-end mb-3">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate("/profile/edit")}
                >
                  Edit Profile
                </Button>
              </div>

              <Row className="mb-3">
                <Col sm={4}><FaUserCircle /> <strong>Name</strong></Col>
                <Col sm={8}>{user.name}</Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4}><FaEnvelope /> <strong>Email</strong></Col>
                <Col sm={8}>{user.email}</Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4}><FaPhone /> <strong>Phone</strong></Col>
                <Col sm={8}>{user.phone || "-"}</Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4}><FaUserShield /> <strong>Role</strong></Col>
                <Col sm={8}>
                  <Badge
                    bg={user.role === "admin" ? "danger" : "success"}
                    className="px-3 py-2"
                  >
                    {user.role}
                  </Badge>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={4}><FaCalendar /> <strong>Created</strong></Col>
                <Col sm={8}>
                  {new Date(user.created_at).toLocaleString()}
                </Col>
              </Row>

              <Row>
                <Col sm={4}><FaCalendar /> <strong>Modified</strong></Col>
                <Col sm={8}>
                  {user.modified_at
                    ? new Date(user.modified_at).toLocaleString()
                    : "-"}
                </Col>
              </Row>

            </Card.Body>
          </Card>

        </Col>
      </Row>
    </Container>
      </>
  );
}