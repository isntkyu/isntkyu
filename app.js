import * as fs from "fs";
import path from "path";
import {getVelogCookie} from "./getSession.js";
import {getTotalView} from "./getTotalView.js";
import dayjs from "dayjs";

const __dirname = path.resolve();

const readmePath = path.join(__dirname, "README.md");

const updateVelogTotal = fs.readFileSync(readmePath, "utf8");

const cookies = await getVelogCookie('github')

const totalView = await getTotalView(cookies)

const totalViewsStr = totalView.toLocaleString()
const now = dayjs().format('YYYY-MM-DD')

// const velogData = '### Velog Total Views: '
const dynamicData = totalViewsStr + ` (auto-updated ${now} by Github Action)\n`

const updatedData = updateVelogTotal.replace(/(### Velog Total Views:).*/, `$1 ${dynamicData}`);


fs.writeFileSync(readmePath, updatedData, (err) => {
  if (err) {
    console.error(err);
  }
});

process.exit()
