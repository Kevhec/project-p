import { useAuth } from '@/context/authContext';
import { Navigate, Outlet, useLocation } from 'react-router';

export default function MainLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (user && !loading && location.pathname === '/') {
    return <Navigate to={"/calendar"} replace />
  }

  if (loading) {
    return (
      <div className='min-w-screen min-h-screen flex items-center justify-center'>
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen min-w-screen mx-auto bg-linear-to-tr from-white to-mimipink '>
      <Outlet />
    </div>
  )
}