import multer from "multer";
// import { v4 as uuidv4 } from "uuid"; // Import uuidv4 as a named import

const storage = multer.memoryStorage()

export const uploadOne = multer({ storage }).single("photo");
