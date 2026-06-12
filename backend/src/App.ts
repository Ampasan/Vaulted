import "dotenv/config";
import { connectDB } from "./config/db";
import { createApp } from "./serverApp";

const port = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  await connectDB();

  const { server } = createApp();

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

export { createApp };
