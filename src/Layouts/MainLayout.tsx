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
    <div className='relative flex flex-col justify-between min-h-screen w-full mx-auto bg-[url(/images/flower-pattern.png)] bg-repeat-y bg-contain'>
      <div className='absolute inset-0 bg-linear-to-r from-white/80 to-white to-70%' />
      <Outlet />
      <div className='fixed bottom-0 w-full bg-white py-2'>
        <p className='text-center text-sm font-diphylleia'>Hecho con ♥️ para nosotros</p>
      </div>
    </div>
  )
}