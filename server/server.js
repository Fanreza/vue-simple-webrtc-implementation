const express = require("express");
const http = require("http");

const app = express();
const server = http.Server(app);
const io = require("socket.io")(server, {
	pingTimeout: 60000,
	cors: {
		origin: "http://localhost:5173",
	},
});

io.on("connection", (socket) => {
	console.log("a user connected");

	socket.on("join-room", (roomId, userId) => {
		console.log("join room", roomId, userId);
		socket.join(roomId);

		socket.on("disconnect", () => {
			io.to(roomId).emit("user-disconnected", userId);
			console.log("user disconnected");
		});
	});

	socket.on("connection-request", (roomId, userId) => {
		console.log("connection request", roomId, userId);
		io.to(roomId).emit("new-user-connected", userId);
	});
});

//start the web server
server.listen(3000, () => {
	console.log("Websocket server started on port 3000");
});
