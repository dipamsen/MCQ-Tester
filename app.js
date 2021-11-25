let score = 0;
let index = 0;
let originalIndex = null;
let updateScores = true;
async function readFile() {
  return await fetch("100qeng.txt").then((res) => res.text());
}

async function main() {
  // parse settings from url param
  const settings = new URLSearchParams(window.location.search);
  updateScores = settings.get("score") !== "false";
  if (!updateScores) document.querySelector(".score").style.display = "none";
  const cache = JSON.parse(localStorage.getItem("MCQ__TESTER__DATA"));

  const file = (await readFile()).replace(/[\r\n]+/g, " ");
  // regex match for questions
  const regex =
    /(\d+)\.\s+(.*?)\s+\(a\)\s+(.*?)\s+\(b\)\s+(.*?)\s+\(c\)\s+(.*?)\s+\(d\)\s+(.*?)\s+Ans\.\s+\((.)\)/gm;
  const questions = [...file.matchAll(regex)];

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
  document.querySelector(".question").textContent = question[2];
  document.querySelector(".option-a").textContent = "(a) " + question[3];
  document.querySelector(".option-b").textContent = "(b) " + question[4];
  document.querySelector(".option-c").textContent = "(c) " + question[5];
  document.querySelector(".option-d").textContent = "(d) " + question[6];
  const correct = question[7];
  const clickListener = (e) => {
    index = (index % 100) + 1;
    if (!e.target.classList.contains(`option-${correct}`)) {
      e.target.classList.add("incorrect");
      if (updateScores) wrongAnswer();
      else document.querySelector("#next").disabled = false;
    } else {
      if (updateScores) correctAnswer();
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
