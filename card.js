import {
  getTitleResult,
  getHiddenTitle,
  getAwakening,
  getThemeClass,
  getNextInfo
} from "./titles.js";
import { TYPE_META, getSubtitle } from "./types.js";
import {
  getCompatibility,
  COMPATIBILITY_LABELS,
  getPairCompatibility,
  getReverseTypeCode
} from "./compatibility.js";
import { renderStatisticsHTML } from "./statistics.js";
import { renderShareButtons, getSharedProfileFromUrl } from "./share.js";

/* =========================
   Score / Result Helpers
========================= */

export function answerToScore(answer) {
  switch (answer) {
    case 1: return 2;
    case 2: return 1;
    case 3: return 0.5;
    case 4: return -1;
    case 5: return -2;
    default: return 0;
  }
}

export function calculateAxisScores(questions, answers) {
  const scores = { FI: 0, RC: 0, OA: 0, TP: 0 };

  for (const q of questions) {
    const answer = answers[q.id];
    if (!answer) continue;

    const raw = answerToScore(answer) * q.weight;

    const positive =
      (q.axis === "FI" && q.side === "F") ||
      (q.axis === "RC" && q.side === "R") ||
      (q.axis === "OA" && q.side === "O") ||
      (q.axis === "TP" && q.side === "T");

    scores[q.axis] += positive ? raw : -raw;
  }

  return scores;
}

export function getTypeCode(scores) {
  const f = scores.FI >= 0 ? "F" : "I";
  const r = scores.RC >= 0 ? "R" : "C";
  const o = scores.OA >= 0 ? "O" : "A";
  const t = scores.TP >= 0 ? "T" : "P";
  return `${f}${r}${o}${t}`;
}

export function calculateSMPercent(scores) {
  const F = Math.max(scores.FI, 0);
  const I = Math.max(-scores.FI, 0);
  const R = Math.max(scores.RC, 0);
  const C = Math.max(-scores.RC, 0);
  const O = Math.max(scores.OA, 0);
  const A = Math.max(-scores.OA, 0);
  const T = Math.max(scores.TP, 0);
  const P = Math.max(-scores.TP, 0);

  const mRaw = F + R + O + T;
  const sRaw = I + C + A + P;
  const total = mRaw + sRaw || 1;

  return {
    mPercent: Math.round((mRaw / total) * 100),
    sPercent: Math.round((sRaw / total) * 100)
  };
}

export function calculateFlatThinking(questions, answers) {
  let fRaw = 0;
  let fMax = 0;

  for (const q of questions) {
    if (q.axis === "FI" && q.side === "F") {
      const answer = answers[q.id];
      if (!answer) continue;
      const raw = Math.max(answerToScore(answer), 0) * q.weight;
      fRaw += raw;
      fMax += 2 * q.weight;
    }
  }

  return Math.round((fRaw / (fMax || 1)) * 100);
}

export function calculateHoldIndex(questions, answers) {
  const total = questions.length || 1;
  const hold = Object.values(answers).filter(v => v === 3).length;
  return Math.round((hold / total) * 100);
}

export function getSMComment(mPercent, sPercent, typeCode) {
  const diff = Math.abs(mPercent - sPercent);

  if (mPercent >= 95 && sPercent <= 5) {
    return "完全に受けの本能へ振り切れた、純度の高いMタイプ。";
  }

  if (sPercent >= 95 && mPercent <= 5) {
    return "主導権を握ることが自然な、純度の高いSタイプ。";
  }

  if (mPercent >= 85 && sPercent >= 85) {
    return "攻めも受けも極端に高い、危険なカオス領域。";
  }

  if (mPercent > sPercent && diff >= 20) {
    return "プレッシャーや受容の中で強さを発揮するタイプ。";
  }

  if (sPercent > mPercent && diff >= 20) {
    return "主導や駆け引きの中で楽しさを感じるタイプ。";
  }

  if (typeCode.startsWith("F")) {
    return "感情より構造を見ながら、立ち位置を柔軟に変える分析型。";
  }

  return "感情や体感を重視しながら、その場の濃度を楽しむタイプ。";
}

