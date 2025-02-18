import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Application } from "express";
const app: Application = express()

dotenv.config();

app.use(bodyParser.json());
app.use(express.json());

export default app;