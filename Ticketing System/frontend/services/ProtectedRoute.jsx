import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem('token');
  const user = sessionStorage.getItem('user');

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}

