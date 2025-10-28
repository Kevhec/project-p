import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import MainLayout from './Layouts/MainLayout'
import AuthProvider from './context/AuthProvider'
import Login from './routes/Login'
import ProtectedRoute from './routes/ProtectedRoute'
import CalendarRoute from './routes/CalendarRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route
              index
              element={
                <Login />
              }
            />
            <Route
              path='/calendar'
              element={(
                <ProtectedRoute>
                  <CalendarRoute />
                </ProtectedRoute>
              )}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
