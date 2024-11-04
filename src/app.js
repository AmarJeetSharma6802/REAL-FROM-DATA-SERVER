import express from "express"
import dotenv from "dotenv"
import router from "./router.js";
import cookieParser from "cookie-parser";
import cors from 'cors'


dotenv.config(
    "./.env"
);
const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, 
}));
app.use(express.json());
app.use(cookieParser())


app.use('/apiBackend',router)

export {app}