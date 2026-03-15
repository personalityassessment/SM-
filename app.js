import { getFixedQuestions, getPoolQuestions } from "./questions.js";
import { buildResultObject, renderFullResultHTML } from "./card.js";
import { bindShareButtons } from "./share.js";
import { saveDiagnosisResult, getStatsSummary } from "./statistics.js";

const SESSION_KEY = "sm_diagnosis_session_v2";
const RESULT_KEY = "sm_diagnosis_result_v2";

const FIXED_COUNT = 8;
const RANDOM_PER_AXIS = 22;
const TOTAL_COUNT = 96;
const TOTAL_NETA_COUNT = 24;

const startScreen = document.getElementById("startScreen");
const questionScreen = document.getElementById("questionScreen");
const resultScreen = document.getElementById("resultScreen");
const questionText = document.getElementById("questionText");
const progress = document.getElementById("progress");
const resultCard = document.getElementById("resultCard");
const compatibility = document.getElementById("compatibility");

let currentQuestions = [];
let currentAnswers = {};
let currentIndex = 0;

function shuffle(array) {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function sample(array, count) {
  return shuffle(array).slice(0, count);
}

function countNeta(list) {
  return list.filter(q => q.category === "neta").length;
}

function createQuestionSet() {
  const fixed = getFixedQuestions();
  const pool = getPoolQuestions();

  if (fixed.length !== FIXED_COUNT) {
    throw new Error(`固定質問が ${FIXED_COUNT} 問ではありません。現在 ${fixed.length} 問`);
  }

  const fixedNetaCount = countNeta(fixed);
  const needRandomNeta = TOTAL_NETA_COUNT - fixedNetaCount;

  const axes = ["FI", "RC", "OA", "TP"];
  const baseNeta = Math.floor(needRandomNeta / axes.length);
  const remainder = needRandomNeta % axes.length;

  const picked = [];

  axes.forEach((axis, index) => {
    const axisPool = pool.filter(q => q.axis === axis);
    const netaPool = axisPool.filter(q => q.category === "neta");
    const normalPool = axisPool.filter(q => q.category !== "neta");

    const netaNeed = baseNeta + (index < remainder ? 1 : 0);
    const normalNeed = RANDOM_PER_AXIS - netaNeed;

    if (axisPool.length < RANDOM_PER_AXIS) {
      throw new Error(`${axis} 軸の質問が不足しています`);
    }
    if (netaPool.length < netaNeed) {
      throw new Error(`${axis} 軸のネタ質問が不足しています`);
    }
    if (normalPool.length < normalNeed) {
      throw new Error(`${axis} 軸の通常質問が不足しています`);
    }

    picked.push(...sample(netaPool, netaNeed));
    picked.push(...sample(normalPool, normalNeed));
  });

  const finalQuestions = shuffle([...fixed, ...picked]);

  if (finalQuestions.length !== TOTAL_COUNT) {
    throw new Error(`出題数が ${TOTAL_COUNT} 問ではありません`);
  }
  if (countNeta(finalQuestions) !== TOTAL_NETA_COUNT) {
    throw new Error(`ネタ質問数が ${TOTAL_NETA_COUNT} 問ではありません`);
  }

  return finalQuestions;
}

function saveSession() {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      questions: currentQuestions,
      answers: currentAnswers,
      index: currentIndex
    })
  );
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function saveResult(result) {
  localStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

function clearResult() {
  localStorage.removeItem(RESULT_KEY);
}

function renderQuestion() {
  if (!currentQuestions.length) return;

  const q = currentQuestions[currentIndex];
  if (!q) return;

  questionText.textContent = `Q${currentIndex + 1}. ${q.text}`;
  progress.textContent = `${currentIndex + 1} / ${currentQuestions.length}`;

  const buttons = Array.from(document.querySelectorAll("#answers button"));
  buttons.forEach((btn, i) => {
    const answerValue = i + 1;
    btn.style.opacity = currentAnswers[q.id] === answerValue ? "1" : "0.85";
    btn.style.outline = currentAnswers[q.id] === answerValue ? "2px solid rgba(255,255,255,.6)" : "none";
  });
}

window.startDiagnosis = function startDiagnosis() {
  clearSession();
  clearResult();

  currentQuestions = createQuestionSet();
  currentAnswers = {};
  currentIndex = 0;

  startScreen.style.display = "none";
  resultScreen.style.display = "none";
  questionScreen.style.display = "block";

  saveSession();
  renderQuestion();
};

window.answer = function answer(value) {
  const q = currentQuestions[currentIndex];
  if (!q) return;

  currentAnswers[q.id] = value;
  saveSession();

  if (currentIndex < currentQuestions.length - 1) {
    currentIndex += 1;
    saveSession();
    renderQuestion();
    return;
  }

  finishDiagnosis();
};

window.goPrevQuestion = function goPrevQuestion() {
  if (!currentQuestions.length) return;

  if (currentIndex > 0) {
    currentIndex -= 1;
    saveSession();
    renderQuestion();
    return;
  }

  // 1問目ならトップへ戻す
  clearSession();
  startScreen.style.display = "block";
  questionScreen.style.display = "none";
  resultScreen.style.display = "none";
};

async function finishDiagnosis() {
  const result = buildResultObject(currentQuestions, currentAnswers);
  saveResult(result);
  clearSession();

  startScreen.style.display = "none";
  questionScreen.style.display = "none";
  resultScreen.style.display = "block";

  let statsSummary = null;

  try {
    await saveDiagnosisResult(result);
    statsSummary = await getStatsSummary(result.typeCode, result.title);
  } catch (error) {
    console.error("Firebase保存または統計取得に失敗:", error);
  }

  resultCard.innerHTML = renderFullResultHTML(result, statsSummary);
  compatibility.innerHTML = "";
  bindShareButtons(result);
}

function bootFromSavedResult() {
  const raw = localStorage.getItem(RESULT_KEY);
  if (!raw) return false;

  try {
    const result = JSON.parse(raw);

    startScreen.style.display = "none";
    questionScreen.style.display = "none";
    resultScreen.style.display = "block";

    resultCard.innerHTML = renderFullResultHTML(result, null);
    compatibility.innerHTML = "";
    bindShareButtons(result);
    return true;
  } catch {
    return false;
  }
}

(function init() {
  // 途中の質問再開はしない
  clearSession();

  if (bootFromSavedResult()) return;

  startScreen.style.display = "block";
  questionScreen.style.display = "none";
  resultScreen.style.display = "none";
})();