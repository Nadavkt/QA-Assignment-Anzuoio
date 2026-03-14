QA Assignment – Node.js TCP Server & Unity Client

Project Overview

This project demonstrates communication between a Node.js TCP server and a Unity client.
The Unity client connects to the server, performs a handshake, sends commands, and displays the server responses in the UI.

The server processes incoming commands using a command handler and returns appropriate responses.

Requirements

Before running the project, make sure you have the following installed:
	•	Node.js (v18 or newer recommended)
	•	npm
	•	Unity (Unity 2018 or newer)


Running the Server

Navigate to the server directory and install dependencies:

npm install

Start the server:

node server.js

The server will start listening on:

localhost:4000

You should see:

TCP server listening on port 4000


⸻

Running the Unity Client
	1.	Open Unity Hub.
	2.	Open the project located in:

unity-client/

	3.	Open the main scene.
	4.	Press Play.

Use the UI buttons to interact with the server.

⸻

Supported Commands

After the handshake, the Unity client can send the following commands:

Command	Server Response
HELLO	READY
PING	PONG
SPAWN_ENEMY	OK

Invalid commands return:

ERROR UNKNOWN_COMMAND


⸻

Running Tests

The project includes Jest tests for validating server behavior.

To run the tests:

npm test

The tests verify:
	•	Handshake protocol
	•	Ping command
	•	Invalid command handling

⸻

Project Structure

qa-assignment-Anzuio
│
├── server
│   ├── server.js
│   ├── commandHandler.js
│   ├── server.test.js
│   └── package.json
│
├── unity-client
│   ├── Assets
│   ├── Packages
│   └── ProjectSettings
│
└── README.md


⸻

Communication Flow

Unity Client
     │
     │ TCP connection
     ▼
Node.js Server
     │
     ▼
Command Handler

Example communication:

Client → HELLO
Server → READY

Client → PING
Server → PONG
