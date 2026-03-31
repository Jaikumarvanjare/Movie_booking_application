const prisma = require('../utils/prismaClient');
const { STATUS } = require('../utils/constants');

const createShow = async (data) => {
    try {
        const theatre = await prisma.theatre.findUnique({
            where: { id: data.theatreId }
        });

        if (!theatre) {
            throw {
                err: 'No theatre found',
                code: STATUS.NOT_FOUND
            };
        }

        if (!theatre.movieIds.includes(data.movieId)) {
            throw {
                err: 'Movie is currently not available in the requested theatre',
                code: STATUS.NOT_FOUND
            };
        }

        const response = await prisma.show.create({
            data: {
                theatreId: data.theatreId,
                movieId: data.movieId,
                timing: new Date(data.timing),
                noOfSeats: Number(data.noOfSeats),
                seatConfiguration: data.seatConfiguration,
                price: Number(data.price),
                format: data.format
            }
        });

        return response;
    } catch (error) {
        throw error;
    }
};

const getShows = async (data) => {
    try {
        let filter = {};

        if (data.theatreId) {
            filter.theatreId = data.theatreId;
        }
        if (data.movieId) {
            filter.movieId = data.movieId;
        }

        const response = await prisma.show.findMany({
            where: filter,
            include: {
                theatre: true
            }
        });

        if (response.length === 0) {
            throw {
                err: 'No shows found',
                code: STATUS.NOT_FOUND
            };
        }

        return response;
    } catch (error) {
        throw error;
    }
};

const deleteShow = async (id) => {
    try {
        const existingShow = await prisma.show.findUnique({
            where: { id }
        });

        if (!existingShow) {
            throw {
                err: 'No show found',
                code: STATUS.NOT_FOUND
            };
        }

        return await prisma.show.delete({
            where: { id }
        });
    } catch (error) {
        throw error;
    }
};

const updateShow = async (data, showId) => {
    try {
        const existingShow = await prisma.show.findUnique({
            where: { id: showId }
        });

        if (!existingShow) {
            throw {
                err: "No show found for the given id",
                code: STATUS.NOT_FOUND
            };
        }

        let updateData = { ...data };
        if (updateData.timing) {
            updateData.timing = new Date(updateData.timing);
        }
        if (updateData.noOfSeats) {
            updateData.noOfSeats = Number(updateData.noOfSeats);
        }
        if (updateData.price) {
            updateData.price = Number(updateData.price);
        }

        const response = await prisma.show.update({
            where: { id: showId },
            data: updateData
        });

        return response;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createShow,
    getShows,
    deleteShow,
    updateShow
};