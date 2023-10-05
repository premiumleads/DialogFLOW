// Import the required module
const DIALOGFLOW_API = require("./dialogflow_api");

// Define the API route handler
export default async function handler(req, res) {
  // Retrieve the necessary data from the request query parameters
  let text = req.query.text;
  let sessionId = req.query.mysession;
  let lang = req.query.lang;
  let projectid = req.query.projectid;
  let typeLanguageAgent = req.query.typeLanguageAgent;

  console.log("💛💛💛 data from server", text, sessionId, lang);

  // Call the detectIntent function from the DIALOGFLOW_API module
  let intentData = await DIALOGFLOW_API.detectIntent(
    text,
    sessionId,
    lang,
    typeLanguageAgent,
    projectid
  );

  // Set the Access-Control-Allow-Origin header to allow cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Send the response based on the intentData
  if (intentData) {
    res.send(intentData);
  } else {
    res.send("Chatbot is having a problem. Try again after some time.");
  }
}
