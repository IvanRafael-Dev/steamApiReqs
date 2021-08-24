const express = require('express');
const rescue = require('express-rescue');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const controller = require('./App/controllers');
const service = require('./App/services/Games');
const model = require('./App/models/Games')
const PORT = 3000;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get('/', rescue(controller.getAll));

app.get('/favorite', rescue(controller.getUserFavorites))

app.post('/favorite', rescue(controller.newFavorite));

app.delete('/favorite/:appid', rescue(controller.deleteUserFavorite));

app.get('/:id', rescue(controller.findById));

app.use((err, _req, res, _next) => {
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
