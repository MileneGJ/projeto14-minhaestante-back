import bcrypt from "bcrypt";
import { db, objectId } from "../dbStrategy/mongodb.js";
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

export async function deleteUser(req, res) {
  const { id } = req.params;
  const user = req.body;
  const userById = await db
    .collection("users")
    .findOne({ _id: new objectId(id) });

  if (!userById) {
    res.sendStatus(404);
    return;
  } else if (bcrypt.compareSync(user.password, userById.password)) {
    try {
      await db.collection("users").deleteOne({ _id: new objectId(id) });
      res.sendStatus(204);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
  else{
    return res.sendStatus(401)
  }
}

export async function putUser(req, res) {
  const { id } = req.params;
  const user = req.body;

  const passwordHash = bcrypt.hashSync(user.password, 10);
  const passConfirmHash = bcrypt.hashSync(user.passConfirm, 10);
  const userById = await db
    .collection("users")
    .findOne({ _id: new objectId(id) });

  if (!userById) {
    res.sendStatus(404);
    return;
  } else if (
    user.password === user.passConfirm &&
    bcrypt.compareSync(user.oldPassword, userById.password)
  ) {
    try {
      await db.collection("users").updateOne(
        {
          _id: new objectId(id),
        },
        {
          $set: {
            name: user.name,
            email: user.email,
            password: passwordHash,
            passConfirm: passConfirmHash,
          },
        }
      );
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  } else {
    return res
      .status(400)
      .send("Não foi possível atualizar o usuário, verifique os dados");
  }
}
