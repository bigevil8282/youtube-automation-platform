const elementLabels = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
};

const elementNames = ["wood", "fire", "earth", "metal", "water"];

const elementProfiles = {
  wood: {
    tone: "성장 균형형",
    summary:
      "성장 방향을 잡는 힘이 강합니다. 다만 50대 투자에서는 성장 테마를 넓은 대표지수 안에 넣고, 배당 바구니로 변동성을 낮추는 구성이 맞습니다.",
    satellite: "헬스케어·친환경 인프라 ETF",
    reason: "장기 성장 산업을 보되 단일 종목 집중을 피하는 보완 바구니입니다.",
  },
  fire: {
    tone: "활력 조절형",
    summary:
      "추진력이 강한 편이라 시장 흐름을 빠르게 보고 싶어질 수 있습니다. 핵심 지수 비중을 먼저 고정하고 위성 ETF는 제한된 범위 안에서 쓰는 편이 좋습니다.",
    satellite: "미국 기술주·반도체 분산 ETF",
    reason: "활력 있는 성장 섹터를 소량 편입하되 리밸런싱 규칙을 함께 둡니다.",
  },
  earth: {
    tone: "안정 배당형",
    summary:
      "균형과 지속성을 중시하는 성향입니다. 한 번에 큰 수익을 좇기보다 꾸준한 현금흐름과 넓은 분산을 우선하는 구성이 맞습니다.",
    satellite: "필수소비재·인프라 ETF",
    reason: "경기 변동에도 생활 기반 수요가 남는 영역으로 포트폴리오를 받쳐줍니다.",
  },
  metal: {
    tone: "원칙 운용형",
    summary:
      "기준과 원칙을 세우는 힘이 강합니다. 저비용 대표지수와 퀄리티 ETF를 중심으로 정기 점검 규칙을 명확히 두는 방식이 맞습니다.",
    satellite: "퀄리티 대형주·배당성장 ETF",
    reason: "재무 건전성과 현금흐름을 기준으로 고르는 바구니입니다.",
  },
  water: {
    tone: "분산 유연형",
    summary:
      "유연하게 움직이는 성향이 강합니다. 환율과 해외 비중을 함께 보면서 전세계 주식과 방어 섹터를 섞는 접근이 좋습니다.",
    satellite: "글로벌 저변동성·헬스케어 ETF",
    reason: "변동성을 낮추며 지역과 통화를 나누는 보완 바구니입니다.",
  },
};

const goalProfiles = {
  retirement: {
    incomeBoost: 8,
    satelliteShift: -4,
    title: "은퇴 생활비형",
  },
  income: {
    incomeBoost: 10,
    satelliteShift: -5,
    title: "배당 현금흐름형",
  },
  balance: {
    incomeBoost: 3,
    satelliteShift: 0,
    title: "안정 성장형",
  },
  growth: {
    incomeBoost: -4,
    satelliteShift: 8,
    title: "자산 성장형",
  },
};

const form = document.querySelector("#profileForm");
const lossInput = document.querySelector("#lossTolerance");
const lossOutput = document.querySelector("#lossOutput");
const resetButton = document.querySelector("#resetButton");
const cardsContainer = document.querySelector("#recommendationCards");

function getElementFromMonth(month) {
  if ([3, 4].includes(month)) return "wood";
  if ([5, 6].includes(month)) return "fire";
  if ([2, 7, 8].includes(month)) return "earth";
  if ([9, 10].includes(month)) return "metal";
  return "water";
}

function getElementFromHour(hourValue) {
  if (hourValue === "unknown") return "earth";
  const hour = Number(hourValue);
  if (hour === 0 || hour === 22) return "water";
  if (hour === 2 || hour === 8 || hour === 14 || hour === 20) return "earth";
  if (hour === 4 || hour === 6) return "wood";
  if (hour === 10 || hour === 12) return "fire";
  return "metal";
}

function scoreElements(date, hourValue) {
  const scores = {
    wood: 1,
    fire: 1,
    earth: 1,
    metal: 1,
    water: 1,
  };

  const yearPick = elementNames[Math.abs(date.getFullYear()) % elementNames.length];
  const dayPick = elementNames[Math.abs(date.getDate() + date.getMonth()) % elementNames.length];
  const monthPick = getElementFromMonth(date.getMonth() + 1);
  const hourPick = getElementFromHour(hourValue);

  [yearPick, monthPick, dayPick, hourPick].forEach((element, index) => {
    scores[element] += index === 1 ? 3 : 2;
  });

  return scores;
}

function rankElements(scores) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1]);
}

