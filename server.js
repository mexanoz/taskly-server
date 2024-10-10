import "dotenv/config";
import express from "express";
import userRouter from "./routes/user.route.js";
import { errorHandler } from "./lib/middleware.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use("/api/v1/users", userRouter);

app.use("*", (req, res) => {
    res.status(404).json({ message: "not found" });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
