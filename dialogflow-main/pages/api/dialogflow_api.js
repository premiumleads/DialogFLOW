const dialogflow = require("dialogflow").v2beta1;
const DevKeys = require("./devKey.js");
import { PrismaClient } from "@prisma/client";

// Function to detect intent
const detectIntent = async (
  userText,
  userId,
  lang,
  typeLanguageAgent,
  projectid
) => {
  // Initialization
  let CREDENTIALS;
  const prisma = new PrismaClient();
  console.log(lang);

  // Choose the credentials based on the language
  if (lang === "fr") {
    CREDENTIALS = DevKeys.fr;
  } else {
    CREDENTIALS = DevKeys.en;
  }

  // Get specific credential from the database
  const uniqueCred = await prisma.creds.findUnique({
    where: {
      DIALOGFLOW_PROJECT_ID: projectid || "",
    },
  });

  // Get unique knowledge base information from the database
  const uniqueKnowledgeBase = await prisma.DIALOGFLOW_KNOWLEDGEBASES.findMany({
    where: {
      DIALOGFLOW_PROJECT_ID_FK: projectid || "",
    },
  });

  console.log(uniqueKnowledgeBase, uniqueCred);

  // Parse the JSON credential if necessary
  if (uniqueCred?.DIALOGFLOW_JSON) {
    if (typeof uniqueCred.DIALOGFLOW_JSON === "string") {
      // Check if the JSON string starts with '{'
      if (!uniqueCred.DIALOGFLOW_JSON.startsWith("{")) {
        uniqueCred.DIALOGFLOW_JSON = `{${uniqueCred.DIALOGFLOW_JSON}}`;
      }
      try {
        // Parse the JSON string
        uniqueCred.DIALOGFLOW_JSON = JSON.parse(uniqueCred.DIALOGFLOW_JSON);
        CREDENTIALS = uniqueCred.DIALOGFLOW_JSON;
      } catch (error) {
        console.error("Error parsing JSON string: ", error);
      }
    } else {
      console.error("Invalid JSON format");
    }
  }

  // Set API constants
  const PRIVATE_KEY = CREDENTIALS.private_key;
  const PROJECID = CREDENTIALS.project_id;
  const Client_email = CREDENTIALS.client_email;
  const SESSIONID = CREDENTIALS.sessionId;
  let SESSIONLANGUAGE = typeLanguageAgent;
  if (uniqueCred?.LANG) {
    SESSIONLANGUAGE;
  }

  const credentials = {
    private_key: PRIVATE_KEY,
    client_email: Client_email,
  };

  // Create a new session client
  const sessionClient = new dialogflow.SessionsClient({
    PROJECID,
    credentials,
  });

  // Create the session path
  let sessionPath = await sessionClient.sessionPath(
    PROJECID,
    SESSIONID + userId
  );
  console.log("dialogflow >>> session path ", sessionPath);

  // Set up the request to use the Knowledge Base query
  let request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: userText,
        languageCode: SESSIONLANGUAGE,
      },
    },
    queryParams: {
      knowledgeBaseNames:
        uniqueKnowledgeBase?.length > 0
          ? uniqueKnowledgeBase.map((item) => item.VALUE)
          : [],
    },
  };

  console.log("💚💚request", request);

  try {
    // Send the detectIntent request
    const responses = await sessionClient.detectIntent(request);
    console.log("this is the response 💛💚💙❤💔💔", responses);
    console.log(responses[0].queryResult.fulfillmentMessages);

    // Extract the desired result from the response
    const result = {
      text: responses[0].queryResult.fulfillmentMessages[0]?.text?.text[0],
      querytext: responses[0].queryResult.queryText,
      displayName: responses[0].queryResult.intent.displayName,
      fullfillmentText: responses[0].queryResult.fulfillmentText,
    };

    console.log(result, responses);
    return { result, responses };
  } catch (error) {
    console.log(`Error at dialogflow-api.js detectIntent --> ${error}`);
    return {
      status: 0,
      text: "Hello, How Can I Help You?",
    };
  }
};

module.exports = {
  detectIntent,
};
