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
        res.cookie("taskly_token", token, { httpOnly: true })
            .status(200)
            .json(rest);
    } catch (error) {
        next({ status: 500, error });
    }
}

export async function signin(req, res, next) {
    const { email, password } = req.body;
    try {
        const validUser = await collection.findOne({ email });
        if (!validUser) {
            return next({ status: 404, message: "User not found" });
        }
        const validPassword = await bcrypt.compare(
            password,
            validUser.password
        );
        if (!validPassword) {
            return next({ status: 401, message: "Password incorrect" });
        }
        const token = jwt.sign({ id: validUser._id }, process.env.AUTH_SECRET);
        const { password: _, updatedAt, createdAt, ...rest } = validUser;
        res.cookie("taskly_token", token, { httpOnly: true })
            .status(200)
            .json(rest);
    } catch (error) {
        next({ status: 500, error });
    }
}

export async function signout(req, res, next) {
    try {
        res.clearCookie("taskly_token");
        res.status(200).json({ message: "Signed out" });
    } catch (error) {
        next({ status: 500 });
    }
}