export function getSMLabel(mPercent, sPercent) {
  const mDiff = mPercent - sPercent;
  const sDiff = sPercent - mPercent;

  if (mPercent >= 70 && mDiff >= 40) {
    return "ドM";
  }

  if (sPercent >= 70 && sDiff >= 40) {
    return "ドS";
  }

  if (mDiff >= 20) {
    return "M";
  }

  if (sDiff >= 20) {
    return "S";
  }

  if (mDiff >= 15) {
    return "M寄り";
  }

  if (sDiff >= 15) {
    return "S寄り";
  }

  const labels = ["SM二刀流", "SM兼業"];
return labels[Math.floor(Math.random() * labels.length)];あと
}

export function normalizeAxisBar(score) {
  return Math.max(0, Math.min(100, Math.round(((score + 24) / 48) * 100)));
}

/* =========================
   Result Object
========================= */

export function buildResultObject(questions, answers) {
  const axisScores = calculateAxisScores(questions, answers);
  const typeCode = getTypeCode(axisScores);
  const typeMeta = TYPE_META[typeCode];
  const { mPercent, sPercent } = calculateSMPercent(axisScores);

  const titleRow = getTitleResult(mPercent, sPercent);
  const hiddenTitle = getHiddenTitle(mPercent, sPercent);
  const awakening = getAwakening(mPercent, sPercent);
  const next = getNextInfo(titleRow, mPercent, sPercent);

  const subtitle = getSubtitle(typeCode, titleRow.title);
  const themeClass = getThemeClass({
    rank: titleRow.rank,
    hiddenTitle,
    awakening,
    nextDiff: next.nextDiff
  });

  return {
    typeCode,
    typeName: typeMeta.name,
    typeShortCopy: typeMeta.shortCopy,
    typeDescription: typeMeta.description,

    title: titleRow.title,
    rank: titleRow.rank,
    titleType: titleRow.type,
    titleComment: titleRow.comment,
    subtitle,

    smComment: getSMComment(mPercent, sPercent, typeCode),
    smLabel: getSMLabel(mPercent, sPercent),

    mPercent,
    sPercent,

    nextTitle: next.nextTitle,
    nextDiff: next.nextDiff,

    axes: {
      FI: normalizeAxisBar(axisScores.FI),
      RC: normalizeAxisBar(axisScores.RC),
      OA: normalizeAxisBar(axisScores.OA),
      TP: normalizeAxisBar(axisScores.TP)
    },

    rawAxisScores: axisScores,

    flatThinking: calculateFlatThinking(questions, answers),
    holdIndex: calculateHoldIndex(questions, answers),

    hiddenTitle: hiddenTitle ? hiddenTitle.name : null,
    hiddenTheme: hiddenTitle ? hiddenTitle.theme : "",
    awakening: awakening ? awakening.name : null,
    awakeningTheme: awakening ? awakening.theme : "",

    themeClass
  };
}

/* =========================
   HTML Parts
========================= */

function barRow(label, percent) {
  return `
    <div class="gauge-row">
      <strong>${label}</strong>
      <div class="bar">
        <div class="bar-fill" style="width:${percent}%"></div>
      </div>
      <span>${percent}%</span>
    </div>
  `;
}

function axisRow(label, percent) {
  return `
    <div class="axis-row">
      <strong>${label}</strong>
      <div class="bar">
        <div class="bar-fill" style="width:${percent}%"></div>
      </div>
      <span>${percent}%</span>
    </div>
  `;
}

function renderMetaPills(result) {
  const pills = [];

  pills.push(`<div class="meta-pill">Rank: ${result.rank}</div>`);
  pills.push(`<div class="meta-pill">FLAT思考指数 ${result.flatThinking}%</div>`);
  pills.push(`<div class="meta-pill">保留指数 ${result.holdIndex}%</div>`);

  if (result.hiddenTitle) {
    pills.push(`<div class="meta-pill">隠し称号 ${result.hiddenTitle}</div>`);
  }

  if (result.awakening) {
    pills.push(`<div class="meta-pill">覚醒 ${result.awakening}</div>`);
  }

  return `<div class="meta-line">${pills.join("")}</div>`;
}

function renderSMBigLabel(result) {
  return `
    <div class="sm-big-label">
      あなたは <strong>${result.smLabel}</strong> です
    </div>
  `;
}

/* =========================
   Main Result Card
========================= */

