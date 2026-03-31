const axios = require('axios');
const userService = require('../services/user.service');

const sendMail = async (subject, id, content) => {
    const user = await userService.getUserById(id);

    if (!user) {
        throw new Error('User not found for sending email');
    }

    await axios.post(process.env.NOTI_SERVICE + '/notiservice/api/v1/notifications', {
        subject: subject,
        recepientEmails: [user.email],
        content: content
    });
};

module.exports = sendMail;