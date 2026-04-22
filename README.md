<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>営業アプリ｜地域包括あり完全版</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: "Hiragino Sans","Yu Gothic","Meiryo",sans-serif; background: #f4f7fb; color: #222; }
    header { background: linear-gradient(135deg,#2146d0,#4f7cff); color:#fff; padding:16px; text-align:center; font-size:22px; font-weight:700; }
    .wrap { max-width: 1680px; margin: 0 auto; padding: 14px; }
    .box,.panel { background:#fff; border-radius:16px; box-shadow:0 8px 22px rgba(0,0,0,.08); margin-bottom:14px; }
    .box { padding:12px; }
    .panel { overflow:hidden; }
    .panel-title { padding:14px 16px; font-weight:700; border-bottom:1px solid #eef1f7; background:#fafcff; }
    .notice { background:#fff8e8; border:1px solid #f3d38f; color:#6c4d00; border-radius:12px; padding:12px; line-height:1.8; font-size:13px; }
    .row { display:flex; flex-wrap:wrap; gap:10px; align-items:center; }
    select,input,button,textarea { border:1px solid #dbe3f2; border-radius:12px; padding:12px; font-size:14px; background:#fff; }
    input { min-width:150px; }
    button { border:none; background:#2146d0; color:#fff; cursor:pointer; white-space:nowrap; }
    button:hover { opacity:.92; }
    .green-btn { background:#16a34a; }
    .red-btn { background:#c51616; }
    .purple-btn { background:#7a34c2; }
    .status-box { margin-top:10px; padding:10px 12px; background:#f7faff; border:1px solid #e1e9fb; border-radius:12px; font-size:13px; color:#3b4d6b; line-height:1.7; }
    .chips { display:flex; flex-wrap:wrap; gap:10px; margin-top:10px; }
    .chip { background:#eef3ff; color:#2146d0; padding:8px 12px; border-radius:999px; font-size:13px; font-weight:700; }
    .layout { display:grid; grid-template-columns:560px 1fr; gap:14px; }
    .list { height:78vh; overflow:auto; }
    .card { padding:14px 16px; border-bottom:1px solid #eef1f7; cursor:pointer; transition:.2s; background:#fff; }
    .card:hover { background:#f5f8ff; }
    .card.active { background:#eaf0ff; border-left:5px solid #2146d0; }
    .card.visited { background:#f2f9f2; }
    .card.today { box-shadow: inset 0 0 0 2px #7a34c2; }
    .topline { display:flex; gap:10px; justify-content:space-between; align-items:flex-start; }
    .order-badge { width:34px; height:34px; border-radius:999px; display:flex; align-items:center; justify-content:center; background:#2146d0; color:#fff; font-weight:700; flex-shrink:0; }
    .name { font-weight:700; line-height:1.5; margin-bottom:6px; }
    .meta { font-size:13px; color:#536076; line-height:1.7; margin-top:6px; }
    .distance { margin-top:8px; font-size:13px; color:#2146d0; font-weight:700; }
    .source { margin-top:8px; font-size:12px; line-height:1.6; color:#5f6b7d; background:#f8fbff; border:1px solid #e6eefc; border-radius:10px; padding:8px 10px; }
    .badge-row { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
    .badge { font-size:12px; padding:4px 8px; border-radius:999px; background:#eef3ff; color:#2146d0; }
    .badge.called { background:#e8f0ff; color:#1f5ed8; }
    .badge.absent { background:#fff3e8; color:#c46b00; }
    .badge.revisit { background:#f6ebff; color:#7a34c2; }
    .badge.hot { background:#e9f9ef; color:#138548; }
    .badge.contract { background:#eaf7ff; color:#0070a8; }
    .badge.done { background:#e8f6e8; color:#208340; }
    .badge.todaybadge { background:#f4eaff; color:#7a34c2; }
    .action-row { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; align-items:center; }
    .small-btn { padding:8px 10px; font-size:12px; border-radius:10px; background:#4f7cff; color:#fff; text-decoration:none; display:inline-block; }
    .small-btn.green { background:#16a34a; }
    .small-btn.orange { background:#f97316; }
    .small-btn.gray { background:#7d8aa5; }
    .small-btn.purple { background:#8b5cf6; }
    .small-btn.teal { background:#0f9fb8; }
    .visit-check { display:flex; align-items:center; gap:6px; font-size:13px; font-weight:700; color:#2c4b85; }
    .memo-box { width:100%; min-height:72px; margin-top:10px; resize:vertical; font-size:13px; line-height:1.5; }
    #map { width:100%; height:78vh; min-height:520px; background:#d8dde8; }
    .subgrid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .big-text { width:100%; min-height:220px; resize:vertical; font-size:13px; line-height:1.6; }
    .footer { font-size:12px; color:#5f6b7d; line-height:1.8; }
    a.tel-link { color:#2146d0; text-decoration:none; font-weight:700; }
    @media (max-width:1100px){
      .layout { grid-template-columns:1fr; }
      .list { height:420px; }
      #map { height:58vh; min-height:380px; }
      .subgrid { grid-template-columns:1fr; }
    }
  </style>
</head>
<body>
  <header>営業アプリ｜地域包括あり完全版</header>

  <div class="wrap">
    <div class="box">
      <div class="notice">
        地域包括・ブランチは最初から入っています。<br>
        CSV選択で居宅介護支援事業所・訪問介護を追加できます。
      </div>
    </div>

    <div class="box">
      <div class="row">
        <select id="wardFilter"><option value="all">全区</option></select>

        <select id="typeFilter">
          <option value="all">全種別</option>
          <option value="地域包括支援センター">地域包括支援センター</option>
          <option value="総合相談窓口（ブランチ）">総合相談窓口（ブランチ）</option>
          <option value="居宅介護支援事業所">居宅介護支援事業所</option>
          <option value="訪問介護">訪問介護</option>
        </select>

        <select id="salesStatusFilter">
          <option value="all">全営業状態</option>
          <option value="未対応">未対応</option>
          <option value="電話した">電話した</option>
          <option value="不在">不在</option>
          <option value="再訪問">再訪問</option>
          <option value="見込みあり">見込みあり</option>
          <option value="契約候補">契約候補</option>
        </select>

        <select id="todayFilter">
          <option value="all">今日の予定 全て</option>
          <option value="today">今日回る先のみ</option>
          <option value="not_today">今日回る先以外</option>
        </select>

        <input id="keyword" type="text" placeholder="区名・駅名・事業所名・住所・電話で検索" />
        <input id="placeSearch" type="text" placeholder="本町駅・梅田駅・天王寺駅などを検索" />

        <button onclick="applyFilters()">絞り込み</button>
        <button onclick="resetFilters()">リセット</button>
        <button onclick="getCurrentLocation()">現在地取得</button>
        <button onclick="searchPlaceAndMove()">場所検索</button>
        <button onclick="sortByWalkingOrder()">近い順</button>
        <button onclick="sortTodayByWalkingOrder()">今日予定を近い順</button>
        <button onclick="jumpToNextUnvisited()">次の未訪問へ</button>
        <button class="red-btn" onclick="generateDailyReport()">日報作成</button>
      </div>

      <div class="row" style="margin-top:10px;">
        <input id="uploadKyotaku" type="file" accept=".csv,text/csv" multiple onchange="loadSelectedCsvs(event)" />
      </div>

      <div id="statusBox" class="status-box">地域包括・ブランチを表示中。CSVを選ぶと追加されます。</div>

      <div class="chips">
        <div class="chip" id="totalCount">全件: 0</div>
        <div class="chip" id="todayCount">今日予定: 0</div>
        <div class="chip" id="visitedCount">訪問済み: 0</div>
        <div class="chip" id="remainingCount">未訪問: 0</div>
        <div class="chip" id="calledCount">電話した: 0</div>
        <div class="chip" id="hotCount">見込みあり: 0</div>
      </div>
    </div>

    <div class="layout">
      <div class="panel">
        <div class="panel-title">営業先リスト</div>
        <div id="list" class="list"></div>
      </div>

      <div class="panel">
        <div class="panel-title">地図</div>
        <div id="map"></div>
      </div>
    </div>

    <div class="subgrid">
      <div class="box">
        <div class="panel-title" style="margin:-12px -12px 12px -12px; border-radius:16px 16px 0 0;">CSV手動追加</div>
        <div class="footer">列順：区名,種別,事業所名,住所,電話,緯度,経度,出典,確認日,検索補助語</div>
        <textarea id="csvInput" class="big-text" placeholder="例:
中央区,居宅介護支援事業所,中央ケアプランセンター本町,大阪市中央区南本町1-1-1,06-0000-1111,34.680,135.509,手動追加,2026-03,中央区 本町駅 居宅"></textarea>
        <div class="row" style="margin-top:10px;">
          <button class="purple-btn" onclick="importSimpleCSV()">CSV追加</button>
        </div>
      </div>

      <div class="box">
        <div class="panel-title" style="margin:-12px -12px 12px -12px; border-radius:16px 16px 0 0;">本日の営業日報</div>
        <textarea id="dailyReport" class="big-text"></textarea>
      </div>
    </div>
  </div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const offices = [
      { id:"hokatsu-chuo", ward:"中央区", type:"地域包括支援センター", name:"中央区地域包括支援センター", address:"大阪市中央区上本町西2-5-25", phone:"06-6763-8139", lat:34.6730, lng:135.5203, source:"初期登録", checked:"2026-04-22", keywords:"中央区 谷町六丁目駅 谷六 上本町" },
      { id:"hokatsu-chuo-hokubu", ward:"中央区", type:"地域包括支援センター", name:"中央区北部地域包括支援センター", address:"大阪市中央区農人橋3-1-3", phone:"06-6944-2116", lat:34.6809, lng:135.5125, source:"初期登録", checked:"2026-04-22", keywords:"中央区 本町駅 堺筋本町駅 谷町四丁目駅" },
      { id:"hokatsu-kita", ward:"北区", type:"地域包括支援センター", name:"北区地域包括支援センター", address:"大阪市北区神山町15-11", phone:"06-6313-5568", lat:34.7054, lng:135.5069, source:"初期登録", checked:"2026-04-22", keywords:"北区 扇町駅 中崎町駅 梅田駅" },
      { id:"branch-kita-umeda", ward:"北区", type:"総合相談窓口（ブランチ）", name:"梅田東ブランチ", address:"大阪市北区芝田2-10-39", phone:"06-6372-0804", lat:34.7079, lng:135.4946, source:"初期登録", checked:"2026-04-22", keywords:"北区 梅田駅 大阪駅 中津駅" },
      { id:"hokatsu-tennoji", ward:"天王寺区", type:"地域包括支援センター", name:"天王寺区地域包括支援センター", address:"大阪市天王寺区六万体町5-26", phone:"06-6774-3386", lat:34.6589, lng:135.5166, source:"初期登録", checked:"2026-04-22", keywords:"天王寺区 四天王寺前夕陽ヶ丘駅 谷町九丁目駅" },
      { id:"hokatsu-abeno", ward:"阿倍野区", type:"地域包括支援センター", name:"阿倍野区地域包括支援センター", address:"大阪市阿倍野区帝塚山1-3-8", phone:"06-6628-1400", lat:34.6258, lng:135.5015, source:"初期登録", checked:"2026-04-22", keywords:"阿倍野区 姫松駅 帝塚山駅 阿倍野駅" },
      { id:"hokatsu-naniwa", ward:"浪速区", type:"地域包括支援センター", name:"浪速区地域包括支援センター", address:"大阪市浪速区難波中3-8-8", phone:"06-6636-6029", lat:34.6614, lng:135.4964, source:"初期登録", checked:"2026-04-22", keywords:"浪速区 なんば駅 難波駅 大国町駅" },
      { id:"hokatsu-nishi", ward:"西区", type:"地域包括支援センター", name:"西区地域包括支援センター", address:"大阪市西区新町4-5-14", phone:"06-6539-8075", lat:34.6767, lng:135.4893, source:"初期登録", checked:"2026-04-22", keywords:"西区 西長堀駅 阿波座駅 西大橋駅" }
    ];

    const OSAKA_WARDS = [
      "北区","都島区","福島区","此花区","中央区","西区","港区","大正区","天王寺区","浪速区",
      "西淀川区","淀川区","東淀川区","東成区","生野区","旭区","城東区","鶴見区","阿倍野区",
      "住之江区","住吉区","東住吉区","平野区","西成区"
    ];

    const WARD_STATIONS = {
      "北区":["梅田駅","大阪駅","中津駅","天神橋筋六丁目駅","扇町駅","南森町駅"],
      "都島区":["都島駅","京橋駅","桜ノ宮駅","野江内代駅"],
      "福島区":["福島駅","新福島駅","海老江駅","野田駅","野田阪神駅"],
      "此花区":["西九条駅","千鳥橋駅","伝法駅","安治川口駅"],
      "中央区":["本町駅","堺筋本町駅","谷町四丁目駅","谷町六丁目駅","北浜駅","天満橋駅"],
      "西区":["西長堀駅","阿波座駅","西大橋駅","四ツ橋駅"],
      "港区":["弁天町駅","朝潮橋駅","大阪港駅"],
      "大正区":["大正駅"],
      "天王寺区":["天王寺駅","谷町九丁目駅","桃谷駅","四天王寺前夕陽ヶ丘駅"],
      "浪速区":["なんば駅","難波駅","大国町駅","恵美須町駅","新今宮駅"],
      "西淀川区":["御幣島駅","福駅","塚本駅"],
      "淀川区":["新大阪駅","十三駅","三国駅","東三国駅"],
      "東淀川区":["淡路駅","上新庄駅","井高野駅","瑞光四丁目駅"],
      "東成区":["今里駅","玉造駅","新深江駅","森ノ宮駅"],
      "生野区":["桃谷駅","小路駅","北巽駅","南巽駅"],
      "旭区":["関目高殿駅","千林大宮駅","城北公園通駅"],
      "城東区":["京橋駅","蒲生四丁目駅","野江駅","今福鶴見駅"],
      "鶴見区":["横堤駅","今福鶴見駅"],
      "阿倍野区":["天王寺駅","阿倍野駅","昭和町駅","文の里駅"],
      "住之江区":["住之江公園駅","北加賀屋駅"],
      "住吉区":["あびこ駅","長居駅","杉本町駅"],
      "東住吉区":["駒川中野駅","針中野駅","南田辺駅"],
      "平野区":["平野駅","喜連瓜破駅","出戸駅"],
      "西成区":["天下茶屋駅","岸里駅","花園町駅"]
    };

    const wardSelect = document.getElementById("wardFilter");
    const typeFilter = document.getElementById("typeFilter");
    const salesStatusFilter = document.getElementById("salesStatusFilter");
    const todayFilter = document.getElementById("todayFilter");
    const keywordInput = document.getElementById("keyword");
    const placeSearchInput = document.getElementById("placeSearch");
    const statusBox = document.getElementById("statusBox");
    const csvInput = document.getElementById("csvInput");
    const dailyReportEl = document.getElementById("dailyReport");
    const listEl = document.getElementById("list");
    const totalCountEl = document.getElementById("totalCount");
    const todayCountEl = document.getElementById("todayCount");
    const visitedCountEl = document.getElementById("visitedCount");
    const remainingCountEl = document.getElementById("remainingCount");
    const calledCountEl = document.getElementById("calledCount");
    const hotCountEl = document.getElementById("hotCount");

    function normalizeText(text){
      return String(text || "")
        .toLowerCase()
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
        .replace(/\s+/g, " ")
        .replace(/　/g, " ")
        .replace(/ヶ/g, "ケ")
        .replace(/之/g, "の")
        .replace(/－/g, "-")
        .trim();
    }

    function splitKeywords(text){
      return normalizeText(text).split(" ").map(s => s.trim()).filter(Boolean);
    }

    function safeId(text){
      return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\u3040-\u30ff\u3400-\u9fff-]/g, "").slice(0, 80) || ("office-" + Date.now());
    }

    function wardFromAddress(address){
      return OSAKA_WARDS.find(w => String(address || "").includes(w)) || "";
    }

    function buildKeywords(ward, name){
      return [ward, name, ...(WARD_STATIONS[ward] || [])].join(" ");
    }

    function todayStr(){
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    }

    function nowTimeStr(){
      const d = new Date();
      return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
    }

    function setStatus(text){ statusBox.innerHTML = text; }
    function getVisitState(id){ return localStorage.getItem("visit_" + id) === "1"; }
    function setVisitState(id, value){ localStorage.setItem("visit_" + id, value ? "1" : "0"); }
    function getMemo(id){ return localStorage.getItem("memo_" + id) || ""; }
    function setMemo(id, text){ localStorage.setItem("memo_" + id, text); }
    function isTodayTarget(id){ return localStorage.getItem("today_target_" + id) === "1"; }
    function setTodayTarget(id, value){ localStorage.setItem("today_target_" + id, value ? "1" : "0"); }
    function getSalesStatus(id){ return localStorage.getItem("sales_status_" + id) || "未対応"; }
    function setSalesStatus(id, value){ localStorage.setItem("sales_status_" + id, value); }
    function getCallTime(id){ return localStorage.getItem("call_time_" + id) || ""; }
    function setCallTime(id, value){ localStorage.setItem("call_time_" + id, value); }

    function statusClass(status){
      if(status === "電話した") return "called";
      if(status === "不在") return "absent";
      if(status === "再訪問") return "revisit";
      if(status === "見込みあり") return "hot";
      if(status === "契約候補") return "contract";
      return "";
    }

    function googleMapsWalkingUrl(address){
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&travelmode=walking`;
    }

    function googleMapsTransitUrl(address){
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&travelmode=transit`;
    }

    function haversine(lat1, lon1, lat2, lon2){
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }

    function walkingMinutesFromKm(km){
      return Math.max(1, Math.round((km / 4.5) * 60));
    }

    function formatDistance(km){
      if(km < 1) return `${Math.round(km * 1000)}m`;
      return `${km.toFixed(2)}km`;
    }

    function rebuildWardOptions(){
      const wards = [...new Set(offices.map(o => o.ward).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"ja"));
      const current = wardSelect.value || "all";
      wardSelect.innerHTML = '<option value="all">全区</option>';
      wards.forEach(ward => {
        const option = document.createElement("option");
        option.value = ward;
        option.textContent = ward;
        wardSelect.appendChild(option);
      });
      if ([...wardSelect.options].some(o => o.value === current)) wardSelect.value = current;
    }

    const map = L.map("map").setView([34.6937, 135.5023], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    let markers = [];
    let visibleMarkers = [];
    let currentPosition = null;
    let userMarker = null;
    let searchMarker = null;
    let routeLine = null;
    let currentRenderedData = [];

    function getFilteredData(){
      const ward = wardSelect.value;
      const type = typeFilter.value;
      const salesStatus = salesStatusFilter.value;
      const todayMode = todayFilter.value;
      const keywords = splitKeywords(keywordInput.value);

      return offices.filter(office => {
        const wardOk = ward === "all" || office.ward === ward;
        const typeOk = type === "all" || office.type === type;
        const statusOk = salesStatus === "all" || getSalesStatus(office.id) === salesStatus;
        const todayOk =
          todayMode === "all" ||
          (todayMode === "today" && isTodayTarget(office.id)) ||
          (todayMode === "not_today" && !isTodayTarget(office.id));

        const searchableText = normalizeText([
          office.id, office.ward, office.type, office.name, office.address,
          office.phone, office.source || "", office.checked || "", office.keywords || ""
        ].join(" "));

        const keywordOk = keywords.length === 0 || keywords.every(word => searchableText.includes(word));
        return wardOk && typeOk && statusOk && todayOk && keywordOk;
      });
    }

    function updateSummary(data){
      totalCountEl.textContent = `全件: ${data.length}`;
      todayCountEl.textContent = `今日予定: ${data.filter(o => isTodayTarget(o.id)).length}`;
      visitedCountEl.textContent = `訪問済み: ${data.filter(o => getVisitState(o.id)).length}`;
      remainingCountEl.textContent = `未訪問: ${data.filter(o => !getVisitState(o.id)).length}`;
      calledCountEl.textContent = `電話した: ${data.filter(o => getSalesStatus(o.id) === "電話した").length}`;
      hotCountEl.textContent = `見込みあり: ${data.filter(o => getSalesStatus(o.id) === "見込みあり").length}`;
    }

    function clearMarkers(){
      markers.forEach(m => map.removeLayer(m));
      markers = [];
      visibleMarkers = [];
      if(routeLine){
        map.removeLayer(routeLine);
        routeLine = null;
      }
    }

    function markerColorByType(type){
      if(type === "総合相談窓口（ブランチ）") return "#f97316";
      if(type === "居宅介護支援事業所") return "#16a34a";
      if(type === "訪問介護") return "#0f9fb8";
      return "#2146d0";
    }

    function renderListAndMap(data){
      currentRenderedData = [...data];
      listEl.innerHTML = "";
      clearMarkers();

      const linePoints = [];
      if(currentPosition) linePoints.push([currentPosition.lat, currentPosition.lng]);

      data.forEach((office, index) => {
        const visited = getVisitState(office.id);
        const today = isTodayTarget(office.id);
        const memo = getMemo(office.id);
        const salesStatus = getSalesStatus(office.id);
        const callTime = getCallTime(office.id);

        const item = document.createElement("div");
        item.className = "card" + (visited ? " visited" : "") + (today ? " today" : "");

        const distanceText = office.distanceFromPrev != null
          ? `前地点から ${formatDistance(office.distanceFromPrev)} / 徒歩約${walkingMinutesFromKm(office.distanceFromPrev)}分`
          : (office.distanceFromStart != null
              ? `現在地から ${formatDistance(office.distanceFromStart)} / 徒歩約${walkingMinutesFromKm(office.distanceFromStart)}分`
              : "距離未計算");

        item.innerHTML = `
          <div class="topline">
            <div style="flex:1;"><div class="name">${office.name}</div></div>
            <div class="order-badge">${index + 1}</div>
          </div>

          <div class="meta">
            ${office.ward}<br>
            ${office.address}<br>
            <a class="tel-link auto-call-link" href="tel:${String(office.phone || "").replace(/-/g, "")}">${office.phone || ""}</a>
            ${callTime ? `<br>電話時刻: ${callTime}` : ""}
          </div>

          <div class="distance">${distanceText}</div>

          <div class="badge-row">
            <span class="badge">${office.type}</span>
            <span class="badge ${statusClass(salesStatus)}">${salesStatus}</span>
            ${today ? '<span class="badge todaybadge">今日回る先</span>' : ""}
            ${visited ? '<span class="badge done">訪問済み</span>' : ""}
          </div>

          <div class="source">
            出典: ${office.source || "未設定"}<br>
            確認日: ${office.checked || "未設定"}<br>
            検索補助語: ${office.keywords || "なし"}
          </div>

          <div class="action-row">
            <label class="visit-check"><input type="checkbox" class="visit-toggle" ${visited ? "checked" : ""}> 訪問済み</label>
            <label class="visit-check"><input type="checkbox" class="today-toggle" ${today ? "checked" : ""}> 今日回る</label>
          </div>

          <div class="action-row">
            <button class="small-btn" data-status="電話した">電話した</button>
            <button class="small-btn orange" data-status="不在">不在</button>
            <button class="small-btn purple" data-status="再訪問">再訪問</button>
            <button class="small-btn green" data-status="見込みあり">見込みあり</button>
            <button class="small-btn teal" data-status="契約候補">契約候補</button>
          </div>

          <div class="action-row">
            <a class="small-btn green" href="${googleMapsWalkingUrl(office.address)}" target="_blank" rel="noopener noreferrer">徒歩ルート</a>
            <a class="small-btn orange" href="${googleMapsTransitUrl(office.address)}" target="_blank" rel="noopener noreferrer">バス・電車ルート</a>
            <button class="small-btn gray next-btn">次へ</button>
          </div>

          <textarea class="memo-box" placeholder="営業メモを入力">${memo}</textarea>
        `;
        listEl.appendChild(item);

        const marker = L.circleMarker([office.lat, office.lng], {
          radius: 8,
          color: markerColorByType(office.type),
          fillColor: markerColorByType(office.type),
          fillOpacity: 0.9,
          weight: 2
        }).addTo(map);

        marker.bindPopup(`<b>${index + 1}. ${office.name}</b><br>${office.ward}<br>${office.type}<br>${office.address}`);
        markers.push(marker);
        visibleMarkers.push(marker);
        linePoints.push([office.lat, office.lng]);

        item.addEventListener("click", (e) => {
          if(
            e.target.classList.contains("visit-toggle") ||
            e.target.classList.contains("today-toggle") ||
            e.target.classList.contains("memo-box") ||
            e.target.classList.contains("next-btn") ||
            e.target.classList.contains("auto-call-link")
          ) return;
          document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
          item.classList.add("active");
          map.setView([office.lat, office.lng], 16);
          marker.openPopup();
        });

        item.querySelector(".visit-toggle").addEventListener("change", (e) => {
          setVisitState(office.id, e.target.checked);
          renderListAndMap(currentRenderedData);
        });
        item.querySelector(".today-toggle").addEventListener("change", (e) => {
          setTodayTarget(office.id, e.target.checked);
          renderListAndMap(currentRenderedData);
        });
        item.querySelectorAll("[data-status]").forEach(btn => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            setSalesStatus(office.id, btn.dataset.status);
            if(btn.dataset.status === "電話した") setCallTime(office.id, nowTimeStr());
            renderListAndMap(currentRenderedData);
          });
        });
        item.querySelector(".memo-box").addEventListener("input", (e) => {
          setMemo(office.id, e.target.value);
        });
        item.querySelector(".next-btn").addEventListener("click", (e) => {
          e.stopPropagation();
          jumpToNextUnvisited(index + 1);
        });
      });

      if(linePoints.length >= 2){
        routeLine = L.polyline(linePoints, { weight:4, opacity:0.7 }).addTo(map);
      }

      updateSummary(data);
      fitVisibleMarkers();
    }

    function fitVisibleMarkers(){
      const layers = [];
      if(userMarker) layers.push(userMarker);
      if(searchMarker) layers.push(searchMarker);
      layers.push(...visibleMarkers);
      if(layers.length === 0) return;
      const group = L.featureGroup(layers);
      map.fitBounds(group.getBounds().pad(0.2));
    }

    function applyFilters(){
      renderListAndMap(getFilteredData());
      setStatus("絞り込みを反映しました。");
    }

    function resetFilters(){
      wardSelect.value = "all";
      typeFilter.value = "all";
      salesStatusFilter.value = "all";
      todayFilter.value = "all";
      keywordInput.value = "";
      renderListAndMap(offices);
      setStatus("表示をリセットしました。");
    }

    async function getCurrentLocation(){
      if(!navigator.geolocation){
        alert("この端末では現在地取得に対応していません。");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          currentPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          if(userMarker) map.removeLayer(userMarker);
          if(searchMarker){ map.removeLayer(searchMarker); searchMarker = null; }
          userMarker = L.marker([currentPosition.lat, currentPosition.lng]).addTo(map).bindPopup("現在地").openPopup();
          map.setView([currentPosition.lat, currentPosition.lng], 15);
          setStatus("現在地を取得しました。");
        },
        () => setStatus("現在地を取得できませんでした。"),
        { enableHighAccuracy:true, timeout:10000, maximumAge:0 }
      );
    }

    async function searchPlaceAndMove(){
      const query = placeSearchInput.value.trim();
      if(!query){
        alert("検索したい場所を入力してください。");
        return;
      }
      try{
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=ja&q=${encodeURIComponent(query + " 大阪市")}`;
        const res = await fetch(url);
        const data = await res.json();
        if(!data.length){
          alert("場所が見つかりませんでした。");
          return;
        }
        const result = data[0];
        currentPosition = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
        if(searchMarker) map.removeLayer(searchMarker);
        if(userMarker){ map.removeLayer(userMarker); userMarker = null; }
        searchMarker = L.marker([currentPosition.lat, currentPosition.lng]).addTo(map).bindPopup(result.display_name).openPopup();
        map.setView([currentPosition.lat, currentPosition.lng], 15);
        setStatus(`検索地点を表示しました。<br>${result.display_name}`);
      }catch(e){
        setStatus("場所検索に失敗しました。");
      }
    }

    function sortByWalkingOrder(){
      const filtered = getFilteredData();
      if(!filtered.length || !currentPosition){
        alert("先に現在地取得か場所検索をしてください。");
        return;
      }
      const remaining = filtered.map(x => ({ ...x, distanceFromPrev:null, distanceFromStart:null }));
      const ordered = [];
      let current = { ...currentPosition };

      while(remaining.length){
        let bestIndex = 0;
        let bestDistance = Infinity;
        remaining.forEach((office, i) => {
          const d = haversine(current.lat, current.lng, office.lat, office.lng);
          if(d < bestDistance){
            bestDistance = d;
            bestIndex = i;
          }
        });
        const next = remaining.splice(bestIndex, 1)[0];
        next.distanceFromPrev = bestDistance;
        if(!ordered.length) next.distanceFromStart = bestDistance;
        ordered.push(next);
        current = { lat: next.lat, lng: next.lng };
      }

      renderListAndMap(ordered);
      setStatus("現在地から近い順に並べ替えました。");
    }

    function sortTodayByWalkingOrder(){
      const data = getFilteredData().filter(o => isTodayTarget(o.id));
      if(!data.length || !currentPosition){
        alert("今日回る先がないか、現在地がありません。");
        return;
      }
      const remaining = data.map(x => ({ ...x, distanceFromPrev:null, distanceFromStart:null }));
      const ordered = [];
      let current = { ...currentPosition };

      while(remaining.length){
        let bestIndex = 0;
        let bestDistance = Infinity;
        remaining.forEach((office, i) => {
          const d = haversine(current.lat, current.lng, office.lat, office.lng);
          if(d < bestDistance){
            bestDistance = d;
            bestIndex = i;
          }
        });
        const next = remaining.splice(bestIndex, 1)[0];
        next.distanceFromPrev = bestDistance;
        if(!ordered.length) next.distanceFromStart = bestDistance;
        ordered.push(next);
        current = { lat: next.lat, lng: next.lng };
      }

      renderListAndMap(ordered);
      setStatus("今日回る先だけを近い順に並べ替えました。");
    }

    function jumpToNextUnvisited(startIndex = 0){
      const data = currentRenderedData;
      let nextIndex = data.findIndex((o, i) => i >= startIndex && !getVisitState(o.id));
      if(nextIndex === -1) nextIndex = data.findIndex(o => !getVisitState(o.id));
      if(nextIndex === -1){
        alert("すべて訪問済みです。");
        return;
      }
      const office = data[nextIndex];
      map.setView([office.lat, office.lng], 16);
      const card = listEl.children[nextIndex];
      if(card){
        document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        card.scrollIntoView({ behavior:"smooth", block:"center" });
      }
      if(markers[nextIndex]) markers[nextIndex].openPopup();
    }

    function generateDailyReport(){
      const visible = currentRenderedData;
      const d = new Date();
      const dateText = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日}`;

      let report = `【営業日報】\n日付：${dateText}\n\n`;
      visible.forEach((office, idx) => {
        report += `${idx + 1}. ${office.name}\n`;
        report += `区：${office.ward}\n`;
        report += `種別：${office.type}\n`;
        report += `状態：${getSalesStatus(office.id)}\n`;
        report += `訪問済み：${getVisitState(office.id) ? "はい" : "いいえ"}\n`;
        report += `今日予定：${isTodayTarget(office.id) ? "はい" : "いいえ"}\n`;
        report += `電話：${office.phone || ""}\n`;
        report += `住所：${office.address}\n`;
        report += `メモ：${getMemo(office.id) || "なし"}\n\n`;
      });
      dailyReportEl.value = report;
      setStatus("日報を作成しました。");
    }

    function parseCsvLine(line){
      const result = [];
      let cur = "";
      let inQuotes = false;
      for(let i = 0; i < line.length; i++){
        const ch = line[i];
        if(ch === '"'){
          if(inQuotes && line[i + 1] === '"'){
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if(ch === "," && !inQuotes){
          result.push(cur);
          cur = "";
        } else {
          cur += ch;
        }
      }
      result.push(cur);
      return result.map(v => v.trim());
    }

    async function decodeCsvFile(file){
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      try { return new TextDecoder("utf-8", { fatal: true }).decode(bytes); } catch(e) {}
      try { return new TextDecoder("shift-jis").decode(bytes); } catch(e) {}
      return new TextDecoder("utf-8").decode(bytes);
    }

    function findHeaderIndex(headers, candidates){
      const nh = headers.map(h => normalizeText(h));
      for(const c of candidates){
        const target = normalizeText(c);
        const idx = nh.findIndex(h => h.includes(target));
        if(idx !== -1) return idx;
      }
      return -1;
    }

    function addOfficeRecord({ ward, type, name, address, phone, source, checked }){
      if(!name || !address) return false;
      const fixedWard = ward || wardFromAddress(address);
      if(!fixedWard) return false;

      const id = safeId(`${fixedWard}-${type}-${name}-${phone}-${address}`);
      if(offices.some(o => o.id === id)) return false;

      offices.push({
        id,
        ward: fixedWard,
        type,
        name,
        address,
        phone: phone || "",
        lat: 34.6937,
        lng: 135.5023,
        source: source || "",
        checked: checked || todayStr(),
        keywords: buildKeywords(fixedWard, name)
      });
      return true;
    }

    async function loadSelectedCsvs(event){
      const files = Array.from(event.target.files || []);
      if(!files.length){
        alert("CSVを選んでください。");
        return;
      }

      let importedTotal = 0;
      const messages = [];

      for(const file of files){
        try{
          const text = await decodeCsvFile(file);
          const lines = text.split(/\r?\n/).filter(Boolean);
          if(lines.length < 2){
            messages.push(`${file.name}: データがありません`);
            continue;
          }

          const headers = parseCsvLine(lines[0]);

          const idxServiceCode = findHeaderIndex(headers, ["サービス種別コード"]);
          const idxName = findHeaderIndex(headers, ["事業所_名称（漢字）", "事業所名称", "名称（漢字）"]);
          const idxAddress = findHeaderIndex(headers, ["事業所_住所（漢字）", "事業所所在地", "住所（漢字）", "所在地"]);
          const idxPhone = findHeaderIndex(headers, ["事業所_電話番号", "電話番号"]);
          const idxStartDate = findHeaderIndex(headers, ["指定有効開始年月日", "指定日", "異動年月日"]);
          const idxOfficeNo = findHeaderIndex(headers, ["事業所番号"]);
          const idxHoujin = findHeaderIndex(headers, ["法人名称"]);

          if(idxName === -1 || idxAddress === -1){
            messages.push(`${file.name}: 必要な列が見つかりません`);
            continue;
          }

          let fileImported = 0;

          for(let i = 1; i < lines.length; i++){
            const cols = parseCsvLine(lines[i]);
            const name = idxName !== -1 ? (cols[idxName] || "") : "";
            const address = idxAddress !== -1 ? (cols[idxAddress] || "") : "";
            const phone = idxPhone !== -1 ? (cols[idxPhone] || "") : "";
            const checked = idxStartDate !== -1 ? (cols[idxStartDate] || "") : "";
            const officeNo = idxOfficeNo !== -1 ? (cols[idxOfficeNo] || "") : "";
            const houjin = idxHoujin !== -1 ? (cols[idxHoujin] || "") : "";
            const serviceCode = idxServiceCode !== -1 ? (cols[idxServiceCode] || "") : "";

            if(!name || !address) continue;
            const ward = wardFromAddress(address);
            if(!ward) continue;

            let type = "";
            if(serviceCode === "43"){
              type = "居宅介護支援事業所";
            } else if(serviceCode === "11"){
              type = "訪問介護";
            } else if(normalizeText(file.name).includes("houmon")){
              type = "訪問介護";
            } else if(normalizeText(file.name).includes("kyotaku")){
              type = "居宅介護支援事業所";
            } else {
              continue;
            }

            const added = addOfficeRecord({
              ward,
              type,
              name,
              address,
              phone,
              source: `${file.name} (${officeNo || houjin || serviceCode})`,
              checked
            });

            if(added) fileImported++;
          }

          importedTotal += fileImported;
          messages.push(`${file.name}: ${fileImported}件追加`);
        }catch(error){
          console.error(error);
          messages.push(`${file.name}: 読み込み失敗`);
        }
      }

      rebuildWardOptions();
      renderListAndMap(offices);

      if(importedTotal === 0){
        setStatus(`追加できませんでした。<br>${messages.join("<br>")}`);
        alert("0件でした。青い表示欄のメッセージを見てください。");
      } else {
        setStatus(`読み込み完了<br>${messages.join("<br>")}`);
      }
    }

    function importSimpleCSV(){
      const text = csvInput.value.trim();
      if(!text){
        alert("CSVを貼ってください。");
        return;
      }
      const lines = text.split(/\r?\n/).filter(Boolean);
      let count = 0;

      lines.forEach((line, index) => {
        const cols = line.split(",").map(v => v.trim());
        if(index === 0 && cols[0] === "区名") return;
        if(cols.length < 10) return;

        const [ward, type, name, address, phone, latStr, lngStr, source, checked, keywords] = cols;
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        if(!ward || !type || !name || !address || Number.isNaN(lat) || Number.isNaN(lng)) return;

        const id = safeId(`${ward}-${name}-${phone}`);
        if(offices.some(o => o.id === id)) return;

        offices.push({
          id, ward, type, name, address, phone, lat, lng,
          source: source || "CSV追加",
          checked: checked || todayStr(),
          keywords: keywords || ""
        });
        count++;
      });

      rebuildWardOptions();
      renderListAndMap(offices);
      setStatus(`${count}件 追加しました。`);
    }

    rebuildWardOptions();
    renderListAndMap(offices);
  </script>
</body>
</html>
