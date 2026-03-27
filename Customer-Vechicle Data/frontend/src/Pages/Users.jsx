import React, { useEffect, useState } from "react";
import { Table, Button, Form, Spinner, Badge, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

 useEffect(() => {
  const filtered = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      String(user.id).includes(search) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  setFilteredUsers(filtered);
  setCurrentPage(1);
}, [search, users]);

  const fetchUsers = async () => {
  try {
    const response = await axios.get("http://localhost:3000/users/view");
    setUsers(response.data.users);
    setFilteredUsers(response.data.users);
    setLoading(false);
  } catch (error) {
    toast.error("Failed to fetch users");
    setLoading(false);
  }
};

const indexOfLastUser = currentPage * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;

const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

const totalPages = Math.ceil(filteredUsers.length / usersPerPage);


  return (
    <>
    <NavBar/>
        <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>User List</h3>
        <Button variant="success" onClick={() => navigate("/users/add")}>
          + Add User
        </Button>
      </div>

      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by Name, ID "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>SL No</th>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr key={user.id} style={{ cursor: "pointer" }} className="align-middle">
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.phone || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-3">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        
      )}
    </div>
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