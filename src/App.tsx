import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router"
import MainLayout from "./Layouts/MainLayout"
import AuthProvider from "./context/AuthProvider"
import Login from "./routes/Login"
import ProtectedRoute from "./routes/ProtectedRoute"
import CalendarRoute from "./routes/CalendarRoute"
import PicturesProvider from "./context/PicturesProvider"
import GalleryRoute from './routes/GalleryRoute'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <AuthProvider>
      <PicturesProvider>
        <BrowserRouter>
          <Toaster position='bottom-right' />
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<Login />} />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <CalendarRoute />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar/:month"
                element={
                  <ProtectedRoute>
                    <GalleryRoute />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </PicturesProvider>
    </AuthProvider>
  )
}

export default App
