import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Card, } from 'react-bootstrap';
import { FaCar, FaIdBadge, FaCalendarAlt, FaTag } from "react-icons/fa";
import NavBar from '../components/NavBar';
import { toast } from 'react-toastify';

export default function AddVehicle() {
  const [formData, setFormData] = useState({
    customer_id: '',
    vehicle_number: '',
    make: '',
    model: '',
    year: ''
  });

  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem('user'))?.token;
      const res = await axios.get('http://localhost:3000/customers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(res.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "vehicle_number"
        ? value.toUpperCase()
        : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = JSON.parse(sessionStorage.getItem('user'))?.token;

    try {
      const res = await axios.post('http://localhost:3000/vehicles', formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessage('Vehicle added successfully!');
      setError('');

      setFormData({
        customer_id: '',
        vehicle_number: '',
        make: '',
        model: '',
        year: ''
      });

    } catch (err) {
      setMessage('');
      setError(err.response?.data?.message || 'Error adding vehicle');
    }
  };

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
            <FaCar className="me-2" /> Add Vehicle
          </h2>

          {message && toast.success(message)}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Floating className="mb-3">
              <Form.Select
                id="customer_id"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                required
                style={{ borderRadius: "10px", height: "50px", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }}
              >
                <option value="">-- Select Customer --</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} (ID: {customer.id})
                  </option>
                ))}
              </Form.Select>
              <label htmlFor="customer_id">
                <FaIdBadge className="me-1" /> Select Customer
              </label>
            </Form.Floating>

            <Form.Floating className="mb-3">
              <Form.Control
                id="vehicle_number"
                type="text"
                placeholder=" "
                name="vehicle_number"
                value={formData.vehicle_number}
                onChange={handleChange}
                required
                style={{ borderRadius: "10px", height: "50px", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }}
              />
              <label htmlFor="vehicle_number">
                <FaTag className="me-1" /> Vehicle Number
              </label>
            </Form.Floating>

            <Form.Floating className="mb-3">
              <Form.Control
                id="make"
                type="text"
                placeholder=" "
                name="make"
                value={formData.make}
                onChange={handleChange}
                required
                style={{ borderRadius: "10px", height: "50px", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }}
              />
              <label htmlFor="make">Make</label>
            </Form.Floating>

            <Form.Floating className="mb-3">
              <Form.Control
                id="model"
                type="text"
                placeholder=" "
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                style={{ borderRadius: "10px", height: "50px", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }}
              />
              <label htmlFor="model">Model</label>
            </Form.Floating>

            <Form.Floating className="mb-4">
              <Form.Control
                id="year"
                type="number"
                placeholder=" "
                name="year"
                value={formData.year}
                onChange={handleChange}
                style={{ borderRadius: "10px", height: "50px", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }}
              />
              <label htmlFor="year">
                <FaCalendarAlt className="me-1" /> Year
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
              Add Vehicle
            </Button>
          </Form>
        </Card>
      </Container>
    </>
  );
}