/* =========================
   TITLE / HIDDEN / AWAKENING
========================= */

/*
priority 優先順
1  ミラー / 完全一致
2  神話級 / 極端値
3  生粋系
4  隠し称号
5  混沌
6  中立
7  M系 / S系通常
8  フォールバック
*/

export const TITLE_TABLE = [
  /* =========================
     1. ミラー / 完全一致
  ========================= */
  {
    id: "mirror_1_1",
    priority: 1,
    type: "mirror",
    title: "ほぼ無害",
    rank: "C",
    comment: "まだ本性が大きく表には出ていない、ごく初期の均衡状態。",
    match: { mMin: 1, mMax: 1, sMin: 1, sMax: 1 },
    next: null
  },
  {
    id: "mirror_33_33",
    priority: 1,
    type: "mirror",
    title: "様子見の達人",
    rank: "R",
    comment: "踏み込む前に見極める慎重さが際立つ、均衡寄りの観察型。",
    match: { mMin: 33, mMax: 33, sMin: 33, sMax: 33 },
    next: null
  },
  {
    id: "mirror_50_50",
    priority: 1,
    type: "mirror",
    title: "五分五分の男",
    rank: "SR",
    comment: "SとMがぴたりと釣り合った、非常に珍しい完全均衡タイプ。",
    match: { mMin: 50, mMax: 50, sMin: 50, sMax: 50 },
    next: null
  },
  {
    id: "mirror_69_69",
    priority: 1,
    type: "mirror",
    title: "69の支配者",
    rank: "SSR",
    comment: "攻めと受けの快楽を同時に成立させる、象徴的な完全一致。",
    match: { mMin: 69, mMax: 69, sMin: 69, sMax: 69 },
    next: null
  },
  {
    id: "mirror_77_77",
    priority: 1,
    type: "mirror",
    title: "混沌予備軍",
    rank: "SSR",
    comment: "均衡のまま高みに差しかかった、危うい両立の入口。",
    match: { mMin: 77, mMax: 77, sMin: 77, sMax: 77 },
    next: null
  },
  {
    id: "mirror_88_88",
    priority: 1,
    type: "mirror",
    title: "深淵の住人",
    rank: "SSR",
    comment: "攻めも受けも高水準で共存している、深層の均衡者。",
    match: { mMin: 88, mMax: 88, sMin: 88, sMax: 88 },
    next: null
  },
  {
    id: "mirror_100_100",
    priority: 1,
    type: "mirror",
    title: "全能者",
    rank: "UR",
    comment: "SとMの両極を完全に宿した、到達者だけの特別領域。",
    match: { mMin: 100, mMax: 100, sMin: 100, sMax: 100 },
    next: null
  },

  /* =========================
     2. 神話級 / 極端値
  ========================= */
  {
    id: "myth_ultimate_m",
    priority: 2,
    type: "mythic",
    title: "究極のドM",
    rank: "UR",
    comment: "受けの極限に到達し、試練すら快感へ変換してしまう終着点。",
    match: { mMin: 100, mMax: 100, sMin: 0, sMax: 0 },
    next: null
  },
  {
    id: "myth_absolute_maou",
    priority: 2,
    type: "mythic",
    title: "絶対魔王",
    rank: "UR",
    comment: "支配の極北に立ち、場そのものを従わせる究極の主導者。",
    match: { mMin: 0, mMax: 0, sMin: 100, sMax: 100 },
    next: null
  },
  {
    id: "myth_chaos_god",
    priority: 2,
    type: "mythic",
    title: "混沌神",
    rank: "UR",
    comment: "攻めも受けも神域に達した、常識外れの完全カオス。",
    match: { mMin: 95, mMax: 99, sMin: 95, sMax: 99 },
    next: null
  },

  /* =========================
     3. 生粋系
  ========================= */
  {
    id: "pure_m",
    priority: 3,
    type: "pure",
    title: "生粋のM",
    rank: "SSR",
    comment: "主導欲よりも受容本能が圧倒的に強い、純度の高いM気質。",
    match: { mMin: 95, mMax: 99, sMin: 0, sMax: 5 },
    next: null
  },
  {
    id: "pure_s",
    priority: 3,
    type: "pure",
    title: "生粋のS",
    rank: "SSR",
    comment: "支配と主導が自然体で滲み出る、純度の高いS気質。",
    match: { mMin: 0, mMax: 5, sMin: 95, sMax: 99 },
    next: null
  },
  {
    id: "pure_observer",
    priority: 3,
    type: "pure",
    title: "無欲の観測者",
    rank: "SSR",
    comment: "攻めにも受けにも強く傾かず、ただ状況を見つめる希少な無欲型。",
    match: { mMin: 0, mMax: 5, sMin: 0, sMax: 5 },
    next: null
  },
  {
    id: "pure_chaos_avatar",
    priority: 3,
    type: "pure",
    title: "混沌の化身",
    rank: "UR",
    comment: "両極端を同時に抱えたまま成立している、極めて危険な存在。",
    match: { mMin: 95, mMax: 99, sMin: 95, sMax: 99 },
    next: null
  },

  /* =========================
     4. 混沌ツリー
  ========================= */
  {
    id: "chaos_70",
    priority: 5,
    type: "chaos",
    title: "混沌予備軍",
    rank: "SR",
    comment: "攻めと受けの両方が高まり始めた、混沌の入口。",
    match: { mMin: 70, mMax: 76, sMin: 70, sMax: 76 },
    next: { title: "混沌の住人", targetM: 78, targetS: 78 }
  },
  {
    id: "chaos_78",
    priority: 5,
    type: "chaos",
    title: "混沌の住人",
    rank: "SSR",
    comment: "SとMの両方を抱えながら日常を渡る、異質な両立者。",
    match: { mMin: 78, mMax: 84, sMin: 78, sMax: 84 },
    next: { title: "深淵の住人", targetM: 85, targetS: 85 }
  },
  {
    id: "chaos_85",
    priority: 5,
    type: "chaos",
    title: "深淵の住人",
    rank: "SSR",
    comment: "攻めも受けも生半可では満たされない、深層領域の住民。",
    match: { mMin: 85, mMax: 89, sMin: 85, sMax: 89 },
    next: { title: "超越者", targetM: 90, targetS: 90 }
  },
  {
    id: "chaos_90",
    priority: 5,
    type: "chaos",
    title: "超越者",
    rank: "UR",
    comment: "通常のS/M概念を飛び越え、異常な両立を成立させた存在。",
    match: { mMin: 90, mMax: 94, sMin: 90, sMax: 94 },
    next: { title: "混沌神", targetM: 95, targetS: 95 }
  },

  /* =========================
     5. 中立ツリー
  ========================= */
  {
    id: "neutral_common",
    priority: 6,
    type: "neutral",
    title: "一般人",
    rank: "C",
    comment: "SにもMにも大きく振れず、最も標準的な帯域にいるタイプ。",
    match: { mMin: 0, mMax: 39, sMin: 0, sMax: 39 },
    next: null,
    extra: { maxDiff: 100 }
  },
  {
    id: "neutral_sense",
    priority: 6,
    type: "neutral",
    title: "常識人",
    rank: "C",
    comment: "極端を避けて安定を選ぶ、落ち着いた均衡志向。",
    match: { mMin: 40, mMax: 44, sMin: 40, sMax: 44 },
    next: null,
    extra: { maxDiff: 4 }
  },
  {
    id: "neutral_balancer",
    priority: 6,
    type: "neutral",
    title: "バランサー",
    rank: "R",
    comment: "攻めも受けも偏りすぎず、状況対応力に優れた均衡型。",
    match: { mMin: 48, mMax: 52, sMin: 48, sMax: 52 },
    next: null,
    extra: { maxDiff: 4 }
  },
  {
    id: "neutral_trickster",
    priority: 6,
    type: "neutral",
    title: "駆け引き上手",
    rank: "SR",
    comment: "どちらにも寄りすぎず、相手次第で立ち位置を変えられる器用型。",
    match: { mMin: 53, mMax: 60, sMin: 53, sMax: 60 },
    next: null,
    extra: { maxDiff: 7 }
  },
  {
    id: "neutral_strategist",
    priority: 6,
    type: "neutral",
    title: "策略家",
    rank: "SSR",
    comment: "感情よりも構図を優先し、均衡のまま場を読んで動く戦略型。",
    match: { mMin: 61, mMax: 70, sMin: 61, sMax: 70 },
    next: null,
    extra: { maxDiff: 9 }
  },

  /* =========================
     6. M系ツリー
  ========================= */
  {
    id: "m_40",
    priority: 7,
    type: "m",
    title: "ちょいM",
    rank: "C",
    comment: "軽く受け身寄りで、主導される空気に少し心地よさを感じる段階。",
    match: { mMin: 40, mMax: 44, sMin: 0, sMax: 100 },
    next: { title: "若干M", targetM: 45 }
  },
  {
    id: "m_45",
    priority: 7,
    type: "m",
    title: "若干M",
    rank: "R",
    comment: "自分で握るより、相手に流れを委ねる方が自然になり始めている。",
    match: { mMin: 45, mMax: 49, sMin: 0, sMax: 100 },
    next: { title: "そこそこM", targetM: 50 }
  },
  {
    id: "m_50",
    priority: 7,
    type: "m",
    title: "そこそこM",
    rank: "R",
    comment: "プレッシャーや受容を前向きに扱える、受け身適性が見え始めた状態。",
    match: { mMin: 50, mMax: 59, sMin: 0, sMax: 100 },
    next: { title: "ドM予備軍", targetM: 60 }
  },
  {
    id: "m_60",
    priority: 7,
    type: "m",
    title: "ドM予備軍",
    rank: "SR",
    comment: "受ける状況そのものに、少しずつ快感や高揚が混ざり始めている。",
    match: { mMin: 60, mMax: 69, sMin: 0, sMax: 100 },
    next: { title: "ドM", targetM: 70 }
  },
  {
    id: "m_70",
    priority: 7,
    type: "m",
    title: "ドM",
    rank: "SR",
    comment: "受容や試練の中で本領を発揮する、分かりやすく強いM気質。",
    match: { mMin: 70, mMax: 79, sMin: 0, sMax: 100 },
    next: { title: "筋金入りドM", targetM: 80 }
  },
  {
    id: "m_80",
    priority: 7,
    type: "m",
    title: "筋金入りドM",
    rank: "SSR",
    comment: "多少の困難では揺らがない、受けに対する耐久と適応が非常に高い。",
    match: { mMin: 80, mMax: 84, sMin: 0, sMax: 100 },
    next: { title: "受けの達人", targetM: 85 }
  },
  {
    id: "m_85",
    priority: 7,
    type: "m",
    title: "受けの達人",
    rank: "SSR",
    comment: "受けることを単なる耐久で終わらせず、理解し楽しめる熟練者。",
    match: { mMin: 85, mMax: 89, sMin: 0, sMax: 100 },
    next: { title: "受けの神", targetM: 90 }
  },
  {
    id: "m_90",
    priority: 7,
    type: "m",
    title: "受けの神",
    rank: "UR",
    comment: "どんな状況も抱え込み、受け止めること自体を力へ変える神域。",
    match: { mMin: 90, mMax: 94, sMin: 0, sMax: 100 },
    next: { title: "究極のドM", targetM: 100, targetS: 0 }
  },

  /* =========================
     7. S系ツリー
  ========================= */
  {
    id: "s_40",
    priority: 7,
    type: "s",
    title: "ちょいS",
    rank: "C",
    comment: "軽く主導したい気配があり、流れを握ることに少し楽しさを感じる。",
    match: { mMin: 0, mMax: 100, sMin: 40, sMax: 44 },
    next: { title: "若干S", targetS: 45 }
  },
  {
    id: "s_45",
    priority: 7,
    type: "s",
    title: "若干S",
    rank: "R",
    comment: "自然と主導側へ回る場面が増え、支配の輪郭が見え始めた段階。",
    match: { mMin: 0, mMax: 100, sMin: 45, sMax: 49 },
    next: { title: "そこそこS", targetS: 50 }
  },
  {
    id: "s_50",
    priority: 7,
    type: "s",
    title: "そこそこS",
    rank: "R",
    comment: "相手の反応を見ながら流れを動かすことに、はっきり面白さを感じる。",
    match: { mMin: 0, mMax: 100, sMin: 50, sMax: 59 },
    next: { title: "ドS予備軍", targetS: 60 }
  },
  {
    id: "s_60",
    priority: 7,
    type: "s",
    title: "ドS予備軍",
    rank: "SR",
    comment: "相手を追い込む駆け引きに、高い快感や手応えを覚え始めている。",
    match: { mMin: 0, mMax: 100, sMin: 60, sMax: 69 },
    next: { title: "ドS", targetS: 70 }
  },
  {
    id: "s_70",
    priority: 7,
    type: "s",
    title: "ドS",
    rank: "SR",
    comment: "主導や支配を明確に楽しめる、非常に分かりやすい強いS気質。",
    match: { mMin: 0, mMax: 100, sMin: 70, sMax: 79 },
    next: { title: "筋金入りドS", targetS: 80 }
  },
  {
    id: "s_80",
    priority: 7,
    type: "s",
    title: "筋金入りドS",
    rank: "SSR",
    comment: "状況全体をコントロールし、自分の流れへ持ち込む力が非常に強い。",
    match: { mMin: 0, mMax: 100, sMin: 80, sMax: 84 },
    next: { title: "支配の達人", targetS: 85 }
  },
  {
    id: "s_85",
    priority: 7,
    type: "s",
    title: "支配の達人",
    rank: "SSR",
    comment: "相手の反応も場の流れも読みながら支配できる、完成度の高いSタイプ。",
    match: { mMin: 0, mMax: 100, sMin: 85, sMax: 89 },
    next: { title: "シハイ神", targetS: 90 }
  },
  {
    id: "s_90",
    priority: 7,
    type: "s",
    title: "シハイ神",
    rank: "UR",
    comment: "気付けば場の主導権を完全に掌握している、支配の神域に近い存在。",
    match: { mMin: 0, mMax: 100, sMin: 90, sMax: 94 },
    next: { title: "絶対魔王", targetS: 100, targetM: 0 }
  }
];

