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
  serverTimestamp,
  getDocs
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
    awakening: result.awakening || null,
    smLabel: result.smLabel || null
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
   Helpers
========================= */

function calcTopPercent(greaterOrEqualCount, totalCount) {
  if (!totalCount) return 0;
  return Math.round((greaterOrEqualCount / totalCount) * 1000) / 10;
}

function getTrustInfo(totalCount) {
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
   Summary + Ranking
========================= */

export async function getStatsSummary(typeCode, title, result) {
  const globalRef = doc(db, "stats", "global");
  const typeRef = doc(db, "stats", `type_${typeCode}`);
  const titleRef = doc(db, "stats", `title_${title}`);

  const [globalSnap, typeSnap, titleSnap, resultsSnap, typeStatsSnap] = await Promise.all([
    getDoc(globalRef),
    getDoc(typeRef),
    getDoc(titleRef),
    getDocs(collection(db, "results")),
    getDocs(collection(db, "stats"))
  ]);

  const totalCount = globalSnap.exists() ? Number(globalSnap.data().count || 0) : 0;
  const typeCount = typeSnap.exists() ? Number(typeSnap.data().count || 0) : 0;
  const titleCount = titleSnap.exists() ? Number(titleSnap.data().count || 0) : 0;

  const typePercent =
    totalCount > 0 ? Math.round((typeCount / totalCount) * 1000) / 10 : 0;

  const titlePercent =
    totalCount > 0 ? Math.round((titleCount / totalCount) * 1000) / 10 : 0;

  const allResults = [];
  resultsSnap.forEach((docSnap) => {
    const data = docSnap.data();
    allResults.push({
      mPercent: Number(data.mPercent || 0),
      sPercent: Number(data.sPercent || 0),
      typeCode: data.typeCode || "",
      title: data.title || ""
    });
  });

  const greaterOrEqualM = allResults.filter(r => r.mPercent >= result.mPercent).length;
  const greaterOrEqualS = allResults.filter(r => r.sPercent >= result.sPercent).length;

  const mTopPercent = calcTopPercent(greaterOrEqualM, totalCount);
  const sTopPercent = calcTopPercent(greaterOrEqualS, totalCount);

  const mRank = greaterOrEqualM || 1;
  const sRank = greaterOrEqualS || 1;

  const typeStats = [];
  typeStatsSnap.forEach((docSnap) => {
    const id = docSnap.id;
    const data = docSnap.data();

    if (id.startsWith("type_")) {
      typeStats.push({
        code: id.replace("type_", ""),
        label: data.label || "",
        count: Number(data.count || 0)
      });
    }
  });

  typeStats.sort((a, b) => b.count - a.count);

  let typeRank = null;
  for (let i = 0; i < typeStats.length; i += 1) {
    if (typeStats[i].code === typeCode) {
      typeRank = i + 1;
      break;
    }
  }

  const trust = getTrustInfo(totalCount);

  return {
    totalCount,
    typeCount,
    titleCount,
    typePercent,
    titlePercent,
    mTopPercent,
    sTopPercent,
    mRank,
    sRank,
    typeRank,
    typeTotalKinds: typeStats.length,
    trust
  };
}

/* =========================
   Render Statistics HTML
========================= */

export function renderStatisticsHTML(summary, result) {
  if (summary.trust.mode === "hidden") {
    return `
      <div class="section-card">
        <h2>統計表示</h2>
        <p class="muted">${summary.trust.label}</p>
      </div>
    `;
  }

  return `
    <div class="section-card">
      <h2>統計表示</h2>
      <p class="muted">${summary.trust.label}</p>

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
          <strong>M度の上位%</strong>
          <span>上位 ${summary.mTopPercent}%</span>
        </div>

        <div class="stat-box">
          <strong>S度の上位%</strong>
          <span>上位 ${summary.sTopPercent}%</span>
        </div>

        <div class="stat-box">
          <strong>タイプ順位</strong>
          <span>${summary.typeRank || "-"}位 / ${summary.typeTotalKinds || 16}タイプ</span>
        </div>

        <div class="stat-box">
          <strong>Mスコア順位</strong>
          <span>${summary.mRank}位 / ${summary.totalCount}件</span>
        </div>

        <div class="stat-box">
          <strong>Sスコア順位</strong>
          <span>${summary.sRank}位 / ${summary.totalCount}件</span>
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