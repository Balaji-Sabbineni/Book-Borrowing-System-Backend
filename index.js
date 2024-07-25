const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
    console.log(`Connected to port at ${port}`);
});