import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Form } from "react-bootstrap";
import { FaUsers, FaCar, FaCarSide } from "react-icons/fa";
import axios from "axios";

export default function DashboardCards() {
  const [totals, setTotals] = useState({
    customers: 0,
    vehicles: 0,
    vehiclesByCustomer: 0,
  });
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const token = JSON.parse(sessionStorage.getItem("user"))?.token;

  useEffect(() => {
    const fetchInitialTotals = async () => {
      try {
        const customerRes = await axios.get("http://localhost:3000/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const vehicleRes = await axios.get("http://localhost:3000/vehicles", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const customersArray = customerRes.data?.data || customerRes.data || [];
        const vehiclesArray = vehicleRes.data?.data || vehicleRes.data || [];

        setCustomers(customersArray);
        setTotals((prev) => ({
          ...prev,
          customers: customersArray.length,
          vehicles: vehiclesArray.length,
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialTotals();
  }, [token]);

  useEffect(() => {
    if (!selectedCustomer) {
      setTotals((prev) => ({ ...prev, vehiclesByCustomer: 0 }));
      return;
    }

    const fetchVehiclesByCustomer = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/reports/vehiclesbycustomer/${selectedCustomer}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const vehiclesByCustomerArray = res.data?.data || res.data || [];
        setTotals((prev) => ({ ...prev, vehiclesByCustomer: vehiclesByCustomerArray.length }));
      } catch (err) {
        console.error(err);
        setTotals((prev) => ({ ...prev, vehiclesByCustomer: 0 }));
      }
    };

    fetchVehiclesByCustomer();
  }, [selectedCustomer, token]);

  if (loading) return <Spinner animation="border" className="d-block mx-auto my-4" />;

  const cardStyle = { minHeight: "200px" };

  return (
    <Row className="mb-4">
      <Col md={4}>
        <Card className="text-center shadow-sm p-3 d-flex flex-column justify-content-between" style={cardStyle}>
          <div>
            <FaUsers size={30} className="mb-2 text-primary" />
            <h5>Total Customers</h5>
            <h3>{totals.customers}</h3>
          </div>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="text-center shadow-sm p-3 d-flex flex-column justify-content-between" style={cardStyle}>
          <div>
            <FaCar size={30} className="mb-2 text-success" />
            <h5>Total Vehicles</h5>
            <h3>{totals.vehicles}</h3>
          </div>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="text-center shadow-sm p-3 d-flex flex-column justify-content-between" style={cardStyle}>
          <div>
            <FaCarSide size={30} className="mb-2 text-warning" />
            <h5>Vehicles of Customer</h5>
            <h3>{totals.vehiclesByCustomer}</h3>
          </div>
          <div className="mt-3">
            <Form.Select
              onChange={(e) => setSelectedCustomer(e.target.value)}
              value={selectedCustomer}
            >
              <option value="">-- Select Customer --</option>
              {customers.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>
                  {c.name}
                </option>
              ))}
            </Form.Select>
          </div>
        </Card>
      </Col>
    </Row>
  );
}