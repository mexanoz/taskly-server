import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../lib/dbConnect.js";

const collection = db.collection("users");

export async function signup(req, res, next) {
    try {
        const { username, password, email } = req.body;
        const query = { $or: [{ email }, { username }] };
        const existingUser = await collection.findOne(query);
        if (existingUser) {
            return next({ status: 422, message: "User already registered" });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = {
            username,
            email,
            password: passwordHash,
            avatar: "https://g.codewithnathan.com/default-user.png",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const { insertedId } = await collection.insertOne(user);
        const token = jwt.sign({ id: insertedId }, process.env.AUTH_SECRET);
        user._id = insertedId;
        const { password: _, createdAt, updatedAt, ...rest } = user;
        return res
            .cookie("taskly_token", token, { httpOnly: true })
            .status(200)
            .json(rest);
    } catch (error) {
        next({ status: 500, error });
    }
}
