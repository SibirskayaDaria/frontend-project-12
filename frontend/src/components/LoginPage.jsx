import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Form, Col, Card, Row } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import avatarImagePath from '../assets/avatar.jpg'; // Путь к изображению
import { useAuth } from '../hooks'; // Путь к хуку для авторизации
import routes from '../routes'; // Путь к маршрутам
import '../index.css'; // Путь к вашему CSS-файлу

// Схема валидации
const logInSchema = yup.object({
  username: yup.string()
    .matches(/^[a-zA-Z0-9_]+$/, 'Только буквы, цифры и подчеркивания')
    .min(5, 'От 5 до 20 символов')
    .max(20, 'От 5 до 20 символов')
    .required('Обязательное поле'),
  password: yup.string()
    .min(5, 'От 5 до 20 символов')
    .max(20, 'От 5 до 20 символов')
    .required('Обязательное поле'),
});

const LoginPage = () => {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const input = useRef(null);

  useEffect(() => {
    input.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: logInSchema,
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        // Запрос на логин
        const res = await axios.post(routes.loginPath(), values);
        
        // Сохраняем токен и данные пользователя в localStorage
        localStorage.setItem('token', res.data.token); 
        localStorage.setItem('user', JSON.stringify({ ...res.data, username: values.username }));
        
        // Уведомляем хук об успешной авторизации
        auth.logIn({ username: values.username });
        
        // Переадресация после логина
        const { from } = location.state || { from: { pathname: '/' } };
        navigate(from);
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          input.current.select();
          return;
        }
        throw err;
      }
    },
  });

  return (
    <div className="container-fluid h-100 page-container">
      <Row className="justify-content-center align-items-center h-100">
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="p-5 mt-4">
              <Row className="justify-content-center align-items-center h-100 mt-4">
                <Col xs={12} md={6} className="d-flex justify-content-center mb-4 mb-md-0">
                  <img
                    src={avatarImagePath}
                    alt="LogIn page"
                    className="rounded-circle"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </Col>
                <Col xs={12} md={6}>
                  <Form onSubmit={formik.handleSubmit}>
                    <h1 className="text-center mb-4">Войти</h1>
                    <fieldset disabled={formik.isSubmitting}>
                      <Form.Group className="mb-3 form-floating" controlId="username">
                        <Form.Control
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.username}
                          onBlur={formik.handleBlur}
                          placeholder="username"
                          autoComplete="username"
                          isInvalid={authFailed}
                          required
                          ref={input}
                        />
                        {formik.touched.username && formik.errors.username && (
                          <div className="invalid-feedback">{formik.errors.username}</div>
                        )}
                        <Form.Label>Ваш ник</Form.Label>
                      </Form.Group>
                      <Form.Group className="mb-4 form-floating" controlId="password">
                        <Form.Control
                          type="password"
                          onChange={formik.handleChange}
                          value={formik.values.password}
                          onBlur={formik.handleBlur}
                          placeholder="password"
                          autoComplete="current-password"
                          isInvalid={authFailed}
                          required
                        />
                        {formik.touched.password && formik.errors.password && (
                          <div className="invalid-feedback">{formik.errors.password}</div>
                        )}
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control.Feedback
                          type="invalid"
                          className="invalid-feedback"
                          tooltip
                        >
                          Неверные имя пользователя или пароль
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button type="submit" variant="outline-primary" className="w-100 mb-3">
                        Войти
                      </Button>
                    </fieldset>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>Нет аккаунта?</span>{' '}
                <NavLink to="/register">Регистрация</NavLink>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
