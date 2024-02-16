import express from 'express';

import userRoute from './routes/user.js' 

const port = 8000;
const app = express();

app.get("/", (req, res) => {
    res.send(`APi is running at api/v1/ `);
})
app.use("/api/v1/user", userRoute);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});