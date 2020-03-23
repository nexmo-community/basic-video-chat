require('dotenv').config();

const express = require("express");
const app = express();
const OpenTok = require("opentok");
const OT = new OpenTok(process.env.API_KEY, process.env.API_SECRET);

let sessions = {};

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/landing.html");
});

app.get("/session/:name", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/session/:name", (request, response) => {
  if (sessions[request.params.name]) {
    const tokenOptions = {
      role: "publisher",
      data: `roomname=${request.params.name}`
    };
    let token = OT.generateToken(sessions[request.params.name], tokenOptions);
    
    response.status(200);
    response.send({
      sessionId: sessions[request.params.name],
      token: token,
      apiKey: process.env.API_KEY
    });
  } else {
    OT.createSession((error, session) => {
      if (error) {
        console.log("Error creating session:", error);
      } else {
        sessions[request.params.name] = session.sessionId;
        const tokenOptions = {
          role: "publisher",
          data: `roomname=${request.params.name}`
        };
        let token = OT.generateToken(
          sessions[request.params.name],
          tokenOptions
        );

        response.status(200);
        response.send({
          sessionId: sessions[request.params.name],
          token: token,
          apiKey: process.env.API_KEY
        });
      }
    });
  }
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
