import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000; 
const db = process.env.MONGO_URL || "mongodb+srv://thrindle:TuaEQhbRADc6PRJb@thrindle-task.ehragas.mongodb.net/";

mongoose.set("strictQuery", false);

mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connection Successful"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
