import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Проверяем учетные данные
  if (username === 'admin' && password === 'admin') {
    // Если учетные данные верные, возвращаем объект с токеном и именем пользователя
    res.json({ token: 'ваш_токен', username: 'admin' });
  } else {
    // Если учетные данные неверные, возвращаем ошибку
    res.status(401).json({ error: 'Неверные учетные данные' });
  }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
