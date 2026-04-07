/* 프로젝트 데이터는 index.html의 <template id="project-p1"> ... </template>에서 로드합니다. */

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return ch;
    }
  });
}

function addBrBullets(html) {
  if (!html) return html;
  const safe = String(html).replace(/^\s+/, "");
  const bullet = '<span class="modal-line-bullet">•</span>';
  // 첫 줄 + 각 <br/> 다음 줄마다 bullet을 삽입
  return (
    bullet +
    safe.replace(/<br\s*\/?>/gi, (br) => `${br}${bullet}`)
  );
}

/* ── 모달 ── */
function openModal(id) {
  const tpl = document.getElementById(`project-${id}`);
  if (!tpl) {
    console.error("Unknown project id:", id);
    return;
  }

  const root = tpl.content;

  const title = root.querySelector(".project-title")?.textContent ?? "";
  const period = root.querySelector(".project-period")?.textContent ?? "";

  const descEl = root.querySelector(".project-desc");
  const descHtml = descEl?.outerHTML ?? "";

  const tags = Array.from(root.querySelectorAll(".project-tag")).map(
    (el) => escapeHtml(el.textContent),
  );

  document.getElementById("m-title").textContent = title;
  document.getElementById("m-period").textContent = period;
  document.getElementById("m-tags").innerHTML = tags
    .map((t) => `<span class="modal-tag">${t}</span>`)
    .join("");

  const mDescEl = document.getElementById("m-desc");
  // project-desc는 div 또는 ul로 올 수 있음. ul/li는 그대로 렌더링.
  mDescEl.innerHTML = descEl?.tagName === "DIV" ? addBrBullets(descHtml) : descHtml;
  document.getElementById("modal-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(e) {
  if (e.target === document.getElementById("modal-overlay")) closeModalDirect();
}

function closeModalDirect() {
  document.getElementById("modal-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModalDirect();
});

/* ── 스크롤 fade-in ── */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.opacity = 1;
        e.target.style.transform = "none";
      }
    });
  },
  { threshold: 0.08 },
);

document.querySelectorAll("section:not(#hero)").forEach((el) => {
  el.style.opacity = 0;
  el.style.transform = "translateY(16px)";
  el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
  io.observe(el);
});
