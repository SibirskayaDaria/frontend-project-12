// getAuthHeader.js
const getAuthHeader = () => {
  try {
    const userId = JSON.parse(localStorage.getItem('userId'));
    if (userId && userId.token) {
      return { Authorization: `Bearer ${userId.token}` };
    }
  } catch (e) {
    console.error('Error parsing userId from localStorage', e);
  }
  return {};
};

export default getAuthHeader; // Экспорт по умолчанию
