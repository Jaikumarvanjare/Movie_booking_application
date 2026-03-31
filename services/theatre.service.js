const prisma = require('../utils/prismaClient');
const { STATUS } = require('../utils/constants');

const createTheatre = async (data) => {
    try {
        const response = await prisma.theatre.create({
            data: {
                name: data.name,
                description: data.description,
                city: data.city,
                pincode: Number(data.pincode),
                address: data.address,
                movieIds: data.movieIds || [],
                ownerId: data.owner
            }
        });

        return {
            ...response,
            movies: response.movieIds
        };
    } catch (error) {
        throw error;
    }
};

const deleteTheatre = async (id) => {
    try {
        const existingTheatre = await prisma.theatre.findUnique({
            where: { id }
        });

        if (!existingTheatre) {
            throw {
                err: "No record of a theatre found for given id",
                code: STATUS.NOT_FOUND
            };
        }

        return await prisma.theatre.delete({
            where: { id }
        });
    } catch (error) {
        throw error;
    }
};

const getTheatre = async (id) => {
    try {
        const response = await prisma.theatre.findUnique({
            where: { id }
        });

        if (!response) {
            throw {
                err: "No theatre found for the given id",
                code: STATUS.NOT_FOUND
            };
        }

        return {
            ...response,
            movies: response.movieIds
        };
    } catch (error) {
        throw error;
    }
};

const getAllTheatre = async (data) => {
    try {
        let query = {};
        let pagination = {};

        if (data && data.city) query.city = data.city;
        if (data && data.pincode) query.pincode = Number(data.pincode);
        if (data && data.name) query.name = data.name;
        if (data && data.movieId) query.movieIds = { has: data.movieId };

        if (data && data.limit) pagination.take = Number(data.limit);
        if (data && data.skip) {
            let perPage = data.limit ? Number(data.limit) : 3;
            pagination.skip = Number(data.skip) * perPage;
        }

        const response = await prisma.theatre.findMany({
            where: query,
            ...pagination
        });

        return response.map(theatre => ({
            ...theatre,
            movies: theatre.movieIds
        }));
    } catch (error) {
        throw error;
    }
};

const updateTheatre = async (id, data) => {
    try {
        const existingTheatre = await prisma.theatre.findUnique({
            where: { id }
        });

        if (!existingTheatre) {
            throw {
                err: "No theatre found for the given id",
                code: STATUS.NOT_FOUND
            };
        }

        let updateData = { ...data };
        if (updateData.pincode) {
            updateData.pincode = Number(updateData.pincode);
        }

        const response = await prisma.theatre.update({
            where: { id },
            data: updateData
        });

        return {
            ...response,
            movies: response.movieIds
        };
    } catch (error) {
        throw error;
    }
};

const updateMoviesInTheatre = async (theatreId, moviesIds, insert) => {
    try {
        const theatre = await prisma.theatre.findUnique({
            where: { id: theatreId }
        });

        if (!theatre) {
            throw {
                err: "No theatre found for the given id",
                code: STATUS.NOT_FOUND
            };
        }

        let updatedMovieIds = [...theatre.movieIds];

        if (insert) {
            updatedMovieIds = [...new Set([...updatedMovieIds, ...moviesIds])];
        } else {
            updatedMovieIds = updatedMovieIds.filter(id => !moviesIds.includes(id));
        }

        const updatedTheatre = await prisma.theatre.update({
            where: { id: theatreId },
            data: {
                movieIds: updatedMovieIds
            }
        });

        const movies = await prisma.movie.findMany({
            where: {
                id: {
                    in: updatedTheatre.movieIds
                }
            }
        });

        return {
            ...updatedTheatre,
            movies
        };
    } catch (error) {
        throw error;
    }
};

const getMoviesInTheatre = async (id) => {
    try {
        const theatre = await prisma.theatre.findUnique({
            where: { id }
        });

        if (!theatre) {
            throw {
                err: "No theatre with given id",
                code: STATUS.NOT_FOUND
            };
        }

        const movies = await prisma.movie.findMany({
            where: {
                id: {
                    in: theatre.movieIds
                }
            }
        });

        return {
            id: theatre.id,
            name: theatre.name,
            address: theatre.address,
            movies
        };
    } catch (error) {
        throw error;
    }
};

const checkMovieInATheatre = async (theatreId, movieId) => {
    try {
        const response = await prisma.theatre.findUnique({
            where: { id: theatreId }
        });

        if (!response) {
            throw {
                err: "No such theatre found for the given id",
                code: STATUS.NOT_FOUND
            };
        }

        return response.movieIds.includes(movieId);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createTheatre,
    deleteTheatre,
    getTheatre,
    getAllTheatre,
    updateTheatre,
    updateMoviesInTheatre,
    getMoviesInTheatre,
    checkMovieInATheatre
};