// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showState, selectToken } from './features/authSlice'; // Импортируем нужные функции
import Login from './Components/Login';
import NotFound from './Components/NotFound';

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken); // Получаем токен из Redux

  React.useEffect(() => {
    dispatch(showState()); // Логирование состояния при загрузке
  }, [dispatch]);

  return (
    <Router>
      <Switch>
        <Route exact path="/" render={() => (
          token ? <h1>Главная страница</h1> : <Redirect to="/login" />
        )} />
        <Route path="/login" component={Login} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;
