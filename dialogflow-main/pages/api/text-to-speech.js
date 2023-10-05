const {
  AudioConfig,
  SpeechConfig,
  SpeechSynthesisOutputFormat,
  SpeechSynthesizer,
  PullAudioOutputStream,
} = require("microsoft-cognitiveservices-speech-sdk");
const { v4: uuidv4 } = require("uuid");
const { Deta } = require("deta");
const TextDecoder = require("util").TextDecoder;
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  try {
    let { audioBase64, filename, type, api_type } = req.body;

    //audio HTML response  and URL
    let audioDataHtml, audioUrl;
    //const filename = uuidv4();

    const audioData = new Uint8Array(0);
    const pullStream = PullAudioOutputStream.createPullStream();
    const key = req.body.filename;

    //initializing deta info to save file to deta drive
    /*
    const deta = Deta(process.env.DETA_KEY);
    const space = deta.Drive(process.env.DETA_DRIVE);

    const saveMp3File = async () => {
      console.log("function oncomplete");
      const audioBase64 = Buffer.from(audioData).toString("base64");

      const key = `${filename}.mp3`;
      // Get file info
      /*const file = await space.get("07elqwwamzx1");
            console.log(file)
      // Generate shareable link
      //const link = `https://deta.space/docs/files/${file?.value}?username=${file?.username}`;

      //  putting file to deta drive

      try {
        await space
          .put(key, {
            data: `data:audio/mpeg;base64,${audioBase64}`,
          })
          .then(async (name) => {
            audioUrl = `https://drive.deta.sh/v1/${process.env.PROJECT_KEY}/${process.env.DETA_DRIVE}/${name}`;

            /*audioDataHtml =`
                  <a href="${audioUrl}"  target="_blank">
                    ${`${audioUrl}`}	
                  </a>
                  <p>
                    ${`${audioUrl}`}
                  </p>
                `;

            console.log("oncomplete done");
            console.log(name);
          });
      } catch (error) {
        console.log(`Error putting file to Deta Drive: ${error}`);
        throw error;
      }

      console.log("done");
    };
    await saveMp3File().then((v, err) => {
      if (err) {
        throw err;
      }

      console.log("after function done");
      res.setHeader("Content-Type", "text/html");
      res.status(200).send(audioDataHtml);
    });
*/

    //saving the file on cloudinary
    const saveMp3File = async () => {
      //initializing deta base to register filename in it
      const prisma = new PrismaClient();
      //const deta = Deta(process.env.DETA_KEY);
      //const space = deta.Base(process.env.DETA_FILE_NAME_BASE);
      //getting unique credential from db
      const uniqueCred = await prisma.creds.findUnique({
        where: {
          DIALOGFLOW_PROJECT_ID: req.query.projectid || "",
        },
      });
      // Configuration
      cloudinary.config({
        cloud_name:
          uniqueCred?.CLOUDINARY_CLOUD_NAME ||
          process.env.CLOUDINARY_CLOUD_NAME,
        api_key:
          uniqueCred?.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY,
        api_secret:
          uniqueCred?.CLOUDINARY_API_SECRET ||
          process.env.CLOUDINARY_API_SECRET,
      });

      // Upload

      const respo = cloudinary.uploader.upload(
        `data:audio/mpeg;base64,${audioBase64}`,

        {
          resource_type: "video",
          public_id: key,
          folder: "Mp3Files",
        }
      );

      await respo
        .then(async (data) => {
          audioDataHtml = data.secure_url;
          console.log("putting item");
          console.log(filename);
          /*space
            .put(data.secure_url, filename)
            .then((v) => console.log("put item !"));
            */
          //saving file with prisma
          const newMP3 = await prisma.mP3Link.create({
            data: {
              TYPE: type,
              VALUE: data.secure_url,
              API_TYPE: api_type,
              KEY: filename,
            },
          });
        })
        .catch((err) => {
          console.log("error with setting the file on cloudinary");
          console.log(err);
        });

      //save filename in deta

      // https://res.cloudinary.com/<cloud_name>/image/upload/h_150,w_100/olympic_flag
    };
    await saveMp3File().then((v, err) => {
      if (err) {
        console.log(err);
        throw err;
      }
      res.setHeader("Content-Type", "text/html");
      res.status(200).send(audioDataHtml);
    });
    /*await new Promise( resolve => {
          console.log("resolving")
           synthesizer.speakTextAsync(text,resolve,err=>{
            throw err;
          })
        }).then(async (e) => {
          console.log("resolved")
          await synthesisCompleted(e).then(()=>{
            console.log("oncomplete done")
              audioDataHtml+=`
              <a href="${audioUrl}"  target="_blank">
                ${`${audioUrl}`}	
              </a>
              <p>
                ${`${audioUrl}`}
              </p>
            `;
              res.setHeader('Content-Type','text/html');          
              res.status(200).send(audioDataHtml);
              
              synthesizer.close();
              console.log("done")

          })

        })/*.then(()=>{  
          console.log(audioUrl)
            audioDataHtml+=`
            <a href="${audioUrl}"  target="_blank">
              ${`${audioUrl}`}	
            </a>
            <p>
              ${`${audioUrl}`}
            </p>
          `;
        })*/
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

// Usage:
// const audioDataHtml = await createAudioFile("Hello world", "af-ZA-WillemNeural", "en-US", "your-deta-key", "your-deta-base");
