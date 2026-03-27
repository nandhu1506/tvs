import React, { useEffect, useState } from "react";
import { Container, Card, Table, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

export default function VehicleByCustomerReport() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("user"))?.token;
    setLoading(true);
    axios
      .get("http://localhost:3000/customers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCustomers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch customers");
        setLoading(false);
      });
  }, []);

  const fetchVehicles = (customerId) => {
    const token = JSON.parse(sessionStorage.getItem("user"))?.token;
    setLoading(true);
    setError("");
    axios
      .get(`http://localhost:3000/reports/vehiclesbycustomer/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setVehicles(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch vehicles");
        setVehicles([]);
        setLoading(false);
      });
  };

  const downloadExcel = async () => {
    if (!selectedCustomer) return;
    const token = JSON.parse(sessionStorage.getItem("user"))?.token;

    try {
      const response = await axios.get(
        `http://localhost:3000/reports/vehiclesbycustomer/${selectedCustomer}/excel`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `vehicles_customer_${selectedCustomer}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      setError("Failed to download Excel");
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm p-3">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <h3 style={{ color: "#0d6efd", fontWeight: "600" }}>Vehicle By Customer Report</h3>
          <Button
            onClick={downloadExcel}
            disabled={!selectedCustomer}
            style={{ background: "linear-gradient(90deg, #28a745, #20c997)", border: "none", fontWeight: "500" }}
          >
            Download Excel
          </Button>
        </div>

        {loading && customers.length === 0 && <Spinner animation="border" className="d-block mx-auto my-4" />}

        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Select
          className="mb-3"
          value={selectedCustomer}
          onChange={(e) => {
            setSelectedCustomer(e.target.value);
            fetchVehicles(e.target.value);
          }}
          style={{ borderRadius: "10px", height: "50px" }}
        >
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </Form.Select>

        {loading && customers.length > 0 && <Spinner animation="border" className="d-block mx-auto my-4" />}

        {!loading && vehicles.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <Table striped bordered hover responsive className="align-middle mb-0">
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Vehicle Number</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Year</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>{vehicle.id}</td>
                    <td>{vehicle.vehicle_number}</td>
                    <td>{vehicle.make}</td>
                    <td>{vehicle.model}</td>
                    <td>{vehicle.year}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {!loading && selectedCustomer && vehicles.length === 0 && (
          <Alert variant="warning" className="mt-3">
            No vehicles found for this customer.
          </Alert>
        )}
      </Card>
    </Container>
  );
}