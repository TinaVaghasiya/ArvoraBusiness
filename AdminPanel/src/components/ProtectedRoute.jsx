import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  
  console.log('ProtectedRoute - Token:', token);
  
  if (!token || token === 'null' || token === 'undefined') {
    return <Navigate to="/" replace />;
  }
  
  return children;
}
