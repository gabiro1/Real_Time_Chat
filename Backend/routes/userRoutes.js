    import express from "express";
    import { checkAuth, login, signup, UpdateProfile } from "../controllers/userController.js";
    import { protectRoutes } from "../middleware/auth.js";

    const userRouter = express.Router();

    userRouter.post('/signup', signup);
    userRouter.post('/login', login);
    userRouter.put('/update', protectRoutes, UpdateProfile);
    userRouter.get('/check', protectRoutes, checkAuth);

    export default userRouter;