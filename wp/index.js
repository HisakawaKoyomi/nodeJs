const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const sql = require("mysql");

const server = express();
server.listen(9111);

server.use('/',express.static("./www"));