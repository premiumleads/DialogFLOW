import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  try {
    // Initialize Prisma client
    const prisma = new PrismaClient();

    // Extract relevant data from the request body
    const { langs, knowledge_bases, ...data } = req.body;

    // Update credentials
    await prisma.creds.update({
      where: { DIALOGFLOW_PROJECT_ID: req.body.DIALOGFLOW_PROJECT_ID },
      data: {
        ...data,
      },
    });

    // Update language settings
    langs.map(async (item) => {
      await prisma.DIALOGFLOW_LANG.update({
        where: { DIALOGFLOW_PROJECT_ID_FK: req.body.DIALOGFLOW_PROJECT_ID },
        data: {
          ...item,
        },
      });
    });

    // Update knowledge bases
    knowledge_bases.map(async (item) => {
      await prisma.DIALOGFLOW_KNOWLEDGEBASES.update({
        where: { DIALOGFLOW_PROJECT_ID_FK: req.body.DIALOGFLOW_PROJECT_ID },
        data: {
          ...item,
        },
      });
    });

    // Fetch updated credentials
    const creds = await prisma.creds.findMany();
    console.log(creds);

    // Return the updated credentials
    return res.status(200).json({ creds });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
