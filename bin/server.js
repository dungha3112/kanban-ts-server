"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const connectBD_1 = __importDefault(require("./configs/connectBD"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    origin: ["https://kanban-client-khaki.vercel.app", "http://localhost:3000"],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
(0, connectBD_1.default)();
const PORT = process.env.PORT;
app.use("/api/v1/auth", routes_1.default.authRouter);
app.use("/api/v1/boards", routes_1.default.boardRouter);
app.use("/api/v1/boards", routes_1.default.sectionRouter);
app.use("/api/v1/boards", routes_1.default.taskRouter);
app.use("/api/v1/user", routes_1.default.userRouter);
app.listen(PORT, () => {
    console.log(`-->Server running on port: ${PORT}`);
});
