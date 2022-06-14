const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", async function (req, res) {
  const data = await fs.readFile(path.join(__dirname, "db/db.json"));
  let jsonData = JSON.parse(data);
  jsonData=jsonData.map(function (note,i){
    return{
        ...note,
        id:i+1
    }
  })
  res.json(jsonData);
});

app.post("/api/notes", async function (req, res) {
  const data = await fs.readFile(path.join(__dirname, "db/db.json"));
  let jsonData = JSON.parse(data);
  
  jsonData.push(req.body);
  await fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(jsonData));
  res.sendStatus(200);
});

app.delete("/api/notes/:id", async function (req, res) {
  const data = await fs.readFile(path.join(__dirname, "db/db.json"));
  let jsonData = JSON.parse(data);
  jsonData = jsonData.filter(function (note,i) {
    return i+1 !== +req.params.id;
  });
  await fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(jsonData));
  res.sendStatus(200);
});

app.listen(3000, function () {
  console.log("listening on port 3000");
});
