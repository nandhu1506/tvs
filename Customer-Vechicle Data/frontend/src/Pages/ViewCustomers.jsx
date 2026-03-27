import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Card, Tooltip, OverlayTrigger, Form } from 'react-bootstrap';
import { FaCarAlt, FaEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';

export default function ViewCustomers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;


  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
  setCurrentPage(1);
}, [searchTerm]);

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

  const filteredCustomers = customers.filter(
  (c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
);

  const indexOfLastCustomer = currentPage * customersPerPage;
const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;

const currentCustomers = filteredCustomers.slice(
  indexOfFirstCustomer,
  indexOfLastCustomer
);

const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);


  return (
    <>
      <NavBar />
      <Container className="mt-5">
        <Card className="shadow-sm">
          <Card.Body>
            <h2 className="mb-4 text-center" style={{ color: "#0d6efd" }}>
              Customer List
            </h2>
            <Form.Control
              type="text"
              placeholder="Search by name or email..."
              className="mb-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div style={{ overflowX: "auto" }}>
              <Table striped bordered hover responsive className="align-middle mb-0">
                <thead className="table-primary">
                  <tr>
                    <th>Sl.No</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Created At</th>
                    <th>Created By</th>
                    <th>Modified At</th>
                    <th>Modified By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length > 0 ? (
                    currentCustomers.map((customer,index) => (
                      <tr key={customer.id}>
                        <td>{indexOfFirstCustomer + index + 1}</td>
                        <td>{customer.id}</td>
                        <td>{customer.name}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone}</td>
                        <td>{new Date(customer.created_at).toLocaleString()}</td>
                        <td>{customer.created_by_name ? `${customer.created_by_name} (id:${customer.created_by})` : ""}</td>
                        <td>{new Date(customer.modified_at).toLocaleString()}</td>
                        <td>{customer.modified_by_name ? `${customer.modified_by_name} (id:${customer.modified_by})` : ""}</td>
                        <td className="d-flex gap-2">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>View Vehicles</Tooltip>}
                          >
                            <Button
                              variant="info"
                              size="sm"
                              onClick={() => navigate(`/customers/${customer.id}/vehicles`)}
                            >
                              <FaCarAlt />
                            </Button>
                          </OverlayTrigger>

                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Edit Customer</Tooltip>}
                          >
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => navigate(`/customers/edit/${customer.id}`)}
                            >
                              <FaEdit />
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-3">
                        No Customers Found
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