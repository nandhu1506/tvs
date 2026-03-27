import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem('user'))?.token;
      const res = await axios.get(`http://localhost:3000/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomer(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = JSON.parse(sessionStorage.getItem('user'))?.token;
      await axios.put(`http://localhost:3000/customers/${id}`, customer, {
        headers: {
          Authorization: `Bearer ${token}`, // 
        },
      });
      alert("Customer Updated Successfully");
      navigate('/customers');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-4 text-center" style={{ color: "#0d6efd" }}>
            Edit Customer
          </h2>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label><FaUser className="me-1" /> Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={customer.name}
                onChange={handleChange}
                placeholder="Enter customer name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><FaEnvelope className="me-1" /> Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={customer.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label><FaPhone className="me-1" /> Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={customer.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100"
              style={{ fontWeight: "500", fontSize: "1.1rem" }}
            >
              Update Customer
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}