/* =========================
   Hidden Titles
========================= */

export const HIDDEN_TITLE_TABLE = [
  {
    id: "hidden_69_sync",
    name: "69の支配者",
    kind: "mirror",
    condition: (m, s) => m === 69 && s === 69,
    theme: "theme-hidden theme-mirror theme-mythic"
  },
  {
    id: "hidden_perfect_balance",
    name: "五分五分の男",
    kind: "mirror",
    condition: (m, s) => m === 50 && s === 50,
    theme: "theme-hidden theme-mirror"
  },
  {
    id: "hidden_zen_observer",
    name: "無欲の観測者",
    kind: "rare",
    condition: (m, s) => m <= 5 && s <= 5,
    theme: "theme-hidden"
  },
  {
    id: "hidden_omnipotent",
    name: "全能者",
    kind: "mirror",
    condition: (m, s) => m === 100 && s === 100,
    theme: "theme-hidden theme-mirror theme-mythic"
  },
  {
    id: "hidden_chaos_avatar",
    name: "混沌の化身",
    kind: "mythic",
    condition: (m, s) => m >= 95 && s >= 95,
    theme: "theme-hidden theme-mythic"
  }
];

/* =========================
   Awakening
========================= */

export const AWAKENING_TABLE = [
  {
    id: "awakening_m",
    name: "M覚醒",
    condition: (m, s) => m >= 88 && m > s + 20,
    theme: "theme-awakening"
  },
  {
    id: "awakening_s",
    name: "S覚醒",
    condition: (m, s) => s >= 88 && s > m + 20,
    theme: "theme-awakening"
  },
  {
    id: "awakening_chaos",
    name: "混沌覚醒",
    condition: (m, s) => m >= 88 && s >= 88,
    theme: "theme-awakening theme-mythic"
  }
];

