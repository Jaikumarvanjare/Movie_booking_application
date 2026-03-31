const prisma = require('../utils/prismaClient');
const { STATUS } = require('../utils/constants');

const createMovie = async (data) => {
    try {
        const movie = await prisma.movie.create({
            data: {
                name: data.name,
                description: data.description,
                casts: data.casts,
                trailerUrl: data.trailerUrl,
                language: data.language,
                releaseDate: new Date(data.releaseDate),
                director: data.director,
                releaseStatus: data.releaseStatus || "UPCOMING",
                poster: data.poster
            }
        });
        return movie;
    } catch (error) {
        throw error;
    }
};

const deleteMovie = async (id) => {
    try {
        const existingMovie = await prisma.movie.findUnique({
            where: { id }
        });

        if (!existingMovie) {
            throw {
                err: "No movie found for the corresponding id provided",
                code: STATUS.NOT_FOUND
            };
        }

        const movie = await prisma.movie.delete({
            where: { id }
        });

        return movie;
    } catch (error) {
        throw error;
    }
};

const getMoviById = async (id) => {
    const movie = await prisma.movie.findUnique({
        where: { id }
    });

    if (!movie) {
        throw {
            err: "No movie found for the corresponding id provided",
            code: STATUS.NOT_FOUND
        };
    }
    return movie;
};

const updateMovie = async (id, data) => {
    try {
        const existingMovie = await prisma.movie.findUnique({
            where: { id }
        });

        if (!existingMovie) {
            throw {
                err: "No movie found for the corresponding id provided",
                code: STATUS.NOT_FOUND
            };
        }

        let updateData = { ...data };
        if (updateData.releaseDate) {
            updateData.releaseDate = new Date(updateData.releaseDate);
        }

        const movie = await prisma.movie.update({
            where: { id },
            data: updateData
        });

        return movie;
    } catch (error) {
        throw error;
    }
};

const fetchMovies = async (filter) => {
    let query = {};

    if (filter.name) {
        query.name = filter.name;
    }

    const movies = await prisma.movie.findMany({
        where: query
    });

    if (movies.length === 0) {
        throw {
            err: 'Not able to find the queries',
            code: STATUS.NOT_FOUND
        };
    }

    return movies;
};

module.exports = {
    createMovie,
    deleteMovie,
    getMoviById,
    updateMovie,
    fetchMovies
};