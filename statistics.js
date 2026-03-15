/*
このファイルは Firebase Firestore を使って
- 診断結果保存
- 簡易統計表示
を行う

前提:
firebase.js で以下が export されていること
- db
- addDoc
- collection
- doc
- getDoc
- setDoc
- increment
- serverTimestamp
*/

import {
  db,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  increment,
  serverTimestamp
} from "./firebase.js";

/* =========================
   Save Result
========================= */

export async function saveDiagnosisResult(result) {
  await addDoc(collection(db, "results"), {
    createdAt: serverTimestamp(),
    typeCode: result.typeCode,
    typeName: result.typeName,
    title: result.title,
    rank: result.rank,
    mPercent: result.mPercent,
    sPercent: result.sPercent,
    flatThinking: result.flatThinking,
    holdIndex: result.holdIndex,
    hiddenTitle: result.hiddenTitle || null,
    awakening: result.awakening || null
  });

  const globalRef = doc(db, "stats", "global");
  const typeRef = doc(db, "stats", `type_${result.typeCode}`);
  const titleRef = doc(db, "stats", `title_${result.title}`);

  await setDoc(
    globalRef,
    {
      count: increment(1),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );

  await setDoc(
    typeRef,
    {
      count: increment(1),
      label: result.typeName,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );

  await setDoc(
    titleRef,
    {
      count: increment(1),
      label: result.title,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

/* =========================
   Read Summary
========================= */

export async function getStatsSummary(typeCode, title) {
  const globalRef = doc(db, "stats", "global");
  const typeRef = doc(db, "stats", `type_${typeCode}`);
  const titleRef = doc(db, "stats", `title_${title}`);

  const [globalSnap, typeSnap, titleSnap] = await Promise.all([
    getDoc(globalRef),
    getDoc(typeRef),
    getDoc(titleRef)
  ]);

  const totalCount = globalSnap.exists() ? Number(globalSnap.data().count || 0) : 0;
  const typeCount = typeSnap.exists() ? Number(typeSnap.data().count || 0) : 0;
  const titleCount = titleSnap.exists() ? Number(titleSnap.data().count || 0) : 0;

  const typePercent =
    totalCount > 0 ? Math.round((typeCount / totalCount) * 1000) / 10 : 0;

  const titlePercent =
    totalCount > 0 ? Math.round((titleCount / totalCount) * 1000) / 10 : 0;

  return {
    totalCount,
    typeCount,
    titleCount,
    typePercent,
    titlePercent
  };
}

/* =========================
   Trust Level
========================= */

export function getStatsTrustInfo(totalCount) {
  if (totalCount < 30) {
    return {
      mode: "hidden",
      label: "統計データが少ないため、比較表示は非表示です。"
    };
  }

  if (totalCount < 100) {
    return {
      mode: "reference",
      label: "統計データが集まり始めているため、参考値として表示しています。"
    };
  }

  if (totalCount < 500) {
    return {
      mode: "normal",
      label: "統計データが一定以上集まっているため、通常表示の統計です。"
    };
  }

  return {
    mode: "high",
    label: "統計データが十分に集まっているため、高信頼の統計です。"
  };
}

/* =========================
   Render Statistics HTML
========================= */

export function renderStatisticsHTML(summary, result) {
  const trust = getStatsTrustInfo(summary.totalCount);

  if (trust.mode === "hidden") {
    return `
      <div class="section-card">
        <h2>統計表示</h2>
        <p class="muted">${trust.label}</p>
      </div>
    `;
  }

  return `
    <div class="section-card">
      <h2>統計表示</h2>
      <p class="muted">${trust.label}</p>

      <div class="stats-grid">
        <div class="stat-box">
          <strong>累計診断数</strong>
          <span>${summary.totalCount}件</span>
        </div>

        <div class="stat-box">
          <strong>このタイプの件数</strong>
          <span>${summary.typeCount}件</span>
        </div>

        <div class="stat-box">
          <strong>この称号の件数</strong>
          <span>${summary.titleCount}件</span>
        </div>

        <div class="stat-box">
          <strong>タイプ人口割合</strong>
          <span>${summary.typePercent}%</span>
        </div>

        <div class="stat-box">
          <strong>称号レア度</strong>
          <span>${summary.titlePercent}%</span>
        </div>

        <div class="stat-box">
          <strong>FLAT思考指数</strong>
          <span>${result.flatThinking}%</span>
        </div>

        <div class="stat-box">
          <strong>保留指数</strong>
          <span>${result.holdIndex}%</span>
        </div>

        <div class="stat-box">
          <strong>M度</strong>
          <span>${result.mPercent}%</span>
        </div>

        <div class="stat-box">
          <strong>S度</strong>
          <span>${result.sPercent}%</span>
        </div>
      </div>
    </div>
  `;
}
