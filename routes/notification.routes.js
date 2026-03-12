const notificationController = require('../controllers/notification.controller');

const routes = (app) => {

    app.post(
        '/notiservice/api/v1/notifications',
        notificationController.create
    )

}

module.exports = routes;