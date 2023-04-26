const cors = require("cors");

function corsMiddleware() {
  return cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.PROD_ORIGIN
        : process.env.DEV_ORIGIN,
    methods: ["GET", "POST"],
  });
}

module.exports = corsMiddleware;
