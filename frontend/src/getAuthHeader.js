// getAuthHeader.js

export default function getAuthHeader() {
  const token = localStorage.getItem('token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}
