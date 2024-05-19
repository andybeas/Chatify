import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import connectToMongoDb from './db/connectToMongoDb.js';
import userRoutes from './routes/user.routes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); //To parse the incoming request with JSON payloads
app.use(cookieParser()); //To parse the incoming cookies
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req,res) => {
    res.send("Hello World!!");
});

app.listen(PORT, () => {
    connectToMongoDb();
    console.log(`Server is running on port ${PORT}`);
});
