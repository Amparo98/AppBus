import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/loginPage';
import RegisterPage from '../pages/registerPage';


function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/registerPage' element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;