import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Protected({ children }) {
  const user = sessionStorage.getItem('user');

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}

