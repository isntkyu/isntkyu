import * as fs from "fs";
import path from "path";
import {getVelogCookie} from "./getSession.js";
import {getTotalView} from "./getTotalView.js";

const __dirname = path.resolve();

const readmePath = path.join(__dirname, "README.md");

const updateVelogTotal = fs.readFileSync(readmePath, "utf8");

const cookies = await getVelogCookie('github')

const totalView = await getTotalView(cookies)

const totalViewsStr = totalView.toLocaleString()
const now = new Date()

const velogData = '\n---\n## VelogTotalViews: ' + totalViewsStr + ` (updated_at: ${now.toString()}) \n --- \n`

fs.appendFileSync(readmePath, velogData, (err) => {
  if (err) {
    console.error(err);
  }
});

process.exit()
