import { createServer } from "./server";
import { log } from "@repo/logger";
import 'dotenv/config';
import connectDB from "./Services/ConnectDB";

const port = process.env.PORT;
const server = createServer();

// Connect DB
connectDB(process.env.MONGODB_URI!)
server.listen(port, () => {
  log(`api running on ${port}`);
});
