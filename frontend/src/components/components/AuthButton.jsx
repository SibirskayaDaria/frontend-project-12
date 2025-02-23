import React from 'react';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../hooks'; // исправленный путь

const AuthButton = () => {
  const auth = useAuth();
  return auth.loggedIn ? <Button onClick={auth.logOut}>Выйти</Button> : null;
};

export default AuthButton;
