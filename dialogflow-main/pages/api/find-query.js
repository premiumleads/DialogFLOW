const { Deta } = require("deta");
import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  //initializing deta base to register filename in it
  //const deta = Deta(process.env.DETA_KEY);
  //const space = deta.Base(process.env.DETA_FILE_NAME_BASE);
  const prisma = new PrismaClient();

  //get link with prisma
  const mp3File = await prisma.mP3Link.findUnique({
    where: {
      KEY: req.body.text,
    },
  });
  console.log(mp3File);
  if (mp3File) {
    res.send({
      found: true,
      audio: mp3File.VALUE,
    });
  } else {
    res.send({
      found: false,
    });
  }
  //get link with deta
  /*
  await space.get(req.body.text).then((data) => {
    console.log("SEARCHED FOR :", req.body.text, "DATA =>", data);
    if (data) {
      res.send({
        found: true,
        /**
         * 
         *       const respo = cloudinary.uploader.upload(
        `data:audio/mpeg;base64,${audioBase64}`,

        {
          resource_type: "video",
          public_id: key,
          folder: "Mp3Files",
        }
      ); get elt with this above
         
        audio: data,
      });
    } else {
      res.send({
        found: false,
      });
    }
  });*/
}
