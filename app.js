(() => {
  "use strict";
  const K = "moru_v11_data",
    OLD = [
      "moru_v10_data",
      "moru_v9_data",
      "moru_v8_data",
      "moru_v7_data",
      "moru_v6_notes",
    ],
    DRAFT = "moru_v11_draft";
  let writeBlocked = false,
    diskSnapshot = null;
  const $ = (id) => document.getElementById(id),
    APP = $("app"),
    OVER = $("overlay"),
    TOAST = $("toast");
  const svg = {
    plus: "M12 5v14M5 12h14",
    arrow: "M5 12h14m-7-7 7 7-7 7",
    back: "m15 18-6-6 6-6",
    check: "m5 12 4 4L19 6",
    leaf: "M12 22v-8M12 14C4 14 3 8 3 5c6 0 9 3 9 9Zm0-1c0-6 3-9 9-9 0 5-2 9-9 9Z",
    spark: "m12 3 2.1 6.9L21 12l-6.9 2.1L12 21l-2.1-6.9L3 12l6.9-2.1L12 3Z",
    link: "M10 13a5 5 0 0 0 7.5.4l3-3A5 5 0 0 0 13.4 3L12 4.4M14 11a5 5 0 0 0-7.5-.4l-3 3A5 5 0 0 0 10.6 21L12 19.6",
    list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
    search: "m21 21-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
    settings:
      "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.5 2.5-.06-.06A1.7 1.7 0 0 0 15.4 19.4M9 4.6a1.7 1.7 0 0 0-1.88-.34l-.06.06-2.5 2.5.06.06A1.7 1.7 0 0 0 4.6 8.6M4.6 15.4A1.7 1.7 0 0 0 4.26 17.3l-.06.06 2.5 2.5.06-.06A1.7 1.7 0 0 0 8.6 19.4M15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.5 2.5-.06.06A1.7 1.7 0 0 0 19.4 8.6M12 2v2m0 16v2M2 12h2m16 0h2",
    heart:
      "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
    edit: "m12 20 9-9-6-6-9 9-2 8 8-2Zm1.5-13.5 4 4",
    trash: "M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3",
    copy: "M8 8h12v12H8zM16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2",
    download: "M12 3v12m-4-4 4 4 4-4M5 17v4h14v-4",
    upload: "M12 21V9m-4 4 4-4 4 4M5 7V3h14v4",
    x: "M18 6 6 18M6 6l12 12",
    clock: "M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18",
    refresh:
      "M20 11a8 8 0 0 0-14-5L3 9m0-5v5h5M4 13a8 8 0 0 0 14 5l3-3m0 5v-5h-5",
    zap: "m13 2-9 12h7l-1 8 10-12h-7V2",
    target:
      "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 4h.01",
    bookmark: "M5 4h14v17l-7-4-7 4V4",
    flip: "M21 7H7a4 4 0 0 0-4 4v1m4-8L3 8l4 4m-4 5h14a4 4 0 0 0 4-4v-1m-4 9 4-4-4-4",
    bulb: "M9 18h6m-6 3h6M9 14a6 6 0 1 1 6 0l-1 3h-4l-1-3Z",
    share: "M12 16V3m-4 4 4-4 4 4M5 13v8h14v-8",
    award: "M12 2 5 5v6c0 5 3 8 7 11 4-3 7-6 7-11V5l-7-3Z",
    compass: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4 6-3 6-5 2 2-5 6-3Z",
    flask: "M9 3h6M10 3v7l-5 8a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-8V3M7 15h10",
    shuffle:
      "M3 17h3a4 4 0 0 0 3-1l6-8a4 4 0 0 1 3-1h3m-3-3 3 3-3 3M3 7h3a4 4 0 0 1 3 1l1 1m4 6 1 1a4 4 0 0 0 3 1h3m-3-3 3 3-3 3",
  };
  const I = (n, cls = "icon") =>
    `<svg class="${cls}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" aria-hidden="true"><path d="${svg[n] || svg.spark}"/></svg>`;
  const esc = (t) =>
    String(t ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const uid = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : "id" + Date.now().toString(36) + Math.random().toString(36).slice(2);
  const get = (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  };
  const put = (k, v) => {
    try {
      localStorage.setItem(k, v);
      return true;
    } catch {
      return false;
    }
  };
  const short = (t, n = 66) => {
    const s = String(t || "")
      .trim()
      .replace(/\s+/g, " ");
    return s.length > n ? s.slice(0, n) + "…" : s;
  };
  const day = (t) => {
    try {
      return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(t));
    } catch {
      return "";
    }
  };
  const ago = (t) => {
    const d = Math.max(0, Math.floor((Date.now() - Number(t)) / 864e5));
    return d === 0 ? "오늘" : d === 1 ? "어제" : d < 7 ? `${d}일 전` : day(t);
  };
  const stop = new Set(
    "그리고 그러나 그래서 이것 저것 하는 했던 하면 하고 이런 저런 있는 없는 정말 너무 이거 저거 아이디어 생각 나는 내가 우리 사람 사용자 위해 대한 대한것 같은 어떻게 뭔가 좀더 이제 경우 바로 지금 내가것 그것 그냥 것들 것은 무엇 어떤 어디 무엇을 것이 같은데 만들고 싶은 하고싶은 하면좋겠다 가장 경우 뭔지 되면 하고자 해서".split(
      " ",
    ),
  );
  const domains = [
    {
      key: "만들기",
      words:
        "앱 서비스 제품 기능 플랫폼 기술 코드 개발 만들 구현 설계 사이트 웹 게임 로봇 인공지능 반도체 회로",
    },
    {
      key: "배움",
      words: "공부 학습 강의 책 수학 물리 시험 학생 학교 전공 수업 교육 대학",
    },
    {
      key: "생활",
      words:
        "시간 습관 운동 건강 친구 가족 여행 집 생활 일상 식사 잠 음식 목표",
    },
    {
      key: "창작",
      words: "글쓰기 사진 그림 영상 음악 디자인 콘텐츠 영화 웹툰 소설",
    },
    {
      key: "일",
      words: "창업 사업 고객 사용자 시장 가격 매출 회사 기업 팀 돈 수익 판매",
    },
  ].map((d) => ({ ...d, words: d.words.split(" ") }));
  const words = (s) => [
    ...new Set(
      (
        String(s || "")
          .toLowerCase()
          .match(/[가-힣a-z0-9]{2,}/g) || []
      )
        .map((w) =>
          w.replace(
            /(에서는|으로는|에게는|에서도|에서|으로|에게|까지|부터|처럼|들이|하고|하면|하는|했다|해서|을|를|이|가|은|는|도|에|의|로)$/,
            "",
          ),
        )
        .filter((w) => w.length >= 2 && !stop.has(w)),
    ),
  ];
  function category(n) {
    const t = (n.body + " " + (n.title || "")).toLowerCase();
    const scores = domains
      .map((d) => ({
        name: d.key,
        count: d.words.reduce((x, w) => x + (t.includes(w) ? 1 : 0), 0),
      }))
      .sort((a, b) => b.count - a.count);
    return scores[0].count > 0 ? scores[0].name : "생각";
  }
  function normalize(raw) {
    if (!raw || typeof raw !== "object") return null;
    const body = String(raw.body ?? raw.text ?? raw.content ?? "").trim();
    if (!body) return null;
    const now = Date.now();
    const exps = Array.isArray(raw.experiments) ? raw.experiments : [];
    const entries = (
      Array.isArray(raw.entries)
        ? raw.entries
        : Array.isArray(raw.growth)
          ? raw.growth
          : []
    )
      .filter(Boolean)
      .map((e) => ({
        ...e,
        id: String(e.id || uid()),
        type: String(e.type || "free").slice(0, 30),
        body: String(e.body || e.text || ""),
        created: Number(e.created) || now,
        label: String(e.label || e.question || "이어진 생각").slice(0, 100),
        linkId: e.linkId || null,
        prompt: e.prompt || null,
      }))
      .filter((e) => e.body.trim());
    const f = raw.fields && typeof raw.fields === "object" ? raw.fields : {};
    return {
      ...raw,
      id: String(raw.id || uid()),
      body,
      originalBody: String(raw.originalBody ?? body),
      revisions: Array.isArray(raw.revisions) ? raw.revisions : [],
      parents: Array.isArray(raw.parents)
        ? raw.parents
            .filter((p) => p && typeof p.id === "string")
            .map((p) => ({
              id: p.id,
              body: String(p.body || ""),
              kind: p.kind === "fusion" ? "fusion" : "branch",
            }))
        : [],
      origin: String(raw.origin || "capture"),
      title: String(raw.title || "").slice(0, 120),
      created: Number(raw.created) || now,
      updated: Number(raw.updated) || Number(raw.created) || now,
      entries,
      fields: {
        ...f,
        who: String(f.who || f.audience || ""),
        problem: String(f.problem || ""),
        solution: String(f.solution || f.proposal || ""),
        difference: String(f.difference || f.edge || ""),
      },
      experiments: exps
        .filter(Boolean)
        .map((e) => ({
          ...e,
          hypothesis: String(e.hypothesis || ""),
          method: String(e.method || ""),
          outcome: String(e.outcome || ""),
          id: String(e.id || uid()),
          title: String(e.title || "").slice(0, 300),
          status: e.status === "done" ? "done" : "todo",
          result: String(e.result || ""),
          learning: String(e.learning || ""),
          created: Number(e.created) || now,
          doneAt: Number(e.doneAt) || null,
        }))
        .filter((e) => e.title),
      links: Array.isArray(raw.links)
        ? raw.links.filter((x) => typeof x === "string")
        : [],
      favorite: !!raw.favorite,
      closedAt: Number(raw.closedAt) || null,
      takeaway: String(raw.takeaway || "").slice(0, 400),
      seen: raw.seen && typeof raw.seen === "object" ? raw.seen : {},
    };
  }
  let notes = [],
    screen = "capture",
    activeId = null,
    savedId = null,
    filter = "all",
    search = "",
    studio = null,
    lens = null,
    pairMode = "similar",
    pairIndex = 0,
    pairOverride = null,
    playMode = "invent",
    playStep = 0,
    playSavedId = null,
    warning = "";
  // Migration writes only the new key. Invalid input is never silently discarded.
  function readNotes(json) {
    const raw = JSON.parse(json);
    if (raw?.version > 11)
      throw Error("더 최신 버전의 백업이야. 이 버전에서는 열 수 없어.");
    const arr = Array.isArray(raw) ? raw : raw?.notes;
    if (!Array.isArray(arr)) throw Error("기록 형식 오류");
    const result = arr.map(normalize);
    if (
      result.some((n) => !n) ||
      new Set(result.map((n) => n.id)).size !== result.length
    )
      throw Error("유효하지 않거나 중복된 기록");
    return result;
  }
  function init() {
    try {
      const current = get(K);
      if (current !== null) {
        notes = readNotes(current);
        diskSnapshot = current;
        return;
      }
      for (const key of OLD) {
        const json = get(key);
        if (json === null) continue;
        notes = readNotes(json);
        if (!saveRaw())
          warning =
            "기존 기록은 보존했지만 이전을 저장하지 못했어. 백업을 권장해.";
        break;
      }
      if (get(DRAFT) === null && get("moru_v9_draft"))
        put(DRAFT, get("moru_v9_draft"));
    } catch (e) {
      writeBlocked = true;
      warning =
        "저장 데이터를 읽을 수 없어 저장을 잠갔어. 설정에서 원본을 백업해 줘.";
    }
  }
  function saveRaw() {
    if (writeBlocked) return false;
    const current = get(K);
    if (current !== diskSnapshot) {
      writeBlocked = true;
      warning =
        "다른 탭에서 기록이 변경됐어. 작성 중인 내용을 복사한 뒤 새로고침해 줘.";
      return false;
    }
    const json = JSON.stringify({
      app: "moru",
      version: 11,
      notes,
      exportedAt: new Date().toISOString(),
    });
    if (!put(K, json)) return false;
    diskSnapshot = json;
    return true;
  }
  function transact(fn) {
    const before = JSON.stringify(notes);
    try {
      fn();
      if (saveRaw()) return true;
    } catch (e) {
      console.error(e);
    }
    notes = JSON.parse(before);
    toast(warning || "저장하지 못했어. 저장 공간을 확인해 줘.");
    return false;
  }
  function note() {
    return notes.find((n) => n.id === activeId);
  }
  const ready = (n) =>
    Object.values(n.fields || {}).filter((s) => s.trim()).length;
  const complete = (n) =>
    (n.experiments || []).filter((x) => x.status === "done").length;
  function stage(n) {
    if (
      n.experiments.some(
        (e) => e.status === "done" && (e.learning.trim() || e.result.trim()),
      )
    )
      return 3;
    if ((n.experiments || []).length > 0 || ready(n) >= 3) return 2;
    if (
      n.entries.some((e) => e.type !== "play") ||
      n.parents.length ||
      notes.some((x) => x.parents.some((p) => p.id === n.id)) ||
      ready(n) > 0
    )
      return 1;
    return 0;
  }
  const stages = ["씨앗", "새싹", "가지", "꽃"];
  function plant(n, cls = "plant-svg") {
    const s = stage(n);
    const soil = '<ellipse class="ground" cx="100" cy="170" rx="48" ry="9"/>';
    if (s === 0)
      return `<svg class="${cls}" viewBox="0 0 200 190" aria-hidden="true">${soil}<ellipse class="seed" cx="100" cy="161" rx="11" ry="8"/><circle class="spark" cx="136" cy="99" r="3"/></svg>`;
    let h = `<svg class="${cls}" viewBox="0 0 200 190" aria-hidden="true">${soil}<path class="stem" d="M100 169Q97 146 100 121Q104 102 102 73"/><path class="leaf" d="M100 144C76 145 65 124 60 112c24-2 39 11 40 32Z"/><path class="leaf second" d="M100 126C129 130 141 109 145 96c-25-2-44 10-45 30Z"/>`;
    if (s >= 2)
      h +=
        '<path class="leaf" d="M102 104C84 99 78 78 79 66c20 6 25 20 23 38Z"/><path class="leaf second" d="M102 88C123 90 139 76 144 63c-22-3-38 8-42 25Z"/>';
    if (s >= 3)
      h +=
        '<circle class="flower" cx="102" cy="64" r="18"/><circle class="flower" cx="88" cy="59" r="12"/><circle class="flower" cx="117" cy="53" r="12"/><circle class="flower-center" cx="102" cy="63" r="8"/>';
    return h + "</svg>";
  }
  function toast(msg) {
    TOAST.textContent = msg;
    TOAST.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => TOAST.classList.remove("show"), 3000);
  }
  const jump = (s, id) => {
    screen = s;
    if (id) activeId = id;
    studio = null;
    lens = null;
    render();
    APP.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  function nav() {
    const items = [
      ["capture", "기록"],
      ["garden", "정원"],
      ["playground", "놀이터"],
      ["lab", "실험실"],
      ["today", "오늘의 발견"],
    ];
    $("nav").innerHTML =
      items
        .map(
          ([s, t]) =>
            `<button data-action="nav" data-screen="${s}" class="${screen === s ? "active" : ""}" ${screen === s ? 'aria-current="page"' : ""}>${I({ capture: "edit", garden: "leaf", playground: "shuffle", lab: "target", today: "spark" }[s], "icon small")}<span>${t}</span></button>`,
        )
        .join("") +
      `<button data-action="settings" class="settings-launch" aria-label="기록 관리">${I("settings")}</button>`;
  }
  function render() {
    nav();
    APP.className = "view";
    APP.innerHTML =
      screen === "today"
        ? today()
        : screen === "capture"
          ? capture()
          : screen === "garden"
            ? garden()
            : screen === "playground"
              ? playground()
              : screen === "lab"
                ? lab()
                : screen === "discover"
                  ? discover()
                  : screen === "detail" && note()
                    ? detail()
                    : capture();
    restoreFields();
    const cap = $("capture-input");
    if (cap) {
      cap.value = get(DRAFT) || "";
      const b = $("capture-save");
      b.disabled = !cap.value.trim();
    }
    const q = $("search-input");
    if (q) q.value = search;
    APP.querySelectorAll("textarea,input").forEach((el) => {
      if (!el.labels?.length && !el.getAttribute("aria-label"))
        el.setAttribute("aria-label", el.placeholder || "생각 내용");
    });
    const tryEl = $("studio-body");
    if (tryEl && studio) attachStudio();
  }
  function capture() {
    const last = notes.slice().sort((a, b) => b.updated - a.updated)[0];
    const pending = notes
      .flatMap((n) =>
        n.experiments.filter((e) => e.status === "todo").map((e) => ({ n, e })),
      )
      .sort((a, b) => b.e.created - a.e.created)[0];
    return `<section class="capture"><span class="eyebrow">SMALL THOUGHTS, BIG POSSIBILITIES</span><h1 class="hero">떠오른 생각,<br><em>그냥 흘려보내지 마.</em></h1><p class="hero-desc">완성된 문장이 아니어도 좋아.<br>일단 남겨두면, 언젠가 다른 생각과 연결될 수 있으니까.</p><div class="entry-box" id="entry-box"><textarea id="capture-input" maxlength="14000" placeholder="지금 어떤 생각이 스쳤어?" aria-label="새로운 생각 기록"></textarea><div class="entry-foot"><span class="entry-hint">${warning ? esc(warning) : "⌘ / Ctrl + Enter로 기록"}</span><button class="btn primary" id="capture-save" data-action="capture-save" disabled>기록하기 ${I("arrow")}</button></div></div><div aria-live="polite" id="capture-feedback">${savedId ? `<div class="capture-success"><div class="success-seal">${I("check", "icon big")}</div><div><strong>생각을 잘 남겼어.</strong><small>원하면 지금 한 걸음 더 이어가 봐.</small></div><button class="link-button" data-action="open-saved">열어보기 ${I("arrow", "icon small")}</button></div>` : ""}</div><p class="capture-tip">기록은 지금 사용하는 브라우저에 저장돼. <button class="link-button" data-action="settings">백업하기</button></p>${pending ? `<div class="home-nudge"><div><strong>잠깐, 이어갈 일이 하나 있어</strong><small>${esc(short(pending.e.title, 55))}</small></div><button data-action="detail" data-id="${esc(pending.n.id)}">이어가기 ${I("arrow", "icon small")}</button></div>` : last ? `<div class="home-nudge"><div><strong>지난 생각, 다시 열어볼까?</strong><small>${esc(short(last.body, 53))}</small></div><button data-action="detail" data-id="${esc(last.id)}">열기 ${I("arrow", "icon small")}</button></div>` : ""}</section>`;
  }
  function garden() {
    const count = notes.length,
      done = notes.reduce((s, n) => s + complete(n), 0),
      total = notes.reduce((s, n) => s + n.experiments.length, 0);
    const spotlight =
      notes.length > 1
        ? [...notes]
            .filter((n) => n.created < Date.now() - 864e5)
            .sort((a, b) => a.updated - b.updated)[0] || notes[notes.length - 1]
        : notes[0];
    const match = (n) => {
      let text = (
        n.body +
        " " +
        n.entries.map((e) => e.body).join(" ") +
        " " +
        Object.values(n.fields).join(" ")
      ).toLowerCase();
      return (
        (!search || text.includes(search.toLowerCase())) &&
        (filter === "all" ||
          (filter === "favorite" && n.favorite) ||
          (filter === "active" &&
            n.experiments.some((e) => e.status === "todo")) ||
          (filter === "flower" && complete(n) > 0))
      );
    };
    const chosen = notes.filter(match).sort((a, b) => b.updated - a.updated);
    return `<section class="page-head"><span class="eyebrow">YOUR LITTLE GARDEN</span><h1 class="page-title">내 생각의 정원</h1><p class="sub">모아둔 생각이 얼마나 자랐는지, 필요한 순간에 다시 발견해 봐.</p></section><section class="garden-overview"><div class="stat-grid"><div class="stat"><span>남긴 생각</span><strong>${count}</strong></div><div class="stat"><span>진행 중인 실험</span><strong>${Math.max(0, total - done)}</strong></div><div class="stat"><span>끝낸 실험</span><strong>${done}</strong></div></div>${spotlight ? `<div class="spotlight"><div class="body"><span class="eyebrow">오늘의 발견</span><p class="quote">${esc(short(spotlight.body, 95))}</p><button class="link-button" data-action="nav" data-screen="today">새 관점으로 보기 ${I("arrow", "icon small")}</button></div>${plant(spotlight)}</div>` : ""}</section><div class="section-title"><h2>나의 기록 <span class="pill">${count}</span></h2><button class="link-button" data-action="nav" data-screen="capture">${I("plus", "icon small")} 새 기록</button></div><div class="toolstrip"><div class="searchbar">${I("search")}<input id="search-input" placeholder="생각 속에서 찾기" aria-label="기록 검색" autocomplete="off"/></div><div class="segments"><button class="segment ${filter === "all" ? "selected" : ""}" data-action="filter" data-filter="all">전체</button><button class="segment ${filter === "favorite" ? "selected" : ""}" data-action="filter" data-filter="favorite">아껴둔</button><button class="segment ${filter === "active" ? "selected" : ""}" data-action="filter" data-filter="active">실험 중</button><button class="segment ${filter === "flower" ? "selected" : ""}" data-action="filter" data-filter="flower">결과 있음</button></div></div><div class="garden-grid" id="garden-cards">${cards(chosen)}</div>${count ? '<p class="footer-note">정원은 기록한 양보다, 실제로 생각하고 실험한 과정에 따라 자라.</p>' : ""}`;
  }
  function cards(arr) {
    return arr.length
      ? arr
          .map(
            (n, i) =>
              `<button class="idea-card" data-action="detail" data-id="${esc(n.id)}" data-tone="${i % 4}"><div class="idea-meta"><b>${esc(category(n))}</b> <span>·</span> ${esc(ago(n.updated))} ${n.favorite ? " · ♥" : ""}</div><div class="idea-text">${esc(short(n.body, 150))}</div><div class="idea-bottom">${esc(stages[stage(n)])} · ${n.experiments.length ? `${complete(n)}/${n.experiments.length} 실험` : `${n.entries.length}개 가지`} ${I("arrow", "icon small")}</div>${plant(n)}</button>`,
          )
          .join("")
      : `<div class="empty-state" style="grid-column:1/-1">${I("leaf")}<strong>${notes.length ? "조건에 맞는 기록이 없어" : "아직 심은 생각이 없어"}</strong><p>${notes.length ? "검색어를 바꿔 보거나 다른 분류를 눌러 봐." : "한 줄의 기록부터 시작해 봐."}</p><button class="btn solid" data-action="nav" data-screen="capture">${I("plus")} 생각 기록하기</button></div>`;
  }
  function pairScore(a, b) {
    const aa = new Set(words(a.body).slice(0, 45)),
      bb = new Set(words(b.body).slice(0, 45));
    let match = [...aa].filter((x) => bb.has(x));
    let ca = category(a),
      cb = category(b);
    return {
      a,
      b,
      match,
      score: match.length / (Math.sqrt(aa.size * bb.size) || 1),
      different: ca !== cb,
    };
  }
  function pairs() {
    const arr = [];
    for (let i = 0; i < notes.length; i++)
      for (let j = i + 1; j < notes.length; j++)
        arr.push(pairScore(notes[i], notes[j]));
    return arr;
  }
  function pairList() {
    let arr = pairs();
    if (pairOverride) {
      const [a, b] = pairOverride;
      const f = arr.find(
        (x) => (x.a.id === a && x.b.id === b) || (x.a.id === b && x.b.id === a),
      );
      if (f) return [f, ...arr.filter((x) => x !== f)];
    }
    if (pairMode === "similar")
      arr.sort(
        (a, b) =>
          b.score - a.score || Number(b.different) - Number(a.different),
      );
    else
      arr.sort(
        (a, b) =>
          Number(b.different) - Number(a.different) || a.score - b.score,
      );
    return arr;
  }
  const pairQuestions = [
    (a, b) =>
      `두 생각을 하나의 서비스로 만든다면 가장 먼저 제공할 기능은 뭘까?`,
    (a, b) => `첫 번째 생각에서 중요한 방법 하나를 두 번째에 적용할 수 있을까?`,
    (a, b) => `두 생각이 해결하려는 불편을 하나의 문장으로 묶는다면?`,
    (a, b) => `둘 중 하나를 덜어내야 한다면 무엇을 남기고 싶어?`,
  ];
  function discover() {
    const ps = pairList(),
      pair = ps.length ? ps[pairIndex % ps.length] : null;
    return `<div class="play-description">예전에 기록한 두 생각을 나란히 놓고 새로운 연결을 찾아봐. 관련된 기록을 추천하지만, 어떤 의미를 발견할지는 네가 결정해.</div><div class="discovery-hero"><h2>연결에서 다음 아이디어가 시작돼.</h2><p>이곳의 추천은 AI가 아니야. 기록의 단어와 주제를 기준으로 짝을 고르고, 질문은 미리 설계한 틀로 제시해. 연결이 의미 있는지는 네가 판단해.</p></div>${notes.length < 2 ? `<div class="empty-state">${I("link", "icon big")}<strong>생각 두 개부터 시작할 수 있어</strong><p>새로운 생각을 하나 더 남기면, 두 생각을 나란히 놓아 볼게.</p><button class="btn primary" data-action="nav" data-screen="capture">기록하러 가기 ${I("arrow")}</button></div>` : `<div class="switches"><button class="segment ${pairMode === "similar" ? "selected" : ""}" data-action="pair-mode" data-mode="similar">닮은 생각 찾기</button><button class="segment ${pairMode === "contrast" ? "selected" : ""}" data-action="pair-mode" data-mode="contrast">뜻밖의 조합</button></div><div class="pair-display"><div class="pair-card"><small>기록 A · ${esc(category(pair.a))}</small><h3>${esc(short(pair.a.body, 100))}</h3></div><div class="pair-middle">${I("link", "icon big")}</div><div class="pair-card"><small>기록 B · ${esc(category(pair.b))}</small><h3>${esc(short(pair.b.body, 100))}</h3></div></div><div class="form-row"><button class="btn ghost" data-action="pair-next">${I("shuffle")} 다른 조합 보기</button></div><section class="prompt-paper"><span class="eyebrow">A THOUGHT EXPERIMENT</span><h3>${esc(pairQuestions[(pairIndex + (pairMode === "contrast" ? 1 : 0)) % pairQuestions.length](pair.a, pair.b))}</h3><p>정답은 없어. 아이디어가 떠오르면 아래에 적어 줘. 원래 두 기록은 그대로 남아.</p><label class="field-label" for="discover-text">이 조합에서 떠오른 생각</label><textarea id="discover-text" class="form-textarea" maxlength="14000" placeholder="두 생각을 만나게 했을 때, 새로 떠오른 게 있어?"></textarea><div class="form-row"><button class="btn primary" data-action="create-link-idea">${I("plus")} 새 아이디어로 남기기</button></div></section><div class="section-title"><h2>연결의 힌트</h2><small>예측이 아닌 탐색 도구</small></div><div class="connection-grid"><button data-action="pair-next"><small>다른 눈으로 보기</small>두 아이디어를 따로 해결하는 대신 하나로 합칠 수 있을까? ${I("arrow", "icon small")}</button><button data-action="pair-mode" data-mode="${pairMode === "similar" ? "contrast" : "similar"}"><small>관점 바꾸기</small>${pairMode === "similar" ? "관련 없어 보이는 조합에서 새로운 가능성 찾기" : "서로 닮은 생각 사이에서 반복되는 관심사 찾기"} ${I("arrow", "icon small")}</button></div>`}`;
  }

  // 놀이터: 관찰, 발명, 연결을 분리해 원본 기록 화면을 단순하게 유지한다.
  const playgroundWordsA = [
    "도서관",
    "공유 자전거",
    "작은 카페",
    "헬스장",
    "대학생",
    "책",
    "반려식물",
    "배달 서비스",
    "우산",
    "스터디 그룹",
    "공원",
    "중고 거래",
    "버스 정류장",
    "병원",
    "음악",
    "여행",
    "일기",
    "공구함",
    "사진",
    "편의점",
    "반도체",
    "로봇",
    "학교",
    "친구",
  ];
  const playgroundWordsB = [
    "게임",
    "구독",
    "지도",
    "타이머",
    "커뮤니티",
    "기록",
    "렌털",
    "자판기",
    "챌린지",
    "소셜",
    "음성",
    "매칭",
    "맞춤형 추천",
    "루틴",
    "알림",
    "예약",
    "나눔",
    "공유",
    "미션",
    "리뷰",
    "교환",
    "습관",
    "재활용",
  ];
  const observationPrompts = [
    "오늘 같은 행동을 두 번 반복한 순간이 있었어?",
    "사람들이 당연하게 불편을 감수하는 장소는 어디일까?",
    "최근에 설명서를 찾아봐야 했던 경험은?",
    "어제 쓴 시간 중 되돌리고 싶은 10분은?",
    "친구가 자주 부탁하는 귀찮은 일은 뭐야?",
    "기다리는 시간이 지루했던 장소를 떠올려 봐.",
    "좋아하는 서비스에서 딱 한 가지 불편한 점은?",
    "처음 방문한 사람이 헤매기 쉬운 곳이 있을까?",
    "너무 많은 선택지 때문에 결정을 미룬 적 있어?",
    "돈을 썼지만 만족하지 못했던 작은 경험은?",
    "종이나 메신저로 임시로 해결하고 있는 일은?",
    "우리 가족이나 친구가 자주 잊어버리는 일은?",
    "이미 있는 제품을 엉뚱하게 활용한 적은?",
    "기분이 좋았는데 왜 좋았는지 설명하기 어려운 순간은?",
    "누군가에게 고마웠던 작은 배려를 제품으로 만들 수 있을까?",
    "오늘 손이 한 번 더 갔던 일을 찾아봐.",
  ];
  const inventionQuestions = [
    "이 둘이 만나면 어떤 불편을 가장 먼저 없앨 수 있을까?",
    "어떤 사람에게 이 조합이 진짜 필요할까?",
    "한 가지 기능만 만들 수 있다면 무엇을 선택할까?",
    "이 조합을 10분 안에 직접 시험하려면 어떻게 할까?",
    "친구에게 한 문장으로 설명한다면 무엇이라고 할까?",
    "이 조합이 가장 유용한 순간은 언제일까?",
  ];
  function playChallenge() {
    if (playMode === "observe")
      return {
        title: "일상에서 하나 발견하기",
        prompt: observationPrompts[playStep % observationPrompts.length],
        a: null,
        b: null,
        tag: "OBSERVE / 02",
      };
    const a = playgroundWordsA[(playStep * 7 + 3) % playgroundWordsA.length],
      b = playgroundWordsB[(playStep * 11 + 5) % playgroundWordsB.length];
    return {
      title: "서로 다른 두 세계를 연결해 봐",
      prompt: inventionQuestions[playStep % inventionQuestions.length],
      a,
      b,
      tag: "INVENT / 01",
    };
  }
  function playground() {
    const tabs = `<div class="play-tabs"><button data-action="play-tab" data-mode="invent" class="${playMode === "invent" ? "selected" : ""}">${I("spark")} 발명하기</button><button data-action="play-tab" data-mode="observe" class="${playMode === "observe" ? "selected" : ""}">${I("compass")} 발견하기</button><button data-action="play-tab" data-mode="connect" class="${playMode === "connect" ? "selected" : ""}">${I("link")} 내 생각 연결</button></div>`;
    const heading = `<section class="page-head play-head"><span class="eyebrow">CREATIVE PLAYGROUND</span><h1 class="page-title">우연을 발명으로.</h1><p class="sub">생각이 없을 땐 여기로 와. 작은 질문 하나에서 새로운 아이디어가 시작될지도 몰라.</p></section>${tabs}`;
    if (playMode === "connect")
      return heading + `<div class="play-connect">${discover()}</div>`;
    const ch = playChallenge();
    return (
      heading +
      `<section class="playground-grid"><div class="play-large"><div class="play-card-head"><span class="eyebrow">${ch.tag}</span><span class="play-stamp">✳ 무제한 연습</span></div><h2>${esc(ch.title)}</h2>${ch.a ? `<div class="concept-row"><div class="concept"><span class="concept-symbol">◌</span><strong>${esc(ch.a)}</strong></div><div class="concept-plus">×</div><div class="concept"><span class="concept-symbol">✳</span><strong>${esc(ch.b)}</strong></div></div>` : `<div class="observe-art" aria-hidden="true"><span>⌁</span><span>✳</span><span>◡</span></div>`}<div class="question-area"><small>생각의 단서</small><p>${esc(ch.prompt)}</p></div>${notes.length ? `<label class="field-label" for="play-parent">키워 볼 생각 (선택)</label><select class="form-input" id="play-parent"><option value="">독립된 새 생각</option>${notes.map((n) => `<option value="${esc(n.id)}">${esc(short(n.body, 65))}</option>`).join("")}</select>` : ""}<textarea id="play-answer" class="play-answer" maxlength="14000" placeholder="정답은 없어. 떠오르는 걸 편하게 적어봐."></textarea><div class="play-actions"><button class="btn outline" data-action="play-next">${I("shuffle")} 새 단서</button><button class="btn primary" data-action="play-save">${I("plus")} 생각으로 남기기</button></div>${playSavedId ? `<div class="play-success">${I("check")} 정원에 새 생각을 심었어. <button class="link-button" data-action="detail" data-id="${esc(playSavedId)}">열어보기 ${I("arrow", "icon small")}</button></div>` : ""}</div><aside class="play-side"><div class="play-side-card"><span class="eyebrow">HOW TO PLAY</span><h3>낯선 연결에서 시작하는 재미.</h3><p>서로 어울리지 않는 두 개념을 조합해 보거나, 일상의 작은 불편을 관찰해 봐. 아이디어가 떠오르지 않으면 과감히 새 단서를 눌러도 좋아.</p><div class="play-guide"><span>01 <b>단서 발견</b></span><span>02 <b>한 줄 상상</b></span><span>03 <b>정원에 저장</b></span></div></div><div class="play-side-card muted"><span class="eyebrow">YOUR GARDEN</span><h3>${notes.length}개의 생각이 기다리고 있어.</h3><p>이미 적어둔 생각끼리도 조합할 수 있어.</p><button class="link-button" data-action="play-tab" data-mode="connect">내 생각 연결하기 ${I("arrow", "icon small")}</button></div></aside></section>`
    );
  }
  function lab() {
    const tasks = notes.flatMap((n) => n.experiments.map((e) => ({ n, e }))),
      pending = tasks
        .filter((x) => x.e.status !== "done")
        .sort((a, b) => b.e.created - a.e.created),
      done = tasks
        .filter((x) => x.e.status === "done")
        .sort((a, b) => (b.e.doneAt || 0) - (a.e.doneAt || 0));
    const good = notes
      .slice()
      .sort((a, b) => b.updated - a.updated)
      .slice(0, 4);
    return `<section class="page-head"><span class="eyebrow">MAKE IT REAL</span><h1 class="page-title">작은 실험실</h1><p class="sub">생각을 증명할 필요는 없어. 작게 해보고, 예상과 달랐던 것도 남겨 봐.</p></section><div class="lab-hero"><div><span class="eyebrow">LEARN BY DOING</span><h2>완벽한 계획보다,<br>작은 실행 한 번.</h2><p>친구 한 명에게 물어보거나 종이에 그려보는 것도 실험이야.</p><div class="lab-counts"><span><b>${pending.length}</b> 진행할 실험</span><span><b>${done.length}</b> 완료한 실험</span></div></div><div class="lab-illustration" aria-hidden="true"><div class="lab-orbit orbit-a"></div><div class="lab-orbit orbit-b"></div><div class="lab-flask">${I("flask", "icon big")}</div><span>✳</span></div></div><section class="lab-section"><div class="section-title"><h2>해볼 실험 <span class="pill">${pending.length}</span></h2></div>${pending.length ? `<div class="lab-list">${pending.map(({ n, e }) => `<article class="lab-task"><div class="lab-task-body"><span class="eyebrow">${esc(category(n))} · ${esc(short(n.body, 52))}</span><h3>${esc(e.title)}</h3><span class="tiny">${esc(ago(e.created))} 추가</span></div><div class="lab-task-actions"><button class="btn primary tiny" data-action="lab-finish" data-note="${esc(n.id)}" data-id="${esc(e.id)}">${I("check", "icon small")} 결과 남기기</button><button class="btn ghost tiny" data-action="detail" data-id="${esc(n.id)}">생각 열기</button></div></article>`).join("")}</div>` : `<div class="lab-empty"><div class="lab-empty-symbol">✦</div><h3>아직 실험할 생각이 없어도 괜찮아.</h3><p>기록한 생각 하나를 고르고, 10분 안에 해볼 일을 만들어 봐.</p><button class="btn solid" data-action="lab-pick">실험할 생각 고르기 ${I("arrow")}</button></div>`}</section>${done.length ? `<section class="lab-section"><div class="section-title"><h2>해보니 알게 된 것 <span class="pill">${done.length}</span></h2></div><div class="lab-results">${done.map(({ n, e }) => `<button class="lab-result" data-action="detail" data-id="${esc(n.id)}"><span>완료 · ${esc(ago(e.doneAt || e.created))}</span><strong>${esc(e.title)}</strong><p>${esc(e.learning || e.result || "실험을 마쳤어.")}</p><p class="next-action">다음 행동 · ${esc(nextAction(e))}</p>${I("arrow", "icon small")}</button>`).join("")}</div></section>` : ""}<section class="lab-section"><div class="section-title"><h2>여기서 시작해 볼까?</h2><small>내 정원에서 고르기</small></div><div class="lab-start-grid">${good.length ? good.map((n) => `<button data-action="lab-new" data-id="${esc(n.id)}"><span>${I("leaf", "icon small")} ${esc(stages[stage(n)])}</span><strong>${esc(short(n.body, 78))}</strong><small>이 생각으로 실험 만들기 ${I("arrow", "icon small")}</small></button>`).join("") : `<button data-action="nav" data-screen="capture"><span>${I("plus", "icon small")} 첫 생각</span><strong>먼저 떠오르는 생각 한 줄을 남겨 봐.</strong><small>기록하러 가기 ${I("arrow", "icon small")}</small></button>`}</div></section>`;
  }

  function detail() {
    const n = note(),
      r = roadmap(n),
      links = (n.links || [])
        .map((x) => notes.find((z) => z.id === x))
        .filter(Boolean),
      connections = pairs()
        .filter((p) => p.a.id === n.id || p.b.id === n.id)
        .sort((a, b) => b.score - a.score)
        .slice(0, 2);
    return `<button class="back-link" data-action="nav" data-screen="garden">${I("back", "icon small")} 내 정원</button><header class="detail-head"><div><span class="eyebrow">${esc(stages[stage(n)].toUpperCase())} · ${esc(category(n))}</span><h1>한 생각의 다음 장.</h1><p class="sub">기록은 그대로, 방향은 자유롭게.</p></div>${plant(n)}</header><div class="detail-grid"><div class="primary-content"><article class="card note-sheet"><div class="note-meta"><span>처음의 기록 · ${esc(day(n.created))}</span><span class="pill">${esc(stages[stage(n)])}</span></div><p class="note-body">${esc(n.body)}</p>${n.originalBody !== n.body ? `<details class="original"><summary>처음 기록한 원본 보기</summary><p>${esc(n.originalBody)}</p></details>` : ""}${n.revisions.length ? `<details class="original"><summary>수정 이력 ${n.revisions.length}개</summary>${n.revisions.map((v) => `<p><small>${esc(day(v.at))}</small><br>${esc(v.body)}</p>`).join("")}</details>` : ""}<div class="note-actions"><button class="link-button" data-action="edit-note">${I("edit", "icon small")} 수정</button><button class="link-button" data-action="favorite">${I("heart", "icon small")} ${n.favorite ? "아껴둔 생각" : "아껴두기"}</button><button class="link-button" data-action="share-note">${I("share", "icon small")} 공유</button></div></article>${evolution(n)}<section class="card studio" id="studio-section"><div class="studio-head"><div><span class="eyebrow">GROW IN YOUR OWN WAY</span><h2>어디로 키워볼까?</h2><p>정해진 순서는 없어. 지금 끌리는 쪽으로 가면 돼.</p></div></div><div class="studio-grid"><button class="studio-choice" data-action="studio" data-studio="focus"><span class="icon-wrap">${I("target")}</span><span><strong>핵심 잡기</strong><small>누구의 문제인지 또렷하게</small></span></button><button class="studio-choice" data-action="studio" data-studio="explore"><span class="icon-wrap">${I("flip")}</span><span><strong>관점 뒤집기</strong><small>다른 가능성 탐색하기</small></span></button><button class="studio-choice" data-action="studio" data-studio="experiment"><span class="icon-wrap">${I("zap")}</span><span><strong>작게 실험하기</strong><small>현실에서 한 번 시도하기</small></span></button><button class="studio-choice" data-action="studio" data-studio="free"><span class="icon-wrap">${I("edit")}</span><span><strong>그냥 이어 쓰기</strong><small>질문 없이 자유롭게</small></span></button></div><div id="studio-body">${studio ? renderStudio(n) : ""}</div></section>${
      ready(n) > 0
        ? `<section><div class="section-title"><h2>한 장으로 정리</h2><button class="link-button" data-action="copy-summary">${I("copy", "icon small")} 복사</button></div><div class="one-pager"><span class="eyebrow">IDEA SNAPSHOT</span><dl><dt>첫 생각</dt><dd>${esc(short(n.body, 240))}</dd>${[
            ["누구를 위해", n.fields.who],
            ["어떤 문제", n.fields.problem],
            ["어떤 방법", n.fields.solution],
            ["다른 점", n.fields.difference],
          ]
            .filter((x) => x[1].trim())
            .map(([name, val]) => `<dt>${esc(name)}</dt><dd>${esc(val)}</dd>`)
            .join(
              "",
            )}${n.takeaway ? `<dt>지금의 결론</dt><dd>${esc(n.takeaway)}</dd>` : ""}</dl></div></section>`
        : ""
    }<section><div class="section-title"><h2>작은 실험 <span class="pill">${n.experiments.length}</span></h2><button class="link-button" data-action="new-exp">${I("plus", "icon small")} 새 실험</button></div><div class="experiments">${n.experiments.length ? n.experiments.map((e) => `<article class="experiment ${e.status === "done" ? "done" : ""}"><div class="experiment-top"><div><strong>${esc(e.title)}</strong><br><small>${e.status === "done" ? "완료 · " + esc(day(e.doneAt || e.created)) : "진행 전 · " + esc(ago(e.created))}</small></div><span class="pill ${e.status === "done" ? "" : "amber"}">${e.status === "done" ? "배움 기록" : "시도해 보기"}</span></div>${e.hypothesis ? `<p><b>가설</b> ${esc(e.hypothesis)}</p>` : ""}${e.method ? `<p><b>실험 방법</b> ${esc(e.method)}</p>` : ""}${e.status === "done" ? `<p><b>관찰 결과</b> ${esc(e.result)}<br><b>배운 점</b> ${esc(e.learning || "아직 남기지 않았어.")}</p><p class="next-action">다음 행동 · ${esc(nextAction(e))}</p>` : ""}<div class="button-row">${e.status !== "done" ? `<button data-action="finish-exp" data-id="${esc(e.id)}">${I("check", "icon small")} 결과 남기기</button>` : ""}${e.status === "done" ? `<button data-action="edit-exp" data-id="${esc(e.id)}">결과 수정</button>` : ""}<button data-action="remove-exp" data-id="${esc(e.id)}">삭제</button></div></article>`).join("") : `<div class="empty-state"><strong>아직 실험은 없어</strong><p>완벽한 계획보다 10분짜리 시도 하나부터 시작해 봐.</p><button class="btn solid" data-action="new-exp">첫 실험 만들기 ${I("arrow")}</button></div>`}</div></section><section><div class="section-title"><h2>이어진 생각 <span class="pill">${n.entries.length}</span></h2><button class="link-button" data-action="studio" data-studio="free">${I("plus", "icon small")} 덧붙이기</button></div><div class="timeline">${
      n.entries.length
        ? n.entries
            .slice()
            .sort((a, b) => a.created - b.created)
            .map(
              (e) =>
                `<article class="timeline-entry"><header><span>${esc(e.label || "이어진 생각")} · ${esc(ago(e.created))}</span><button data-action="remove-entry" data-id="${esc(e.id)}">삭제</button></header>${e.prompt ? `<div class="prompt">${esc(e.prompt)}</div>` : ""}<p>${esc(e.body)}</p></article>`,
            )
            .join("")
        : `<p class="tiny">생각을 더하면 이곳에 차곡차곡 남아.</p>`
    }</div></section><div class="detail-footer"><button class="link-button" data-action="copy-summary">${I("copy", "icon small")} 내용 복사</button><button class="link-button" data-action="finish-note">${I("bookmark", "icon small")} ${n.closedAt ? "한 줄 결론 바꾸기" : "지금의 결론 남기기"}</button><button class="link-button" style="color:#b17b76" data-action="delete-note">${I("trash", "icon small")} 기록 삭제</button></div></div><aside class="side-stack"><div class="side-panel"><span class="eyebrow">NEXT LITTLE STEP</span>${plant(n)}<div class="next">${esc(r.text)}</div><button class="btn primary" data-action="${r.action}" ${r.action === "studio" ? 'data-studio="focus"' : ""}>${esc(r.label)} ${I("arrow", "icon small")}</button><div class="metric-line">${I("leaf", "icon small")} 구체화 ${ready(n)}/4 · 실험 완료 <b>${complete(n)}</b></div></div><div class="side-panel white"><h3>${I("link", "icon small")} 다른 생각과 만나기</h3><p>${notes.length <= 1 ? "기록이 하나 더 생기면 생각을 연결할 수 있어." : `관련 단어와 주제를 단서로 ${connections.length}개의 조합을 골랐어.`}</p>${connections
      .map((p) => {
        const other = p.a.id === n.id ? p.b : p.a;
        return `<button class="link-button" data-action="connect-with" data-id="${esc(other.id)}" style="white-space:normal;text-align:left">${I("arrow", "icon small")} ${esc(short(other.body, 65))}</button>`;
      })
      .join(
        "",
      )}${notes.length > 1 ? `<button class="btn outline tiny" data-action="find-links">발견하러 가기</button>` : ""}</div>${links.length ? `<div class="side-panel white"><h3>연결된 생각</h3>${links.map((x) => `<button class="link-button" data-action="detail" data-id="${esc(x.id)}">${I("link", "icon small")} ${esc(short(x.body, 34))}</button>`).join("")}</div>` : ""}</aside></div>`;
  }
  const promptPool = {
    flip: [
      "반대로, 이 아이디어를 전혀 다른 사람에게 쓴다면?",
      "가장 큰 제약 하나를 일부러 없애 본다면?",
      "기존 방법과 정반대 방향으로 접근한다면?",
      "돈이나 시간이 거의 없다면 무엇만 남길까?",
      "내가 반대하는 사람이라면 무엇을 문제 삼을까?",
    ],
    inspire: [
      "지금 방식의 절반만 남기면 어떤 모습일까?",
      "어떤 상황에서 이 생각이 특히 유용할까?",
      "다른 분야에서 이미 해결한 비슷한 문제가 있을까?",
      "가장 놀라운 사용 장면은 어떤 모습일까?",
      "누가 보면 이 생각을 완전히 다르게 해석할까?",
    ],
  };
  function nextPrompt(n, mode) {
    const seen = Array.isArray(n.seen?.[mode]) ? n.seen[mode] : [];
    const arr = promptPool[mode] || [];
    return arr.find((p, i) => !seen.includes(mode + "-" + i)) || null;
  }
  function renderStudio(n) {
    if (studio === "focus")
      return `<div class="work-panel"><h3>생각을 한 장으로.</h3><p class="help">모든 칸을 채울 필요 없어. 필요한 만큼만 적어 두면 다음에 이어갈 수 있어.</p><div class="focus-grid"><div><label class="field-label" for="f-who">누구를 위한 생각일까?</label><textarea class="form-textarea" id="f-who" placeholder="예: 생각은 많지만 정리하기 어려운 대학생">${esc(n.fields.who)}</textarea></div><div><label class="field-label" for="f-problem">어떤 불편을 덜어줄까?</label><textarea class="form-textarea" id="f-problem" placeholder="예: 기록하는 과정이 번거로워서 놓친다">${esc(n.fields.problem)}</textarea></div><div><label class="field-label" for="f-solution">핵심 해결 방법은?</label><textarea class="form-textarea" id="f-solution" placeholder="예: 메모 한 줄로 시작하는 아이디어 정원">${esc(n.fields.solution)}</textarea></div><div><label class="field-label" for="f-difference">기존 방법과 무엇이 다를까?</label><textarea class="form-textarea" id="f-difference" placeholder="예: 기록부터 실행까지 같은 곳에서 이어진다">${esc(n.fields.difference)}</textarea></div></div><div class="work-actions"><span class="tiny">원본 기록은 수정되지 않아.</span><span class="spacer"></span><button class="btn primary" data-action="focus-save">${I("check")} 내용 저장</button><button class="btn ghost" data-action="studio-close">닫기</button></div></div>`;
    if (studio === "explore") {
      const mode = lens || "flip",
        p = nextPrompt(n, mode);
      return `<div class="work-panel"><h3>다른 방향으로 살펴보기.</h3><p class="help">여기는 정답을 찾는 곳이 아니야. 질문이 마음에 들지 않으면 건너뛰거나 자유롭게 적어도 돼.</p><div class="segments"><button class="segment ${mode === "flip" ? "selected" : ""}" data-action="lens-mode" data-mode="flip">반대로 보기</button><button class="segment ${mode === "inspire" ? "selected" : ""}" data-action="lens-mode" data-mode="inspire">가능성 넓히기</button></div><div style="margin-top:19px"><span class="eyebrow">${p ? "TODAY’S SPARK" : "NO MORE QUESTIONS"}</span><h3 style="margin:10px 0;font-size:18px;line-height:1.6">${esc(p || "준비된 질문은 여기까지야. 이제 네 생각을 이어가 봐.")}</h3></div><textarea id="explore-text" class="form-textarea" maxlength="14000" placeholder="질문과 상관없는 생각을 적어도 괜찮아."></textarea><div class="work-actions">${p ? `<button class="btn outline" data-action="next-prompt">${I("shuffle")} 다른 질문</button>` : ""}<span class="spacer"></span><button class="btn primary" data-action="explore-save">생각 남기기 ${I("plus")}</button><button class="btn ghost" data-action="studio-close">닫기</button></div></div>`;
    }
    if (studio === "free")
      return `<div class="work-panel"><h3>그냥, 이어서 써 줘.</h3><p class="help">정리되지 않은 문장도 괜찮아. 떠오른 걸 그대로 남기면 돼.</p><textarea id="free-text" class="form-textarea" maxlength="14000" placeholder="새로 알게 된 것, 바뀐 생각, 뜬금없는 연결까지."></textarea><div class="work-actions"><span class="spacer"></span><button class="btn primary" data-action="free-save">생각 붙이기 ${I("plus")}</button><button class="btn ghost" data-action="studio-close">닫기</button></div></div>`;
    if (studio === "experiment")
      return `<div class="work-panel"><h3>작은 실험 하나면 충분해.</h3><p class="help">이론보다 빠른 검증을 해 봐. 실제로 했는지, 무엇을 배웠는지가 중요해.</p><div class="connection-grid">${["친구 세 명에게 실제로 필요한지 물어보기", "비슷한 제품·방법 두 개를 찾아 비교하기", "10분 안에 종이에 첫 화면 그려보기", "가장 작은 첫 행동을 오늘 시도하기"].map((x) => `<button data-action="exp-template" data-value="${esc(x)}"><small>추천 실험</small>${esc(x)} ${I("arrow", "icon small")}</button>`).join("")}</div><label class="field-label" for="exp-hypothesis">가설 · 무엇이 달라질까?</label><textarea id="exp-hypothesis" class="form-textarea" maxlength="2000" placeholder="예: 기록 단계를 줄이면 매일 아이디어를 남길 것이다"></textarea><label class="field-label" for="exp-method">실험 방법 · 어떻게 확인할까?</label><textarea id="exp-method" class="form-textarea" maxlength="2000" placeholder="예: 3명에게 시제품을 주고 3일간 기록 횟수 관찰"></textarea><label class="field-label" for="exp-name">실험 이름 (필수)</label><input class="form-input" id="exp-name" placeholder="예: 일주일 동안 직접 써 보기" maxlength="300"/><div class="work-actions"><span class="spacer"></span><button class="btn primary" data-action="exp-save">실험 추가 ${I("plus")}</button><button class="btn ghost" data-action="studio-close">닫기</button></div></div>`;
    return "";
  }
  function attachStudio() {
    if (studio === "focus") return;
    const c = $("explore-text");
    if (c) {
      c.focus({ preventScroll: true });
    }
  }
  function showStudio(mode) {
    studio = mode;
    lens = null;
    render();
    $("studio-section")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
  let modalReturn = null;
  function closeModal() {
    OVER.hidden = true;
    OVER.innerHTML = "";
    document.querySelector(".shell").inert = false;
    document.body.style.overflow = "";
    if (modalReturn?.isConnected) modalReturn.focus();
    else APP.focus({ preventScroll: true });
  }
  function modal(html) {
    modalReturn = document.activeElement;
    document.querySelector(".shell").inert = true;
    document.body.style.overflow = "hidden";
    OVER.hidden = false;
    OVER.innerHTML = `<section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="modal-head"><h2 id="modal-title">${html.title}</h2><button class="modal-close" data-action="close-modal" aria-label="닫기">${I("x")}</button></header>${html.body}</section>`;
    setTimeout(() => {
      if (!OVER.hidden) OVER.querySelector(".modal-close")?.focus();
    }, 10);
  }
  function settings() {
    modal({
      title: "나의 기록 관리",
      body: `<div class="modal-section"><h3>Moru v11 · 기록 백업</h3>${warning ? `<p role="alert">${esc(warning)}</p>` : ""}<p>아이디어와 실험 결과를 JSON 파일로 저장할 수 있어. 다른 기기로 옮길 때도 이 파일을 사용할 수 있어.</p><button class="btn solid" data-action="backup">${I("download")} 백업 파일 저장</button><button class="btn outline" data-action="import">${I("upload")} 백업 불러오기</button></div><div class="modal-section"><h3>현재 저장 방식</h3><p>AI·계정·외부 데이터베이스 없이 작동해. 기록은 이 기기의 브라우저에만 저장돼. 다른 기기와 자동 동기화되지 않으며, 브라우저 데이터가 삭제되면 기록도 사라질 수 있어.</p><p>웹주소를 열어 사용할 수 있는 HTML 웹사이트야. GitHub Pages에는 데이터가 저장되지 않아.</p></div><div class="modal-section"><h3>무엇을 할 수 있나?</h3><p>생각 자동 조합은 한국어 단어 일치와 분야별 규칙에 기반해. 실제 의미 이해·AI 생성·온라인 공개 공유는 지원하지 않아.</p></div>`,
    });
  }
  function finishModal() {
    const n = note();
    modal({
      title: "오늘은 여기까지?",
      body: `<div class="modal-section" style="border:0;padding-top:8px"><p>가장 중요한 발견이나 다음에 기억할 한 줄을 남겨 봐. 다음에 다시 이어갈 수 있어.</p><textarea class="form-textarea" id="takeaway-input" maxlength="400" placeholder="오늘 발견한 한 문장">${esc(n.takeaway)}</textarea><div class="form-row"><button class="btn primary" data-action="takeaway-save">${I("bookmark")} 오늘의 결론 남기기</button></div></div>`,
    });
  }
  function expFinishModal(id) {
    const n = note(),
      e = n.experiments.find((e) => e.id === id);
    if (!e) return;
    modal({
      title: "실험에서 무엇을 배웠어?",
      body: `<div class="modal-section" style="border:0;padding-top:8px"><p><strong>${esc(e.title)}</strong></p><div class="status-choice"><button data-action="result-pick" data-val="도움이 됐다" class="selected">도움이 됐다</button><button data-action="result-pick" data-val="예상과 달랐다">예상과 달랐다</button><button data-action="result-pick" data-val="판단이 어렵다">판단이 어렵다</button></div><label class="field-label" for="result-text">관찰한 결과 (필수)</label><textarea id="result-text" class="form-textarea" maxlength="4000" placeholder="예: 3명 중 2명이 3일 모두 기록했다">${esc(e.result)}</textarea><label class="field-label" for="learning-text">배운 점 (필수)</label><textarea id="learning-text" class="form-textarea" placeholder="실제로 해보니 어떤 점이 달랐어?">${esc(e.learning)}</textarea><div class="form-row"><button class="btn primary" data-action="result-save" data-id="${esc(id)}">${I("check")} 결과 기록</button></div></div>`,
    });
    OVER.dataset.result = e.outcome || "도움이 됐다";
    OVER.querySelectorAll('[data-action="result-pick"]').forEach((b) =>
      b.classList.toggle("selected", b.dataset.val === OVER.dataset.result),
    );
  }
  function noteText(n) {
    return (
      `처음의 생각 · ${day(n.created)}\n${n.body}\n\n` +
      Object.entries(n.fields)
        .filter(([, v]) => v.trim())
        .map(
          ([k, v]) =>
            (({
              who: "누구를 위해",
              problem: "어떤 문제",
              solution: "핵심 방법",
              difference: "차별점",
            })[k] || k) +
            ": " +
            v,
        )
        .join("\n") +
      (n.entries.length
        ? "\n\n이어진 생각\n" +
          n.entries.map((e) => `[${e.label}] ${e.body}`).join("\n")
        : "") +
      (n.experiments.length
        ? "\n\n작은 실험\n" +
          n.experiments
            .map(
              (e) =>
                `${e.status === "done" ? "✓" : "○"} ${e.title}${e.learning ? " — " + e.learning : ""}`,
            )
            .join("\n")
        : "") +
      (n.takeaway ? "\n\n지금의 결론\n" + n.takeaway : "")
    );
  }
  async function copy(t) {
    try {
      await navigator.clipboard.writeText(t);
      toast("클립보드에 복사했어.");
    } catch {
      const el = document.createElement("textarea");
      el.value = t;
      el.style.cssText = "position:fixed;left:-9000px";
      document.body.append(el);
      el.select();
      if (document.execCommand("copy")) toast("복사했어.");
      else prompt("아래 내용을 복사해 줘", t);
      el.remove();
    }
  }
  function backup() {
    const txt = writeBlocked
        ? JSON.stringify(
            {
              app: "moru-recovery",
              storage: Object.fromEntries(
                [K, ...OLD, DRAFT, "moru_v9_draft"].map((k) => [k, get(k)]),
              ),
            },
            null,
            2,
          )
        : JSON.stringify(
            {
              app: "moru",
              version: 11,
              notes,
              exportedAt: new Date().toISOString(),
            },
            null,
            2,
          ),
      url = URL.createObjectURL(
        new Blob([txt], { type: "application/json;charset=utf-8" }),
      ),
      a = document.createElement("a");
    a.href = url;
    a.download =
      "moru-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    toast("백업 파일을 저장했어.");
  }
  function maybeStartImport() {
    const input = $("import-file");
    input.value = "";
    input.click();
  }
  $("import-file").addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      if (file.size > 10e6) throw Error("파일이 너무 커.");
      const imported = readNotes(await file.text());
      if (
        !confirm(
          `${imported.length}개 기록을 불러올까? 같은 ID의 기록은 중복되지 않아.`,
        )
      )
        return;
      let added = 0;
      const success = transact(() => {
        const ids = new Set(notes.map((n) => n.id));
        for (const n of imported) {
          if (!ids.has(n.id)) {
            notes.push(n);
            ids.add(n.id);
            added++;
          }
        }
      });
      if (success) {
        closeModal();
        render();
        toast(`${added}개의 기록을 가져왔어.`);
      }
    } catch (err) {
      toast("가져오기 실패: " + err.message);
    }
  });
  const takeText = (id) => $(id)?.value.trim() || "";
  function action(name, button) {
    const id = button?.dataset.id,
      cur = note();
    switch (name) {
      case "today-branch":
        activeId = id;
        branchModal();
        break;
      case "branch":
        branchModal();
        break;
      case "branch-save":
        saveBranch();
        break;
      case "today-next":
        todayOffset++;
        render();
        break;
      case "edit-exp":
        expFinishModal(id);
        break;
      case "nav":
        savedId = null;
        pairOverride = null;
        pairIndex = 0;
        jump(button.dataset.screen);
        break;
      case "detail":
        jump("detail", id);
        break;
      case "settings":
        settings();
        break;
      case "close-modal":
        closeModal();
        break;
      case "play-tab":
        playMode = button.dataset.mode;
        playSavedId = null;
        pairOverride = null;
        pairIndex = 0;
        render();
        break;
      case "play-next":
        playStep++;
        playSavedId = null;
        render();
        break;
      case "play-save":
        {
          const v = takeText("play-answer");
          if (!v) {
            toast("떠오른 생각을 한 줄 적어 봐.");
            return;
          }
          const parent = notes.find((n) => n.id === $("play-parent")?.value);
          const ch = playChallenge(),
            n = normalize({
              id: uid(),
              body: v,
              origin: "playground",
              parents: parent
                ? [{ id: parent.id, body: parent.body, kind: "branch" }]
                : [],
              links: parent ? [parent.id] : [],
              created: Date.now(),
              entries: [
                {
                  id: uid(),
                  body: ch.a ? `${ch.a} × ${ch.b}` : ch.prompt,
                  label: ch.a ? "발명 놀이터에서 시작" : "관찰 놀이터에서 시작",
                  type: "play",
                  created: Date.now(),
                },
              ],
            });
          if (
            transact(() => {
              notes.unshift(n);
              if (parent) parent.links = [...new Set([...parent.links, n.id])];
            })
          ) {
            clearField("play-answer");
            playSavedId = n.id;
            playStep++;
            render();
            toast("새로운 생각을 심었어.");
          }
        }
        break;
      case "lab-finish":
        activeId = button.dataset.note;
        expFinishModal(id);
        break;
      case "lab-pick":
        jump("garden");
        toast("실험할 생각 하나를 열어 봐.");
        break;
      case "lab-new":
        jump("detail", id);
        studio = "experiment";
        render();
        $("studio-section")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        break;
      case "capture-save":
        {
          const value = takeText("capture-input");
          if (!value) return;
          const n = normalize({ id: uid(), body: value, created: Date.now() });
          if (transact(() => notes.unshift(n))) {
            put(DRAFT, "");
            savedId = n.id;
            render();
            const s = $("capture-feedback");
            s?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            toast("생각을 남겼어.");
          }
        }
        break;
      case "open-saved":
        if (savedId) jump("detail", savedId);
        break;
      case "filter":
        filter = button.dataset.filter;
        render();
        break;
      case "favorite":
        if (!cur) return;
        if (transact(() => (cur.favorite = !cur.favorite))) {
          render();
          toast(
            cur.favorite ? "아껴둔 생각에 추가했어." : "아껴둔 생각에서 뺐어.",
          );
        }
        break;
      case "edit-note":
        if (!cur) return;
        modal({
          title: "생각 다듬기",
          body: `<div class="modal-section" style="border:0;padding-top:8px"><p>처음 기록과 수정 이력은 보존돼.</p><textarea class="form-textarea" id="edit-body" style="min-height:175px" maxlength="14000">${esc(cur.body)}</textarea><div class="form-row"><button class="btn primary" data-action="edit-save">수정 저장</button></div></div>`,
        });
        break;
      case "edit-save":
        {
          const v = takeText("edit-body");
          if (!v) {
            toast("내용을 입력해 줘.");
            return;
          }
          if (
            transact(() => {
              if (cur.body !== v)
                cur.revisions.push({ body: cur.body, at: Date.now() });
              cur.body = v;
              cur.updated = Date.now();
            })
          ) {
            clearField("edit-body");
            closeModal();
            render();
            toast("수정했어.");
          }
        }
        break;
      case "delete-note":
        if (!confirm("이 기록과 이어진 생각, 실험을 모두 삭제할까?")) return;
        if (
          transact(() => {
            notes = notes.filter((x) => x.id !== cur.id);
            for (const n of notes)
              n.links = n.links.filter((x) => x !== cur.id);
          })
        ) {
          jump("garden");
          toast("기록을 삭제했어.");
        }
        break;
      case "share-note":
        if (!cur) return;
        {
          const text = noteText(cur);
          if (navigator.share) {
            navigator
              .share({ title: "Moru에서 자란 생각", text })
              .catch(() => {});
          } else copy(text);
        }
        break;
      case "studio":
        studio = button.dataset.studio;
        lens = null;
        render();
        $("studio-section")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        break;
      case "studio-close":
        studio = null;
        lens = null;
        render();
        $("studio-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;
      case "focus-save":
        {
          if (!cur) return;
          const fields = {
            who: takeText("f-who"),
            problem: takeText("f-problem"),
            solution: takeText("f-solution"),
            difference: takeText("f-difference"),
          };
          if (
            transact(() => {
              cur.fields = fields;
              cur.updated = Date.now();
            })
          ) {
            ["f-who", "f-problem", "f-solution", "f-difference"].forEach(
              clearField,
            );
            studio = null;
            render();
            toast("생각이 조금 더 또렷해졌어.");
          }
        }
        break;
      case "lens-mode":
        lens = button.dataset.mode;
        render();
        $("studio-section")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        break;
      case "next-prompt": {
        const mode = lens || "flip",
          p = nextPrompt(cur, mode);
        if (p)
          transact(() => {
            cur.seen[mode] = Array.isArray(cur.seen[mode])
              ? cur.seen[mode]
              : [];
            cur.seen[mode].push(mode + "-" + promptPool[mode].indexOf(p));
          });
        render();
        $("studio-section")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        break;
      }
      case "explore-save":
        {
          const v = takeText("explore-text"),
            mode = lens || "flip",
            p = nextPrompt(cur, mode);
          if (!v) {
            toast("한 줄만 남겨도 괜찮아.");
            return;
          }
          if (
            transact(() => {
              cur.entries.push({
                id: uid(),
                body: v,
                type: mode,
                label:
                  mode === "flip" ? "뒤집어 본 생각" : "가능성을 넓힌 생각",
                prompt: p,
                created: Date.now(),
                linkId: null,
              });
              if (p) {
                cur.seen[mode] = cur.seen[mode] || [];
                cur.seen[mode].push(mode + "-" + promptPool[mode].indexOf(p));
              }
              cur.updated = Date.now();
            })
          ) {
            clearField("explore-text");
            studio = null;
            render();
            toast("새로운 가지를 남겼어.");
          }
        }
        break;
      case "free-save":
        {
          const v = takeText("free-text");
          if (!v) {
            toast("남길 생각을 입력해 줘.");
            return;
          }
          if (
            transact(() => {
              cur.entries.push({
                id: uid(),
                body: v,
                type: "free",
                label: "이어진 생각",
                created: Date.now(),
                linkId: null,
              });
              cur.updated = Date.now();
            })
          ) {
            clearField("free-text");
            studio = null;
            render();
            toast("생각을 이어 붙였어.");
          }
        }
        break;
      case "new-exp":
        studio = "experiment";
        render();
        $("studio-section")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        break;
      case "exp-template":
        $("exp-name").value = button.dataset.value;
        $("exp-name").focus();
        break;
      case "exp-save":
        {
          const v = takeText("exp-name");
          if (!v) {
            toast("실험을 한 문장으로 적어 줘.");
            return;
          }
          if (
            transact(() => {
              cur.experiments.unshift({
                id: uid(),
                title: v,
                hypothesis: takeText("exp-hypothesis"),
                method: takeText("exp-method"),
                outcome: "",
                status: "todo",
                result: "",
                learning: "",
                created: Date.now(),
                doneAt: null,
              });
              cur.updated = Date.now();
            })
          ) {
            ["exp-name", "exp-hypothesis", "exp-method"].forEach(clearField);
            studio = null;
            render();
            toast("작은 실험이 생겼어.");
          }
        }
        break;
      case "finish-exp":
        expFinishModal(
          id || cur?.experiments.find((e) => e.status === "todo")?.id,
        );
        break;
      case "result-pick":
        OVER.dataset.result = button.dataset.val;
        OVER.querySelectorAll('[data-action="result-pick"]').forEach((b) =>
          b.classList.toggle("selected", b === button),
        );
        break;
      case "result-save":
        {
          const e = cur?.experiments.find((x) => x.id === id);
          if (!e) return;
          const outcome = OVER.dataset.result || "도움이 됐다",
            v = takeText("result-text"),
            learning = takeText("learning-text");
          if (!v || !learning) {
            toast("관찰한 결과와 배운 점을 남겨 줘.");
            return;
          }
          if (
            transact(() => {
              e.status = "done";
              e.outcome = outcome;
              e.result = v;
              e.learning = learning;
              e.doneAt = Date.now();
              cur.updated = Date.now();
            })
          ) {
            closeModal();
            render();
            toast("작은 실험을 마쳤어. 배움이 남았네.");
          }
        }
        break;
      case "remove-exp":
        if (!confirm("실험 기록을 삭제할까?")) return;
        if (
          transact(() => {
            cur.experiments = cur.experiments.filter((e) => e.id !== id);
            cur.updated = Date.now();
          })
        ) {
          render();
          toast("실험을 삭제했어.");
        }
        break;
      case "remove-entry":
        if (!confirm("이어서 쓴 생각을 삭제할까?")) return;
        if (
          transact(() => {
            cur.entries = cur.entries.filter((e) => e.id !== id);
            cur.updated = Date.now();
          })
        ) {
          render();
          toast("삭제했어.");
        }
        break;
      case "copy-summary":
        if (cur) copy(noteText(cur));
        break;
      case "finish-note":
        finishModal();
        break;
      case "takeaway-save":
        if (
          transact(() => {
            cur.takeaway = takeText("takeaway-input");
            cur.closedAt = Date.now();
            cur.updated = Date.now();
          })
        ) {
          closeModal();
          render();
          toast("오늘의 생각을 잘 남겨 뒀어.");
        }
        break;
      case "find-links":
        playMode = "connect";
        pairOverride = null;
        pairMode = "similar";
        pairIndex = 0;
        jump("playground");
        break;
      case "connect-with":
        if (cur) {
          playMode = "connect";
          pairOverride = [cur.id, id];
          pairIndex = 0;
          jump("playground");
        }
        break;
      case "pair-mode":
        pairMode = button.dataset.mode;
        pairIndex = 0;
        pairOverride = null;
        render();
        break;
      case "pair-next":
        pairIndex++;
        pairOverride = null;
        render();
        break;
      case "create-link-idea":
        {
          const p = pairList()[pairIndex % pairList().length],
            v = takeText("discover-text");
          if (!v) {
            toast("새로운 생각을 한 줄 적어 줘.");
            return;
          }
          if (!p) return;
          const n = normalize({
            id: uid(),
            body: v,
            created: Date.now(),
            origin: "fusion",
            parents: [p.a, p.b].map((x) => ({
              id: x.id,
              body: x.body,
              kind: "fusion",
            })),
            links: [p.a.id, p.b.id],
          });
          if (
            transact(() => {
              notes.unshift(n);
              p.a.links = [...new Set([...(p.a.links || []), n.id])];
              p.b.links = [...new Set([...(p.b.links || []), n.id])];
            })
          ) {
            clearField("discover-text");
            jump("detail", n.id);
            toast("두 생각 사이에서 새 아이디어가 태어났어.");
          }
        }
        break;
      case "backup":
        backup();
        break;
      case "import":
        maybeStartImport();
        break;
    }
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-action]");
    if (b) action(b.dataset.action, b);
  });
  document.addEventListener("input", (e) => {
    if (e.target.matches("textarea,input") && e.target.id !== "search-input")
      saveField(e.target);
    if (e.target.id === "capture-input") {
      put(DRAFT, e.target.value);
      $("capture-save").disabled = !e.target.value.trim();
      if (savedId) {
        savedId = null;
        $("capture-feedback").innerHTML = "";
      }
    }
    if (e.target.id === "search-input") {
      search = e.target.value;
      const arr = notes
        .filter((n) =>
          (
            n.body +
            " " +
            n.entries.map((e) => e.body).join(" ") +
            " " +
            Object.values(n.fields).join(" ")
          )
            .toLowerCase()
            .includes(search.toLowerCase()),
        )
        .filter(
          (n) =>
            filter === "all" ||
            (filter === "favorite" && n.favorite) ||
            (filter === "active" &&
              n.experiments.some((e) => e.status === "todo")) ||
            (filter === "flower" && complete(n) > 0),
        )
        .sort((a, b) => b.updated - a.updated);
      $("garden-cards").innerHTML = cards(arr);
    }
  });
  OVER.addEventListener("click", (e) => {
    if (e.target === OVER) {
      closeModal();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !OVER.hidden) {
      closeModal();
    }
  });
  $("brand").addEventListener("click", () => jump("capture"));
  // v11: explicit ancestry is separate from the legacy, undirected links.
  function nextAction(e) {
    return e.outcome === "도움이 됐다"
      ? "같은 방법을 더 많은 사람이나 다른 환경에서 반복해 봐."
      : e.outcome === "예상과 달랐다"
        ? "달랐던 원인을 하나 골라 가설을 바꾸고 새 방향으로 분기해 봐."
        : "판단 기준과 관찰 기간을 정한 뒤 한 번 더 확인해 봐.";
  }
  function roadmap(n) {
    const done = n.experiments
      .filter((e) => e.status === "done")
      .sort((a, b) => b.doneAt - a.doneAt)[0];
    if (done)
      return {
        text: nextAction(done),
        action: "branch",
        label: "배움에서 새 방향 만들기",
      };
    if (n.experiments.some((e) => e.status === "todo"))
      return {
        text: "실행한 뒤 관찰한 결과와 배움을 남겨 봐.",
        action: "finish-exp",
        label: "결과 남기기",
      };
    return {
      text: "가장 불확실한 부분 하나를 작은 실험으로 확인해 봐.",
      action: "new-exp",
      label: "첫 실험 설계하기",
    };
  }
  function evolution(n) {
    const related = new Set([n.id]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const x of notes) {
        if (related.has(x.id) || x.parents.some((p) => related.has(p.id))) {
          for (const id of [x.id, ...x.parents.map((p) => p.id)])
            if (!related.has(id)) {
              related.add(id);
              changed = true;
            }
        }
      }
    }
    const family = notes
      .filter((x) => related.has(x.id))
      .sort((a, b) => a.created - b.created);
    return `<section class="evolution card"><div class="section-title"><div><span class="eyebrow">IDEA EVOLUTION</span><h2>생각이 자라온 길</h2></div><button class="btn solid tiny" data-action="branch">${I("plus")} 새 방향으로 분기</button></div><p class="sub">원본을 남겨두고, 새로운 가능성을 독립된 생각으로 키워 봐.</p><ol class="evolution-path">${family
      .map(
        (x) =>
          `<li class="${x.id === n.id ? "current" : ""}"><small>${x.parents.length > 1 ? "융합" : x.parents.length ? "분기" : x.origin === "playground" ? "놀이터에서 시작" : "첫 기록"} · ${esc(day(x.created))}</small>${
            x.parents.length
              ? `<div class="parent-path">${x.parents
                  .map((p) => {
                    const parent = notes.find((z) => z.id === p.id);
                    return parent
                      ? `<button class="link-button" data-action="detail" data-id="${esc(p.id)}">${esc(short(parent.body, 32))}</button>`
                      : `<span>삭제된 원본 · ${esc(short(p.body, 32))}</span>`;
                  })
                  .join(" + ")} →</div>`
              : ""
          }<button class="path-node" data-action="detail" data-id="${esc(x.id)}" ${x.id === n.id ? 'aria-current="true"' : ""}>${esc(short(x.body, 100))}<span>${esc(stages[stage(x)])}</span></button></li>`,
      )
      .join(
        "",
      )}</ol><p class="tiny">씨앗: 기록 · 새싹: 발전 또는 분기 · 가지: 실험 설계 · 꽃: 결과와 배움</p></section>`;
  }
  function branchModal() {
    const n = note();
    if (!n) return;
    modal({
      title: "새 방향으로 분기",
      body: `<p class="sub">이 생각은 그대로 보존돼.</p><blockquote>${esc(short(n.body, 160))}</blockquote><label class="field-label" for="branch-body">새 방향의 생각</label><textarea class="form-textarea" id="branch-body" maxlength="14000" placeholder="대상을 바꾸거나, 실험에서 배운 점을 반영해 봐."></textarea><div class="form-row"><button class="btn primary" data-action="branch-save">새 가지 만들기</button></div>`,
    });
    restoreFields();
  }
  function saveBranch() {
    const parent = note(),
      body = takeText("branch-body");
    if (!body) {
      toast("새 방향을 한 줄 남겨 줘.");
      return;
    }
    const n = normalize({
      id: uid(),
      body,
      origin: "branch",
      parents: [{ id: parent.id, body: parent.body, kind: "branch" }],
      links: [parent.id],
    });
    if (
      transact(() => {
        notes.unshift(n);
        parent.links = [...new Set([...parent.links, n.id])];
      })
    ) {
      clearField("branch-body");
      closeModal();
      jump("detail", n.id);
      toast("원본에서 새로운 가지가 자랐어.");
    }
  }
  let todayOffset = 0;
  function today() {
    const candidates = notes.slice().sort((a, b) => a.updated - b.updated);
    const d = new Date(),
      dayKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
      seed = [...dayKey].reduce((a, c) => a + c.charCodeAt(0), 0),
      n = candidates[(seed + todayOffset) % candidates.length];
    const lenses = [
      {
        title: "다른 사람의 시선으로",
        text: "이 생각이 가장 필요할 것 같은 사람 한 명을 떠올려 봐. 그 사람의 하루 어디에 놓을 수 있을까?",
      },
      {
        title: "작게 줄여서",
        text: "이 생각에서 딱 한 가지만 남긴다면? 오늘 10분 안에 확인할 수 있는 크기로 줄여 봐.",
      },
      {
        title: "제약을 바꾸어서",
        text: "시간이나 예산이 절반이라면 어떤 방법이 가능할까? 핵심 목적은 유지한 채 방법을 바꿔 봐.",
      },
    ];
    const lens = lenses[(seed + todayOffset) % lenses.length];
    return `<section class="page-head"><span class="eyebrow">DAILY REDISCOVERY · ${esc(day(Date.now()))}</span><h1 class="page-title">오늘의 발견</h1><p class="sub">예전의 생각을, 오늘의 시선으로.</p></section>${n ? `<section class="discovery-hero"><span class="eyebrow">다시 꺼낸 기록 · ${esc(ago(n.updated))}</span><h2>${esc(n.body)}</h2><div class="divider"></div><span class="pill">${esc(lens.title)}</span><p class="discovery-lens">${esc(lens.text)}</p><div class="button-row"><button class="btn primary" data-action="today-branch" data-id="${esc(n.id)}">이 관점으로 분기하기 ${I("arrow")}</button><button class="btn outline" data-action="detail" data-id="${esc(n.id)}">원본 열기</button><button class="btn ghost" data-action="today-next">다른 발견</button></div></section><p class="tiny">오래 쉬고 있는 기록부터 날짜에 맞춰 골라 보여줘. 제안은 브라우저의 규칙으로 만들어져.</p>` : `<div class="empty-state"><strong>오늘의 발견은 첫 기록에서 시작돼</strong><p>아이디어가 쌓이면 새로운 관점으로 다시 만날 수 있어.</p><button class="btn primary" data-action="nav" data-screen="capture">첫 생각 기록하기</button></div>`}`;
  }
  // Persist unfinished fields independently from saved notes. Never persist search controls.
  const draftKey = (id) => `moru_v11_field:${activeId || screen}:${id}`;
  function saveField(el) {
    if (el.id === "capture-input") return;
    if (!put(draftKey(el.id), el.value))
      toast("임시 저장 공간이 부족해. 작성 내용을 복사해 줘.");
  }
  function clearField(id) {
    try {
      localStorage.removeItem(draftKey(id));
    } catch {}
  }
  function restoreFields() {
    APP.querySelectorAll("textarea,input").forEach((el) => {
      if (el.id && el.id !== "capture-input" && el.id !== "search-input") {
        const value = get(draftKey(el.id));
        if (value !== null) el.value = value;
      }
    });
  }
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Enter" &&
      (e.metaKey || e.ctrlKey) &&
      document.activeElement?.id === "capture-input"
    ) {
      e.preventDefault();
      action("capture-save");
    }
    if (e.key === "Tab" && !OVER.hidden) {
      const focusable = [
        ...OVER.querySelectorAll("button,input,textarea,[href]"),
      ].filter((el) => !el.disabled);
      const first = focusable[0],
        last = focusable.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  });
  window.addEventListener("storage", (e) => {
    if (e.key === K && e.newValue !== diskSnapshot) {
      writeBlocked = true;
      warning =
        "다른 탭에서 기록이 변경됐어. 작성 중인 내용을 복사한 뒤 새로고침해 줘.";
      toast(warning);
    }
  });

  init();
  render();
})();
