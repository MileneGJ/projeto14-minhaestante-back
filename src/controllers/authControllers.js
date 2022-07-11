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
        favorites: [],
        cart: [],
        bought: [],
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
        email: user.email,
      });

      res.status(202).send({
        token: token,
        name: user.name,
        userId: user._id,
        email: user.email,
        favorites: user.favorites,
        cart: user.cart,
        bought: user.bought,
      });
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
  const { password } = req.headers;
  const userById = await db
    .collection("users")
    .findOne({ _id: new objectId(id) });
  if (!userById) {
    res.sendStatus(404);
    return;
  } else if (bcrypt.compareSync(password, userById.password)) {
    try {
      await db.collection("users").deleteOne({ _id: new objectId(id) });
      res.sendStatus(204);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  } else {
    return res.sendStatus(401);
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

export async function sendListFromCollection(req, res) {
  const { field, id } = req.params;

  try {
    const currentUser = await db
      .collection("users")
      .findOne({ _id: new objectId(id) });

    switch (field) {
      case "favorites":
        return res.status(200).send(currentUser.favorites);
      case "cart":
        return res.status(200).send(currentUser.cart);
      case "bought":
        return res.status(200).send(currentUser.bought);
      default:
        break;
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
export async function deleteFromCart(req, res) {
  const { field, id } = req.params;
  try {
    const currentUser = await db
      .collection("users")
      .findOne({ _id: new objectId(id) });

    switch (field) {
      case "favorites":
        const newFavorite = currentUser.favorites.filter(
          (b) => b._id !== req.body.bookId
        );
        await db.collection("users").updateOne(
          {
            _id: new objectId(id),
          },
          {
            $set: { favorites: newFavorite },
          }
        );
        return res.status(200).send(newFavorite);
      case "cart":
        const newCart = currentUser.cart.filter(
          (b) => b._id !== req.body.bookId
        );
        await db.collection("users").updateOne(
          {
            _id: new objectId(id),
          },
          {
            $set: { cart: newCart },
          }
        );
        return res.status(200).send(newCart);

      default:
        break;
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
export async function addToUserCollection(req, res) {
  const { field, id } = req.params;
  let update;

  try {
    const currentUser = await db
      .collection("users")
      .findOne({ _id: new objectId(id) });

    switch (field) {
      case "favorites":
        if (currentUser.favorites.length > 0) {
          update = [...currentUser.favorites, res.locals.newBook];
        } else {
          update = [res.locals.newBook];
        }
        await db.collection("users").updateOne(
          {
            _id: new objectId(id),
          },
          {
            $set: {
              favorites: update,
            },
          }
        );
        break;

      case "cart":
        if (currentUser.cart.length > 0) {
          update = [...currentUser.cart, res.locals.newBook];
        } else {
          update = [res.locals.newBook];
        }
        await db.collection("users").updateOne(
          {
            _id: new objectId(id),
          },
          {
            $set: {
              cart: update,
            },
          }
        );
        break;

      case "bought":
        let boughtBook;
        if (res.locals.newBook.length) {
          boughtBook = [];
          for (let i = 0; i < res.locals.newBook.length; i++) {
            await db.collection("books").updateOne(
              {
                _id: new objectId(res.locals.newBook[i]._id),
              },
              {
                $set: {
                  status: "Comprado",
                },
              }
            );
            boughtBook.push(
              await db
                .collection("books")
                .findOne({ _id: new objectId(res.locals.newBook[i]._id) })
            );
          }

          if (currentUser.bought.length > 0) {
            update = [...currentUser.bought, ...boughtBook];
          } else {
            update = [...boughtBook];
          }
          console.log(update);
        } else {
          await db.collection("books").updateOne(
            {
              _id: new objectId(res.locals.newBook._id),
            },
            {
              $set: {
                status: "Comprado",
              },
            }
          );

          boughtBook = await db
            .collection("books")
            .findOne({ _id: new objectId(res.locals.newBook._id) });

          if (currentUser.bought.length > 0) {
            update = [...currentUser.bought, boughtBook];
          } else {
            update = [boughtBook];
          }
        }

        await db.collection("users").updateOne(
          {
            _id: new objectId(id),
          },
          {
            $set: {
              bought: update,
              cart: [],
            },
          }
        );
        break;
      default:
        break;
    }
    const updatedUser = await db
      .collection("users")
      .findOne({ _id: new objectId(id) });
    return res.status(200).send({
      token: res.locals.token,
      name: updatedUser.name,
      userId: updatedUser._id,
      email: updatedUser.email,
      favorites: updatedUser.favorites,
      cart: updatedUser.cart,
      bought: updatedUser.bought,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
