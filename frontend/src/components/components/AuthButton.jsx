import React from 'react';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../hooks'; // исправленный путь
import { useTranslation } from 'react-i18next';


const AuthButton = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  return auth.loggedIn ? <Button onClick={auth.logOut}>{t('logout')}</Button> : null;
};

export default AuthButton;
