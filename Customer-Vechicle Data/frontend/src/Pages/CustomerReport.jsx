import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Spinner, Alert, Card } from 'react-bootstrap';

export default function CustomerReport() {
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem('user'))?.token;
      const res = await axios.get(
        'http://localhost:3000/reports/customers',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setCustomer(res.data);
    } catch (err) {
      setError('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    const token = JSON.parse(sessionStorage.getItem('user'))?.token;
    const response = await axios.get(
      "http://localhost:3000/reports/customers/excel",
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
    link.setAttribute("download", "customer-report.xlsx");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <>
      <Container className="mt-4">
        <Card className="shadow-sm p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 style={{ color: "#0d6efd", fontWeight: "600" }}>Customer Report</h3>
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
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No Records Found
                      </td>
                    </tr>
                  ) : (
                    customer.map((c) => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.name}</td>
                        <td>{c.email}</td>
                        <td>{c.phone}</td>
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