require('dotenv').config();
const express = require('express');

const app = express();

app.set('port', process.env.PORT);
app.get('/', (req, res) => {
    res.json({
        message: 'js bot'
    })
});

app.listen(process.env.PORT, () => {
    console.log('Server is working')
})


