const userController = require('../controllers/user.controller');
const userMiddleware = require('../middlewares/user.middlewares');
const authMiddleware = require('../middlewares/auth.middlewares');

const routes = (app) => {
    app.get(
        '/mba/api/v1/users/me',
        authMiddleware.isAuthenticated,
        userController.getProfile
    );
    app.get(
        '/mba/api/v1/users',
        authMiddleware.isAuthenticated,
        authMiddleware.isAdmin,
        userController.getUsers
    );
    app.patch(
        '/mba/api/v1/users/me',
        authMiddleware.isAuthenticated,
        userMiddleware.validateUpdateProfileRequest,
        userController.updateProfile
    );
    app.patch(
        '/mba/api/v1/user/:id',
        authMiddleware.isAuthenticated,
        authMiddleware.isAdmin,
        userMiddleware.validateUpdateUserRequest,
        userController.update
    );
};

module.exports = routes;
