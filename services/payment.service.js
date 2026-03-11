const Payment = require('../models/payment.model');
const Booking = require('../models/booking.model');
const { STATUS, BOOKING_STATUS, PAYMENT_STATUS } = require('../utils/constants');

const createPayment = async (data) => {
    try {
        const booking = await Booking.findById(data.bookingId);
        if(!booking){
            throw {
                err: 'No booking found',
                code: STATUS.NOT_FOUND
            }
        }
        // prevent duplicate payment
        if(booking.status === BOOKING_STATUS.successfull){
            throw {
                err: 'Booking already done, cannot make a new payment against it',
                code: STATUS.FORBIDDEN
            }
        }
        // check expiry
        const minutes = (Date.now() - booking.createdAt) / 60000;
        if(minutes > 5){
            booking.status = BOOKING_STATUS.expired;
            await booking.save();
            return booking;
        }
        // create payment
        const payment = await Payment.create({
            bookingId: data.bookingId,
            amount: data.amount
        });
        // amount mismatch
        if(payment.amount !== booking.totalCost){
            payment.status = PAYMENT_STATUS.failed;
            booking.status = BOOKING_STATUS.cancelled;
            await payment.save();
            await booking.save();

            return booking;
        }
        // success case
        payment.status = PAYMENT_STATUS.success;
        booking.status = BOOKING_STATUS.successfull;
        await payment.save();
        await booking.save();
        return payment;
    } catch(error){
        console.log(error);
        throw error;
    }
}

const getPaymentById = async (id) => {
    try {
        const response = await Payment.findById(id).populate('booking');
        if(!response){
            throw {
                err: 'No payment record found',
                code: STATUS.NOT_FOUND
            }
        }
        return response;
    } catch(error){
        console.log(error);
        throw error;
    }
}

module.exports = {
    createPayment,
    getPaymentById
}