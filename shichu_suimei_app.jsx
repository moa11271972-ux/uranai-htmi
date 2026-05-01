import React, { useMemo, useState } from "react";

/*
  四柱推命アプリ 完全単体版 App.jsx
  --------------------------------------------------
  Vite React の src/App.jsx をこのコードで置き換えるだけで動きます。

  起動:
  npm create vite@latest shichu-app -- --template react
  cd shichu-app
  npm install
  npm run dev

  この版の暦計算:
  - 年柱: 立春 = 太陽黄経315度で切替
  - 月柱: 節入り = 太陽黄経315度から30度ごとで切替
  - 日柱: グレゴリオ暦のユリウス日番号から六十干支を算出
  - 時柱: 日干と出生時刻から算出

  注意:
  - 太陽黄経はMeeus系の簡易天文式による近似です。
  - 出生地の真太陽時補正、流派差、23時日替わり採用などは設定化していません。
  - 身内へのプレゼントや個人利用には十分使いやすい構成です。
  - 有料鑑定で使う場合は、万年暦データとの照合を追加してください。
*/

const STEMS = [
  { jp: "甲", yy: "陽", element: "木", image: "大樹", detail: "まっすぐで向上心が強く、理想を掲げて成長していくタイプ。自分の軸を持つほど運が開きます。" },
  { jp: "乙", yy: "陰", element: "木", image: "草花", detail: "柔軟で調和力があり、人や環境に合わせながら魅力を育てるタイプ。美意識と粘り強さが武器です。" },
  { jp: "丙", yy: "陽", element: "火", image: "太陽", detail: "存在感があり、発信力と華やかさで周囲を明るくするタイプ。表に出るほど運が動きます。" },
  { jp: "丁", yy: "陰", element: "火", image: "灯火", detail: "繊細で直感が鋭く、集中力と表現力を持つタイプ。心が動くものに向き合うと才能が光ります。" },
  { jp: "戊", yy: "陽", element: "土", image: "山", detail: "安定感と包容力があり、人から頼られやすいタイプ。焦らず大きく構えるほど信用が育ちます。" },
  { jp: "己", yy: "陰", element: "土", image: "畑", detail: "現実感覚があり、物事を丁寧に育てるタイプ。人の可能性を引き出す力と生活力があります。" },
  { jp: "庚", yy: "陽", element: "金", image: "刀", detail: "決断力があり、困難を突破する勝負強さを持つタイプ。鍛えられるほど本来の力が出ます。" },
  { jp: "辛", yy: "陰", element: "金", image: "宝石", detail: "繊細で品格があり、専門性や美意識を磨くほど評価されるタイプ。妥協しない姿勢が魅力です。" },
  { jp: "壬", yy: "陽", element: "水", image: "海", detail: "知性と自由さがあり、広い世界で可能性を広げるタイプ。情報・移動・人脈が運を運びます。" },
  { jp: "癸", yy: "陰", element: "水", image: "雨", detail: "洞察力があり、静かに物事の本質を見抜くタイプ。研究・癒し・言葉の力に恵まれます。" },
];

const BRANCHES = [
  { jp: "子", animal: "鼠", element: "水", hidden: ["癸"] },
  { jp: "丑", animal: "牛", element: "土", hidden: ["己", "癸", "辛"] },
  { jp: "寅", animal: "虎", element: "木", hidden: ["甲", "丙", "戊"] },
  { jp: "卯", animal: "兎", element: "木", hidden: ["乙"] },
  { jp: "辰", animal: "龍", element: "土", hidden: ["戊", "乙", "癸"] },
  { jp: "巳", animal: "蛇", element: "火", hidden: ["丙", "庚", "戊"] },
  { jp: "午", animal: "馬", element: "火", hidden: ["丁", "己"] },
  { jp: "未", animal: "羊", element: "土", hidden: ["己", "丁", "乙"] },
  { jp: "申", animal: "猿", element: "金", hidden: ["庚", "壬", "戊"] },
  { jp: "酉", animal: "鶏", element: "金", hidden: ["辛"] },
  { jp: "戌", animal: "犬", element: "土", hidden: ["戊", "辛", "丁"] },
  { jp: "亥", animal: "猪", element: "水", hidden: ["壬", "甲"] },
];

