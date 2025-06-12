"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controllers_1 = require("../../controllers/auth.controllers");
const User_model_1 = __importDefault(require("../../models/User.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Mock dependencies
jest.mock('../../models/User.model');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
describe('Auth Controllers', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        };
    });
    describe('signup', () => {
        it('should return 400 if required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { name: 'Test User' }; // Missing email and password
            yield (0, auth_controllers_1.signup)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Some fields are missing' });
        }));
        it('should return 400 if user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { name: 'Test User', email: 'test@example.com', password: 'password123' };
            User_model_1.default.findOne.mockResolvedValueOnce({ _id: '123', email: 'test@example.com' });
            yield (0, auth_controllers_1.signup)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
        }));
        it('should create a new user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { name: 'Test User', email: 'test@example.com', password: 'password123' };
            User_model_1.default.findOne.mockResolvedValueOnce(null);
            bcrypt_1.default.hash.mockResolvedValueOnce('hashedPassword');
            const mockUser = {
                _id: '123',
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedPassword'
            };
            User_model_1.default.create.mockResolvedValueOnce(mockUser);
            jsonwebtoken_1.default.sign.mockReturnValueOnce('test-token');
            yield (0, auth_controllers_1.signup)(req, res);
            expect(res.cookie).toHaveBeenCalledWith('token', 'test-token', expect.any(Object));
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User created successfully',
                token: 'test-token',
                user: {
                    id: '123',
                    name: 'Test User',
                    email: 'test@example.com',
                },
            });
        }));
    });
    describe('login', () => {
        it('should return 400 if email or password is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { email: 'test@example.com' }; // Missing password
            yield (0, auth_controllers_1.login)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
        }));
        it('should return 401 if user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { email: 'test@example.com', password: 'password123' };
            User_model_1.default.findOne.mockResolvedValueOnce(null);
            yield (0, auth_controllers_1.login)(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        }));
        it('should return 401 if password is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { email: 'test@example.com', password: 'password123' };
            User_model_1.default.findOne.mockResolvedValueOnce({
                _id: '123',
                email: 'test@example.com',
                password: 'hashedPassword'
            });
            bcrypt_1.default.compare.mockResolvedValueOnce(false);
            yield (0, auth_controllers_1.login)(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        }));
        it('should login successfully with valid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { email: 'test@example.com', password: 'password123' };
            const mockUser = {
                _id: '123',
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedPassword'
            };
            User_model_1.default.findOne.mockResolvedValueOnce(mockUser);
            bcrypt_1.default.compare.mockResolvedValueOnce(true);
            jsonwebtoken_1.default.sign.mockReturnValueOnce('test-token');
            yield (0, auth_controllers_1.login)(req, res);
            expect(res.cookie).toHaveBeenCalledWith('token', 'test-token', expect.any(Object));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Login successful',
                token: 'test-token',
                user: {
                    id: '123',
                    name: 'Test User',
                    email: 'test@example.com',
                },
            });
        }));
    });
});
//# sourceMappingURL=auth.controllers.test.js.map