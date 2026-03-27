import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import NavBar from '../components/NavBar';
import { toast } from 'react-toastify';

export default function AddCustomer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = JSON.parse(sessionStorage.getItem('user'))?.token;

    try {
      const res = await axios.post('http://localhost:3000/customers', formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage('Customer added successfully!');
      setError('');

      setFormData({
        name: '',
        email: '',
        phone: ''
      });

      console.log(res.data);

    } catch (err) {
      setMessage('');
      setError(err.response?.data?.message || 'Error adding customer');
    }
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      setMessage("")
    } if (error) {
      toast.error(error);
      setError("");
    }
  }, [message, error])

  return (
    <>
      <NavBar />
      <Container className="d-flex justify-content-center mt-5">
        <Card
          className="p-4 shadow-lg"
          style={{
            width: "100%",
            maxWidth: "500px",
            borderRadius: "15px",
            background: "linear-gradient(145deg, #f8f9fa, #e9ecef)",
            border: "none",
          }}
        >
          <h2 className="text-center mb-4" style={{ fontWeight: "700", color: "#333" }}>
            Add Customer
          </h2>



          <Form onSubmit={handleSubmit}>
            <Form.Floating className="mb-3">
              <Form.Control
                id="name"
                type="text"
                placeholder=" "
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ borderRadius: "10px", height: "50px", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }}
              />
              <label htmlFor="name">
                <FaUser className="me-1" /> Name
              </label>
            </Form.Floating>

            <Form.Floating className="mb-3">
              <Form.Control
                id="email"
                type="email"
                placeholder=" "
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ borderRadius: "10px", height: "50px", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }}
              />
              <label htmlFor="email">
                <FaEnvelope className="me-1" /> Email
              </label>
            </Form.Floating>

            <Form.Floating className="mb-4">
              <Form.Control
                id="phone"
                type="tel"
                placeholder=" "
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{ borderRadius: "10px", height: "50px", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }}
              />
              <label htmlFor="phone">
                <FaPhone className="me-1" /> Phone
              </label>
            </Form.Floating>

            <Button
              type="submit"
              className="w-100"
              style={{
                background: "linear-gradient(90deg, #667eea, #764ba2)",
                border: "none",
                padding: "12px",
                fontWeight: "600",
                fontSize: "1rem",
                borderRadius: "10px",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.filter = "brightness(1.1)")}
              onMouseLeave={(e) => (e.target.style.filter = "brightness(1)")}
            >
              Add Customer
            </Button>
          </Form>
        </Card>
      </Container>
    </>
  );
}