const ELEMENTS = ["木", "火", "土", "金", "水"];
const GENERATES = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
const CONTROLS = { 木: "土", 火: "金", 土: "水", 金: "木", 水: "火" };
const GENERATED_BY = Object.fromEntries(Object.entries(GENERATES).map(([a, b]) => [b, a]));
const CONTROLLED_BY = Object.fromEntries(Object.entries(CONTROLS).map(([a, b]) => [b, a]));

const ELEMENT_TEXT = {
  木: { icon: "🌳", talent: "企画・成長・教育・発展", excess: "理想先行、頑固、焦り", lucky: "植物、朝の散歩、読書、緑、学び直し" },
  火: { icon: "🔥", talent: "表現・人気・直感・発信", excess: "感情的、消耗、目立ちすぎ", lucky: "太陽、発信、赤、キャンドル、笑う時間" },
  土: { icon: "⛰️", talent: "安定・信用・管理・育成", excess: "抱え込み、停滞、慎重すぎ", lucky: "整理整頓、陶器、黄色、貯金、規則正しい生活" },
  金: { icon: "💎", talent: "決断・専門性・整理・美意識", excess: "批判的、完璧主義、緊張", lucky: "白、アクセサリー、断捨離、上質な道具、専門資格" },
  水: { icon: "💧", talent: "知性・情報・自由・柔軟性", excess: "考えすぎ、不安、流されやすい", lucky: "水辺、入浴、黒、日記、静かな時間、学習" },
};

const TEN_GOD_TEXT = {
  比肩: "自立心・芯の強さ・マイペース。自分の看板で勝負すると力が出ます。",
  劫財: "競争心・仲間運・巻き込み力。人と組むほど大きく動けます。",
  食神: "楽しみ・表現・衣食住の豊かさ。自然体の発信が運を呼びます。",
  傷官: "才能・感性・鋭い表現。型にはまらない発想が武器です。",
  偏財: "人脈・商才・行動力。広く動くほどチャンスを拾えます。",
  正財: "堅実・管理・信用。積み上げ型の金運と生活力があります。",
  偏官: "勝負・責任・突破力。困難な場面で本領を発揮します。",
  正官: "品位・社会性・信頼。ルールある場所で評価されやすい星です。",
  偏印: "ひらめき・専門性・変化。独自の学びや感性で道を作ります。",
  印綬: "知性・保護・学問。深く学び、信頼を得て伸びる星です。",
};

const TWELVE_PHASES = {
  甲: { 亥: "長生", 子: "沐浴", 丑: "冠帯", 寅: "建禄", 卯: "帝旺", 辰: "衰", 巳: "病", 午: "死", 未: "墓", 申: "絶", 酉: "胎", 戌: "養" },
  乙: { 午: "長生", 巳: "沐浴", 辰: "冠帯", 卯: "建禄", 寅: "帝旺", 丑: "衰", 子: "病", 亥: "死", 戌: "墓", 酉: "絶", 申: "胎", 未: "養" },
  丙: { 寅: "長生", 卯: "沐浴", 辰: "冠帯", 巳: "建禄", 午: "帝旺", 未: "衰", 申: "病", 酉: "死", 戌: "墓", 亥: "絶", 子: "胎", 丑: "養" },
  丁: { 酉: "長生", 申: "沐浴", 未: "冠帯", 午: "建禄", 巳: "帝旺", 辰: "衰", 卯: "病", 寅: "死", 丑: "墓", 子: "絶", 亥: "胎", 戌: "養" },
  戊: { 寅: "長生", 卯: "沐浴", 辰: "冠帯", 巳: "建禄", 午: "帝旺", 未: "衰", 申: "病", 酉: "死", 戌: "墓", 亥: "絶", 子: "胎", 丑: "養" },
  己: { 酉: "長生", 申: "沐浴", 未: "冠帯", 午: "建禄", 巳: "帝旺", 辰: "衰", 卯: "病", 寅: "死", 丑: "墓", 子: "絶", 亥: "胎", 戌: "養" },
  庚: { 巳: "長生", 午: "沐浴", 未: "冠帯", 申: "建禄", 酉: "帝旺", 戌: "衰", 亥: "病", 子: "死", 丑: "墓", 寅: "絶", 卯: "胎", 辰: "養" },
  辛: { 子: "長生", 亥: "沐浴", 戌: "冠帯", 酉: "建禄", 申: "帝旺", 未: "衰", 午: "病", 巳: "死", 辰: "墓", 卯: "絶", 寅: "胎", 丑: "養" },
  壬: { 申: "長生", 酉: "沐浴", 戌: "冠帯", 亥: "建禄", 子: "帝旺", 丑: "衰", 寅: "病", 卯: "死", 辰: "墓", 巳: "絶", 午: "胎", 未: "養" },
  癸: { 卯: "長生", 寅: "沐浴", 丑: "冠帯", 子: "建禄", 亥: "帝旺", 戌: "衰", 酉: "病", 申: "死", 未: "墓", 午: "絶", 巳: "胎", 辰: "養" },
};

