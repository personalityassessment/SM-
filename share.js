function truncateText(text, maxLength = 280) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}

export function getSharedProfileFromUrl() {
  const params = new URLSearchParams(window.location.search);

  const typeCode = params.get("type");
  const m = params.get("m");
  const s = params.get("s");

  if (!typeCode || m === null || s === null) {
    return null;
  }

  const mPercent = Number(m);
  const sPercent = Number(s);

  if (Number.isNaN(mPercent) || Number.isNaN(sPercent)) {
    return null;
  }

  return {
    typeCode,
    mPercent,
    sPercent
  };
}

export function buildShareText(result, statsSummary = null) {
  const lines = [];

  lines.push("あなたのSMタイプ診断");
  lines.push("");
  lines.push(`${result.typeCode} × ${result.title}`);
  lines.push(`【${result.typeName}】`);
  lines.push(`―${result.subtitle}―`);
  lines.push("");

  if (result.awakening) {
    lines.push(`覚醒：${result.awakening}`);
  }

  lines.push(`S ${result.sPercent}% / M ${result.mPercent}%`);
  lines.push("");
  lines.push(`称号：${result.title}`);

  if (statsSummary && statsSummary.trust && statsSummary.trust.mode !== "hidden") {
    lines.push("");
    lines.push(`M度 上位${statsSummary.mTopPercent}%`);
    lines.push(`称号レア度 ${statsSummary.titlePercent}%`);
  }

  lines.push("");
  lines.push(`#SM診断 #診断メーカー風`);
  lines.push("");
  lines.push("このリンクから診断すると、あなたとの相性が表示されます");

  return truncateText(lines.join("\n"), 280);
}

export function buildShareUrl(result) {
  const cleanBase = `${window.location.origin}${window.location.pathname}`;
  const url = new URL(cleanBase);

  url.searchParams.set("type", result.typeCode);
  url.searchParams.set("m", String(result.mPercent));
  url.searchParams.set("s", String(result.sPercent));

  return url.toString();
}

export function buildShareIntentUrl(result, statsSummary = null) {
  const text = buildShareText(result, statsSummary);
  const url = buildShareUrl(result);

  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

export function shareX(result, statsSummary = null) {
  const intentUrl = buildShareIntentUrl(result, statsSummary);
  window.open(intentUrl, "_blank", "noopener,noreferrer");
}

export function renderShareButtons() {
  return `
    <div class="share-row">
      <button class="share-btn" id="shareXBtn">Xで共有</button>
      <button class="retry-btn" id="retryBtn">もう一度診断</button>
    </div>
    <p class="share-guide">この結果を共有すると、相手との相性も見られます</p>
  `;
}

export function bindShareButtons(result, statsSummary = null) {
  const shareBtn = document.getElementById("shareXBtn");
  const retryBtn = document.getElementById("retryBtn");

  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      shareX(result, statsSummary);
    });
  }

  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      if (typeof window.restartDiagnosis === "function") {
        window.restartDiagnosis();
      } else {
        localStorage.removeItem("sm_diagnosis_session_v2");
        localStorage.removeItem("sm_diagnosis_result_v2");
        window.location.reload();
      }
    });
  }
}