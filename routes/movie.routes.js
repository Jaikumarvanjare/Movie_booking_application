const movieController = require('../controllers/movie.controller');
const movieMiddlewares = require('../middlewares/movie.middlewares');
const authMiddlewares = require('../middlewares/auth.middlewares');

const routes = (app) => {
    app.post(
        '/mba/api/v1/movies',
        authMiddlewares.isAuthenticated,
        authMiddlewares.isAdminOrClient,
        movieMiddlewares.validateMovieCreateRequest,
        movieController.createMovie
    );

    app.delete(
        '/mba/api/v1/movies/:id',
        authMiddlewares.isAuthenticated,
        authMiddlewares.isAdminOrClient,
        movieController.deleteMovie
    );

    app.get(
        '/mba/api/v1/movies/:id',
        movieController.getMovie
    );

    app.put(
        '/mba/api/v1/movies/:id',
        authMiddlewares.isAuthenticated,
        authMiddlewares.isAdminOrClient,
        movieController.updateMovie
    );

    app.patch(
        '/mba/api/v1/movies/:id',
        authMiddlewares.isAuthenticated,
        authMiddlewares.isAdminOrClient,
        movieController.updateMovie
    );

    app.get(
        '/mba/api/v1/movies',
        movieController.getMovies
    );
};

module.exports = routes;