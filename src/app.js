import express from "express"
import dotenv from "dotenv"
import router from "./router.js";
import cookieParser from "cookie-parser";
import cors from 'cors'


dotenv.config(
    "./.env"
);

const app = express()
app.use(express.json());
app.use(cookieParser())
app.use(cors())

app.use('/apiBackend',router)

export {app}