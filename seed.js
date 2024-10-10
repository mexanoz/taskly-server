import "dotenv/config";
import { db } from "./lib/dbConnect.js";

const users = [
    {
        username: 'nathan121',
        email: 'nathan@mail.com',
        password: '$2b$10$vD5yRWdxLp1j6riuSi/Ozu71x145viXeGC7AHT5R0WcycGalmYTae',
        avatar: 'https://g.codewithnathan.com/default-user.png',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        username: 'jane78',
        email: 'jane@mail.com',
        password: '$2b$10$vD5yRWdxLp1j6riuSi/Ozu71x145viXeGC7AHT5R0WcycGalmYTae',
        avatar: 'https://g.codewithnathan.com/default-user.png',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

const tasks = [
    {
        name: 'Прочитать книгу "Atomic Habits"',
        description: 'Закончить чтение книги "Atomic Habits" Джеймса Клира',
        priority: 'не срочно',
        due: new Date().toISOString(),
        status: 'открыта',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        name: 'Изучить стек MERN',
        description: 'Изучить стек MERN и создать с его помощью полнофункциональное приложение',
        priority: 'срочно',
        due: new Date().toISOString(),
        status: 'открыта',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

function log(message) { console.log("[seed]", message); }

try {
    const usersCollection = db.collection("users");
    log("Adding users...");
    const result = await usersCollection.insertMany(users);
    log("Added users successfully");

    tasks[0].owner = result.insertedIds[0];
    tasks[1].owner = result.insertedIds[1];
    const tasksCollection = db.collection("tasks");
    log("Adding tasks...");
    await tasksCollection.insertMany(tasks);
    log("Added tasks successfully");

    log("Complete");
} catch (err) {
    console.err("[seed]", err);
}

process.exit();
