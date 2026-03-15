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

function buildAnalysisComments(summary, result) {
  const comments = [];

  if (summary.mTopPercent <= 3) {
    comments.push(`上位${summary.mTopPercent}%のドM適性`);
  } else if (summary.sTopPercent <= 3) {
    comments.push(`上位${summary.sTopPercent}%のドS適性`);
  } else if (result.smLabel === "M") {
    comments.push("強いM傾向");
  } else if (result.smLabel === "S") {
    comments.push("強いS傾向");
  } else if (result.smLabel === "M寄り") {
    comments.push("ややM寄りの気質");
  } else if (result.smLabel === "S寄り") {
    comments.push("ややS寄りの気質");
  } else {
    comments.push("バランス型の傾向");
  }

  if (result.mPercent >= 80) {
    comments.push("かなり希少な受け型");
  } else if (result.sPercent >= 80) {
    comments.push("かなり希少な攻め型");
  } else if (summary.titlePercent <= 5) {
    comments.push("かなりレアな称号帯");
  } else {
    comments.push("比較的標準的な帯域");
  }

  if (result.axes.FI >= 65) {
    comments.push("観察寄りタイプ");
  } else if (result.axes.OA >= 65) {
    comments.push("行動寄りタイプ");
  } else if (result.axes.RC >= 65) {
    comments.push("受容・支配差がはっきりしたタイプ");
  } else {
    comments.push("バランスの取れた傾向");
  }

  if (result.mPercent >= 75 && result.sPercent >= 75) {
    comments.push("混沌領域に近いスコア");
  } else if (result.mPercent >= 60 && result.sPercent >= 60) {
    comments.push("両極にまたがる複合型");
  } else if (Math.abs(result.mPercent - result.sPercent) <= 10) {
    comments.push("中立寄りの安定した配分");
  } else {
    comments.push("偏りがはっきりしたスコア");
  }

  return comments.slice(0, 4);
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

  typeStats.sort((a, b) => a.count - b.count);

  let rareTypeRank = null;
  for (let i = 0; i < typeStats.length; i += 1) {
    if (typeStats[i].code === typeCode) {
      rareTypeRank = i + 1;
      break;
    }
  }

  const trust = getTrustInfo(totalCount);
  const analysisComments = buildAnalysisComments(
    {
      totalCount,
      typeCount,
      titleCount,
      typePercent,
      titlePercent,
      mTopPercent,
      sTopPercent
    },
    result
  );

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
    rareTypeRank,
    typeTotalKinds: typeStats.length,
    trust,
    analysisComments
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
      <h2>📊 統計データ</h2>
      <p class="muted">${summary.trust.label}</p>

      <div class="stats-block">
        <div class="stats-line-title">M度：上位 ${summary.mTopPercent}%</div>
        <div class="stats-line-title">S度：上位 ${summary.sTopPercent}%</div>
        <div class="stats-line-title">このタイプ：${summary.typePercent}%</div>
        <div class="stats-line-title">この称号：${summary.titlePercent}%</div>
      </div>

      <div class="stats-block">
        <h3>🏆 あなたの順位</h3>
        <div class="stats-line">Mランキング：${summary.mRank}位 / ${summary.totalCount}人</div>
        <div class="stats-line">Sランキング：${summary.sRank}位 / ${summary.totalCount}人</div>
        <div class="stats-line">タイプレア順位：${summary.rareTypeRank || "-"}位 / ${summary.typeTotalKinds || 16}タイプ</div>
      </div>

      <div class="stats-block">
        <h3>🧠 分析コメント</h3>
        <ul class="stats-comment-list">
          ${summary.analysisComments.map(comment => `<li>・${comment}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}