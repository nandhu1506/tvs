import React, { useState } from 'react';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import DashboardCards from '../components/DashBoard';

export default function Home() {
  const [selectedCustomer, setSelectedCustomer] = useState()
  const navigate = useNavigate()
  return (
    <>
      <NavBar />
      <Container className="mt-5">
        <Row className="mb-4">
          <Col>
            <h1 className="mb-2" style={{ fontWeight: '700' }}>Welcome to the Dashboard</h1>
            <p className="mb-3 text-secondary">Manage your customers and vehicles efficiently.</p>
            <DashboardCards selectedCustomer={selectedCustomer} />

            <Button
              onClick={() => navigate('/addcustomer')}
              variant="primary"
              className="me-2"
              style={{ borderRadius: '8px', fontWeight: '500' }}
            >
              Add Customer
            </Button>
            <Button
              onClick={() => navigate('/addvehicle')}
              variant="success"
              style={{ borderRadius: '8px', fontWeight: '500' }}
            >
              Add Vehicle
            </Button>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={4}>
            <Card
              className="h-100 shadow-sm border-0"
              style={{
                borderRadius: '15px',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
            >
              <Card.Body className="text-center">
                <Card.Title className="mb-2" style={{ fontWeight: '600' }}>Customers</Card.Title>
                <Card.Text className="text-muted mb-3">View and manage all customers.</Card.Text>
                <Button
                  onClick={() => navigate('/customers')}
                  variant="primary"
                  style={{
                    borderRadius: '8px',
                    fontWeight: '500',
                  }}
                >
                  View Customers
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card
              className="h-100 shadow-sm border-0"
              style={{
                borderRadius: '15px',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
            >
              <Card.Body className="text-center">
                <Card.Title className="mb-2" style={{ fontWeight: '600' }}>Vehicles</Card.Title>
                <Card.Text className="text-muted mb-3">
                  View and manage vehicles linked to customers.
                </Card.Text>
                <Button
                  onClick={() => navigate('/vehicles')}
                  variant="success"
                  style={{ borderRadius: '8px', fontWeight: '500' }}
                >
                  View Vehicles
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card
              className="h-100 shadow-sm border-0"
              style={{
                borderRadius: '15px',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
            >
              <Card.Body className="text-center">
                <Card.Title className="mb-2" style={{ fontWeight: '600' }}>Reports</Card.Title>
                <Card.Text className="text-muted mb-3">Generate and download reports.</Card.Text>
                <Button
                  onClick={() => navigate('/reports')}
                  variant="warning"
                  style={{ borderRadius: '8px', fontWeight: '500' }}
                >
                  View Reports
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}