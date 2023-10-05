import { PrismaClient } from "@prisma/client";
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

export default async function handler(request, response) {
  try {
    const prisma = new PrismaClient();
    const { email, name } = request.body;

    // Encrypt the password
    let encrypted_password = CryptoJs.AES.encrypt(
      request.body.password,
      process.env.SECRET_KEY
    ).toString();

    // Create a new user
    let user = await prisma.uSER.create({
      data: {
        EMAIL: email,
        PASSWORD: encrypted_password,
        FIRST_NAME: name,
        LAST_NAME: "",
        IMAGE: "",
        PASS_ID: "",
      },
    });

    console.log("created user");
    console.log(user);

    // Exclude the password field and create a JWT token
    const { PASSWORD, ...info } = user;
    const token = jwt.sign({ id: info.id }, process.env.SECRET_KEY, {
      expiresIn: "5d",
    });

    // Return the user information and token
    response.status(200).json({ ...info, new: true, token });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: err.message });
  }
}
