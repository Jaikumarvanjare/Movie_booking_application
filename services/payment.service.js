const axios = require('axios');
const crypto = require('crypto');
const prisma = require('../utils/prismaClient');
const sendMail = require('../services/email.service');
const { STATUS, BOOKING_STATUS, PAYMENT_STATUS, USER_ROLE } = require('../utils/constants');

const RAZORPAY_BASE_URL = 'https://api.razorpay.com/v1';
const PAYMENT_GATEWAYS = {
    demo: 'DEMO',
    razorpay: 'RAZORPAY'
};

const parseSerializedJson = (value) => {
    if (!value || typeof value !== 'string') {
        return null;
    }

    try {
        return JSON.parse(value.replaceAll("'", '"'));
    } catch (error) {
        return null;
    }
};

const getBookingWithShow = async (bookingId) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
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

        return {
            booking: expiredBooking,
            show,
            isExpired: true
        };
    }

    return {
        booking,
        show,
        isExpired: false
    };
};

const validatePaymentAmount = (booking, amount) => {
    if (Number(amount) !== Number(booking.totalCost)) {
        throw {
            err: 'Payment amount does not match booking total cost',
            code: STATUS.BAD_REQUEST
        };
    }
};

const buildUpdatedSeatConfiguration = (show, booking) => {
    let updatedSeatConfiguration = show.seatConfiguration;

    if (show.seatConfiguration && booking.seat) {
        const showSeatConfig = parseSerializedJson(show.seatConfiguration);
        const bookedSeats = parseSerializedJson(booking.seat);

        if (!showSeatConfig?.rows || !Array.isArray(bookedSeats)) {
            return updatedSeatConfiguration;
        }

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

    return updatedSeatConfiguration;
};

const sendBookingConfirmation = async (booking) => {
    try {
        await sendMail(
            "Movie Booking Confirmed",
            booking.userId,
            `Your booking has been confirmed. Seats booked: ${booking.noOfSeats}`
        );
    } catch (mailError) {
        console.log("Mail sending failed:", mailError.message);
    }
};

const upsertPaymentRecord = async (bookingId, data) => {
    const existingPayment = await prisma.payment.findUnique({
        where: { bookingId }
    });

    if (existingPayment) {
        return prisma.payment.update({
            where: { bookingId },
            data
        });
    }

    return prisma.payment.create({
        data: {
            bookingId,
            ...data
        }
    });
};

const markBookingCancelled = async (bookingId, paymentId) => {
    await prisma.$transaction(async (tx) => {
        if (paymentId) {
            await tx.payment.update({
                where: { id: paymentId },
                data: {
                    status: PAYMENT_STATUS.failed
                }
            });
        }

        await tx.booking.update({
            where: { id: bookingId },
            data: {
                status: BOOKING_STATUS.cancelled
            }
        });
    });
};

const finalizeSuccessfulPayment = async (booking, show, payment) => {
    const updatedSeatConfiguration = buildUpdatedSeatConfiguration(show, booking);

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

        return tx.booking.update({
            where: { id: booking.id },
            data: {
                status: BOOKING_STATUS.successfull
            }
        });
    });

    await sendBookingConfirmation(booking);
    return updatedBooking;
};

const getRazorpayCredentials = () => {
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.KEY_SECRET;

    if (!keyId || !keySecret) {
        throw {
            err: 'Razorpay credentials are not configured on the backend',
            code: STATUS.INTERNAL_SERVER_ERROR
        };
    }

    return {
        keyId,
        keySecret
    };
};

const createPayment = async (data) => {
    try {
        const { booking, show, isExpired } = await getBookingWithShow(data.bookingId);

        if (isExpired) {
            return booking;
        }

        const payment = await upsertPaymentRecord(data.bookingId, {
            amount: Number(data.amount),
            gateway: PAYMENT_GATEWAYS.demo,
            currency: 'INR',
            status: PAYMENT_STATUS.pending,
            orderId: null,
            paymentId: null
        });

        if (Number(payment.amount) !== Number(booking.totalCost)) {
            await markBookingCancelled(booking.id, payment.id);
            return prisma.booking.findUnique({
                where: { id: booking.id }
            });
        }

        return finalizeSuccessfulPayment(booking, show, payment);
    } catch (error) {
        console.log(error.message || error);
        throw error;
    }
};

