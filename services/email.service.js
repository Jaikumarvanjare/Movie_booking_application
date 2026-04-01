const env = require('../config/env');
const axios = require('axios');
const userService = require('../services/user.service');

const sendMail = async (subject, id, content) => {
    const user = await userService.getUserById(id);

    if (!user) {
        throw new Error('User not found for sending email');
    }

    console.log("➡️ Sending notification to:", user.email);

    try {
        const response = await axios.post(
            env.NOTI_SERVICE + '/notiservice/api/v1/notifications',
            {
                subject: subject,
                recepientEmails: [user.email],
                content: content
            },
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
            console.error("❌ Notification service error:", error.response.data.message);
        } else {
            console.error("❌ Notification request failed:", error.message);
        }

        return null;
    }
};

module.exports = sendMail;