const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Index World');
});

app.get('/api', (req, res) => {
    res.send('Hello World');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
