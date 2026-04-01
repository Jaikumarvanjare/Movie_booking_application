const prisma = require('../utils/prismaClient');
const bcrypt = require('bcrypt');
const { USER_ROLE, USER_STATUS, STATUS } = require('../utils/constants');

const createUser = async (data) => {
    try {
        if (!data.userRole || data.userRole === USER_ROLE.customer) {
            data.userRole = USER_ROLE.customer;
            data.userStatus = USER_STATUS.approved;
        } else {
            data.userStatus = USER_STATUS.pending;
        }

        const existingEmail = await prisma.user.findUnique({
            where: { email: data.email.toLowerCase() }
        });

        if (existingEmail) {
            throw { err: 'User already exists with the given email', code: STATUS.BAD_REQUEST };
        }

        const existingName = await prisma.user.findFirst({
            where: { name: data.name }
        });

        if (existingName) {
            throw { err: 'User already exists with the given name', code: STATUS.BAD_REQUEST };
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const response = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email.toLowerCase().trim(),
                password: hashedPassword,
                userRole: data.userRole,
                userStatus: data.userStatus
            }
        });

        return response;
    } catch (error) {
        throw error;
    }
};

const getUserByEmail = async (email) => {
    try {
        const response = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase()
            }
        });

        if (!response) {
            throw { err: 'No user found for the given email', code: STATUS.NOT_FOUND };
        }
        return response;
    } catch (error) {
        throw error;
    }
};

const getUserById = async (id) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw { err: "No user found for the given id", code: STATUS.NOT_FOUND };
        }
        return user;
    } catch (error) {
        throw error;
    }
};

const updateUserRoleOrStatus = async (data, userId) => {
    try {
        let updateQuery = {};

        if (data.userRole) updateQuery.userRole = data.userRole;
        if (data.userStatus) updateQuery.userStatus = data.userStatus;

        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            throw { err: 'No user found for the given id', code: STATUS.NOT_FOUND };
        }

        const response = await prisma.user.update({
            where: { id: userId },
            data: updateQuery
        });

        return response;
    } catch (error) {
        throw error;
    }
};

const updatePassword = async (userId, newPassword) => {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const response = await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword
            }
        });

        return response;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    updateUserRoleOrStatus,
    updatePassword
};