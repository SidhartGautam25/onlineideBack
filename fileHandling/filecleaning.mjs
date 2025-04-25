import fs from "fs";
// import logger from "../logger.js"; // adjust path as needed

export function safeDelete(filePath) {
  fs.rm(
    filePath,
    {
      force: true, // don't throw if file/folder doesn't exist
      recursive: true, // allows deleting directories with contents
      maxRetries: 3, // optional: retry a few times on fail
      retryDelay: 100, // optional: ms between retries
    },
    (err) => {
      if (err) {
        console.error(`Failed to delete ${filePath}: ${err.message}`);
      } else {
        console.log(`Deleted ${filePath}`);
      }
    }
  );
}

// need to implement periodic cleanup jobs
