import express from "express";
import { createServer } from "http";
import { initSocket } from "./utils/socket.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import prepsRoute from "./routes/preps.js"
import servicesRoute from "./routes/services.js";
import invoiceRoute from "./routes/invoice.js";
import bookingsRoute from "./routes/bookings.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
initSocket(httpServer)
dotenv.config()

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};


mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/services", servicesRoute);
app.use("/api/preps", prepsRoute);
app.use("/api/invoice", invoiceRoute);
app.use("/api/booking", bookingsRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!!!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  connect();
  console.log(`Server is running on port ${PORT}`);
});