const VOID_GROUPS = [
  { start: 0, voids: ["戌", "亥"] },
  { start: 10, voids: ["申", "酉"] },
  { start: 20, voids: ["午", "未"] },
  { start: 30, voids: ["辰", "巳"] },
  { start: 40, voids: ["寅", "卯"] },
  { start: 50, voids: ["子", "丑"] },
];

const SOLAR_TERMS = [
  { name: "立春", angle: 315, branchIndex: 2, roughMonth: 2, roughDay: 4 },
  { name: "啓蟄", angle: 345, branchIndex: 3, roughMonth: 3, roughDay: 6 },
  { name: "清明", angle: 15, branchIndex: 4, roughMonth: 4, roughDay: 5 },
  { name: "立夏", angle: 45, branchIndex: 5, roughMonth: 5, roughDay: 6 },
  { name: "芒種", angle: 75, branchIndex: 6, roughMonth: 6, roughDay: 6 },
  { name: "小暑", angle: 105, branchIndex: 7, roughMonth: 7, roughDay: 7 },
  { name: "立秋", angle: 135, branchIndex: 8, roughMonth: 8, roughDay: 8 },
  { name: "白露", angle: 165, branchIndex: 9, roughMonth: 9, roughDay: 8 },
  { name: "寒露", angle: 195, branchIndex: 10, roughMonth: 10, roughDay: 8 },
  { name: "立冬", angle: 225, branchIndex: 11, roughMonth: 11, roughDay: 7 },
  { name: "大雪", angle: 255, branchIndex: 0, roughMonth: 12, roughDay: 7 },
  { name: "小寒", angle: 285, branchIndex: 1, roughMonth: 1, roughDay: 6, nextYear: true },
];