/* =========================
   Utilities
========================= */

function inRange(value, min, max) {
  return value >= min && value <= max;
}

function diffWithin(m, s, maxDiff) {
  return Math.abs(m - s) <= maxDiff;
}

export function matchTitle(row, mPercent, sPercent) {
  const baseMatch =
    inRange(mPercent, row.match.mMin, row.match.mMax) &&
    inRange(sPercent, row.match.sMin, row.match.sMax);

  if (!baseMatch) return false;

  if (row.extra && typeof row.extra.maxDiff === "number") {
    return diffWithin(mPercent, sPercent, row.extra.maxDiff);
  }

  return true;
}

export function getTitleResult(mPercent, sPercent) {
  for (const row of TITLE_TABLE) {
    if (matchTitle(row, mPercent, sPercent)) {
      return row;
    }
  }

  return {
    id: "fallback",
    priority: 999,
    type: "fallback",
    title: "一般人",
    rank: "C",
    comment: "特に強いS/M傾向はない平均型。",
    match: { mMin: 0, mMax: 100, sMin: 0, sMax: 100 },
    next: null
  };
}

export function getHiddenTitle(mPercent, sPercent) {
  for (const row of HIDDEN_TITLE_TABLE) {
    if (row.condition(mPercent, sPercent)) return row;
  }
  return null;
}