const createRazorpayOrder = async (data) => {
    let booking = null;

    try {
        const response = await getBookingWithShow(data.bookingId);
        booking = response.booking;

        if (response.isExpired) {
            throw {
                err: 'Booking expired before Razorpay order creation',
                code: STATUS.GONE,
                data: response.booking
            };
        }

        validatePaymentAmount(booking, data.amount);
        const { keyId, keySecret } = getRazorpayCredentials();
        const razorpayResponse = await axios.post(
            `${RAZORPAY_BASE_URL}/orders`,
            {
                amount: Math.round(Number(data.amount) * 100),
                currency: 'INR',
                receipt: `booking_${booking.id}`,
                notes: {
                    bookingId: booking.id
                }
            },
            {
                auth: {
                    username: keyId,
                    password: keySecret
                }
            }
        );

        await upsertPaymentRecord(booking.id, {
            amount: Number(data.amount),
            status: PAYMENT_STATUS.pending,
            gateway: PAYMENT_GATEWAYS.razorpay,
            orderId: razorpayResponse.data.id,
            paymentId: null,
            currency: razorpayResponse.data.currency || 'INR'
        });

        return razorpayResponse.data;
    } catch (error) {
        console.log(error.response?.data || error.message || error);

        if (booking && booking.status === BOOKING_STATUS.processing && error.code !== STATUS.GONE) {
            await prisma.booking.update({
                where: { id: booking.id },
                data: {
                    status: BOOKING_STATUS.cancelled
                }
            });
        }

        if (error.response?.data?.error?.description) {
            throw {
                err: error.response.data.error.description,
                code: error.response.status || STATUS.BAD_REQUEST
            };
        }
        throw error;
    }
};

const verifyRazorpayPayment = async (data) => {
    let booking = null;

    try {
        const response = await getBookingWithShow(data.bookingId);
        booking = response.booking;
        const show = response.show;

        if (response.isExpired) {
            throw {
                err: 'Booking expired before payment verification',
                code: STATUS.GONE,
                data: response.booking
            };
        }

        validatePaymentAmount(booking, data.amount);
        const { keyId, keySecret } = getRazorpayCredentials();
        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${data.razorpayOrderId}|${data.razorpayPaymentId}`)
            .digest('hex');

        if (expectedSignature !== data.razorpaySignature) {
            const failedPayment = await upsertPaymentRecord(booking.id, {
                amount: Number(data.amount),
                status: PAYMENT_STATUS.failed,
                gateway: PAYMENT_GATEWAYS.razorpay,
                orderId: data.razorpayOrderId,
                paymentId: data.razorpayPaymentId,
                currency: 'INR'
            });

            await markBookingCancelled(booking.id, failedPayment.id);
            throw {
                err: 'Razorpay signature verification failed',
                code: STATUS.BAD_REQUEST
            };
        }

        const paymentDetailsResponse = await axios.get(
            `${RAZORPAY_BASE_URL}/payments/${data.razorpayPaymentId}`,
            {
                auth: {
                    username: keyId,
                    password: keySecret
                }
            }
        );

        const paymentDetails = paymentDetailsResponse.data;
        if (paymentDetails.order_id !== data.razorpayOrderId) {
            throw {
                err: 'Razorpay order id does not match the payment',
                code: STATUS.BAD_REQUEST
            };
        }

        if (!['authorized', 'captured'].includes(paymentDetails.status)) {
            throw {
                err: 'Razorpay payment is not authorized for booking confirmation',
                code: STATUS.BAD_REQUEST
            };
        }

        if (Number(paymentDetails.amount) !== Math.round(Number(data.amount) * 100)) {
            throw {
                err: 'Razorpay payment amount does not match booking total cost',
                code: STATUS.BAD_REQUEST
            };
        }

        const payment = await upsertPaymentRecord(booking.id, {
            amount: Number(data.amount),
            status: PAYMENT_STATUS.pending,
            gateway: PAYMENT_GATEWAYS.razorpay,
            orderId: data.razorpayOrderId,
            paymentId: data.razorpayPaymentId,
            currency: paymentDetails.currency || 'INR'
        });

        return finalizeSuccessfulPayment(booking, show, payment);
    } catch (error) {
        console.log(error.response?.data || error.message || error);

        if (booking && booking.status === BOOKING_STATUS.processing && error.code !== STATUS.GONE) {
            await prisma.booking.update({
                where: { id: booking.id },
                data: {
                    status: BOOKING_STATUS.cancelled
                }
            });
        }

        if (error.response?.data?.error?.description) {
            throw {
                err: error.response.data.error.description,
                code: error.response.status || STATUS.BAD_REQUEST
            };
        }
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
    createRazorpayOrder,
    verifyRazorpayPayment,
    getPaymentById,
    getAllPayments
};
           
