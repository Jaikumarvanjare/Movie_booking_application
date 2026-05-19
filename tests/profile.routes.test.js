const request = require('supertest');

jest.mock('../services/user.service', () => ({
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
    getUserById: jest.fn(),
    getUserProfileById: jest.fn(),
    updateUserRoleOrStatus: jest.fn(),
    updateProfile: jest.fn(),
    updatePassword: jest.fn(),
    formatUserProfile: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn()
}));

jest.mock('bcrypt', () => ({
    compare: jest.fn(),
    hash: jest.fn()
}));

const app = require('../app');
const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

describe('Profile and account routes', () => {
    const authToken = 'valid-token';
    const authHeader = { Authorization: `Bearer ${authToken}` };
    const authenticatedUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        userRole: 'CUSTOMER',
        userStatus: 'APPROVED',
        createdAt: '2026-04-24T10:00:00.000Z'
    };
    const profileResponse = {
        id: authenticatedUser.id,
        name: authenticatedUser.name,
        email: authenticatedUser.email,
        role: authenticatedUser.userRole,
        status: authenticatedUser.userStatus,
        createdAt: authenticatedUser.createdAt
    };

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.AUTH_KEY = 'test-secret';
        jwt.verify.mockReturnValue({ id: authenticatedUser.id, email: authenticatedUser.email });
        userService.getUserById.mockResolvedValue(authenticatedUser);
    });

    it('GET /users/me returns current user for valid token', async () => {
        userService.getUserProfileById.mockResolvedValue(profileResponse);

        const response = await request(app)
            .get('/mba/api/v1/users/me')
            .set(authHeader);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Profile fetched successfully');
        expect(response.body.data).toEqual({ user: profileResponse });
        expect(userService.getUserProfileById).toHaveBeenCalledWith(authenticatedUser.id);
    });

    it('GET /users/me returns unauthorized without token', async () => {
        const response = await request(app).get('/mba/api/v1/users/me');

        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
        expect(response.body.err).toBe('No token provided');
    });

    it('PATCH /users/me updates name successfully', async () => {
        const updatedProfile = { ...profileResponse, name: 'Updated User Name' };
        userService.updateProfile.mockResolvedValue(updatedProfile);

        const response = await request(app)
            .patch('/mba/api/v1/users/me')
            .set(authHeader)
            .send({ name: '  Updated User Name  ' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Profile updated successfully');
        expect(response.body.data).toEqual({ user: updatedProfile });
        expect(userService.updateProfile).toHaveBeenCalledWith(authenticatedUser.id, { name: 'Updated User Name' });
    });

    it('PATCH /users/me rejects invalid name', async () => {
        const response = await request(app)
            .patch('/mba/api/v1/users/me')
            .set(authHeader)
            .send({ name: ' ' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.err).toBe('Name cannot be empty');
    });

    it('PATCH /users/me rejects forbidden fields like role, email, and password', async () => {
        const response = await request(app)
            .patch('/mba/api/v1/users/me')
            .set(authHeader)
            .send({ name: 'John Doe', role: 'ADMIN', email: 'hack@example.com', password: '123456' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.err).toBe('Cannot update restricted field(s): role, email, password');
    });

    it('POST /auth/change-password succeeds with correct current password', async () => {
        bcrypt.compare
            .mockResolvedValueOnce(true)
            .mockResolvedValueOnce(false);
        userService.updatePassword.mockResolvedValue({ id: authenticatedUser.id });

        const response = await request(app)
            .post('/mba/api/v1/auth/change-password')
            .set(authHeader)
            .send({ currentPassword: 'oldPassword123', newPassword: 'newPassword123' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Password changed successfully');
        expect(response.body.data).toEqual({});
        expect(bcrypt.compare).toHaveBeenCalledWith('oldPassword123', authenticatedUser.password);
        expect(bcrypt.compare).toHaveBeenCalledWith('newPassword123', authenticatedUser.password);
        expect(userService.updatePassword).toHaveBeenCalledWith(authenticatedUser.id, 'newPassword123');
    });

    it('POST /auth/change-password fails with wrong current password', async () => {
        bcrypt.compare.mockResolvedValue(false);

        const response = await request(app)
            .post('/mba/api/v1/auth/change-password')
            .set(authHeader)
            .send({ currentPassword: 'wrongPassword', newPassword: 'newPassword123' });

        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Password change failed');
        expect(response.body.err).toBe('Invalid current password');
    });

    it('POST /auth/change-password fails when new password matches current password', async () => {
        bcrypt.compare
            .mockResolvedValueOnce(true)
            .mockResolvedValueOnce(true);

        const response = await request(app)
            .post('/mba/api/v1/auth/change-password')
            .set(authHeader)
            .send({ currentPassword: 'oldPassword123', newPassword: 'oldPassword123' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Password change failed');
        expect(response.body.err).toBe('New password cannot be the same as the current password');
        expect(userService.updatePassword).not.toHaveBeenCalled();
    });

    it('POST /auth/change-password fails for invalid new password', async () => {
        const response = await request(app)
            .post('/mba/api/v1/auth/change-password')
            .set(authHeader)
            .send({ currentPassword: 'oldPassword123', newPassword: '123' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.err).toBe('New password must be at least 6 characters long');
    });

    it('POST /auth/logout succeeds for authenticated user', async () => {
        const response = await request(app)
            .post('/mba/api/v1/auth/logout')
            .set(authHeader);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Logged out successfully');
        expect(response.body.data).toEqual({});
    });

    it('POST /auth/logout unauthorized behavior is consistent without token', async () => {
        const response = await request(app).post('/mba/api/v1/auth/logout');

        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
        expect(response.body.err).toBe('No token provided');
    });
});
