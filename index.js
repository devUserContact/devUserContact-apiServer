require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const PORT = process.env.PORT;
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.SQL_USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
});

server.get("/api/test", (req, res) => {
	connection.query("SELECT * FROM posts", function (err, results, fields) {
		res.status(200).send(results);
	});
});

server.listen(PORT, () => console.log(`listening on port ${PORT}`));
