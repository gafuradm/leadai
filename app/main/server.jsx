const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'Yandex',
  auth: {
    user: 'gafadm@yandex.ru',
    pass: 'admin09!?'
  }
});

app.post('/api/send-feedback', (req, res) => {
  const { rating, comment } = req.body;

  const mailOptions = {
    from: 'gafadm@yandex.ru',
    to: 'gafur.adm09adm@yandex.ru',
    subject: 'Новый отзыв о тесте IELTS',
    text: `Рейтинг: ${rating}/5\nКомментарий: ${comment}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Ошибка при отправке отзыва');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Отзыв успешно отправлен');
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});