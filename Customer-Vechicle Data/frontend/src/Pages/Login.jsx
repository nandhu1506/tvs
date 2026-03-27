import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card,Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) navigate('/home');
  }, [navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/users/login', {
        email,
        password
      });


      sessionStorage.setItem('user', JSON.stringify({
        token: res.data.token,
        name: res.data.user.name,
        email: res.data.user.email
      }));
      navigate('/home');
      toast.success("Logged in Successfully")
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid credentials');
      } else {
        setError('Server error. Try again later.');
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <Container
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
      }}
    >
      <Card
        style={{
          width: '400px',
          borderRadius: '15px',
          border: 'none',
          overflow: 'hidden',
        }}
        className="p-4 shadow-lg"
      >
        <div
          className="text-center mb-4"
          style={{
            background: 'linear-gradient(to right, #667eea, #764ba2)',
            color: '#fff',
            padding: '15px',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '1.5rem',
          }}
        >
          Login
        </div>

        <Form onSubmit={handleLogin}>
          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ borderRadius: '10px', padding: '10px' }}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ borderRadius: '10px', padding: '10px' }}
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100"
            disabled={loading}
            style={{
              background: 'linear-gradient(to right, #667eea, #764ba2)',
              border: 'none',
              padding: '10px',
              fontWeight: '500',
              transition: '0.3s',
            }}
            onMouseEnter={(e) =>
              (e.target.style.filter = 'brightness(1.1)')
            }
            onMouseLeave={(e) =>
              (e.target.style.filter = 'brightness(1)')
            }
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}