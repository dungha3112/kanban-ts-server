import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import ConnectDB from "./configs/connectBD";
import routes from "./routes";
dotenv.config();

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: [
      "https://kanban-client-khaki.vercel.app",
      "https://kanban-client-khaki.vercel.app/",
      "http://localhost:3000",
      "http://localhost:3000/",
    ],
    credentials: true,
  })
);
app.use(cookieParser());

ConnectDB();
const PORT = process.env.PORT;

app.use("/api/v1/auth", routes.authRouter);
app.use("/api/v1/boards", routes.boardRouter);
app.use("/api/v1/boards", routes.sectionRouter);
app.use("/api/v1/boards", routes.taskRouter);

app.use("/api/v1/user", routes.userRouter);

app.listen(PORT, () => {
  console.log(`-->Server running on port: ${PORT}`);
});
