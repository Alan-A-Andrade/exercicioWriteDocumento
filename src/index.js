import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import { client } from './database.js';
import file from '../data.json' assert { type: 'json' };
import * as fs from 'fs';


const app = express();

dotenv.config()

app.use(cors());
app.use(json());
app.get("/createJson", find)
app.get("/jsonToVCS", toCSV)

app.listen(process.env.PORT || 5000);


async function find(req, res) {

  const data = await client.repositories.findMany({
    where: {
      hasSponsorship: true
    }
  })

  fs.writeFile("data.json", JSON.stringify(data), (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
      console.log("The written has the following contents:");
      console.log(fs.readFileSync("books.txt", "utf8"));
    }
  }
  )

  return res.send("ok")
}

async function toCSV(req, res) {

  const jsfile = file

  const arrays = jsfile.map(el => {
    return {
      name: el.name,
      owner: el.owner,
      description: el.description,
      topic: el.topic,
      language: el.language,
      stars: el.stars
    }
  })

  const array = arrays.sort(function (a, b) { return b.stars - a.stars });


  let text = `name, owner, description, topic, language, starts \n`
  array.forEach(el => {
    text += `"${el.name}","${el.owner}","${el.description}","${el.topic}","${el.language}",${el.stars} \n`
  }

  );

  fs.writeFile("data.csv", text, (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
      console.log("The written has the following contents:");
      console.log(fs.readFileSync("books.txt", "utf8"));
    }
  }
  )

  return res.send("ok")
}