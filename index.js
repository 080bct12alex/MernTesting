import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";
const git = simpleGit();

const commitMessages = [
  "Setup MongoDB schema for user module",
  "Integrated Next.js API routes",
  "Styled login page using Tailwind CSS",
  "Developed dashboard in React Native",
  "Optimized SSR in Next.js",
  "Added Express API for user auth",
  "Improved CSS grid layout",
  "Created reusable React components",
  "Redux state refactoring",
  "Linked React Native with REST API",
  "Polished UI with Tailwind",
  "Created custom React hooks",
  "Enhanced responsive design",
  "JWT authentication flow setup",
  "Connected backend to MongoDB Atlas",
  "Added REST API endpoints",
  "Implemented push notifications",
  "Optimized static rendering",
  "Fixed Tailwind responsiveness bugs",
  "Created HTML/CSS/JS landing page"
];

const isExcludedDate = (date) => {
  const year = date.year();
  const month = date.month(); // 0-indexed
  const day = date.date();

  return (
    (year === 2024 && (month === 8 || month === 9)) || // Sep, Oct 2024
    (year === 2025 && date.isBetween("2025-03-24", "2025-04-17", "day", "[]"))
  );
};

const getMaxCommits = (date) => {
  const year = date.year();
  const month = date.month();
  const day = date.date();

  if (isExcludedDate(date)) return 0;

  const isHighActivity =
    (year === 2024 && (month === 6 || month === 7 || month === 11)) || // Jul, Aug, Dec 2024
    (year === 2025 && (month === 0 || month === 1)); // Jan, Feb 2025

  const isModerateActivity =
    (year === 2024 && month === 10) || // Nov 2024
    (year === 2025 &&
      ((month === 2 && day <= 23) || // Mar 1–23
        (month === 3 && day >= 17) || // Apr 17–30
        (month === 4 && day <= 5))); // May 1–5

  if (isHighActivity) return random.int(6, 12);
  if (isModerateActivity) return random.int(3, 8);

  return random.int(1, 6);
};

const markCommit = (date, message, done) => {
  const data = { date };
  jsonfile.writeFile(path, data, () => {
    git.add([path]).commit(message, { "--date": date }, done);
  });
};

const makeCommits = async () => {
  const startDate = moment("2024-07-20");
  const endDate = moment("2025-05-05");
  let currentDate = startDate.clone();

  while (currentDate.isSameOrBefore(endDate)) {
    const maxCommits = getMaxCommits(currentDate);
    const isInactive = maxCommits === 0 || random.float() < 0.2;
    const commitsToday = isInactive ? 0 : random.int(1, maxCommits);

    for (let i = 0; i < commitsToday; i++) {
      const commitTime = currentDate.clone().add(i * 7, "minutes").format();
      const message = commitMessages[random.int(0, commitMessages.length - 1)];
      await new Promise((resolve) => {
        markCommit(commitTime, message, resolve);
      });
    }

    currentDate.add(1, "day");
  }

  git.push();
};

makeCommits();
