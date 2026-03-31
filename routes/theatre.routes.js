const theatreController = require('../controllers/theatre.controller');
const theatreMiddleware = require('../middlewares/theatre.middlewares');
const authMiddleware = require('../middlewares/auth.middlewares');

const routes = (app) => {
    app.post(
        '/mba/api/v1/theatres',
        authMiddleware.isAuthenticated,
        authMiddleware.isAdminOrClient,
        theatreMiddleware.validateTheatreCreateRequest,
        theatreController.createTheatre
    );

    app.delete(
        '/mba/api/v1/theatres/:id',
        authMiddleware.isAuthenticated,
        authMiddleware.isAdminOrClient,
        theatreController.deleteTheatre
    );

    app.get(
        '/mba/api/v1/theatres/:id',
        theatreController.getTheatre
    );

    app.get(
        '/mba/api/v1/theatres',
        theatreController.getTheatres
    );

    app.patch(
        '/mba/api/v1/theatres/:id',
        authMiddleware.isAuthenticated,
        authMiddleware.isAdminOrClient,
        theatreController.updateTheatre
    );

    app.put(
        '/mba/api/v1/theatres/:id',
        authMiddleware.isAuthenticated,
        authMiddleware.isAdminOrClient,
        theatreController.updateTheatre
    );

    app.patch(
        '/mba/api/v1/theatres/:id/movies',
        authMiddleware.isAuthenticated,
        authMiddleware.isAdminOrClient,
        theatreMiddleware.validateUpdateMovies,
        theatreController.updateMovies
    );

    app.get(
        '/mba/api/v1/theatres/:id/movies',
        theatreController.getMovies
    );

    app.get(
        '/mba/api/v1/theatres/:theatreId/movies/:movieId',
        theatreController.checkMovie
    );
};

module.exports = routes;