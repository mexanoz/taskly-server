import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { db } from "../lib/dbConnect.js";

const collection = db.collection("users");

export async function getUser(req, res, next) {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const user = await collection.findOne(query);
        if (!user) {
            return next({ status: 404, message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        next({ status: 500, error });
    }
}

export async function updateUser(req, res, next) {
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const query = { _id: new ObjectId(req.params.id) };
        const data = {
            $set: {
                ...req.body,
                updateAt: new Date().toISOString(),
            },
        };
        const options = { returnDocument: "after" };

        const updatedUser = await collection.findOneAndUpdate(
            query,
            data,
            options
        );
        const { password: pass, updatedAt, createdAt, ...rest } = updatedUser;
        res.status(200).json(updatedUser);
    } catch (error) {
        return next({ status: 500, error });
    }
}

export async function deleteUser(req, res, next) {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        await collection.deleteOne(query);
        res.status(200).json({ message: "User has been deleted!" });
    } catch (error) {
        return next({ status: 500, error });
    }
}
