import { useTranslation } from 'react-i18next';
import notFoundImagePath from '../../assets/notFound.jpg';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <img src={notFoundImagePath} alt={t('notFound.alt')} className="img-fluid h-25" />
      <h1 className="h4 text-muted">{t('notFound.title')}</h1>
      <p className="text-muted">
        {t('notFound.message')}{' '}
        <a href="/">{t('notFound.homeLink')}</a>
      </p>
    </div>
  );
};

export default NotFoundPage;
