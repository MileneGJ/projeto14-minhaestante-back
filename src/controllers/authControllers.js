import bcrypt from "bcrypt";
import { db } from "../dbStrategy/mongodb.js";
import { v4 as uuid } from "uuid";

export async function signUp(req, res) {
  const user = req.body;
  const passwordHash = bcrypt.hashSync(user.password, 10);
  const passConfirmHash = bcrypt.hashSync(user.passConfirm, 10);
  const email = user.email;
  try {
    const participantEmail = await db.collection("users").findOne({ email });
    if (participantEmail) {
      res.status(409).send("E-mail ja utilizado");
    } else {
      await db.collection("users").insertOne({
        ...user,
        password: passwordHash,
        passConfirm: passConfirmHash,
      });
      res.sendStatus(201);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;
  try {
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(404).send("Usuário não cadastrado!");
    }
    if (user && bcrypt.compareSync(password, user.password)) {
      //comparing if the passwords match: the one that was given now and the one on db
      const token = uuid();

      await db.collection("sessions").insertOne({
        userId: user._id,
        name: user.name,
        token,
      });

      res.status(202).send({ token: token, name: user.name, userId: user._id });
    } else {
      return res.status(401).send("Email ou senha incorretos");
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
