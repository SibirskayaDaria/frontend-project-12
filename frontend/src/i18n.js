import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import en from './locales/en';
import ru from './locales/ru';

i18next.init({
  lng: 'ru', // Устанавливаем язык по умолчанию
  resources: {
    en: en,
    ru: ru,
  },
  interpolation: {
    escapeValue: false, // Для React не нужно экранировать
  },
});

function App() {
  return (
    <I18nextProvider i18n={i18next}>
      <YourComponent />
    </I18nextProvider>
  );
}

export default App;
