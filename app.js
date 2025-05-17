import * as fs from "fs";
import path from "path";
import { getVelogCookie } from "./getSession.js";
import { getTotalView } from "./getTotalView.js";
import dayjs from "dayjs";

const __dirname = path.resolve();

const getReadmePath = () => path.join(__dirname, "README.md");

const readFileContent = (filePath) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error('파일을 읽는 중 오류가 발생했습니다:', error);
    throw error;
  }
};

const formatTotalViews = (totalView) => {
  const totalViewsStr = totalView.toLocaleString();
  const now = dayjs().format('YYYY-MM-DD');
  return `${totalViewsStr} (auto-updated ${now} by Github Action)`;
};

const updateReadmeContent = (content, dynamicData) => {
  return content.replace(/(### Velog Total Views:).*/, `$1 ${dynamicData}`);
};

const writeFileContent = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, content);
  } catch (error) {
    console.error('파일을 쓰는 중 오류가 발생했습니다:', error);
    throw error;
  }
};

const main = async () => {
  try {
    const readmePath = getReadmePath();
    const content = readFileContent(readmePath);

    const cookies = await getVelogCookie('github');
    const totalView = await getTotalView(cookies);

    const formattedData = formatTotalViews(totalView);
    const updatedContent = updateReadmeContent(content, formattedData);

    writeFileContent(readmePath, updatedContent);
  } catch (error) {
    console.error('프로그램 실행 중 오류가 발생했습니다:', error);
    process.exit(1);
  }
};

main().finally(() => process.exit());
