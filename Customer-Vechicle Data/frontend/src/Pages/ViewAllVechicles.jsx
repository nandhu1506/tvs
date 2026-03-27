import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Card, Spinner, Alert, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function ViewAllVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 10;
  

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem('user'))?.token;

        if (!token) {
          setError("No token found. Please login.");
          setLoading(false);
          return;
        }

        const res = await axios.get('http://localhost:3000/vehicles', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setVehicles(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
  setCurrentPage(1);
}, [search]);

  const filteredVehicles = vehicles.filter(v =>
    v.vehicle_number.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastVehicle = currentPage * vehiclesPerPage;
const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;

const currentVehicles = filteredVehicles.slice(
  indexOfFirstVehicle,
  indexOfLastVehicle
);

const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);


  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <Card className="shadow-sm">
          <Card.Body>
            <h2 className="mb-4 text-center" style={{ color: "#0d6efd" }}>
              All Vehicles
            </h2>
            <Form.Control
              type="text"
              placeholder="Search by Vehicle Reg.No"
              className="mb-3"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            {loading && <Spinner animation="border" className="d-block mx-auto" />}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && vehicles.length === 0 && (
              <Alert variant="info">No vehicles found</Alert>
            )}

            {!loading && vehicles.length > 0 && (
              <div style={{ overflowX: "auto" }}>
                <Table striped bordered hover responsive className="align-middle mb-0">
                  <thead className="table-primary">
                    <tr>
                      <th>Sl.No</th>
                      <th>ID</th>
                      <th>Reg.No</th>
                      <th>Customer</th>
                      <th>Make</th>
                      <th>Model</th>
                      <th>Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVehicles.length > 0 ? (
                      currentVehicles.map((vehicle,index) => (
                        <tr key={vehicle.id}>
                          <td>{indexOfFirstVehicle + index + 1}</td>
                          <td>{vehicle.id}</td>
                          <td>{vehicle.vehicle_number}</td>
                          <td>
                            <span
                              className="text-primary"
                              style={{ cursor: "pointer", textDecoration: "underline" }}
                              onClick={() =>
                                navigate(`/customers/${vehicle.customer_id}/vehicles`)
                              }
                            >
                              {vehicle.customer_name} (id:{vehicle.customer_id})
                            </span>
                          </td>
                          <td>{vehicle.make}</td>
                          <td>{vehicle.model}</td>
                          <td>{vehicle.year}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-3">
                          No vehicles match the search
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
      <div className="d-flex justify-content-center mt-3">

  <Button
    variant="secondary"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
    className="me-2"
  >
    Previous
  </Button>

  {[...Array(totalPages)].map((_, i) => (
    <Button
      key={i}
      variant={currentPage === i + 1 ? "primary" : "outline-primary"}
      onClick={() => setCurrentPage(i + 1)}
      className="me-1"
    >
      {i + 1}
    </Button>
  ))}

  <Button
    variant="secondary"
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
    className="ms-2"
  >
    Next
  </Button>

</div>
    </>
  );
}