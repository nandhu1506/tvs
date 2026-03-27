import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { FaCar, FaTag, FaCalendarAlt } from "react-icons/fa";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    year: ''
  });

  useEffect(() => {
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem('user'))?.token;
      const res = await axios.get(
        `http://localhost:3000/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }
      );
      setVehicle(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(sessionStorage.getItem('user'))?.token;
      await axios.put(
        `http://localhost:3000/vehicles/${id}`,
        vehicle, {
        headers: { Authorization: `Bearer ${token}` }
      }
      );
      alert("Vehicle Updated Successfully");
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-4 text-center" style={{ color: "#0d6efd" }}>
            Edit Vehicle
          </h2>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label><FaCar className="me-1" /> Make</Form.Label>
              <Form.Control
                type="text"
                name="make"
                value={vehicle.make}
                onChange={handleChange}
                placeholder="Enter vehicle make"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><FaTag className="me-1" /> Model</Form.Label>
              <Form.Control
                type="text"
                name="model"
                value={vehicle.model}
                onChange={handleChange}
                placeholder="Enter vehicle model"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label><FaCalendarAlt className="me-1" /> Year</Form.Label>
              <Form.Control
                type="number"
                name="year"
                value={vehicle.year}
                onChange={handleChange}
                placeholder="Enter manufacturing year"
                required
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100"
              style={{ fontWeight: "500", fontSize: "1.1rem" }}
            >
              Update Vehicle
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}