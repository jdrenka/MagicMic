
// MagicMic Server
// Author: Justin Drenka -> jpdrenka@gmail.com

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const OPENAI_API_KEY = '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';
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json());

//Gets 
app.get('/', (req, res) => {
  res.redirect('Client/index.html');
});

//Posts

app.post('/send-message', async (req, res) => {
  const { messages } = req.body;

  try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages,
              temperature: 0.7
          }),
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
          // Send the first choice's message back to the client
          res.json({answer: data.choices[0].message.content});
      } else {
          res.status(500).send('No response from OpenAI');
      }
  } catch (error) {
      console.error('Error calling OpenAI API:', error);
      res.status(500).send('Failed to fetch response from OpenAI');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
