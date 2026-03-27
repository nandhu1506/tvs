import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Spinner, Alert, Card } from 'react-bootstrap';

export default function VehicleReport() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem('user'))?.token;
      const res = await axios.get(
        'http://localhost:3000/reports/vehicles',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setVehicles(res.data);
    } catch (err) {
      setError('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    const token = JSON.parse(sessionStorage.getItem('user'))?.token;
    const response = await axios.get(
      "http://localhost:3000/reports/vehicles/excel",
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "vehicle-report.xlsx");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <>
      <Container className="mt-4">
        <Card className="shadow-sm p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 style={{ color: "#0d6efd", fontWeight: "600" }}>Vehicle Report</h3>
            <Button
              onClick={downloadExcel}
              style={{
                background: "linear-gradient(90deg, #28a745, #20c997)",
                border: "none",
                fontWeight: "500",
              }}
            >
              Download Excel
            </Button>
          </div>

          {loading && <Spinner animation="border" className="d-block mx-auto my-4" />}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && (
            <div style={{ overflowX: "auto" }}>
              <Table striped bordered hover responsive className="align-middle mb-0">
                <thead className="table-primary">
                  <tr>
                    <th>ID</th>
                    <th>Vehicle No</th>
                    <th>Customer</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No Records Found
                      </td>
                    </tr>
                  ) : (
                    vehicles.map((v) => (
                      <tr key={v.id}>
                        <td>{v.id}</td>
                        <td>{v.vehicle_number}</td>
                        <td>{v.customer_name}</td>
                        <td>{v.make}</td>
                        <td>{v.model}</td>
                        <td>{v.year}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Container>
    </>
  );
}