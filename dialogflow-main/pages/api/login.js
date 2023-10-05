import { PrismaClient } from "@prisma/client";
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

export default async function handler(request, response) {
  try {
    const prisma = new PrismaClient();
    const { email } = request.body;

    // Find the user by email
    let user = await prisma.uSER.findFirst({
      where: {
        EMAIL: email,
      },
    });

    if (user) {
      // Decrypt the user's password
      const bytes = CryptoJs.AES.decrypt(
        user.PASSWORD || "",
        process.env.SECRET_KEY
      );

      console.log("bytes");
      console.log(bytes);

      if (bytes.sigBytes > 0) {
        const originalPassword = bytes.toString(CryptoJs.enc.Utf8);

        // Check if the provided password matches the decrypted password
        if (originalPassword !== request.body?.password) {
          response.status(401).json("Wrong password or username! ");
          return;
        }
      }

      // Exclude the password field and create a JWT token
      const { PASSWORD, ...info } = user;
      const token = jwt.sign({ id: info.id }, process.env.SECRET_KEY, {
        expiresIn: "5d",
      });

      console.log("done");
      console.log(info);

      // Return the user information and token
      response.status(200).json({ ...info, new: true, token });
    } else {
      throw "User not found";
    }
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: err.message });
  }
}
