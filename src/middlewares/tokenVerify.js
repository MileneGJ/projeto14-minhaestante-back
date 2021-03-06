import { db } from "../dbStrategy/mongodb.js";

export async function tokenVerify(req, res, next) {
    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer ", "");
    res.locals.token = token
      if (!token) {
      return res.sendStatus(401);
      }
  
    const session = await db.collection("sessions").findOne({ token });
    if (!session) {
      return res.sendStatus(401);
    }
  
      const user = await db.collection("users").findOne({ 
          _id: session.userId 
      });
      if (!user) {
        return res.sendStatus(401);
      }
  
      res.locals.user = user;
  
    next();
  }