import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import { errorHandler } from "./lib/middleware.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.use("*", (req, res) => {
    res.status(404).json({ message: "not found" });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
