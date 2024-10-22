import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from "./Pages/LoginPage.jsx"
import MainPage from "./Pages/MainPage.jsx"
import NotFoundPage from "./Pages/NotFoundPage.jsx"
import RegistrationPage from "./Pages/RegistrationPage.jsx";
import { selectToken } from './Slices/authSlice.js';
import { useSelector } from "react-redux"


function Router() {
    const token = useSelector(selectToken);

    return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegistrationPage />} />
        <Route path="/" element={token ? <MainPage /> : <Navigate replace to="/login" />} />
        </Routes>
    </BrowserRouter>
  );
}

export default Router;