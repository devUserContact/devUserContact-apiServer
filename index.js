require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const ENVIRONMENT = process.env.NODE_ENV;
const PORT = process.env.PORT;

let allowedOrigins = [];
let table = "";

if (ENVIRONMENT === "development") {
	allowedOrigins = ["*"];
	table = "blog_post_TEST";
} else {
	allowedOrigins = [
		"https://devusercontact.com",
		"https://devusercontact-blog.netlify.app",
	];
	table = "blog_post";
}

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.SQL_USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
});
server.get("/api/blog-devusercontact/posts", (req, res) => {
	connection.query(`SELECT * FROM ${table}`, function (err, results, fields) {
		const origin = req.headers.origin;
		if (allowedOrigins.includes(origin)) {
			res.setHeader("Access-Control-Allow-Origin", origin);
		}
		res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
		res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
		res.header("Access-Control-Allow-Credentials", true);
		res.status(200).send(results);
	});
});

server.listen(PORT, () => console.log(`listening on port ${PORT}`));
