const env = require('dotenv');
const app = require('./app');

env.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Server started on Port ${PORT} !!`);
});