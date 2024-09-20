import * as fs from "fs";
import path from "path";
import {getVelogCookie} from "./getSession.js";
import {getTotalView} from "./getTotalView.js";

const __dirname = path.resolve();

const readmePath = path.join(__dirname, "README.md");

const updateVelogTotal = fs.readFileSync(readmePath, "utf8");

const cookies = await getVelogCookie('github')

const totalView = await getTotalView(cookies)

console.log(totalView)

fs.appendFileSync(readmePath, `${totalView.getStats.total}`, (err) => {
  if (err) {
    console.error(err);
  }
});
