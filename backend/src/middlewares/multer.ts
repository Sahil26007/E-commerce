import multer from "multer";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4 as a named import

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads");
    },
    filename(req, file, callback) {
        const id = uuidv4(); // Call uuidv4 as a function to generate a unique identifier
        const extName = file.originalname.split(".").pop();

        callback(null, `${id}.${extName}`);
    },
});

export const uploadOne = multer({ storage }).single("photo");
