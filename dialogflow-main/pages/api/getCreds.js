//import { db } from "@vercel/postgres";
import { PrismaClient } from "@prisma/client";

export default async function handler(request, response) {
  try {
    const prisma = new PrismaClient();

    const { user_id } = request.query;
    /*
    //getting data with prisma function and testing with create()
    let getDataPrisma = async () => {
      const newCred = await prisma.creds.create({
        data: {
          DIALOGFLOW: "test5",
          AZURETTS: "test6",
          CLOUDINARY: "test7",
        },
      });
      console.log(newCred);
      const creds = await prisma.creds.findMany();
      console.log(creds);
      return creds;
    };
    getDataPrisma();*/

    //get data with postgres func
    /*
    let client;
    console.log("waiting to make conn...");
    client = await db.connect();
    console.log("waiting to make request ....");
    const creds = await client.sql`SELECT * FROM creds;`;
    console.log("success");
    */
    //get data with prisma
    const creds = await prisma.creds.findMany({
      where: {
        USER_ID: parseInt(user_id) || 1,
      },
    });
    console.log(creds);
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
      response.status(200).send(data);
    });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: err.message });
  } /*finally {
    if (client) client.release();
  }*/
}