function getAllocation(lossTolerance, goal) {
  let core = 62;
  let income = 25;
  let satellite = 13;

  if (lossTolerance >= 25) {
    core = 52;
    income = 23;
    satellite = 25;
  }

  if (lossTolerance <= 10) {
    core = 67;
    income = 25;
    satellite = 8;
  }

  const goalProfile = goalProfiles[goal];
  income += goalProfile.incomeBoost;
  satellite += goalProfile.satelliteShift;
  core = 100 - income - satellite;

  if (core < 45) {
    satellite -= 45 - core;
    core = 45;
  }

  if (satellite < 5) {
    core -= 5 - satellite;
    satellite = 5;
  }

  return { core, income, satellite };
}

function formatWon(value) {
  const number = Number(value || 0);
  if (number >= 10000) {
    return `${Math.round(number / 10000).toLocaleString("ko-KR")}만원`;
  }
  return `${number.toLocaleString("ko-KR")}원`;
}

function buildCards(profile, missingElement, allocation, monthly) {
  const monthlyText = formatWon(monthly);
  return [
    {
      kicker: `${allocation.core}%`,
      title: "핵심 지수 ETF",
      body: "미국 대표지수, 전세계 주식, 국내 대형주처럼 넓게 분산된 ETF를 중심 축으로 둡니다.",
      note: `월 ${monthlyText} 적립 시 먼저 채울 기본 바구니입니다.`,
    },
    {
      kicker: `${allocation.income}%`,
      title: "배당·퀄리티 ETF",
      body: "국내 고배당, 배당성장, 퀄리티 대형주 ETF로 은퇴 전후 현금흐름과 하락 방어를 보완합니다.",
      note: "분배금만 보지 말고 총보수와 장기 성과를 함께 확인합니다.",
    },
    {
      kicker: `${allocation.satellite}%`,
      title: `${elementLabels[missingElement]} 보완 바구니`,
      body: profile.satellite,
      note: profile.reason,
    },
  ];
}

function renderCards(cards) {
  cardsContainer.innerHTML = cards
    .map(
      (card) => `
        <article class="recommendation-card">
          <span class="card-kicker">${card.kicker}</span>
          <h3>${card.title}</h3>
          <p>${card.body}</p>
          <p class="card-note">${card.note}</p>
        </article>
      `,
    )
    .join("");
}

function updateText(id, text) {
  document.querySelector(`#${id}`).textContent = text;
}

function updateAllocation(allocation) {
  updateText("coreWeight", `${allocation.core}%`);
  updateText("incomeWeight", `${allocation.income}%`);
  updateText("satelliteWeight", `${allocation.satellite}%`);
  document.querySelector("#coreBar").style.width = `${allocation.core}%`;
  document.querySelector("#incomeBar").style.width = `${allocation.income}%`;
  document.querySelector("#satelliteBar").style.width = `${allocation.satellite}%`;
}

function calculate(event) {
  if (event) event.preventDefault();

  const data = new FormData(form);
  const birthdate = data.get("birthdate");
  const lossTolerance = Number(data.get("lossTolerance"));
  const goal = data.get("goal");
  const monthly = data.get("monthly");
  const date = birthdate ? new Date(`${birthdate}T12:00:00`) : new Date("1974-06-18T12:00:00");
  const scores = scoreElements(date, data.get("birthHour"));
  const ranked = rankElements(scores);
  const strongElement = ranked[0][0];
  const missingElement = ranked[ranked.length - 1][0];
  const profile = elementProfiles[strongElement];
  const allocation = getAllocation(lossTolerance, goal);
  const goalProfile = goalProfiles[goal];

  lossOutput.value = `${lossTolerance}%`;
  updateText("clientName", data.get("name") || "고객");
  updateText("dominantElement", elementLabels[strongElement]);
  updateText("strongElement", elementLabels[strongElement]);
  updateText("missingElement", elementLabels[missingElement]);
  updateText("riskTone", goalProfile.title || profile.tone);
  updateText("sajuSummary", profile.summary);
  updateText("satelliteText", profile.satellite);
  updateText("coreText", lossTolerance >= 25 ? "미국 대표지수·전세계 주식" : "전세계 주식·국내 대형주");
  updateText("incomeText", goal === "income" ? "국내 고배당·배당성장" : "퀄리티 배당·저변동성");
  updateAllocation(allocation);
  renderCards(buildCards(profile, missingElement, allocation, monthly));
}

lossInput.addEventListener("input", () => {
  lossOutput.value = `${lossInput.value}%`;
});

form.addEventListener("submit", calculate);
form.addEventListener("input", calculate);
form.addEventListener("change", calculate);

resetButton.addEventListener("click", () => {
  form.reset();
  calculate();
});

calculate();
