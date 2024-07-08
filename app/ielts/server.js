const express = require('express');
const bodyParser = require('body-parser');
const heygen = require('./heygen');

const app = express();
app.use(bodyParser.json());

app.get('/avatars', async (req, res) => {
  try {
    const avatars = await heygen.listAvatars();
    res.json(avatars);
  } catch (error) {
    res.status(500).send('Error fetching avatars');
  }
});

app.get('/voices', async (req, res) => {
  try {
    const voices = await heygen.listVoices();
    res.json(voices);
  } catch (error) {
    res.status(500).send('Error fetching voices');
  }
});

app.post('/generate-video', async (req, res) => {
  const { text, avatarId, voiceId } = req.body;
  
  try {
    const video = await heygen.generateVideo(avatarId, voiceId, text);
    res.json(video);
  } catch (error) {
    res.status(500).send('Error generating video');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
