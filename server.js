const cors = require("cors");
const app = require("./src/api/index");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

process.on("SIGINT", () => {
  console.log("Received SIGINT. Shutting down...");
  process.exit();
});
