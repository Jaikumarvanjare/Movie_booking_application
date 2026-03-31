const prisma = require('../utils/prismaClient');
const { STATUS } = require('../utils/constants');

const createBooking = async (data) => {
    try {
        const show = await prisma.show.findFirst({
            where: {
                movieId: data.movieId,
                theatreId: data.theatreId,
                timing: new Date(data.timing)
            }
        });

        if (!show) {
            throw {
                err: "No show found for given movie, theatre and timing",
                code: STATUS.NOT_FOUND
            };
        }

        if (show.noOfSeats < Number(data.noOfSeats)) {
            throw {
                err: "Not enough seats available",
                code: STATUS.BAD_REQUEST
            };
        }

        data.totalCost = Number(data.noOfSeats) * show.price;

        const response = await prisma.booking.create({
            data: {
                theatreId: data.theatreId,
                movieId: data.movieId,
                userId: data.userId,
                timing: new Date(data.timing),
                noOfSeats: Number(data.noOfSeats),
                totalCost: data.totalCost,
                status: data.status,
                seat: data.seat
            }
        });

        return response;
    } catch (error) {
        throw error;
    }
};

const updateBooking = async (data, bookingId) => {
    try {
        const existingBooking = await prisma.booking.findUnique({
            where: { id: bookingId }
        });

        if (!existingBooking) {
            throw {
                err: "No booking found for the given id",
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
        if (updateData.totalCost) {
            updateData.totalCost = Number(updateData.totalCost);
        }

        const response = await prisma.booking.update({
            where: { id: bookingId },
            data: updateData
        });

        return response;
    } catch (error) {
        throw error;
    }
};

const getBookings = async (data) => {
    try {
        const response = await prisma.booking.findMany({
            where: data
        });
        return response;
    } catch (error) {
        throw error;
    }
};

const getAllBookings = async () => {
    try {
        const response = await prisma.booking.findMany();
        return response;
    } catch (error) {
        throw error;
    }
};

const getBookingById = async (id, userId) => {
    try {
        const response = await prisma.booking.findUnique({
            where: { id }
        });

        if (!response) {
            throw {
                err: 'No booking records found for the id',
                code: STATUS.NOT_FOUND
            };
        }

        if (response.userId !== userId) {
            throw {
                err: 'Not able to access the booking',
                code: STATUS.UNAUTHORISED
            };
        }

        return response;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createBooking,
    updateBooking,
    getBookings,
    getAllBookings,
    getBookingById
};