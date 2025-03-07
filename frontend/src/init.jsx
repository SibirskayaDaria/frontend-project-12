// import React from 'react';
// import { Provider } from 'react-redux';
// import { io } from 'socket.io-client';
// import i18next from 'i18next';
// import { I18nextProvider, initReactI18next } from 'react-i18next';
// import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
// import LeoProfanity from 'leo-profanity';
// import  resources  from 'i18next';
// import App from './components/App.jsx';
// import resources from './locales/index.js';
// import store from './slices/index.js';
// import ChatApiProvider from './contexts/ChatApiProvider.jsx';
// import AuthProvider from './contexts/AuthProvider.jsx';

// const userLanguage = localStorage.getItem('userLanguage');
// const DEFAULT_LANGUAGE = userLanguage ?? 'ru';

// const i18n = i18next.createInstance();



// const Init = async () => {
//   const rollbarConfig = {
//     accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
//     payload: {
//       environment: 'production',
//     },
//     captureUncaught: true,
//     captureUnhandledRejections: true,
//   };

//   const i18n = i18next.createInstance();
//     await i18n
//     .use(initReactI18next)
//     .init({
//       resources,
//       fallbackLng: 'ru',
//     });

//   profanityFilter
//     .add(profanityFilter.getDictionary('ru'), profanityFilter.getDictionary('en'));

//   const socket = io('/', { autoConnect: false });

//   return (
//     <RollbarProvider config={rollbarConfig}>
//       <ErrorBoundary>
//         <I18nextProvider i18n={i18n}>
//           <Provider store={store}>
//             <AuthProvider>
//               <ChatApiProvider socket={socket}>
//                 <App />
//               </ChatApiProvider>
//             </AuthProvider>
//           </Provider>
//         </I18nextProvider>
//       </ErrorBoundary>
//     </RollbarProvider>
//   );
// };

// export default Init;