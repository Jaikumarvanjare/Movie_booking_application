const Payment = require('../models/payment.model');
const Booking = require('../models/booking.model');
const Show = require('../models/show.model');
const User = require('../models/user.model');

const { STATUS, BOOKING_STATUS, PAYMENT_STATUS, USER_ROLE } = require('../utils/constants');

const createPayment = async (data) => {
    try {
        const booking = await Booking.findById(data.bookingId);
        if(!booking){
            throw {
                err: 'No booking found',
                code: STATUS.NOT_FOUND
            }
        }
        if(booking.status !== BOOKING_STATUS.processing){
            throw {
                err: "Booking already processed",
                code: STATUS.BAD_REQUEST
            }
        }
        const existingPayment = await Payment.findOne({
            booking: data.bookingId,
            status: PAYMENT_STATUS.success
        });
        if(existingPayment){
            throw {
                err: "Payment already completed",
                code: STATUS.BAD_REQUEST
            }
        }
        const show = await Show.findOne({
            movieId: booking.movieId,
            theatreId: booking.theatreId,
            timing: booking.timing
        });
        if(!show){
            throw {
                err: "No show found",
                code: STATUS.NOT_FOUND
            }
        }
        if(show.noOfSeats < booking.noOfSeats){
            throw {
                err: "Not enough seats available",
                code: STATUS.BAD_REQUEST
            }
        }
        let minutes = Math.floor((Date.now() - booking.createdAt) / 60000);
        if(minutes > 5){
            booking.status = BOOKING_STATUS.expired;
            await booking.save();
            return booking;
        }
        const payment = await Payment.create({
            booking: data.bookingId,
            amount: data.amount
        });
        if(payment.amount !== booking.totalCost){
            payment.status = PAYMENT_STATUS.failed;
            booking.status = BOOKING_STATUS.cancelled;
            await booking.save();
            await payment.save();
            return booking;
        }
        payment.status = PAYMENT_STATUS.success;
        booking.status = BOOKING_STATUS.successfull;
        show.noOfSeats -= booking.noOfSeats;
        await show.save();
        await booking.save();
        await payment.save();
        return booking;
    } catch(error){
        console.log(error);
        throw error;
    }
}

const getPaymentById = async (id) => {
    try {
        const response = await Payment.findById(id).populate('booking');
        if(!response) {
            throw {
                err: 'No payment record found',
                code: STATUS.NOT_FOUND
            }
        }
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getAllPayments = async (userId) => {
    try {
        const user = await User.findById(userId);
        let filter = {};
        if(user.userRole != USER_ROLE.admin) {
            filter.userId = user.id;
        }
        const bookings = await Booking.find(filter, '_id');
        const bookingIds = bookings.map(b => b._id);
        const payments = await Payment.find({
            booking: { $in: bookingIds }
        });
        return payments;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    createPayment,
    getPaymentById,
    getAllPayments
}