import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Form, Col, Card, Row } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import avatarImagePath from '../../assets/avatar.jpg';
import { useAuth } from '../../hooks/index.jsx';
import routes from '../../routes.js';
import '../../styles/style.css';
import Navbar from '../Navbar.jsx';

const SignUpPage = () => {
  const { t } = useTranslation();
  const [registrationFailed, setRegistrationFailed] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const input = useRef(null);

  useEffect(() => {
    input.current.focus();
  }, []);

  const signUpSchema = yup.object({
    username: yup.string()
      .matches(/^[a-zA-Z0-9_]+$/, t('validation.usernamePattern'))
      .min(5, t('validation.usernameLength'))
      .max(20, t('validation.usernameLength'))
      .required(t('validation.required')),
    password: yup.string()
      .min(6, t('validation.passwordLength'))
      .required(t('validation.required')),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], t('validation.passwordMatch'))
      .required(t('validation.required')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      setRegistrationFailed(false);
      try {
        const { data } = await axios.post(routes.signupPath(), {
          username: values.username,
          password: values.password,
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('username', values.username);
        auth.logIn({ username: values.username });

        navigate('/');
      } catch (err) {
        formik.setSubmitting(false);
        if (err.response?.status === 409) {
          setRegistrationFailed(true);
          input.current.select();
          return;
        }
        console.error(t('errors.registrationFailed'), err);
      }
    },
  });

  return (
    <>
      <Navbar />
      <div className="container-fluid h-100 page-container">
        <Row className="justify-content-center align-items-center h-100">
          <Col className="col-12 col-md-8 col-xxl-6">
            <Card className="shadow-sm">
              <Card.Body className="p-5 mt-4">
                <Row className="justify-content-center align-items-center h-100 mt-4">
                  <Col xs={12} md={6} className="d-flex justify-content-center mb-4 mb-md-0">
                    <img
                      src={avatarImagePath}
                      alt={t('signupPage.avatarAlt')}
                      className="rounded-circle"
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                  </Col>
                  <Col xs={12} md={6}>
                    <Form onSubmit={formik.handleSubmit}>
                      <h1 className="text-center mb-4">{t('signupPage.title')}</h1>
                      <fieldset disabled={formik.isSubmitting}>
                        <Form.Group className="mb-3 form-floating" controlId="username">
                          <Form.Control
                            type="text"
                            name="username"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                            onBlur={formik.handleBlur}
                            placeholder={t('signupPage.username')}
                            autoComplete="username"
                            isInvalid={registrationFailed || (formik.touched.username && formik.errors.username)}
                            required
                            ref={input}
                          />
                          <Form.Label>{t('signupPage.username')}</Form.Label>
                          {formik.touched.username && formik.errors.username && (
                            <div className="invalid-feedback">{formik.errors.username}</div>
                          )}
                        </Form.Group>
                        <Form.Group className="mb-3 form-floating" controlId="password">
                          <Form.Control
                            type="password"
                            name="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            onBlur={formik.handleBlur}
                            placeholder={t('signupPage.password')}
                            autoComplete="new-password"
                            isInvalid={formik.touched.password && formik.errors.password}
                            required
                          />
                          <Form.Label>{t('signupPage.password')}</Form.Label>
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.password}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-4 form-floating" controlId="confirmPassword">
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            onChange={formik.handleChange}
                            value={formik.values.confirmPassword}
                            onBlur={formik.handleBlur}
                            placeholder={t('signupPage.confirmPassword')}
                            autoComplete="new-password"
                            isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            required
                          />
                          <Form.Label>{t('signupPage.confirmPassword')}</Form.Label>
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.confirmPassword}
                          </Form.Control.Feedback>
                        </Form.Group>
                        {registrationFailed && <div className="text-danger mb-3">{t('signupPage.userExists')}</div>}
                        <Button type="submit" variant="outline-primary" className="w-100 mb-3">
                          {t('signupPage.registerButton')}
                        </Button>
                      </fieldset>
                    </Form>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className="p-4">
                <div className="text-center">
                  <span>{t('signupPage.alreadyHaveAccount')}</span>{' '}
                  <NavLink to="/login">{t('signupPage.login')}</NavLink>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SignUpPage;
