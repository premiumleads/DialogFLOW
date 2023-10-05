import { PrismaClient } from "@prisma/client";

export default async function handler(request, response) {
  try {
    const prisma = new PrismaClient();
    //get data with prisma
    let uniqueCred = [];
    if (request.query.projectid) {
      uniqueCred = await prisma.creds.findUnique({
        where: {
          DIALOGFLOW_PROJECT_ID: request.query.projectid || "",
        },
      });
    }
    console.log(uniqueCred);
    return response.status(200).json(uniqueCred);
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: err.message });
  }
}
