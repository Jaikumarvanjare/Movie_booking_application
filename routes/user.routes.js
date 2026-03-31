const userController = require('../controllers/user.controller');
const userMiddleware = require('../middlewares/user.middlewares');
const authMiddleware = require('../middlewares/auth.middlewares');

const routes = (app) => {
    app.patch(
        '/mba/api/v1/user/:id',
        authMiddleware.isAuthenticated,
        authMiddleware.isAdmin,
        userMiddleware.validateUpdateUserRequest,
        userController.update
    );
};

module.exports = routes;