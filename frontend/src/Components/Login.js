// src/Components/Login.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserInfo } from '../features/authSlice'; // Импортируй функцию setUserInfo
import { Alert } from 'react-bootstrap';

const Login = () => {
  const dispatch = useDispatch(); // Получаем dispatch
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleLogin = async (values) => {
    try {
      const response = await axios.post('http://localhost:5001/login', {
        username: values.username,
        password: values.password,
      });
      const { token, username } = response.data; // Предполагается, что сервер возвращает username и token
      dispatch(setUserInfo({ token, username })); // Сохраняем информацию о пользователе в Redux
      navigate('/'); // Редирект на главную страницу
    } catch (error) {
      setErrorMessage('Ошибка авторизации. Проверьте имя пользователя и пароль.');
    }
  };

  return (
    <div>
      <h2>Авторизация</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={handleLogin}
      >
        {() => (
          <Form>
            <div>
              <label htmlFor="username">Имя пользователя:</label>
              <Field id="username" name="username" placeholder="Введите имя пользователя" />
              <ErrorMessage name="username" component="div" className="error" />
            </div>
            <div>
              <label htmlFor="password">Пароль:</label>
              <Field type="password" id="password" name="password" placeholder="Введите пароль" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <button type="submit">Войти</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;