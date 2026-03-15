/* =========================
   Share Helpers
========================= */

function truncateText(text, maxLength = 120) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}

export function buildShareText(result) {
  const lines = [];

  lines.push("あなたのSMタイプは？");
  lines.push(`${result.typeCode} × ${result.title}`);
  lines.push(`【${result.typeName}】`);
  lines.push(`―${result.subtitle}―`);

  if (result.hiddenTitle) {
    lines.push(`隠し称号: ${result.hiddenTitle}`);
  }

  if (result.awakening) {
    lines.push(`覚醒: ${result.awakening}`);
  }

  lines.push(`S ${result.sPercent}% / M ${result.mPercent}%`);
  lines.push(`称号: ${result.title}`);

  if (typeof result.nextDiff === "number" && result.nextTitle) {
    lines.push(`NEXT：あと${result.nextDiff}%で ${result.nextTitle}`);
  }

  lines.push(`#SM診断 #16タイプ診断 #診断メーカー風`);

  return truncateText(lines.join("\n"), 280);
}

export function buildShareUrl(result) {
  const text = buildShareText(result);
  const url = window.location.href.split("?")[0].split("#")[0];
  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

export function shareX(result) {
  const shareUrl = buildShareUrl(result);
  window.open(shareUrl, "_blank", "noopener,noreferrer");
}

export function renderShareButtons(result) {
  return `
    <div class="share-row">
      <button class="share-btn" id="shareXBtn">Xで共有</button>
      <button class="retry-btn" id="retryBtn">もう一度診断</button>
    </div>
  `;
}

export function bindShareButtons(result) {
  const shareBtn = document.getElementById("shareXBtn");
  const retryBtn = document.getElementById("retryBtn");

  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      shareX(result);
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