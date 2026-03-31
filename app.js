const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const movieRoutes = require('./routes/movie.routes');
const theatreRoutes = require('./routes/theatre.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const bookingRoutes = require('./routes/booking.routes');
const showRoutes = require('./routes/show.routes');
const paymentRoutes = require('./routes/payment.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

movieRoutes(app);
theatreRoutes(app);
authRoutes(app);
userRoutes(app);
bookingRoutes(app);
showRoutes(app);
paymentRoutes(app);
notificationRoutes(app);

app.get('/', (req, res) => {
    res.send('Home');
});

module.exports = app;