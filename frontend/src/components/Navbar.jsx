import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Navbar as BootstrapNavbar, Container } from 'react-bootstrap';


const Navbar = ({ onLogout }) => {
  const username = useSelector((state) => state.auth?.username);
  const location = useLocation();

  // Скрываем Navbar на странице входа
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <BootstrapNavbar bg="light" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={NavLink} to="/">
          Главная
        </BootstrapNavbar.Brand>
        <div className="ms-auto">
          {username ? (
            <>
              <span className="me-3">Привет, {username}!</span>
              <Button variant="outline-danger" onClick={onLogout}>
                Выйти
              </Button>
            </>
          ) : (
            <NavLink className="btn btn-outline-primary" to="/login">
              Войти
            </NavLink>
          )}
        </div>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
