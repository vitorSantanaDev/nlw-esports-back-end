import express, { Request, Response } from "express";

const app = express();

app.get("/users", (req: Request, res: Response) => {
  return res.json([
    { name: "Vitor Santana" },
    { name: "Cassia Maria" },
    { name: "Cesar Araujo" },
    { name: "Cesar Araujo" },
  ]);
});

app.listen(3333, () => console.log(`Server is running in the port 3333 🚀`));
