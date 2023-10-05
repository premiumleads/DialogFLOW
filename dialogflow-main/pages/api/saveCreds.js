import { db } from "@vercel/postgres";
import { PrismaClient } from "@prisma/client";

export default async function handler(request, response) {
  try {
    //saving data with postgres
    //if no dialogflow project_id is added we use this
    console.log(request.body);
    const { langs, knowledgebases, ...data } = request.body;
    if (!request.body?.DIALOGFLOW_PROJECT_ID) {
      try {
        request.body.DIALOGFLOW_PROJECT_ID = JSON.parse(
          request.body.DIALOGFLOW_JSON
        )?.project_id;
      } catch (error) {
        console.log(error);
      }
    }
    /*
    console.log("server reached");
    console.log(request.body);
    const client = await db.connect();
    console.log(client);
    await client.sql`INSERT INTO creds VALUES (${dialogflow}, ${azuretts}, ${cloudinary});`;
    const creds = await client.sql`SELECT * FROM creds;`;
    */

    //saving data with prisma
    const prisma = new PrismaClient();
    //saving creds
    const newCred = await prisma.creds.create({
      data: { ...data },
    });
    //saving langs
    langs?.map(async (item) => {
      item.DIALOGFLOW_PROJECT_ID_FK = data.DIALOGFLOW_PROJECT_ID;
      await prisma.DIALOGFLOW_LANG.create({
        data: { ...item },
      });
    });

    knowledgebases?.map(async (item) => {
      item.DIALOGFLOW_PROJECT_ID_FK = data.DIALOGFLOW_PROJECT_ID;
      await prisma.DIALOGFLOW_KNOWLEDGEBASES.create({
        data: { ...item },
      });
    });
    console.log(newCred);
    const creds = await prisma.creds.findMany();
    const promise_array = creds?.map(async (item) => {
      for (const [key, value] of Object.entries(item)) {
        if (
          key.toLocaleLowerCase()?.includes("key") ||
          key.toLocaleLowerCase()?.includes("secret")
        ) {
          item[key] = "***********";
        }
      }
      item.knowledge_bases = await prisma.DIALOGFLOW_KNOWLEDGEBASES.findMany({
        where: { DIALOGFLOW_PROJECT_ID_FK: item.DIALOGFLOW_PROJECT_ID },
      });
      item.langs = await prisma.dIALOGFLOW_LANG.findMany({
        where: { DIALOGFLOW_PROJECT_ID_FK: item.DIALOGFLOW_PROJECT_ID },
      });
      return item;
    });
    await Promise.all(promise_array).then((data) => {
      console.log(data);
      response.status(200).send(data);
    });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: err.message });
  }
}
