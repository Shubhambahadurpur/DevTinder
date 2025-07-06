const express = require('express');
const app = express();

app.use('/', (req, res) => {
    res.send("Hello");
})

app.listen(3000, () => {
    console.log("Server is listning on port 3000");
})