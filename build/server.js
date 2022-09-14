import express from "express";
const app = express();
app.get("/users", (req, res) => {
    return res.json([{ name: "Vitor Santana" }, { name: "Cassia Maria" }]);
});
app.listen(3333, () => console.log(`Server is running in the port 3333 🚀`));