function mod(n, m) { return ((n % m) + m) % m; }
function degToRad(d) { return (d * Math.PI) / 180; }
function norm360(d) { return mod(d, 360); }
function stemByJp(jp) { return STEMS.find((s) => s.jp === jp); }
function makePillar(stemIndex, branchIndex) {
  return { stemIndex, branchIndex, stem: STEMS[stemIndex], branch: BRANCHES[branchIndex], label: `${STEMS[stemIndex].jp}${BRANCHES[branchIndex].jp}` };
}
function julianDayFromDate(date) { return date.getTime() / 86400000 + 2440587.5; }
function julianDayNumber(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

function apparentSolarLongitude(date) {
  const jd = julianDayFromDate(date);
  const T = (jd - 2451545.0) / 36525;
  const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(degToRad(M)) +
    (0.019993 - 0.000101 * T) * Math.sin(degToRad(2 * M)) +
    0.000289 * Math.sin(degToRad(3 * M));
  const trueLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  return norm360(trueLong - 0.00569 - 0.00478 * Math.sin(degToRad(omega)));
}

function signedAngleDiff(lon, target) {
  return ((lon - target + 540) % 360) - 180;
}

function findSolarTermTime(solarYear, term) {
  const y = term.nextYear ? solarYear + 1 : solarYear;
  let left = new Date(y, term.roughMonth - 1, term.roughDay - 4, 0, 0, 0);
  let right = new Date(y, term.roughMonth - 1, term.roughDay + 4, 23, 59, 59);

  let fLeft = signedAngleDiff(apparentSolarLongitude(left), term.angle);
  let fRight = signedAngleDiff(apparentSolarLongitude(right), term.angle);

  if (fLeft > fRight) {
    left = new Date(y, term.roughMonth - 1, term.roughDay - 8, 0, 0, 0);
    right = new Date(y, term.roughMonth - 1, term.roughDay + 8, 23, 59, 59);
    fLeft = signedAngleDiff(apparentSolarLongitude(left), term.angle);
    fRight = signedAngleDiff(apparentSolarLongitude(right), term.angle);
  }

  for (let i = 0; i < 50; i++) {
    const mid = new Date((left.getTime() + right.getTime()) / 2);
    const fMid = signedAngleDiff(apparentSolarLongitude(mid), term.angle);
    if (fMid < 0) left = mid;
    else right = mid;
  }
  return right;
}

function solarTermsForSolarYear(solarYear) {
  return SOLAR_TERMS.map((t) => ({ ...t, time: findSolarTermTime(solarYear, t) })).sort((a, b) => a.time - b.time);
}

function getSolarYear(date) {
  const y = date.getFullYear();
  const lichun = findSolarTermTime(y, SOLAR_TERMS[0]);
  return date >= lichun ? y : y - 1;
}

function getYearPillar(date) {
  const sy = getSolarYear(date);
  return makePillar(mod(sy - 4, 10), mod(sy - 4, 12));
}

function getMonthPillar(date, yearStemIndex) {
  const sy = getSolarYear(date);
  const terms = solarTermsForSolarYear(sy);
  let active = terms[0];
  for (const term of terms) {
    if (date >= term.time) active = term;
    else break;
  }
  const branchIndex = active.branchIndex;
  const monthNumberFromTiger = mod(branchIndex - 2, 12);
  const tigerMonthStem = [2, 4, 6, 8, 0][Math.floor(yearStemIndex / 2)];
  const stemIndex = mod(tigerMonthStem + monthNumberFromTiger, 10);
  return { ...makePillar(stemIndex, branchIndex), solarTerm: active.name, solarTermTime: active.time };
}

function getDayPillar(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const jdn = julianDayNumber(y, m, d);
  // 1949-10-01 と 1912-02-18 を甲子日とする六十干支基準。JDN % 60 = 11 の日が甲子。
  const cycleIndex = mod(jdn - 11, 60);
  return makePillar(cycleIndex % 10, cycleIndex % 12);
}

function getHourPillar(date, dayStemIndex) {
  const h = date.getHours();
  const branchIndex = mod(Math.floor((h + 1) / 2), 12);
  const startStem = [0, 2, 4, 6, 8][Math.floor(dayStemIndex / 2)];
  return makePillar(mod(startStem + branchIndex, 10), branchIndex);
}

function tenGod(dayStem, targetStem) {
  const sameYY = dayStem.yy === targetStem.yy;
  if (targetStem.element === dayStem.element) return sameYY ? "比肩" : "劫財";
  if (GENERATES[dayStem.element] === targetStem.element) return sameYY ? "食神" : "傷官";
  if (CONTROLS[dayStem.element] === targetStem.element) return sameYY ? "偏財" : "正財";
  if (CONTROLLED_BY[dayStem.element] === targetStem.element) return sameYY ? "偏官" : "正官";
  if (GENERATED_BY[dayStem.element] === targetStem.element) return sameYY ? "偏印" : "印綬";
  return "-";
}

function getVoid(dayStemIndex, dayBranchIndex) {
  const cycleIndex = mod(dayStemIndex + ((dayBranchIndex - dayStemIndex + 12) % 12), 60);
  const group = VOID_GROUPS.find((g) => cycleIndex >= g.start && cycleIndex < g.start + 10) || VOID_GROUPS[0];
  return group.voids;
}

function scoreFiveElements(pillars) {
  const counts = Object.fromEntries(ELEMENTS.map((e) => [e, 0]));
  Object.values(pillars).forEach((p) => {
    counts[p.stem.element] += 1.4;
    counts[p.branch.element] += 1.0;
    p.branch.hidden.forEach((h, i) => {
      const s = stemByJp(h);
      if (s) counts[s.element] += i === 0 ? 0.5 : 0.25;
    });
  });
  return counts;
}

function judgeStrength(dayElement, counts, monthBranch) {
  const support = counts[dayElement] + counts[GENERATED_BY[dayElement]] * 0.8;
  const drain = counts[GENERATES[dayElement]] * 0.5 + counts[CONTROLS[dayElement]] * 0.7 + counts[CONTROLLED_BY[dayElement]] * 0.9;
  const seasonal = monthBranch.element === dayElement || monthBranch.element === GENERATED_BY[dayElement] ? 1.2 : 0;
  const value = support + seasonal - drain;
  if (value >= 2.4) return { label: "身強", useful: [CONTROLS[dayElement], GENERATES[dayElement]], avoid: [dayElement, GENERATED_BY[dayElement]] };
  if (value <= -0.8) return { label: "身弱", useful: [GENERATED_BY[dayElement], dayElement], avoid: [CONTROLLED_BY[dayElement], GENERATES[dayElement]] };
  return { label: "中和", useful: [CONTROLS[dayElement], GENERATED_BY[dayElement]], avoid: [] };
}

function calculateChart({ birthDate, birthTime }) {
  const [year, month, day] = birthDate.split("-").map(Number);
  const [hour, minute] = birthTime.split(":").map(Number);
  const date = new Date(year, month - 1, day, hour, minute || 0, 0);

  const yearPillar = getYearPillar(date);
  const monthPillar = getMonthPillar(date, yearPillar.stemIndex);
  const dayPillar = getDayPillar(date);
  const hourPillar = getHourPillar(date, dayPillar.stemIndex);

  const basePillars = { 年柱: yearPillar, 月柱: monthPillar, 日柱: dayPillar, 時柱: hourPillar };
  const counts = scoreFiveElements(basePillars);
  const sorted = [...ELEMENTS].sort((a, b) => counts[b] - counts[a]);
  const strength = judgeStrength(dayPillar.stem.element, counts, monthPillar.branch);
  const voids = getVoid(dayPillar.stemIndex, dayPillar.branchIndex);

  const pillars = Object.fromEntries(Object.entries(basePillars).map(([name, p]) => [name, {
    ...p,
    tenGodStem: name === "日柱" ? "日主" : tenGod(dayPillar.stem, p.stem),
    hiddenGods: p.branch.hidden.map((h) => ({ stem: h, god: tenGod(dayPillar.stem, stemByJp(h)) })),
    twelvePhase: TWELVE_PHASES[dayPillar.stem.jp]?.[p.branch.jp] || "-",
    isVoid: voids.includes(p.branch.jp),
  }]));

  return {
    date,
    pillars,
    dayMaster: dayPillar.stem,
    counts,
    strongest: sorted[0],
    weakest: sorted[sorted.length - 1],
    strength,
    usefulGodElements: strength.useful,
    avoidElements: strength.avoid,
    voids,
    solarYear: getSolarYear(date),
  };
}

function makeReading(chart, name, gender) {
  const n = name || "お客様";
  const dm = chart.dayMaster;
  const mainGod = chart.pillars["月柱"].tenGodStem;
  const phase = chart.pillars["日柱"].twelvePhase;
  const strong = chart.strongest;
  const weak = chart.weakest;
  const genderTone = gender === "female" ? "受け取る力と感性" : gender === "male" ? "決断力と行動力" : "自然体の魅力";
  return [
    { title: "本質", icon: "⭐", text: `${n}様の日主は「${dm.jp}（${dm.image}）」。${dm.detail} ${genderTone}を無理に作るより、本来の性質を整えることで運が強くなります。` },
    { title: "才能", icon: "📜", text: `月柱の通変星は「${mainGod}」。${TEN_GOD_TEXT[mainGod] || "社会で出やすい才能を示します。"} 仕事や人間関係では、この星を活かせる環境を選ぶほど結果につながります。` },
    { title: "十二運", icon: "🌙", text: `日柱の十二運は「${phase}」。これは人生のエネルギーの出方を表します。強く押すだけでなく、自分に合う速度で運を使うことが大切です。` },
    { title: "五行", icon: "⚖️", text: `五行では「${strong}」が強く、「${weak}」が不足しやすい命式です。強い五行は才能として出ますが、出すぎると「${ELEMENT_TEXT[strong].excess}」になりやすいため調整が必要です。` },
    { title: "開運", icon: "🎁", text: `この命式は「${chart.strength.label}」寄りです。喜神の目安は「${chart.usefulGodElements.join("・")}」。開運行動としては、${chart.usefulGodElements.map((e) => ELEMENT_TEXT[e].lucky).join("、")} が合います。` },
    { title: "注意点", icon: "🛡️", text: `空亡は「${chart.voids.join("・")}」。空亡に当たる柱は、執着を手放すことでかえって運が整う場所です。大きな判断ほど、焦らず確認を重ねると安定します。` },
    { title: "仕事運", icon: "💼", text: `${ELEMENT_TEXT[strong].talent}が強みです。評価されるには、得意なことを感覚で終わらせず、実績や形にして見せること。専門性を持つほど仕事運が伸びます。` },
    { title: "恋愛・人間関係", icon: "💗", text: `相性では、日主を支える「${GENERATED_BY[dm.element]}」や、命式を整える「${chart.usefulGodElements.join("・")}」の気を持つ相手と安心感が出やすいでしょう。無理に合わせる恋より、自然体で話せる関係が吉です。` },
    { title: "金運", icon: "💰", text: `金運は一発勝負より、得意な五行を仕事・信用・発信に変えることで伸びます。不足する「${weak}」を補う習慣を持つと、お金の流れも整いやすくなります。` },
  ];
}

function PillarCard({ title, p }) {
  return <div className="card pillar">
    <div className="row"><b className="small gold">{title}</b>{p.isVoid && <span className="void">空亡</span>}</div>
    <div className="pillarText">{p.label}</div>
    <div className="miniGrid">
      <div><span>天干</span><b>{p.stem.jp}・{p.stem.yy}{p.stem.element}</b></div>
      <div><span>地支</span><b>{p.branch.jp}・{p.branch.animal}</b></div>
      <div><span>通変星</span><b>{p.tenGodStem}</b></div>
      <div><span>十二運</span><b>{p.twelvePhase}</b></div>
    </div>
    <p className="small muted">蔵干: {p.hiddenGods.map((h) => `${h.stem}/${h.god}`).join("・")}</p>
    {title === "月柱" && <p className="small muted">節入り: {p.solarTerm} {p.solarTermTime?.toLocaleString()}</p>}
  </div>;
}

function makeShareText(chart, name, birthDate, birthTime) {
  return `${name || "お客様"}の四柱推命鑑定\n生年月日: ${birthDate} ${birthTime}\n日主: ${chart.dayMaster.jp}（${chart.dayMaster.image}）\n年柱: ${chart.pillars["年柱"].label}\n月柱: ${chart.pillars["月柱"].label}\n日柱: ${chart.pillars["日柱"].label}\n時柱: ${chart.pillars["時柱"].label}\n身強身弱: ${chart.strength.label}\n強い五行: ${chart.strongest}\n補いたい五行: ${chart.weakest}\n喜神目安: ${chart.usefulGodElements.join("・")}\n空亡: ${chart.voids.join("・")}`;
}

export default function App() {
  const [name, setName] = useState("お客様");
  const [birthDate, setBirthDate] = useState("1995-04-15");
  const [birthTime, setBirthTime] = useState("12:00");
  const [gender, setGender] = useState("none");
  const [place, setPlace] = useState("東京");
  const [copied, setCopied] = useState(false);

  const chart = useMemo(() => calculateChart({ birthDate, birthTime }), [birthDate, birthTime]);
  const reading = useMemo(() => makeReading(chart, name, gender), [chart, name, gender]);
  const max = Math.max(...Object.values(chart.counts));

  async function copyResult() {
    const text = makeShareText(chart, name, birthDate, birthTime);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      alert(text);
    }
  }

  return <div className="app">
    <style>{css}</style>
    <header className="hero">
      <div><div className="badge">✨ 四柱推命 本格鑑定</div><h1>命式鑑定アプリ</h1><p>二十四節気の節入りを計算して、年柱・月柱・日柱・時柱を出します。</p></div>
      <div className="buttons noPrint"><button className="button ghost" onClick={copyResult}>{copied ? "コピー済み" : "結果をコピー"}</button><button className="button" onClick={() => window.print()}>印刷 / PDF</button></div>
    </header>

    <div className="layout">
      <aside className="card input noPrint">
        <h2>鑑定入力</h2>
        <label>名前</label><input value={name} onChange={(e) => setName(e.target.value)} />
        <label>生年月日</label><input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        <label>出生時刻</label><input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} />
        <label>出生地</label><input value={place} onChange={(e) => setPlace(e.target.value)} />
        <label>性別表現</label><select value={gender} onChange={(e) => setGender(e.target.value)}><option value="none">指定なし</option><option value="female">女性</option><option value="male">男性</option></select>
        <div className="note"><b>弟さんに渡す用</b><br/>VercelやNetlifyに公開すればURLだけで渡せます。スマホではホーム画面に追加できます。</div>
        <div className="warn"><b>暦計算</b><br/>太陽黄経から節入りを近似計算します。厳密な商用鑑定では万年暦との照合をおすすめします。</div>
      </aside>

      <main className="main">
        <section className="card summary">
          <div><span className="small gold">鑑定対象</span><h2>{name || "お客様"} 様</h2><p>{birthDate} {birthTime} 生まれ / 出生地: {place}</p><p className="small muted">暦年: {chart.solarYear}年 / 月柱切替: {chart.pillars["月柱"].solarTerm}</p></div>
          <div className="dayMaster"><span>日主</span><b>{chart.dayMaster.jp}</b><em>{chart.dayMaster.image}</em></div>
        </section>

        <section className="pillars">{Object.entries(chart.pillars).map(([k, p]) => <PillarCard key={k} title={k} p={p} />)}</section>

        <section className="twoCols">
          <div className="card"><h2>五行バランス</h2>{ELEMENTS.map((e) => <div className="barWrap" key={e}><div className="row"><b>{ELEMENT_TEXT[e].icon} {e}</b><span>{chart.counts[e].toFixed(1)}</span></div><div className="bar"><div style={{ width: `${Math.max(6, chart.counts[e] / max * 100)}%` }} /></div><p className="small muted">{ELEMENT_TEXT[e].talent}</p></div>)}</div>
          <div className="card"><h2>判定</h2><div className="judge">{chart.strength.label}</div><div className="box"><span>喜神目安</span><b>{chart.usefulGodElements.join("・")}</b></div><div className="box"><span>補いたい五行</span><b>{chart.weakest}</b><small>{ELEMENT_TEXT[chart.weakest].lucky}</small></div><div className="box dark"><span>空亡</span><b>{chart.voids.join("・")}</b></div></div>
        </section>

        <section className="reading">{reading.map((r) => <div className="card" key={r.title}><h3>{r.icon} {r.title}</h3><p>{r.text}</p></div>)}</section>

        <section className="card conclusion"><h2>鑑定まとめ</h2><p>{name || "お客様"}様は、日主「{chart.dayMaster.jp}」の性質を中心に、強い五行「{chart.strongest}」を才能として使うことで運が開きます。命式は「{chart.strength.label}」寄りのため、喜神目安である「{chart.usefulGodElements.join("・")}」を生活・仕事・人間関係に取り入れることが開運の鍵です。</p></section>
      </main>
    </div>
  </div>;
}

