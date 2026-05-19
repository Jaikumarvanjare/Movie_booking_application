const env = require('../config/env');
const axios = require('axios');
const userService = require('../services/user.service');

const postNotification = async (path, payload) => {
    try {
        const response = await axios.post(
            `${env.NOTI_SERVICE}${path}`,
            payload,
            {
                timeout: 5000,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("✅ Notification response:", response.data.message);
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error("❌ Notification service is DOWN. Could not connect to:", env.NOTI_SERVICE);
        } else if (error.response) {
            const responseBody = error.response.data;
            const responseMessage =
                responseBody?.message ||
                responseBody?.err ||
                (typeof responseBody === 'string' ? responseBody.slice(0, 300) : JSON.stringify(responseBody));

            console.error(
                `❌ Notification service error (${error.response.status}) on ${path}:`,
                responseMessage
            );
        } else {
            console.error("❌ Notification request failed:", error.message);
        }

        return null;
    }
};

const sendPasswordResetOtp = async (email, otp, expiresInMinutes = 10) => {
    console.log("➡️ Queueing password reset OTP for:", email);
    return postNotification('/notiservice/api/v1/emails/password-reset-otp', {
        email,
        otp,
        expiresInMinutes
    });
};

const sendBookingConfirmation = async (booking) => {
    const user = await userService.getUserById(booking.userId);

    console.log("➡️ Queueing booking confirmation for:", user.email);
    return postNotification('/notiservice/api/v1/emails/booking-confirmation', {
        email: user.email,
        bookingId: booking.id,
        noOfSeats: booking.noOfSeats,
        timing: booking.timing
    });
};

const sendTheatreCreated = async (userId, theatreName) => {
    const user = await userService.getUserById(userId);

    console.log("➡️ Queueing theatre creation notification for:", user.email);
    return postNotification('/notiservice/api/v1/emails/theatre-created', {
        email: user.email,
        theatreName
    });
};

module.exports = {
    sendPasswordResetOtp,
    sendBookingConfirmation,
    sendTheatreCreated
};
