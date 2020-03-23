function initializeSession(apiKey, sessionId, token) {
  // Create a session object with the sessionId
  const session = OT.initSession(apiKey, sessionId);

  // Create a publisher
  const publisher = OT.initPublisher(
    "publisher",
    {
      insertMode: "append",
      width: "100%",
      height: "100%"
    },
    handleError
  );

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, initialize the publisher and publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });

  // Subscribe to a newly created stream
  session.on("streamCreated", function(event) {
    session.subscribe(
      event.stream,
      "subscriber",
      {
        insertMode: "append",
        width: "100%",
        height: "100%"
      },
      handleError
    );
  });
}

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

fetch(location.pathname, { method: "POST" })
  .then(function(res) {
    return res.json();
  })
  .then(function(res) {
    console.log(res);
    const apiKey = res.apiKey;
    const sessionId = res.sessionId;
    const token = res.token;
    initializeSession(apiKey, sessionId, token);
  })
  .catch(handleError);
