const prisma = require('../utils/prismaClient');
const sendMail = require('../services/email.service');
const { STATUS, BOOKING_STATUS, PAYMENT_STATUS, USER_ROLE } = require('../utils/constants');

const createPayment = async (data) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: data.bookingId }
        });

        if (!booking) {
            throw {
                err: 'No booking found',
                code: STATUS.NOT_FOUND
            };
        }

        if (booking.status == BOOKING_STATUS.successfull) {
            throw {
                err: 'Booking already done, cannot make a new payment against it',
                code: STATUS.FORBIDDEN
            };
        }

        const show = await prisma.show.findFirst({
            where: {
                movieId: booking.movieId,
                theatreId: booking.theatreId,
                timing: booking.timing
            }
        });

        if (!show) {
            throw {
                err: 'No show found for this booking',
                code: STATUS.NOT_FOUND
            };
        }

        const bookingTime = new Date(booking.createdAt).getTime();
        const currentTime = Date.now();
        const minutes = Math.floor(((currentTime - bookingTime) / 1000) / 60);

        if (minutes > 5) {
            const expiredBooking = await prisma.booking.update({
                where: { id: booking.id },
                data: {
                    status: BOOKING_STATUS.expired
                }
            });
            return expiredBooking;
        }

        const payment = await prisma.payment.create({
            data: {
                bookingId: data.bookingId,
                amount: Number(data.amount)
            }
        });

        if (Number(payment.amount) !== Number(booking.totalCost)) {
            await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: PAYMENT_STATUS.failed
                }
            });

            const cancelledBooking = await prisma.booking.update({
                where: { id: booking.id },
                data: {
                    status: BOOKING_STATUS.cancelled
                }
            });

            return cancelledBooking;
        }

        let updatedSeatConfiguration = show.seatConfiguration;

        if (show.seatConfiguration && booking.seat) {
            const showSeatConfig = JSON.parse(show.seatConfiguration.replaceAll("'", '"'));
            const bookedSeats = JSON.parse(booking.seat.replaceAll("'", '"'));
            const bookedSeatsMap = {};

            bookedSeats.forEach((seats) => {
                if (!bookedSeatsMap[seats.rowNumber]) {
                    bookedSeatsMap[seats.rowNumber] = new Set();
                }
                bookedSeatsMap[seats.rowNumber].add(seats.seatNumber);
            });

            showSeatConfig.rows.forEach((row) => {
                if (bookedSeatsMap[row.number]) {
                    row.seats = row.seats.map((seat) => {
                        if (bookedSeatsMap[row.number].has(seat.number)) {
                            seat.status = 2;
                        }
                        return seat;
                    });
                }
            });

            updatedSeatConfiguration = JSON.stringify(showSeatConfig).replaceAll('"', "'");
        }

        const updatedBooking = await prisma.$transaction(async (tx) => {
            await tx.payment.update({
                where: { id: payment.id },
                data: {
                    status: PAYMENT_STATUS.success
                }
            });

            await tx.show.update({
                where: { id: show.id },
                data: {
                    noOfSeats: show.noOfSeats - booking.noOfSeats,
                    seatConfiguration: updatedSeatConfiguration
                }
            });

            const updatedBookingRecord = await tx.booking.update({
                where: { id: booking.id },
                data: {
                    status: BOOKING_STATUS.successfull
                }
            });
            return updatedBookingRecord;
        });

        try {
            await sendMail(
                "Movie Booking Confirmed",
                booking.userId,
                `Your booking has been confirmed. Seats booked: ${booking.noOfSeats}`
            );
        } catch (mailError) {
            console.log("Mail sending failed:", mailError.message);
        }

        return updatedBooking;
    } catch (error) {
        console.log(error.message || error);
        throw error;
    }
};

const getPaymentById = async (id) => {
    try {
        const response = await prisma.payment.findUnique({
            where: { id },
            include: {
                booking: true
            }
        });

        if (!response) {
            throw {
                err: 'No payment record found',
                code: STATUS.NOT_FOUND
            };
        }

        return response;
    } catch (error) {
        throw error;
    }
};

const getAllPayments = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw {
                err: 'No user found for the given id',
                code: STATUS.NOT_FOUND
            };
        }

        if (user.userRole == USER_ROLE.admin) {
            return await prisma.payment.findMany({
                include: {
                    booking: true
                }
            });
        }

        const bookings = await prisma.booking.findMany({
            where: {
                userId: user.id
            },
            select: {
                id: true
            }
        });

        const bookingIds = bookings.map(booking => booking.id);

        const payments = await prisma.payment.findMany({
            where: {
                bookingId: {
                    in: bookingIds
                }
            },
            include: {
                booking: true
            }
        });

        return payments;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createPayment,
    getPaymentById,
    getAllPayments
};
           