export function renderResultCardHTML(result) {
  return `
    <div class="result-card ${result.themeClass}">
      <div class="result-topline">${result.typeCode} × ${result.title}</div>
      <div class="result-main-title">【${result.typeName}】</div>
      <div class="result-subtitle">―${result.subtitle}―</div>

      <div class="result-title-comment">「${result.titleComment}」</div>
      <div class="result-sm-comment">${result.smComment}</div>
      ${renderSMBigLabel(result)}

      <div class="gauge-block">
        ${barRow("S", result.sPercent)}
        ${barRow("M", result.mPercent)}
      </div>

      ${
        result.nextTitle
          ? `<div class="next-box">NEXT：あと${result.nextDiff}%で ${result.nextTitle}<br><small class="next-note">※もう一度診断すると結果が変わる可能性があります</small></div>`
          : ``
      }

      <div class="axis-block">
        ${axisRow("F/I", result.axes.FI)}
        ${axisRow("R/C", result.axes.RC)}
        ${axisRow("O/A", result.axes.OA)}
        ${axisRow("T/P", result.axes.TP)}
      </div>

      ${renderMetaPills(result)}
    </div>
  `;
}

export function renderTypeDetailHTML(result) {
  return `
    <div class="section-card">
      <h2>${result.typeName}</h2>
      <p class="muted">${result.typeShortCopy}</p>
      <p>${result.typeDescription}</p>
    </div>
  `;
}

function renderPairCompatibilityHTML(result) {
  const shared = getSharedProfileFromUrl();

  if (!shared) {
    return "";
  }

  const otherType = TYPE_META[shared.typeCode];
  if (!otherType) {
    return "";
  }

  const pair = getPairCompatibility(
    {
      typeCode: result.typeCode,
      mPercent: result.mPercent,
      sPercent: result.sPercent
    },
    {
      typeCode: shared.typeCode,
      mPercent: shared.mPercent,
      sPercent: shared.sPercent
    }
  );

  return `
    <div class="section-card">
      <h2>🤝 相性診断</h2>
      <div class="pair-card">
        <div class="pair-line">あなた：${result.typeCode}【${result.typeName}】</div>
        <div class="pair-line">相手：${shared.typeCode}【${otherType.name}】</div>

        <div class="pair-score">${pair.score}%</div>
        <div class="pair-rank">${pair.rankName}</div>
        <p class="muted">${pair.rankDescription}</p>

        ${
          pair.awakening
            ? `<div class="next-box">覚醒：${pair.awakening}</div>`
            : ``
        }

        ${
          pair.nextName
            ? `<div class="next-box">あと${pair.nextDiff}%で ${pair.nextName}</div>`
            : ``
        }
      </div>
    </div>
  `;
}

function renderReverseTypeHTML(result) {
  const shared = getSharedProfileFromUrl();

  if (!shared) {
    return "";
  }

  const reverseCode = getReverseTypeCode(result.typeCode);
  const reverseType = TYPE_META[reverseCode];

  if (!reverseType) {
    return "";
  }

  return `
    <div class="section-card">
      <h2>⚡ 真逆タイプ</h2>
      <div class="compat-item">
        <strong>${reverseCode}</strong>
        <p>${reverseType.name}</p>
      </div>
    </div>
  `;
}

export function renderCompatibilityCategoryHTML(typeCode, typeNameMap = TYPE_META) {
  const compatibility = getCompatibility(typeCode);

  return `
    <div class="section-card">
      <h2>相性タイプ</h2>

      ${["good", "calm", "stimulus", "bad"].map(key => `
        <div class="compat-group">
          <h3>${COMPATIBILITY_LABELS[key]}</h3>
          ${
            compatibility[key].map(([code, reason]) => `
              <div class="compat-item">
                <strong>${typeNameMap[code]?.name || code}（${code}）</strong>
                <p>${reason}</p>
              </div>
            `).join("")
          }
        </div>
      `).join("")}
    </div>
  `;
}

/* =========================
   Full Result HTML
========================= */

export function renderFullResultHTML(result, statsSummary = null) {
  const parts = [];

  parts.push(renderResultCardHTML(result));
  parts.push(renderShareButtons());
  parts.push(renderTypeDetailHTML(result));

  const pairSection = renderPairCompatibilityHTML(result);
  if (pairSection) {
    parts.push(pairSection);
  }

  const reverseSection = renderReverseTypeHTML(result);
  if (reverseSection) {
    parts.push(reverseSection);
  }

  parts.push(renderCompatibilityCategoryHTML(result.typeCode));

  if (statsSummary) {
    parts.push(renderStatisticsHTML(statsSummary, result));
  }

  return parts.join("");
}