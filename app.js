const express = require('express');
const jwt = require('jsonwebtoken');
// https://www.youtube.com/watch?v=cL3bXzUBFUA

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api', (req, res) => {
  res.json({
    message: 'Nodejs and JWT',
  });
});

app.post('/api/login', (req, res) => {
  const user = {
    id: 1,
    name: 'Oscar',
    email: 'oscar@example',
  };

  jwt.sign({ user }, 'secretKey', (err, token) => {
    // ? { expiresIn: '1 day' }  https://github.com/auth0/node-jsonwebtoken#readme
    res.json({
      token,
    });
  });
});

// Authorization: Bearer <token>
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretKey', (error, authData) => {
    if (error) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post has been created',
        authData,
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
