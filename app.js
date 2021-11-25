// read 100qeng.txt file
async function readFile() {
  return await fetch("100qeng.txt").then((res) => res.text());
}

async function main() {
  const file = (await readFile()).replace(/[\r\n]+/g, " ");
  // regex match for questions
  const regex =
    /(\d+)\.\s+(.*?)\s+\(a\)\s+(.*?)\s+\(b\)\s+(.*?)\s+\(c\)\s+(.*?)\s+\(d\)\s+(.*?)\s+Ans\.\s+\((.)\)/gm;
  const questions = [...file.matchAll(regex)];

  const index = Math.floor(Math.random() * questions.length);
  setupQuestion(questions[index]);

  document.querySelector("#next").addEventListener("click", () => {
    const index = Math.floor(Math.random() * questions.length);
    setupQuestion(questions[index % 100]);
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
    if (!e.target.classList.contains(`option-${correct}`)) {
      e.target.classList.add("incorrect");
    }
    document.querySelector(`.option-${correct}`).classList.add("correct");
    options.forEach((option) =>
      option.removeEventListener("click", clickListener)
    );
    document.querySelector("#next").disabled = false;
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
