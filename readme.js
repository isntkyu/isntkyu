import * as fs from "fs";
import path from "path";

const __dirname = path.resolve();

const readmePath = path.join(__dirname, "README.md");

const readme = fs.readFileSync(readmePath, "utf8");

const newContent = `\ngithub action test\n`;

fs.appendFileSync(readmePath, newContent, (err) => {
  if (err) {
    console.error(err);
  }
});

console.log(readme);
