import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    // Проверяем наличие токена в localStorage
    const token = localStorage.getItem('token');

    // Если токена нет, перенаправляем пользователя на страницу логина
    if (!token) {
      history.push('/login');
    }
  }, [history]);

  return (
    <div>
      <h1>Добро пожаловать в чат!</h1>
      <p>Здесь будет сам чат.</p>
    </div>
  );
};

export default HomePage;
