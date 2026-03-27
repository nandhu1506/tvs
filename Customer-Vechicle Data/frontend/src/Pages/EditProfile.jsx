import React, { useEffect, useState } from "react";
import { Card, Row, Col, Form, Button, Spinner, Container } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function EditProfile() {

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

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

      setFormData({
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone || "",
        password: "",
        confirmPassword: ""
      });

    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {

      const token = JSON.parse(sessionStorage.getItem("user"))?.token;

      await axios.put(
        "http://localhost:3000/users/profile/update",
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Profile updated successfully");

      navigate("/profile");

    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <NavBar />

      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>

            <Card className="shadow-lg border-0" style={{ borderRadius: "15px" }}>

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
                <h4>Edit Profile</h4>
              </div>

              <Card.Body>

                <Form onSubmit={handleSubmit}>

                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <hr />

                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between">

                    <Button
                      variant="secondary"
                      onClick={() => navigate("/profile")}
                    >
                      Cancel
                    </Button>

                    <Button type="submit" variant="primary">
                      Update Profile
                    </Button>

                  </div>

                </Form>

              </Card.Body>

            </Card>

          </Col>
        </Row>
      </Container>
    </>
  );
}