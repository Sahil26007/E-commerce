import DataURIParser from "datauri/parser.js";
import path from "path";

interface MulterFile {
    originalname: string;
    buffer: Buffer;
}

export const getDataUri = (photo: MulterFile) => {
    const parser = new DataURIParser();
    const extName = path.extname(photo.originalname).toString(); 
    
    return parser.format(extName, photo.buffer);
};
