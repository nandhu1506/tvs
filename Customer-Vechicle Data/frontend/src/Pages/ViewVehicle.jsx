import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Table, Button, Card, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import { FaEdit, FaTrash } from "react-icons/fa";
import NavBar from '../components/NavBar';

export default function ViewVehicles() {
  const { customerId } = useParams();
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1);
const vehiclesPerPage = 10;

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem('user'))?.token;
    axios.get(`http://localhost:3000/vehicles/customer/${customerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setVehicles(res.data);
      })
      .catch((err) => {
        console.error("Error fetching vehicles:", err);
      });
  }, [customerId]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this vehicle?");
    if (!confirmDelete) return;

    try {
      const token = JSON.parse(sessionStorage.getItem('user'))?.token;
      if (!token) {
        alert("Please login first");
        return;
      }

      await axios.delete(`http://localhost:3000/vehicles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));

      alert("Vehicle deleted successfully");

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to delete vehicle");
    }
  };

  const indexOfLastVehicle = currentPage * vehiclesPerPage;
const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;

const currentVehicles = vehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);

const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);

  return (
    <>
      <NavBar />
      <Container className="mt-5">
        <Card className="shadow-sm">
          <Card.Body>
            <h2 className="mb-4 text-center" style={{ color: "#0d6efd" }}>
              Vehicles List
            </h2>

            <div style={{ overflowX: "auto" }}>
              <Table striped bordered hover responsive className="align-middle mb-0">
                <thead className="table-primary">
                  <tr>
                    <th>Sl.No</th>
                    <th>ID</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>Created At</th>
                    <th>Created By</th>
                    <th>Modified At</th>
                    <th>Modified By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.length > 0 ? (
                    currentVehicles.map((vehicle,index) => (
                      <tr key={vehicle.id}>
                        <td>{indexOfFirstVehicle + index + 1}</td>
                        <td>{vehicle.id}</td>
                        <td>{vehicle.make}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.year}</td>
                        <td>{new Date(vehicle.created_at).toLocaleString()}</td>
                        <td>{vehicle.created_by_name ? `${vehicle.created_by_name} (id:${vehicle.created_by})` : ""}</td>
                        <td>{new Date(vehicle.modified_at).toLocaleString()}</td>
                        <td>{vehicle.modified_by_name ? `${vehicle.modified_by_name} (id:${vehicle.modified_by})` : ""}</td>
                        <td className="d-flex gap-2">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Edit Vehicle</Tooltip>}
                          >
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => navigate(`/vehicles/edit/${vehicle.id}`)}
                            >
                              <FaEdit />
                            </Button>
                          </OverlayTrigger>

                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Delete Vehicle</Tooltip>}
                          >
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(vehicle.id)}
                            >
                              <FaTrash />
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-3">
                        No vehicles found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
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