const css = `
*{box-sizing:border-box} body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Hiragino Sans','Yu Gothic',Meiryo,sans-serif;background:#f8fafc;color:#0f172a}.app{min-height:100vh;padding:24px;background:radial-gradient(circle at top left,#fff7ed,transparent 34%),linear-gradient(135deg,#fff,#f8fafc)}.hero{max-width:1180px;margin:0 auto 22px;padding:28px;border:1px solid #fde68a;border-radius:32px;background:rgba(255,255,255,.88);display:flex;justify-content:space-between;gap:20px;box-shadow:0 14px 40px rgba(15,23,42,.06)}.badge{display:inline-block;background:#0f172a;color:#fff;border-radius:999px;padding:9px 14px;font-weight:800}.hero h1{font-size:44px;margin:14px 0 8px;letter-spacing:-.04em}.hero p{margin:0;color:#64748b;line-height:1.8}.buttons{display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap}.button{border:0;border-radius:18px;background:#0f172a;color:white;padding:12px 16px;font-weight:800;cursor:pointer}.button.ghost{background:#fff;color:#0f172a;border:1px solid #e2e8f0}.layout{max-width:1180px;margin:auto;display:grid;grid-template-columns:340px 1fr;gap:22px}.card{background:rgba(255,255,255,.92);border:1px solid #fde68a;border-radius:28px;padding:22px;box-shadow:0 10px 32px rgba(15,23,42,.05)}.input{height:max-content;position:sticky;top:20px}.input h2,.card h2{margin:0 0 16px}.input label{display:block;margin:14px 0 7px;font-weight:800;font-size:13px}.input input,.input select{width:100%;border:1px solid #e2e8f0;border-radius:16px;padding:13px;font-size:16px;background:white}.note,.warn{margin-top:16px;border-radius:20px;padding:14px;line-height:1.7;font-size:13px}.note{background:#fff7ed}.warn{background:#f1f5f9}.main{display:flex;flex-direction:column;gap:18px}.summary{display:flex;justify-content:space-between;align-items:center;gap:18px}.summary h2{font-size:32px;margin:4px 0}.summary p{color:#64748b;margin:5px 0}.small{font-size:12px}.muted{color:#64748b}.gold{color:#b45309}.dayMaster{background:#0f172a;color:white;border-radius:26px;padding:18px 28px;text-align:center;min-width:130px}.dayMaster span,.dayMaster em{display:block;opacity:.75;font-style:normal}.dayMaster b{font-size:46px;line-height:1}.pillars{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.row{display:flex;justify-content:space-between;gap:10px;align-items:center}.void{background:#0f172a;color:white;border-radius:999px;padding:4px 9px;font-size:11px;font-weight:800}.pillarText{font-size:38px;font-weight:900;letter-spacing:.08em;margin:10px 0}.miniGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.miniGrid div{background:#f8fafc;border-radius:16px;padding:10px}.miniGrid span,.box span{display:block;color:#64748b;font-size:11px}.miniGrid b,.box b{display:block;margin-top:3px}.twoCols{display:grid;grid-template-columns:1fr 330px;gap:18px}.barWrap{margin:15px 0}.bar{height:12px;background:#e2e8f0;border-radius:999px;overflow:hidden;margin:8px 0}.bar div{height:100%;background:#0f172a;border-radius:999px}.judge{font-size:38px;font-weight:900;margin:8px 0 18px}.box{background:#fff7ed;border-radius:20px;padding:15px;margin:10px 0}.box.dark{background:#0f172a;color:#fff}.box small{display:block;color:#64748b;margin-top:5px;line-height:1.6}.reading{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.reading h3{margin-top:0}.reading p,.conclusion p{line-height:1.9;color:#334155}@media(max-width:900px){.app{padding:14px}.hero,.summary{display:block}.layout{grid-template-columns:1fr}.input{position:static}.pillars,.reading,.twoCols{grid-template-columns:1fr}.hero h1{font-size:34px}.dayMaster{margin-top:16px}}@media print{.noPrint{display:none!important}.app{padding:0;background:white}.hero,.card{box-shadow:none}.layout{display:block}.pillars{grid-template-columns:repeat(4,1fr)}.reading{grid-template-columns:repeat(2,1fr)}body{background:white}}`;
