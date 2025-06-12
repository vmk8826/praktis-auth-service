"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = require("../controllers/auth.controllers");
const authRoutes = (0, express_1.Router)();
authRoutes.post("/signup", auth_controllers_1.signup);
authRoutes.post("/login", auth_controllers_1.login);
exports.default = authRoutes;
//# sourceMappingURL=auth.routes.js.map