const express = require("express");
const http = require("http");
const path = require("path");
const router = require("./src/routes/router");
const { PORT } = require("./src/config");
require("dotenv").config();

//initialize express
const app = express();

app.use("/api/v1", router);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/test", (req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end('<p>Working</p>');
});

// ///////Whiteboard download
app.use(express.static(path.join(__dirname, "downloader")));

app.get("/download", (req, res) => {
    res.sendFile(path.join(__dirname, "downloader", "downloadtest.html"));
});

app.use(express.static(path.join(__dirname, "../whiteboard-root/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../whiteboard-root/dist/index.html"));
});

//Error handling
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

// The server should start listening
app.listen(PORT, () => {
    console.log(`Server is listening on port http://127.0.0.1:${PORT}`);
});