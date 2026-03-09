const theatreController = require('../controllers/theatre.controller');
const theatreMiddleware = require('../middlewares/theatre.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const routes = (app) =>{
     //routes function takes express app object as parameter

     //CREATE
    app.post(
        '/mba/api/v1/theatres',
        authMiddleware.isAuthenticated,
        theatreMiddleware.validateTheatreCreateRequest,
        theatreController.createTheatre
     );

     //DELETE     
     app.delete(
          '/mba/api/v1/theatres/:id',
          authMiddleware.isAuthenticated,
          theatreController.deleteTheatre
     );

     //READ
     app.get(
          '/mba/api/v1/theatres/:id',
          theatreController.getTheatre
     );

     //READ
     app.get(
          '/mba/api/v1/theatres',
          theatreController.getTheatres
     );
     
     //UPDATE
     app.patch(
          '/mba/api/v1/theatres/:id',
          authMiddleware.isAuthenticated,
          theatreController.updateTheatre
     );

     //UPDATE
     app.put(
          '/mba/api/v1/theatres/:id',
          authMiddleware.isAuthenticated,
          theatreController.updateTheatre
     );
     
     //UPDATE
     app.patch(
          '/mba/api/v1/theatres/:id/movies',  
          authMiddleware.isAuthenticated,
          theatreMiddleware.validateUpdateMovies,
          theatreController.updateMovies
     );
     //GET
     app.get(
          '/mba/api/v1/theatres/:id/movies',
          theatreController.getMovies
     );

     //GET
     app.get(
          '/mba/api/v1/theatres/:theatreId/movies/:movieId',
          theatreController.checkMovie
     );
}

module.exports = routes;
 