export function getAwakening(mPercent, sPercent) {
  for (const row of AWAKENING_TABLE) {
    if (row.condition(mPercent, sPercent)) return row;
  }
  return null;
}

export function getRankTheme(rank) {
  switch (rank) {
    case "C":
      return "rank-C";
    case "R":
      return "rank-R";
    case "SR":
      return "rank-SR";
    case "SSR":
      return "rank-SSR";
    case "UR":
      return "rank-UR";
    default:
      return "rank-C";
  }
}

export function getThemeClass({ rank, hiddenTitle, awakening, nextDiff }) {
  const classes = [getRankTheme(rank)];

  // 優先順位
  // 神話級隠し称号 → ミラー隠し称号 → 覚醒 → ランク背景
  if (hiddenTitle) {
    classes.push(hiddenTitle.theme);
  } else if (awakening) {
    classes.push(awakening.theme);
  }

  if (typeof nextDiff === "number" && nextDiff >= 0 && nextDiff <= 3) {
    classes.push("theme-next-evolution");
  }

  return classes.join(" ");
}

export function getNextInfo(titleRow, mPercent, sPercent) {
  if (!titleRow || !titleRow.next) {
    return {
      nextTitle: null,
      nextDiff: null
    };
  }

  const diffs = [];

  if (typeof titleRow.next.targetM === "number") {
    diffs.push(titleRow.next.targetM - mPercent);
  }

  if (typeof titleRow.next.targetS === "number") {
    diffs.push(titleRow.next.targetS - sPercent);
  }

  const validDiffs = diffs.filter(v => v >= 0);

  return {
    nextTitle: titleRow.next.title,
    nextDiff: validDiffs.length ? Math.min(...validDiffs) : 0
  };
}
