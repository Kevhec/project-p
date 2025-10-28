import { useAuth } from '@/context/authContext';
import React from 'react';
import { Navigate, useLocation } from 'react-router';

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!user && !loading) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    children
  );
}