const create = async (req, res) => {
    const { subject, recepientEmails, content } = req.body;

    console.log("EMAIL REQUEST RECEIVED");
    console.log(subject);
    console.log(recepientEmails);
    console.log(content);

    return res.status(200).json({
        success: true,
        message: "Notification received"
    });
};

module.exports = { create };