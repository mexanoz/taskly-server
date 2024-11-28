import { db } from "../lib/dbConnect.js";
import { ObjectId } from "mongodb";

const collection = db.collection("tasks");

export async function getTasksByUser(req, res, next) {
    try {
        const query = { owner: new ObjectId(req.params.id) };
        const tasks = await collection.find(query).toArray();
        res.status(200).json({ tasks });
    } catch (error) {
        next({ status: 500, error });
    }
}

export async function getTask(req, res, next) {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const task = await collection.findOne(query);
        if (!task) {
            return next({ status: 404, message: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        next({ status: 500, error });
    }
}

export async function createTask(req, res, next) {
    try {
        const newTask = req.body;
        newTask.owner = new ObjectId(req.user.id);
        newTask.createdAt = new Date().toISOString();
        newTask.updatedAt = new Date().toISOString();
        const insertedTask = await collection.insertOne(newTask);
        res.status(200).json(insertedTask);
    } catch (error) {
        next({ status: 500, error });
    }
}

export async function updateTask(req, res, next) {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const data = {
            $set: {
                ...req.body,
                owner: new ObjectId(req.body.owner),
                updatedAt: new Date().toISOString(),
            },
        };
        const options = { ReturnDocument: "after" };
        const updatedTask = await collection.findOneAndUpdate(
            query,
            data,
            options
        );
        res.status(200).json(updatedTask);
    } catch (error) {
        next({ status: 500, error });
    }
}

export async function deleteTask(req, res, next) {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        await collection.deleteOne(query);
        res.status(200).json("Task deleted successfully");
    } catch (error) {
        next({ status: 500, error });
    }
}
