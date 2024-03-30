import express from "express";
import http from "http";
import { Server } from "socket.io";
import { config } from "dotenv";
import { dbconnect } from "./database/data.js";
import userRouter from "./routes/userRoutes.js";
import unauthRouter from "./routes/unauthRoutes.js";
import User from "./modals/user.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";

config();
dbconnect();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});



app.get("/", (req, res) => {
  return res.json({
    message: "server is running",
  });
});

app.use("/unauth", unauthRouter);
app.use("/user", userRouter);

//middleware for socket auth check
io.use(async (socket, next) => {
    console.log("used");
    console.log(socket.request.headers);

    // Check if the cookie exists in the request
    if (socket.request.headers.cookie) {
        const token = socket.request.headers.cookie.split("; ").find(cookie => cookie.startsWith("token="));
        if (token) {
            const authToken = token.split("=")[1];
            // User is authenticated, proceed with the connection
            try {
                const decodetoken = jwt.verify(authToken, process.env.JWT_SECRET);
                const user = await User.findById(decodetoken._id);
                if (user) {
                    socket.user = user;
                    return next();
                }
            } catch (error) {
                console.error("Error verifying token:", error);
            }
        }
    }
    // User is not authenticated, reject the connection
    return next(new Error("Unauthorized"));
});

io.on("connection", (socket) => {
  console.log("new user is connected", socket.id);

  const sendWelcomeMessages = () => {
    socket.emit("welcome", "Hi there!👋");
    setTimeout(() => {
      socket.emit("welcome","I'm Wysa- an AI chatbot built by therapists.");
    }, 1000);
    setTimeout(() => {
      socket.emit(
        "welcome","I'm here to understand your concerns and connect you with the best resources available to support you"
      );
    }, 2000);
    setTimeout(() => {
      socket.emit("welcome","Can I help?");
    }, 3000);
  };

  sendWelcomeMessages();

  socket.on("user-query", (msg) => {
    console.log("User query received:", msg);
    socket.emit("backend-response", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});



server.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
