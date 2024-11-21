// import React, { useState, useMemo } from 'react';
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link,
//   Navigate,
//   useLocation,
// } from 'react-router-dom';
// import { Navbar, Container } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Для стилизации
// import './App.css'; // Ваши стили

// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';

// import ChatPage from './ChatPage.jsx';
// import LoginPage from './LoginPage.jsx';
// import NotFoundPage from './NotFoundPage.jsx';
// import AuthContext from '../contexts/index.jsx';
// import useAuth from '../hooks/index.jsx';

// // Провайдер контекста авторизации
// const AuthProvider = ({ children }) => {
//   const [loggedIn, setLoggedIn] = useState(false);

//   const logIn = () => setLoggedIn(true);
//   const logOut = () => {
//     localStorage.removeItem('userId');
//     setLoggedIn(false);
//   };

//   const memoizedValue = useMemo(() => ({ loggedIn, logIn, logOut }), [loggedIn]);

//   return (
//     <AuthContext.Provider value={memoizedValue}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Приватный маршрут
// const PrivateRoute = ({ children }) => {
//   const auth = useAuth();
//   const location = useLocation();

//   return auth.loggedIn ? (
//     children
//   ) : (
//     <Navigate to="/login" state={{ from: location }} />
//   );
// };

// // Главный компонент приложения
// const App = () => {
//   const [count, setCount] = useState(0);

//   return (
//     <AuthProvider>
//       <Router>
//         <div className="d-flex flex-column h-100">
//           <Navbar bg="white" expand="lg" className="shadow-sm">
//             <Container>
//               <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
//             </Container>
//           </Navbar>
//           <div className="container-fluid h-100">
//             <Routes>
//               <Route
//                 path="/"
//                 element={(
//                   <PrivateRoute>
//                     <div className="app-content">
//                       <div>
//                         <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
//                           <img src={viteLogo} className="logo" alt="Vite logo" />
//                         </a>
//                         <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
//                           <img src={reactLogo} className="logo react" alt="React logo" />
//                         </a>
//                       </div>
//                       <h1>Vite + React + Hexlet Chat</h1>
//                       <div className="card">
//                         <button onClick={() => setCount((count) => count + 1)}>
//                           count is {count}
//                         </button>
//                         <p>
//                           Edit <code>src/App.jsx</code> and save to test HMR
//                         </p>
//                       </div>
//                       <p className="read-the-docs">
//                         Click on the Vite and React logos to learn more
//                       </p>
//                     </div>
//                     <ChatPage />
//                   </PrivateRoute>
//                 )}
//               />
//               <Route path="/login" element={<LoginPage />} />
//               <Route path="*" element={<NotFoundPage />} />
//             </Routes>
//           </div>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;
