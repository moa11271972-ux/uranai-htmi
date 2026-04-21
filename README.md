<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>営業アプリ｜大阪市全区 自動読込＋住所座標化版</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Hiragino Sans","Yu Gothic","Meiryo",sans-serif;
      background: #f4f7fb;
      color: #222;
    }
    header {
      background: linear-gradient(135deg,#2146d0,#4f7cff);
      color: #fff;
      padding: 16px;
      text-align: center;
      font-size: 22px;
      font-weight: 700;
    }
    .wrap {
      max-width: 1680px;
      margin: 0 auto;
      padding: 14px;
    }
    .box, .panel {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 22px rgba(0,0,0,.08);
      margin-bottom: 14px;
    }
    .box { padding: 12px; }
    .panel { overflow: hidden; }
    .panel-title {
      padding: 14px 16px;
      font-weight: 700;
      border-bottom: 1px solid #eef1f7;
      background: #fafcff;
    }
    .notice {
      background: #fff8e8;
      border: 1px solid #f3d38f;
      color: #6c4d00;
      border-radius: 12px;
      padding: 12px;
      line-height: 1.8;
      font-size: 13px;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
    }
    select, input, button, textarea {
      border: 1px solid #dbe3f2;
      border-radius: 12px;
      padding: 12px;
      font-size: 14px;
      background: #fff;
    }
    input { min-width: 150px; }
    button {
      border: none;
      background: #2146d0;
      color: #fff;
      cursor: pointer;
      white-space: nowrap;
    }
    button:hover { opacity: .92; }
    .green-btn { background: #16a34a; }
    .orange-btn { background: #f97316; }
    .red-btn { background: #c51616; }
    .purple-btn { background: #7a34c2; }
    .gray-btn { background: #7d8aa5; }

    .status-box {
      margin-top: 10px;
      padding: 10px 12px;
      background: #f7faff;
      border: 1px solid #e1e9fb;
      border-radius: 12px;
      font-size: 13px;
      color: #3b4d6b;
      line-height: 1.7;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
    }
    .chip {
      background: #eef3ff;
      color: #2146d0;
      padding: 8px 12px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
    }

    .layout {
      display: grid;
      grid-template-columns: 560px 1fr;
      gap: 14px;
    }
    .list {
      height: 78vh;
      overflow: auto;
    }
    .card {
      padding: 14px 16px;
      border-bottom: 1px solid #eef1f7;
      cursor: pointer;
      transition: .2s;
      background: #fff;
    }
    .card:hover { background: #f5f8ff; }
    .card.active {
      background: #eaf0ff;
      border-left: 5px solid #2146d0;
    }
    .card.visited { background: #f2f9f2; }
    .card.today { box-shadow: inset 0 0 0 2px #7a34c2; }

    .topline {
      display: flex;
      gap: 10px;
      justify-content: space-between;
      align-items: flex-start;
    }
    .order-badge {
      width: 34px;
      height: 34px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #2146d0;
      color: #fff;
      font-weight: 700;
      flex-shrink: 0;
    }
    .name {
      font-weight: 700;
      line-height: 1.5;
      margin-bottom: 6px;
    }
    .meta {
      font-size: 13px;
      color: #536076;
      line-height: 1.7;
      margin-top: 6px;
    }
    .distance {
      margin-top: 8px;
      font-size: 13px;
      color: #2146d0;
      font-weight: 700;
    }
    .source {
      margin-top: 8px;
      font-size: 12px;
      line-height: 1.6;
      color: #5f6b7d;
      background: #f8fbff;
      border: 1px solid #e6eefc;
      border-radius: 10px;
      padding: 8px 10px;
    }
    .badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }
    .badge {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 999px;
      background: #eef3ff;
      color: #2146d0;
    }
    .badge.called { background: #e8f0ff; color: #1f5ed8; }
    .badge.absent { background: #fff3e8; color: #c46b00; }
    .badge.revisit { background: #f6ebff; color: #7a34c2; }
    .badge.hot { background: #e9f9ef; color: #138548; }
    .badge.contract { background: #eaf7ff; color: #0070a8; }
    .badge.done { background: #e8f6e8; color: #208340; }
    .badge.todaybadge { background: #f4eaff; color: #7a34c2; }
    .badge.pending { background: #fff7e6; color: #a16207; }

    .action-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
      align-items: center;
    }
    .small-btn {
      padding: 8px 10px;
      font-size: 12px;
      border-radius: 10px;
      background: #4f7cff;
      color: #fff;
      text-decoration: none;
      display: inline-block;
    }
    .small-btn.green { background: #16a34a; }
    .small-btn.orange { background: #f97316; }
    .small-btn.gray { background: #7d8aa5; }
    .small-btn.purple { background: #8b5cf6; }
    .small-btn.teal { background: #0f9fb8; }

    .visit-check {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 700;
      color: #2c4b85;
    }
    .memo-box {
      width: 100%;
      min-height: 72px;
      margin-top: 10px;
      resize: vertical;
      font-size: 13px;
      line-height: 1.5;
    }
    #map {
      width: 100%;
      height: 78vh;
      min-height: 520px;
      background: #d8dde8;
    }
    .subgrid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .big-text {
      width: 100%;
      min-height: 220px;
      resize: vertical;
      font-size: 13px;
      line-height: 1.6;
    }
    .footer {
      font-size: 12px;
      color: #5f6b7d;
      line-height: 1.8;
    }
    a.tel-link {
      color: #2146d0;
      text-decoration: none;
      font-weight: 700;
    }
    .muted {
      font-size: 12px;
      color: #6b7280;
    }
    @media (max-width: 1100px) {
      .layout { grid-template-columns: 1fr; }
      .list { height: 420px; }
      #map { height: 58vh; min-height: 380px; }
      .subgrid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <header>営業アプリ｜大阪市全区 自動読込＋住所座標化版</header>

  <div class="wrap">
    <div class="box">
      <div class="notice">
        このアプリは公開されている事業所情報の表示を前提にしています。<br>
        地域包括・ブランチは住所から順番に座標化し、端末内に保存します。初回は少し時間がかかります。<br>
        居宅は大阪府CSVの緯度経度があればそのまま使います。
      </div>
    </div>

    <div class="box">
      <div class="row">
        <select id="wardFilter">
          <option value="all">全区</option>
        </select>

        <select id="typeFilter">
          <option value="all">全種別</option>
          <option value="地域包括支援センター">地域包括支援センター</option>
          <option value="総合相談窓口（ブランチ）">総合相談窓口（ブランチ）</option>
          <option value="居宅介護支援事業所">居宅介護支援事業所</option>
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

        <input id="keyword" type="text" placeholder="区名・駅名・種別・事業所名・住所・電話で検索" />
        <input id="placeSearch" type="text" placeholder="本町駅・梅田駅・天王寺駅などを検索" />

        <button onclick="applyFilters()">絞り込み</button>
        <button onclick="resetFilters()">リセット</button>
        <button onclick="getCurrentLocation()">現在地取得</button>
        <button onclick="searchPlaceAndMove()">場所検索</button>
        <button onclick="sortByWalkingOrder()">近い順</button>
        <button onclick="sortTodayByWalkingOrder()">今日予定を近い順</button>
        <button onclick="jumpToNextUnvisited()">次の未訪問へ</button>
        <button class="red-btn" onclick="generateDailyReport()">日報作成</button>
        <button onclick="copyDailyReport()">日報コピー</button>
        <button onclick="exportSalesData()">CSV出力</button>
      </div>

      <div class="row" style="margin-top:10px;">
        <button class="green-btn" onclick="loadAllOfficialData(true)">再読込</button>
        <button class="orange-btn" onclick="clearGeocodeCache()">座標キャッシュ削除</button>
        <input id="officialCsvFiles" type="file" accept=".csv,text/csv" multiple onchange="loadKyotakuFromFiles(event)" />
      </div>

      <div id="statusBox" class="status-box">現在地はまだ取得していません。</div>

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
中央区,居宅介護支援事業所,中央ケアプランセンター本町,大阪市中央区南本町1-1-1,06-0000-1111,34.680,135.509,介護保険事業所台帳情報,2026-03,本町駅 堺筋本町駅 中央区"></textarea>
        <div class="row" style="margin-top:10px;">
          <button class="purple-btn" onclick="importSimpleCSV()">CSV追加</button>
        </div>
      </div>

      <div class="box">
        <div class="panel-title" style="margin:-12px -12px 12px -12px; border-radius:16px 16px 0 0;">本日の営業日報</div>
        <textarea id="dailyReport" class="big-text" placeholder="日報作成を押すとここに入ります。"></textarea>
      </div>
    </div>
  </div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const OSAKA_CITY_OFFICIAL_CSV = "https://www.city.osaka.lg.jp/fukushi/cmsfiles/contents/0000370/370519/6csv.csv";
    const OSAKA_PREF_OFFICIAL_CSVS = [
      "https://www.pref.osaka.lg.jp/documents/23900/202603kyotaku01.csv",
      "https://www.pref.osaka.lg.jp/documents/23900/202603kyotaku02.csv"
    ];

    const offices = [];

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

    function todayStr(){
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    }

    function nowTimeStr(){
      const d = new Date();
      return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
    }

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

    function setStatus(text){
      statusBox.innerHTML = text;
    }

    function updateSummary(data){
      const total = data.length;
      const today = data.filter(o => isTodayTarget(o.id)).length;
      const visited = data.filter(o => getVisitState(o.id)).length;
      const remaining = total - visited;
      const called = data.filter(o => getSalesStatus(o.id) === "電話した").length;
      const hot = data.filter(o => getSalesStatus(o.id) === "見込みあり").length;

      totalCountEl.textContent = `全件: ${total}`;
      todayCountEl.textContent = `今日予定: ${today}`;
      visitedCountEl.textContent = `訪問済み: ${visited}`;
      remainingCountEl.textContent = `未訪問: ${remaining}`;
      calledCountEl.textContent = `電話した: ${called}`;
      hotCountEl.textContent = `見込みあり: ${hot}`;
    }

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
      return "#2146d0";
    }

    function markCalled(office){
      setSalesStatus(office.id, "電話した");
      setCallTime(office.id, nowTimeStr());
      renderListAndMap(currentRenderedData);
      updateSummary(currentRenderedData);
      setStatus(`${office.name} を「電話した」に更新しました。`);
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

        const badgePending = office.needsGeocode ? '<span class="badge pending">座標取得待ち</span>' : '';

        const item = document.createElement("div");
        item.className = "card" + (visited ? " visited" : "") + (today ? " today" : "");

        const distanceText = office.distanceFromPrev != null
          ? `前地点から ${formatDistance(office.distanceFromPrev)} / 徒歩約${walkingMinutesFromKm(office.distanceFromPrev)}分`
          : (office.distanceFromStart != null
              ? `現在地から ${formatDistance(office.distanceFromStart)} / 徒歩約${walkingMinutesFromKm(office.distanceFromStart)}分`
              : "距離未計算");

        item.innerHTML = `
          <div class="topline">
            <div style="flex:1;">
              <div class="name">${office.name}</div>
            </div>
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
            ${badgePending}
            ${today ? '<span class="badge todaybadge">今日回る先</span>' : ""}
            ${visited ? '<span class="badge done">訪問済み</span>' : ""}
          </div>

          <div class="source">
            出典: ${office.source || "未設定"}<br>
            確認日: ${office.checked || "未設定"}<br>
            検索補助語: ${office.keywords || "なし"}
          </div>

          <div class="action-row">
            <label class="visit-check">
              <input type="checkbox" class="visit-toggle" ${visited ? "checked" : ""}> 訪問済み
            </label>
            <label class="visit-check">
              <input type="checkbox" class="today-toggle" ${today ? "checked" : ""}> 今日回る
            </label>
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

        marker.bindPopup(`
          <b>${index + 1}. ${office.name}</b><br>
          ${office.ward}<br>
          ${office.type}<br>
          ${office.address}<br>
          <a href="tel:${String(office.phone || "").replace(/-/g, "")}">${office.phone || ""}</a><br>
          <a href="${googleMapsWalkingUrl(office.address)}" target="_blank" rel="noopener noreferrer">徒歩ルート</a><br>
          <a href="${googleMapsTransitUrl(office.address)}" target="_blank" rel="noopener noreferrer">バス・電車ルート</a>
        `);

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
          updateSummary(currentRenderedData);
        });

        item.querySelector(".today-toggle").addEventListener("change", (e) => {
          setTodayTarget(office.id, e.target.checked);
          renderListAndMap(currentRenderedData);
          updateSummary(currentRenderedData);
        });

        item.querySelectorAll("[data-status]").forEach(btn => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            setSalesStatus(office.id, btn.dataset.status);
            if(btn.dataset.status === "電話した") setCallTime(office.id, nowTimeStr());
            renderListAndMap(currentRenderedData);
            updateSummary(currentRenderedData);
          });
        });

        item.querySelector(".memo-box").addEventListener("input", (e) => {
          setMemo(office.id, e.target.value);
        });

        item.querySelector(".next-btn").addEventListener("click", (e) => {
          e.stopPropagation();
          jumpToNextUnvisited(index + 1);
        });

        item.querySelector(".auto-call-link").addEventListener("click", () => {
          markCalled(office);
        });
      });

      if(linePoints.length >= 2){
        routeLine = L.polyline(linePoints, { weight: 4, opacity: 0.7 }).addTo(map);
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

    function nearestNeighborSort(startPoint, items){
      const remaining = [...items];
      const ordered = [];
      let current = { lat: startPoint.lat, lng: startPoint.lng };
      while(remaining.length > 0){
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
        if(ordered.length === 0) next.distanceFromStart = bestDistance;
        ordered.push(next);
        current = { lat: next.lat, lng: next.lng };
      }
      return ordered;
    }

    function getCurrentLocation(){
      if(!navigator.geolocation){
        alert("この端末では現在地取得に対応していません。");
        return;
      }
      setStatus("現在地を取得しています…");
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          currentPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude };

          if(userMarker) map.removeLayer(userMarker);
          if(searchMarker){ map.removeLayer(searchMarker); searchMarker = null; }

          userMarker = L.marker([currentPosition.lat, currentPosition.lng]).addTo(map).bindPopup("現在地").openPopup();
          map.setView([currentPosition.lat, currentPosition.lng], 15);

          const address = await reverseGeocode(currentPosition.lat, currentPosition.lng);
          setStatus(address ? `現在地を取得しました。<br>${address}` : "現在地を取得しました。");
        },
        () => {
          setStatus("現在地を取得できませんでした。");
          alert("現在地を取得できませんでした。");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    async function reverseGeocode(lat, lng){
      try{
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ja`;
        const res = await fetch(url);
        const data = await res.json();
        return data.display_name || "";
      }catch(e){
        return "";
      }
    }

    async function geocodePlace(query){
      try{
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=ja&q=${encodeURIComponent(query + " 大阪市")}`;
        const res = await fetch(url);
        const data = await res.json();
        if(data && data.length > 0){
          return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            name: data[0].display_name
          };
        }
      }catch(e){
        console.log(e);
      }
      return null;
    }

    async function searchPlaceAndMove(){
      const query = placeSearchInput.value.trim();
      if(!query){
        alert("検索したい場所を入力してください。");
        return;
      }
      const result = await geocodePlace(query);
      if(!result){
        alert("場所が見つかりませんでした。");
        return;
      }
      currentPosition = { lat: result.lat, lng: result.lng };

      if(searchMarker) map.removeLayer(searchMarker);
      if(userMarker){ map.removeLayer(userMarker); userMarker = null; }

      searchMarker = L.marker([result.lat, result.lng]).addTo(map).bindPopup(`検索地点<br>${result.name}`).openPopup();
      map.setView([result.lat, result.lng], 15);
      setStatus(`検索地点を表示しました。<br>${result.name}`);
    }

    function sortByWalkingOrder(){
      const filtered = getFilteredData();
      if(filtered.length === 0){
        alert("該当する営業先がありません。");
        return;
      }
      if(!currentPosition){
        alert("先に現在地取得か場所検索をしてください。");
        return;
      }
      const ordered = nearestNeighborSort(
        currentPosition,
        filtered.map(x => ({ ...x, distanceFromPrev:null, distanceFromStart:null }))
      );
      renderListAndMap(ordered);
      setStatus("現在地から近い順に並べ替えました。");
    }

    function sortTodayByWalkingOrder(){
      const todayItems = getFilteredData().filter(o => isTodayTarget(o.id));
      if(todayItems.length === 0){
        alert("今日回る先がありません。");
        return;
      }
      if(!currentPosition){
        alert("先に現在地取得か場所検索をしてください。");
        return;
      }
      const ordered = nearestNeighborSort(
        currentPosition,
        todayItems.map(x => ({ ...x, distanceFromPrev:null, distanceFromStart:null }))
      );
      renderListAndMap(ordered);
      setStatus("今日回る先だけを近い順に並べ替えました。");
    }

    function jumpToNextUnvisited(startIndex = 0){
      const data = currentRenderedData;
      if(data.length === 0) return;
      let nextIndex = -1;
      for(let i = startIndex; i < data.length; i++){
        if(!getVisitState(data[i].id)){ nextIndex = i; break; }
      }
      if(nextIndex === -1){
        for(let i = 0; i < startIndex; i++){
          if(!getVisitState(data[i].id)){ nextIndex = i; break; }
        }
      }
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
      setStatus(`次の未訪問先は「${office.name}」です。`);
    }

    function generateDailyReport(){
      const visible = currentRenderedData;
      const todayItems = visible.filter(o => isTodayTarget(o.id));
      const visited = visible.filter(o => getVisitState(o.id));
      const called = visible.filter(o => getSalesStatus(o.id) === "電話した");
      const absent = visible.filter(o => getSalesStatus(o.id) === "不在");
      const revisit = visible.filter(o => getSalesStatus(o.id) === "再訪問");
      const hot = visible.filter(o => getSalesStatus(o.id) === "見込みあり");
      const contract = visible.filter(o => getSalesStatus(o.id) === "契約候補");

      const d = new Date();
      const dateText = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;

      let report = "";
      report += `【営業日報】\n`;
      report += `日付：${dateText}\n\n`;
      report += `表示件数：${visible.length}件\n`;
      report += `今日予定：${todayItems.length}件\n`;
      report += `訪問済み：${visited.length}件\n`;
      report += `電話した：${called.length}件\n`;
      report += `不在：${absent.length}件\n`;
      report += `再訪問：${revisit.length}件\n`;
      report += `見込みあり：${hot.length}件\n`;
      report += `契約候補：${contract.length}件\n\n`;

      visible.forEach((office, idx) => {
        report += `${idx + 1}. ${office.name}\n`;
        report += `区：${office.ward}\n`;
        report += `種別：${office.type}\n`;
        report += `状態：${getSalesStatus(office.id)}\n`;
        report += `訪問済み：${getVisitState(office.id) ? "はい" : "いいえ"}\n`;
        report += `今日予定：${isTodayTarget(office.id) ? "はい" : "いいえ"}\n`;
        report += `電話時刻：${getCallTime(office.id) || "未記録"}\n`;
        report += `電話：${office.phone || ""}\n`;
        report += `住所：${office.address}\n`;
        report += `出典：${office.source || ""}\n`;
        report += `確認日：${office.checked || ""}\n`;
        report += `メモ：${getMemo(office.id) || "なし"}\n\n`;
      });

      dailyReportEl.value = report;
      setStatus("日報を作成しました。");
    }

    async function copyDailyReport(){
      const text = dailyReportEl.value.trim();
      if(!text){
        alert("先に日報を作成してください。");
        return;
      }
      try{
        await navigator.clipboard.writeText(text);
        alert("日報をコピーしました。");
      }catch(e){
        dailyReportEl.select();
        document.execCommand("copy");
        alert("日報をコピーしました。");
      }
    }

    function exportSalesData(){
      const rows = [[
        "区名","種別","事業所名","住所","電話","営業状態","訪問済み","今日予定","電話時刻","出典","確認日","検索補助語","メモ"
      ]];

      currentRenderedData.forEach(office => {
        rows.push([
          office.ward, office.type, office.name, office.address, office.phone || "",
          getSalesStatus(office.id),
          getVisitState(office.id) ? "はい" : "いいえ",
          isTodayTarget(office.id) ? "はい" : "いいえ",
          getCallTime(office.id),
          office.source || "", office.checked || "", office.keywords || "",
          getMemo(office.id).replace(/\n/g, " ")
        ]);
      });

      const csv = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "eigyo_app_osakashi_complete.csv";
      link.click();
      URL.revokeObjectURL(url);
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
          keywords: keywords || "",
          needsGeocode: false
        });
        count++;
      });
      rebuildWardOptions();
      renderListAndMap(offices);
      setStatus(`${count}件 追加しました。`);
    }

    function guessColumnIndex(headers, candidates){
      const normalized = headers.map(h => normalizeText(h));
      for(const c of candidates){
        const needle = normalizeText(c);
        const idx = normalized.findIndex(h => h.includes(needle));
        if(idx !== -1) return idx;
      }
      return -1;
    }

    function parseCsvLine(line){
      const result = [];
      let cur = "";
      let inQuotes = false;
      for(let i = 0; i < line.length; i++){
        const ch = line[i];
        if(ch === '"'){
          if(inQuotes && line[i+1] === '"'){
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

    function wardFromAddress(address){
      return OSAKA_WARDS.find(w => String(address || "").includes(w)) || "";
    }

    function looksLikeOsakaCity(address, ward){
      if (OSAKA_WARDS.includes(ward)) return true;
      return OSAKA_WARDS.some(w => String(address || "").includes(`大阪市${w}`) || String(address || "").includes(w));
    }

    function buildKeywords(ward, name){
      return [ward, name, ...(WARD_STATIONS[ward] || [])].join(" ");
    }

    function getGeocodeCacheKey(address){
      return `geo_cache_${normalizeText(address)}`;
    }

    function getCachedGeocode(address){
      try{
        const raw = localStorage.getItem(getGeocodeCacheKey(address));
        return raw ? JSON.parse(raw) : null;
      }catch(e){
        return null;
      }
    }

    function setCachedGeocode(address, lat, lng){
      try{
        localStorage.setItem(getGeocodeCacheKey(address), JSON.stringify({ lat, lng }));
      }catch(e){}
    }

    function clearGeocodeCache(){
      const keys = [];
      for(let i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i);
        if(key && key.startsWith("geo_cache_")) keys.push(key);
      }
      keys.forEach(k => localStorage.removeItem(k));
      alert("座標キャッシュを削除しました。");
    }

    function sleep(ms){
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function geocodeAddressNominatim(address){
      const cached = getCachedGeocode(address);
      if(cached && Number.isFinite(cached.lat) && Number.isFinite(cached.lng)) return cached;

      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=ja&q=${encodeURIComponent(address)}`;
      const res = await fetch(url, { cache: "no-store" });
      if(!res.ok) return null;
      const data = await res.json();
      if(!Array.isArray(data) || data.length === 0) return null;

      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      if(Number.isNaN(lat) || Number.isNaN(lng)) return null;

      setCachedGeocode(address, lat, lng);
      return { lat, lng };
    }

    async function geocodePendingCityOffices(){
      const pending = offices.filter(o => o.needsGeocode);
      if(pending.length === 0) return;

      for(let i = 0; i < pending.length; i++){
        const office = pending[i];
        setStatus(`住所から座標を取得中… ${i + 1}/${pending.length}<br>${office.name}`);

        const result = await geocodeAddressNominatim(office.address);
        if(result){
          office.lat = result.lat;
          office.lng = result.lng;
          office.needsGeocode = false;
        }
        renderListAndMap(getFilteredData().length ? getFilteredData() : offices);
        await sleep(1100);
      }
      setStatus("住所からの座標取得が完了しました。");
    }

    function importOsakaCityCsvText(text){
      const lines = text.split(/\r?\n/).filter(Boolean);
      if(lines.length < 2) return 0;

      let imported = 0;
      for(let i = 1; i < lines.length; i++){
        const cols = parseCsvLine(lines[i]);
        if(cols.length < 14) continue;

        const typeRaw = cols[0] || "";
        const ward = cols[10] || "";
        const name = cols[11] || "";
        const address = cols[12] || "";
        const phone = cols[13] || "";

        if(!name || !address) continue;

        let type = "";
        if(normalizeText(typeRaw).includes(normalizeText("地域包括支援センター"))){
          type = "地域包括支援センター";
        } else if(
          normalizeText(typeRaw).includes(normalizeText("総合相談窓口")) ||
          normalizeText(name).includes(normalizeText("ブランチ"))
        ){
          type = "総合相談窓口（ブランチ）";
        } else {
          continue;
        }

        const id = safeId(`${ward}-${name}-${phone}-${type}`);
        if(offices.some(o => o.id === id)) continue;

        const cached = getCachedGeocode(address);

        offices.push({
          id,
          ward: ward || wardFromAddress(address) || "",
          type,
          name,
          address,
          phone,
          lat: cached?.lat ?? 34.6937,
          lng: cached?.lng ?? 135.5023,
          source: "大阪市 地域包括・ブランチ一覧CSV",
          checked: "2026-04-10",
          keywords: buildKeywords(ward || wardFromAddress(address) || "", name),
          needsGeocode: !(cached && Number.isFinite(cached.lat) && Number.isFinite(cached.lng))
        });
        imported++;
      }
      return imported;
    }

    function importOfficialKyotakuCsvText(text, sourceLabel){
      const lines = text.split(/\r?\n/).filter(Boolean);
      if(lines.length < 2) return 0;

      const headers = parseCsvLine(lines[0]);
      const serviceNameIdx = guessColumnIndex(headers, ["サービス種類名称","サービス種類"]);
      const officeNameIdx = guessColumnIndex(headers, ["事業所名称","施設名称"]);
      const addressIdx = guessColumnIndex(headers, ["事業所所在地","住所"]);
      const phoneIdx = guessColumnIndex(headers, ["事業所電話番号","電話番号"]);
      const latIdx = guessColumnIndex(headers, ["緯度"]);
      const lngIdx = guessColumnIndex(headers, ["経度"]);
      const wardIdx = guessColumnIndex(headers, ["区市町村","市区町村","行政区","保険者名"]);
      const updatedIdx = guessColumnIndex(headers, ["異動年月日","更新年月日","指定年月日"]);

      let imported = 0;

      for(let i = 1; i < lines.length; i++){
        const cols = parseCsvLine(lines[i]);
        const serviceName = cols[serviceNameIdx] || "";
        if(!normalizeText(serviceName).includes(normalizeText("居宅介護支援"))) continue;

        const address = cols[addressIdx] || "";
        const rawWard = cols[wardIdx] || "";
        const ward = wardFromAddress(address) || rawWard;
        if(!looksLikeOsakaCity(address, ward)) continue;

        const name = cols[officeNameIdx] || "";
        if(!name || !address) continue;

        const lat = parseFloat(cols[latIdx] || "");
        const lng = parseFloat(cols[lngIdx] || "");
        if(Number.isNaN(lat) || Number.isNaN(lng)) continue;

        const phone = cols[phoneIdx] || "";
        const checked = cols[updatedIdx] || "2026-03";
        const id = safeId(`${ward}-${name}-${phone}-${address}`);
        if(offices.some(o => o.id === id)) continue;

        offices.push({
          id,
          ward: ward || "大阪市",
          type: "居宅介護支援事業所",
          name,
          address,
          phone,
          lat,
          lng,
          source: `大阪府 介護保険事業所台帳情報 (${sourceLabel})`,
          checked,
          keywords: buildKeywords(ward || "大阪市", name),
          needsGeocode: false
        });
        imported++;
      }
      return imported;
    }

    async function loadOsakaCityData(){
      const cityRes = await fetch(OSAKA_CITY_OFFICIAL_CSV, { cache: "no-store" });
      if(!cityRes.ok) throw new Error("大阪市CSVの読込に失敗しました。");
      return importOsakaCityCsvText(await cityRes.text());
    }

    async function loadKyotakuData(){
      let importedKyotaku = 0;
      for(const url of OSAKA_PREF_OFFICIAL_CSVS){
        const res = await fetch(url, { cache: "no-store" });
        if(!res.ok) throw new Error(`大阪府CSVの読込に失敗しました: ${url}`);
        importedKyotaku += importOfficialKyotakuCsvText(await res.text(), url);
      }
      return importedKyotaku;
    }

    async function loadAllOfficialData(reset = false){
      setStatus("大阪市と大阪府の公式CSVを自動読込しています…");
      try{
        if(reset) offices.length = 0;
        else offices.length = 0;

        const importedCity = await loadOsakaCityData();
        const importedKyotaku = await loadKyotakuData();

        rebuildWardOptions();
        renderListAndMap(offices);
        setStatus(`自動読込完了：地域包括・ブランチ ${importedCity} 件、居宅 ${importedKyotaku} 件 追加しました。`);

        await geocodePendingCityOffices();
        renderListAndMap(offices);
      }catch(err){
        console.error(err);
        setStatus("自動読込に失敗しました。下のファイル選択または手動CSV追加を使ってください。");
      }
    }

    async function loadKyotakuFromFiles(event){
      const files = Array.from(event.target.files || []);
      if(files.length === 0) return;

      let imported = 0;
      for(const file of files){
        const text = await file.text();
        imported += importOfficialKyotakuCsvText(text, file.name);
      }

      rebuildWardOptions();
      renderListAndMap(offices);
      setStatus(`ファイルから ${imported} 件の大阪市内居宅を追加しました。`);
    }

    renderListAndMap(offices);
    setTimeout(() => {
      map.invalidateSize();
      fitVisibleMarkers();
    }, 400);

    window.addEventListener("load", async () => {
      try {
        await loadAllOfficialData();
      } catch (e) {
        console.error(e);
      }
    });
  </script>
</body>
</html>
