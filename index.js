import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "dotenv";
import { dbconnect } from "./database/data.js";
import userRouter from "./routes/userRoutes.js";
import unauthRouter from "./routes/unauthRoutes.js";
import User from "./modals/user.js";
import jwt from "jsonwebtoken";
import cors from "cors";


config();
dbconnect();

const PORT = process.env.PORT || 4000;
const app = express();


app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use("/unauth", unauthRouter);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URI,
    credentials: true,
  },
});

app.get("/", (req, res) => {
  return res.json({
    message: "server is running",
  });
});


app.use("/user", userRouter);

//middleware for socket auth check
io.use((socket, next) => {
  console.log(socket);
  const { token } = socket.handshake.auth;
  console.log(token)

  if (token && token.startsWith("Bearer ")) {
    const authToken = token.split(" ")[1];
    console.log(authToken);

    try {
      const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
      socket.user = decodedToken;

      return next();
    } catch (error) {
      console.error("Error verifying token:", error);
      return next(new Error("Unauthorized"));
    }
  }

  // No authorization header or invalid format
  return next(new Error("Unauthorized"));
});

io.on("connection", (socket) => {
  // console.log("new user is connected", socket.id);

  const sendWelcomeMessages = () => {
    socket.emit("welcome", "Hi there!👋");
    setTimeout(() => {
      socket.emit("welcome", "I'm Wysa- an AI chatbot built by therapists.");
    }, 1000);
    setTimeout(() => {
      socket.emit(
        "welcome",
        "I'm here to understand your concerns and connect you with the best resources available to support you"
      );
    }, 2000);
    setTimeout(() => {
      socket.emit("welcome", "Can I help?");
    }, 3000);
  };

  sendWelcomeMessages();

  socket.on("user-query", (msg) => {
    // console.log("User query received:", msg);
    setTimeout(() => {
      socket.emit("backend-response", msg);
    }, 3000);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
