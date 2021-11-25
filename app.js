const files = {
  Eng_T1: "English Term I",
  SST_T1: "Social Science Term I",
};
let score = 0;
let index = 0;
let originalIndex = null;
const settings = {
  scoring: true,
  file: "Eng_T1",
};
async function readFile(file) {
  return await fetch(file + ".json").then((res) => res.json());
}

async function main() {
  // parse settings from url param
  updateSettings();
  if (!settings.scoring)
    document.querySelector(".score").style.display = "none";
  const cache = JSON.parse(localStorage.getItem("MCQ__TESTER__DATA"));

  const questions = await readFile(settings.file);

  if (cache && cache.index) {
    index = cache.index;
    originalIndex = cache.originalIndex;
  } else {
    index = Math.floor(Math.random() * questions.length);
    originalIndex = index;
    saveCache();
  }
  setupQuestion(questions[index]);

  document.querySelector("#next").addEventListener("click", () => {
    setupQuestion(questions[index]);
    resetStyles();
  });
}

main();

function setupQuestion(question) {
  document.querySelector(".question").textContent = question.question;
  document.querySelector(".option-a").textContent =
    "(a) " + question.options[0];
  document.querySelector(".option-b").textContent =
    "(b) " + question.options[1];
  document.querySelector(".option-c").textContent =
    "(c) " + question.options[2];
  document.querySelector(".option-d").textContent =
    "(d) " + question.options[3];
  const correct = question.correctOpt;
  const clickListener = (e) => {
    index = (index % 100) + 1;
    if (!e.target.classList.contains(`option-${correct}`)) {
      e.target.classList.add("incorrect");
      if (settings.scoring) wrongAnswer();
      else document.querySelector("#next").disabled = false;
    } else {
      if (settings.scoring) correctAnswer();
      document.querySelector("#next").disabled = false;
    }
    document.querySelector(`.option-${correct}`).classList.add("correct");
    options.forEach((option) =>
      option.removeEventListener("click", clickListener)
    );
  };
  const options = document.querySelectorAll(".option");
  options.forEach((option) => {
    option.addEventListener("click", clickListener);
  });
}

function resetStyles() {
  // disable #next
  document.querySelector("#next").disabled = true;
  // reset styles
  document.querySelectorAll(".option").forEach((option) => {
    option.classList.remove("correct");
    option.classList.remove("incorrect");
  });
}

function correctAnswer() {
  score++;
  document.querySelector(".score").textContent = score;
}

function wrongAnswer() {
  setTimeout(() => {
    document.querySelector(".score").textContent = score;
    saveCache();
    showModal();
    console.log("HELlo");
  }, 1000);
}

function saveCache() {
  localStorage.setItem(
    "MCQ__TESTER__DATA",
    JSON.stringify({ index, originalIndex, score })
  );
}

function showModal() {
  // set score-final
  document.querySelector("#score-final").textContent = score;
  document.querySelector(".modal").style.display = "flex";
}

function updateSettings() {
  const urlParams = new URLSearchParams(window.location.search);
  settings.scoring = urlParams.get("score") !== "false";
  settings.file = urlParams.get("file") || "Eng_T1";
  document.querySelector(".title").textContent = files[settings.file];
}
