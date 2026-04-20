<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>営業アプリ｜完全版</title>
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  />
  <style>
    * { box-sizing: border-box; }

    body{
      margin:0;
      font-family:"Hiragino Sans","Yu Gothic","Meiryo",sans-serif;
      background:#f4f7fb;
      color:#222;
    }

    header{
      background:linear-gradient(135deg,#2146d0,#4f7cff);
      color:#fff;
      padding:16px;
      text-align:center;
      font-size:22px;
      font-weight:700;
      box-shadow:0 4px 12px rgba(0,0,0,0.15);
    }

    .wrap{
      max-width:1540px;
      margin:0 auto;
      padding:14px;
    }

    .toolbar{
      background:#fff;
      border-radius:16px;
      padding:12px;
      box-shadow:0 8px 22px rgba(0,0,0,0.08);
      margin-bottom:14px;
    }

    .row{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
      align-items:center;
    }

    select, input, button, textarea{
      border:1px solid #dbe3f2;
      border-radius:12px;
      padding:12px;
      font-size:14px;
      background:#fff;
    }

    input{ min-width:150px; }

    button{
      border:none;
      background:#2146d0;
      color:#fff;
      cursor:pointer;
      white-space:nowrap;
    }

    button:hover{ opacity:0.92; }

    .danger-btn{ background:#c51616; }

    .status-box{
      margin-top:10px;
      padding:10px 12px;
      background:#f7faff;
      border:1px solid #e1e9fb;
      border-radius:12px;
      font-size:13px;
      color:#3b4d6b;
      line-height:1.7;
    }

    .chips{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
      margin-top:10px;
    }

    .chip{
      background:#eef3ff;
      color:#2146d0;
      padding:8px 12px;
      border-radius:999px;
      font-size:13px;
      font-weight:700;
    }

    .chip.red{
      background:#ffe3e3;
      color:#c51616;
    }

    .chip.orange{
      background:#fff1db;
      color:#b96a00;
    }

    .layout{
      display:grid;
      grid-template-columns:470px 1fr;
      gap:14px;
    }

    .panel{
      background:#fff;
      border-radius:18px;
      box-shadow:0 8px 22px rgba(0,0,0,0.08);
      overflow:hidden;
    }

    .panel-title{
      padding:14px 16px;
      font-weight:700;
      border-bottom:1px solid #eef1f7;
      background:#fafcff;
    }

    .list{
      height:78vh;
      overflow:auto;
    }

    .card{
      padding:14px 16px;
      border-bottom:1px solid #eef1f7;
      cursor:pointer;
      transition:0.2s;
      background:#fff;
    }

    .card:hover{ background:#f5f8ff; }

    .card.active{
      background:#eaf0ff;
      border-left:5px solid #2146d0;
    }

    .card.visited{
      background:#f2f9f2;
    }

    .card.today{
      box-shadow: inset 0 0 0 2px #7a34c2;
    }

    .card.follow-today{
      background:#fff4f4;
      box-shadow: inset 0 0 0 2px #ff6b6b;
    }

    .card.follow-overdue{
      background:#ffe7e7;
      box-shadow: inset 0 0 0 3px #c51616;
    }

    .topline{
      display:flex;
      gap:10px;
      justify-content:space-between;
      align-items:flex-start;
    }

    .order-badge{
      width:34px;
      height:34px;
      border-radius:999px;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#2146d0;
      color:#fff;
      font-weight:700;
      flex-shrink:0;
    }

    .name{
      font-weight:700;
      line-height:1.5;
      margin-bottom:6px;
    }

    .meta{
      font-size:13px;
      color:#536076;
      line-height:1.7;
      margin-top:6px;
    }

    .distance{
      margin-top:8px;
      font-size:13px;
      color:#2146d0;
      font-weight:700;
    }

    .badge-row{
      display:flex;
      flex-wrap:wrap;
      gap:6px;
      margin-top:8px;
    }

    .badge{
      font-size:12px;
      padding:4px 8px;
      border-radius:999px;
      background:#eef3ff;
      color:#2146d0;
    }

    .badge.status-called{ background:#e8f0ff; color:#1f5ed8; }
    .badge.status-absent{ background:#fff3e8; color:#c46b00; }
    .badge.status-revisit{ background:#f6ebff; color:#7a34c2; }
    .badge.status-hot{ background:#e9f9ef; color:#138548; }
    .badge.status-contract{ background:#eaf7ff; color:#0070a8; }
    .badge.today-badge{ background:#f4eaff; color:#7a34c2; }
    .badge.done-badge{ background:#e8f6e8; color:#208340; }
    .badge.follow-badge{ background:#ffdede; color:#c51616; font-weight:700; }
    .badge.overdue-badge{ background:#c51616; color:#fff; font-weight:700; }

    .action-row{
      display:flex;
      flex-wrap:wrap;
      gap:8px;
      margin-top:10px;
      align-items:center;
    }

    .small-btn{
      padding:8px 10px;
      font-size:12px;
      border-radius:10px;
      background:#4f7cff;
    }

    .small-btn.gray{ background:#7d8aa5; }
    .small-btn.orange{ background:#e59100; }
    .small-btn.purple{ background:#8b5cf6; }
    .small-btn.green{ background:#16a34a; }
    .small-btn.teal{ background:#0f9fb8; }
    .small-btn.pink{ background:#d946ef; }

    .visit-check{
      display:flex;
      align-items:center;
      gap:6px;
      font-size:13px;
      font-weight:700;
      color:#2c4b85;
    }

    .date-grid{
      display:grid;
      grid-template-columns:1fr 1fr 1fr;
      gap:8px;
      margin-top:10px;
    }

    .date-box label{
      display:block;
      font-size:12px;
      color:#5b6472;
      margin-bottom:4px;
      font-weight:700;
    }

    .date-box input{
      width:100%;
      min-width:0;
      padding:10px;
      font-size:13px;
    }

    .memo-box{
      width:100%;
      min-height:64px;
      margin-top:10px;
      resize:vertical;
      font-size:13px;
      line-height:1.5;
    }

    #map{
      width:100%;
      height:78vh;
      min-height:520px;
      background:#d8dde8;
    }

    .report-area{
      margin-top:14px;
      background:#fff;
      border-radius:18px;
      box-shadow:0 8px 22px rgba(0,0,0,0.08);
      overflow:hidden;
    }

    .report-body{
      padding:14px;
    }

    #dailyReport{
      width:100%;
      min-height:300px;
      resize:vertical;
      font-size:14px;
      line-height:1.7;
    }

    .footer-note{
      margin-top:12px;
      font-size:12px;
      color:#5b6472;
      line-height:1.8;
      background:#fff;
      padding:12px 14px;
      border-radius:14px;
      box-shadow:0 8px 22px rgba(0,0,0,0.06);
    }

    a.tel-link{
      color:#2146d0;
      text-decoration:none;
      font-weight:700;
    }

    a.route-link{
      display:inline-block;
      margin-top:8px;
      color:#0b57d0;
      text-decoration:none;
      font-size:13px;
      font-weight:700;
    }

    @media (max-width: 1100px){
      .layout{
        grid-template-columns:1fr;
      }
      .list{
        height:420px;
      }
      #map{
        height:58vh;
        min-height:380px;
      }
      .date-grid{
        grid-template-columns:1fr;
      }
    }
  </style>
</head>
<body>
  <header>営業アプリ｜完全版</header>

  <div class="wrap">
    <div class="toolbar">
      <div class="row">
        <select id="wardFilter">
          <option value="all">全区</option>
          <option value="天王寺区">天王寺区</option>
          <option value="阿倍野区">阿倍野区</option>
        </select>

        <select id="typeFilter">
          <option value="all">全種別</option>
          <option value="地域包括支援センター">地域包括支援センター</option>
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

        <select id="followFilter">
          <option value="all">フォロー日 全て</option>
          <option value="today">今日フォロー予定のみ</option>
          <option value="overdue">期限超過のみ</option>
          <option value="set">日付設定ありのみ</option>
          <option value="unset">日付未設定のみ</option>
        </select>

        <input id="keyword" type="text" placeholder="事業所名・住所で検索" />
        <input id="placeSearch" type="text" placeholder="天王寺駅などを検索" />

        <button onclick="applyFilters()">絞り込み</button>
        <button onclick="sortFollowPriority()">フォロー優先順</button>
        <button onclick="resetFilters()">リセット</button>
        <button onclick="getCurrentLocation()">現在地取得</button>
        <button onclick="searchPlaceAndMove()">場所検索</button>
        <button onclick="sortByWalkingOrder()">徒歩順</button>
        <button onclick="sortTodayByWalkingOrder()">今日予定を徒歩順</button>
        <button onclick="jumpToNextUnvisited()">次の未訪問へ</button>
        <button class="danger-btn" onclick="generateDailyReport()">日報作成</button>
        <button onclick="copyDailyReport()">日報コピー</button>
        <button onclick="exportSalesData()">CSV出力</button>
        <button onclick="clearVisitData()">記録消去</button>
      </div>

      <div id="statusBox" class="status-box">現在地はまだ取得していません。</div>

      <div class="chips">
        <div class="chip" id="totalCount">全件: 0</div>
        <div class="chip" id="todayCount">今日予定: 0</div>
        <div class="chip" id="visitedCount">訪問済み: 0</div>
        <div class="chip" id="remainingCount">未訪問: 0</div>
        <div class="chip" id="hotCount">見込みあり: 0</div>
        <div class="chip" id="contractCount">契約候補: 0</div>
        <div class="chip orange" id="followTodayCount">今日フォロー: 0</div>
        <div class="chip red" id="overdueCount">期限超過: 0</div>
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

    <div class="report-area">
      <div class="panel-title">本日の営業日報</div>
      <div class="report-body">
        <textarea id="dailyReport" placeholder="「日報作成」を押すとここに本日の営業日報が自動で入ります。"></textarea>
      </div>
    </div>

    <div class="footer-note">
      電話番号タップで自動的に「電話した」へ更新します。<br>
      今日フォロー予定は赤系、期限超過は濃い赤で強調されます。<br>
      今日の訪問先、日報、CSV出力までこの1本で使えます。
    </div>
  </div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const offices = [
      { id:"tennoji-houkatsu", name:"天王寺区地域包括支援センター", ward:"天王寺区", type:"地域包括支援センター", address:"大阪市天王寺区六万体町5-26", phone:"06-6774-3386", lat:34.6589, lng:135.5166 },
      { id:"abeno-hokubu-houkatsu", name:"阿倍野区北部地域包括支援センター", ward:"阿倍野区", type:"地域包括支援センター", address:"大阪市阿倍野区阿倍野筋3-10-1 あべのベルタ106", phone:"06-6760-4018", lat:34.6456, lng:135.5109 },
      { id:"abeno-chubu-houkatsu", name:"阿倍野区中部地域包括支援センター", ward:"阿倍野区", type:"地域包括支援センター", address:"大阪市阿倍野区阪南町1-57-2 オルセ阿倍野1階", phone:"06-6629-8686", lat:34.6356, lng:135.5159 },
      { id:"abeno-houkatsu", name:"阿倍野区地域包括支援センター", ward:"阿倍野区", type:"地域包括支援センター", address:"大阪市阿倍野区帝塚山1-3-8", phone:"06-6628-1400", lat:34.6258, lng:135.5015 },
      { id:"ueroku-care", name:"うえろくケアプランセンター", ward:"天王寺区", type:"居宅介護支援事業所", address:"大阪市天王寺区上本町8丁目4-11 KIMURAビル3F", phone:"06-6772-6223", lat:34.6624, lng:135.5208 },
      { id:"shitennoji-care", name:"四天王寺ケアプランセンター", ward:"天王寺区", type:"居宅介護支援事業所", address:"大阪市天王寺区玉造元町1-29", phone:"06-6763-4115", lat:34.6735, lng:135.5310 },
      { id:"yuhigaoka-care", name:"夕陽ヶ丘ケアサービス居宅介護支援事業所", ward:"天王寺区", type:"居宅介護支援事業所", address:"大阪市天王寺区勝山2丁目8-23", phone:"06-6771-3015", lat:34.6538, lng:135.5278 },
      { id:"nakayoshi-tennoji", name:"介護支援センターなかよし天王寺", ward:"天王寺区", type:"居宅介護支援事業所", address:"大阪市天王寺区烏ヶ辻1-8-9 烏ヶ辻コーポ103", phone:"06-4302-5500", lat:34.6555, lng:135.5308 },
      { id:"care-reach", name:"居宅介護支援事業所ケアリーチ", ward:"天王寺区", type:"居宅介護支援事業所", address:"大阪市天王寺区上汐3丁目2-16 アリビオ上本町604号室", phone:"06-6777-9433", lat:34.6621, lng:135.5180 },
      { id:"care21-abeno", name:"ケア21阿倍野", ward:"阿倍野区", type:"居宅介護支援事業所", address:"大阪市阿倍野区昭和町1-8-26 パレロイヤルビル201号", phone:"06-6626-2055", lat:34.6377, lng:135.5184 },
      { id:"abeno-ishikai", name:"阿倍野区医師会ケアセンター", ward:"阿倍野区", type:"居宅介護支援事業所", address:"大阪市阿倍野区阿倍野筋5-8-26 大阪市阿倍野区医師会館3F", phone:"06-6624-1665", lat:34.6387, lng:135.5068 },
      { id:"loopcare", name:"居宅介護支援事業所 るぅぷけぁ", ward:"阿倍野区", type:"居宅介護支援事業所", address:"大阪市阿倍野区阪南町2-1-11", phone:"06-6654-3012", lat:34.6339, lng:135.5161 },
      { id:"hanamizuki", name:"介護支援センターはなみずき", ward:"阿倍野区", type:"居宅介護支援事業所", address:"大阪市阿倍野区王子町3丁目8-4", phone:"06-6654-3277", lat:34.6276, lng:135.5038 },
      { id:"shien-club", name:"居宅支援倶楽部", ward:"阿倍野区", type:"居宅介護支援事業所", address:"大阪市阿倍野区松虫通3-1-18 パインヒルズ105", phone:"06-6615-9160", lat:34.6309, lng:135.5060 }
    ];

    const map = L.map("map").setView([34.646, 135.519], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const listEl = document.getElementById("list");
    const wardFilter = document.getElementById("wardFilter");
    const typeFilter = document.getElementById("typeFilter");
    const salesStatusFilter = document.getElementById("salesStatusFilter");
    const todayFilter = document.getElementById("todayFilter");
    const followFilter = document.getElementById("followFilter");
    const keywordInput = document.getElementById("keyword");
    const placeSearchInput = document.getElementById("placeSearch");
    const statusBox = document.getElementById("statusBox");
    const dailyReportEl = document.getElementById("dailyReport");

    const totalCountEl = document.getElementById("totalCount");
    const todayCountEl = document.getElementById("todayCount");
    const visitedCountEl = document.getElementById("visitedCount");
    const remainingCountEl = document.getElementById("remainingCount");
    const hotCountEl = document.getElementById("hotCount");
    const contractCountEl = document.getElementById("contractCount");
    const followTodayCountEl = document.getElementById("followTodayCount");
    const overdueCountEl = document.getElementById("overdueCount");

    let markers = [];
    let visibleMarkers = [];
    let currentPosition = null;
    let userMarker = null;
    let searchMarker = null;
    let routeLine = null;
    let currentRenderedData = [...offices];

    function todayStr(){
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }

    function nowTimeStr(){
      const d = new Date();
      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");
      return `${h}:${m}`;
    }

    function getVisitState(id){ return localStorage.getItem("visit_" + id) === "1"; }
    function setVisitState(id, value){ localStorage.setItem("visit_" + id, value ? "1" : "0"); }

    function getMemo(id){ return localStorage.getItem("memo_" + id) || ""; }
    function setMemo(id, text){ localStorage.setItem("memo_" + id, text); }

    function getSalesStatus(id){ return localStorage.getItem("sales_status_" + id) || "未対応"; }
    function setSalesStatus(id, value){ localStorage.setItem("sales_status_" + id, value); }

    function isTodayTarget(id){ return localStorage.getItem("today_target_" + id) === "1"; }
    function setTodayTarget(id, value){ localStorage.setItem("today_target_" + id, value ? "1" : "0"); }

    function getVisitDate(id){ return localStorage.getItem("visit_date_" + id) || ""; }
    function setVisitDate(id, value){ localStorage.setItem("visit_date_" + id, value); }

    function getNextVisitDate(id){ return localStorage.getItem("next_visit_date_" + id) || ""; }
    function setNextVisitDate(id, value){ localStorage.setItem("next_visit_date_" + id, value); }

    function getFollowDate(id){ return localStorage.getItem("follow_date_" + id) || ""; }
    function setFollowDate(id, value){ localStorage.setItem("follow_date_" + id, value); }

    function getCallTime(id){ return localStorage.getItem("call_time_" + id) || ""; }
    function setCallTime(id, value){ localStorage.setItem("call_time_" + id, value); }

    function isFollowToday(id){
      const v = getFollowDate(id);
      return v !== "" && v === todayStr();
    }

    function isFollowOverdue(id){
      const v = getFollowDate(id);
      return v !== "" && v < todayStr();
    }

    function statusBadgeClass(status){
      if(status === "電話した") return "status-called";
      if(status === "不在") return "status-absent";
      if(status === "再訪問") return "status-revisit";
      if(status === "見込みあり") return "status-hot";
      if(status === "契約候補") return "status-contract";
      return "";
    }

    function markerColor(status, visited, today, followToday, overdue){
      if(overdue) return "#c51616";
      if(followToday) return "#ff6b6b";
      if(status === "契約候補") return "#0f9fb8";
      if(status === "見込みあり") return "#16a34a";
      if(status === "再訪問") return "#8b5cf6";
      if(status === "不在") return "#e59100";
      if(status === "電話した") return "#4f7cff";
      if(today) return "#d946ef";
      if(visited) return "#2aa84a";
      return "#2146d0";
    }

    function followPriorityScore(office){
      if(isFollowOverdue(office.id)) return 100;
      if(isFollowToday(office.id)) return 90;
      if(getSalesStatus(office.id) === "契約候補") return 80;
      if(getSalesStatus(office.id) === "見込みあり") return 70;
      if(getSalesStatus(office.id) === "再訪問") return 60;
      if(isTodayTarget(office.id)) return 50;
      return 10;
    }

    function googleMapsDirectionsUrl(destination){
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=walking`;
    }

    function haversine(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
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
      const hot = data.filter(o => getSalesStatus(o.id) === "見込みあり").length;
      const contract = data.filter(o => getSalesStatus(o.id) === "契約候補").length;
      const followToday = data.filter(o => isFollowToday(o.id)).length;
      const overdue = data.filter(o => isFollowOverdue(o.id)).length;

      totalCountEl.textContent = `全件: ${total}`;
      todayCountEl.textContent = `今日予定: ${today}`;
      visitedCountEl.textContent = `訪問済み: ${visited}`;
      remainingCountEl.textContent = `未訪問: ${remaining}`;
      hotCountEl.textContent = `見込みあり: ${hot}`;
      contractCountEl.textContent = `契約候補: ${contract}`;
      followTodayCountEl.textContent = `今日フォロー: ${followToday}`;
      overdueCountEl.textContent = `期限超過: ${overdue}`;
    }

    function getFilteredData(){
      const ward = wardFilter.value;
      const type = typeFilter.value;
      const salesStatus = salesStatusFilter.value;
      const todayMode = todayFilter.value;
      const followMode = followFilter.value;
      const keyword = keywordInput.value.trim().toLowerCase();

      return offices.filter(office => {
        const wardOk = ward === "all" || office.ward === ward;
        const typeOk = type === "all" || office.type === type;
        const statusOk = salesStatus === "all" || getSalesStatus(office.id) === salesStatus;
        const todayOk =
          todayMode === "all" ||
          (todayMode === "today" && isTodayTarget(office.id)) ||
          (todayMode === "not_today" && !isTodayTarget(office.id));

        let followOk = true;
        if(followMode === "today") followOk = isFollowToday(office.id);
        if(followMode === "overdue") followOk = isFollowOverdue(office.id);
        if(followMode === "set") followOk = getFollowDate(office.id) !== "";
        if(followMode === "unset") followOk = getFollowDate(office.id) === "";

        const keywordOk =
          keyword === "" ||
          office.name.toLowerCase().includes(keyword) ||
          office.address.toLowerCase().includes(keyword);

        return wardOk && typeOk && statusOk && todayOk && followOk && keywordOk;
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

    function markCalledFromPhoneTap(office){
      setSalesStatus(office.id, "電話した");
      if(!getVisitDate(office.id)) setVisitDate(office.id, todayStr());
      setCallTime(office.id, nowTimeStr());

      setTimeout(() => {
        renderListAndMap(currentRenderedData);
        updateSummary(currentRenderedData);
        setStatus(`${office.name} を「電話した」に更新しました。`);
      }, 300);
    }

    function renderListAndMap(data){
      currentRenderedData = [...data];
      listEl.innerHTML = "";
      clearMarkers();

      const linePoints = [];
      if(currentPosition){
        linePoints.push([currentPosition.lat, currentPosition.lng]);
      }

      data.forEach((office, index) => {
        const visited = getVisitState(office.id);
        const memo = getMemo(office.id);
        const salesStatus = getSalesStatus(office.id);
        const today = isTodayTarget(office.id);
        const visitDate = getVisitDate(office.id);
        const nextVisitDate = getNextVisitDate(office.id);
        const followDate = getFollowDate(office.id);
        const callTime = getCallTime(office.id);
        const followToday = isFollowToday(office.id);
        const overdue = isFollowOverdue(office.id);

        let cardClass = "card";
        if(visited) cardClass += " visited";
        if(today) cardClass += " today";
        if(followToday) cardClass += " follow-today";
        if(overdue) cardClass += " follow-overdue";

        const item = document.createElement("div");
        item.className = cardClass;

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
            ${office.address}<br>
            <a class="tel-link auto-call-link" href="tel:${office.phone.replace(/-/g, "")}">${office.phone}</a>
            ${callTime ? `<br>電話時刻: ${callTime}` : ""}
          </div>

          <div class="distance">${distanceText}</div>

          <div class="badge-row">
            <span class="badge">${office.ward}</span>
            <span class="badge">${office.type}</span>
            <span class="badge ${statusBadgeClass(salesStatus)}">${salesStatus}</span>
            ${today ? '<span class="badge today-badge">今日回る先</span>' : ""}
            ${visited ? '<span class="badge done-badge">訪問済み</span>' : ""}
            ${followToday ? '<span class="badge follow-badge">今日フォロー</span>' : ""}
            ${overdue ? '<span class="badge overdue-badge">期限超過</span>' : ""}
          </div>

          <div class="action-row">
            <label class="visit-check">
              <input type="checkbox" class="visit-toggle" ${visited ? "checked" : ""}>
              訪問済み
            </label>
            <label class="visit-check">
              <input type="checkbox" class="today-toggle" ${today ? "checked" : ""}>
              今日回る
            </label>
          </div>

          <div class="action-row">
            <button class="small-btn gray status-btn" data-status="電話した">電話した</button>
            <button class="small-btn orange status-btn" data-status="不在">不在</button>
            <button class="small-btn purple status-btn" data-status="再訪問">再訪問</button>
            <button class="small-btn green status-btn" data-status="見込みあり">見込みあり</button>
            <button class="small-btn teal status-btn" data-status="契約候補">契約候補</button>
            <button class="small-btn pink next-btn">次へ</button>
          </div>

          <div class="date-grid">
            <div class="date-box">
              <label>訪問日</label>
              <input type="date" class="visit-date-input" value="${visitDate}">
            </div>
            <div class="date-box">
              <label>次回訪問日</label>
              <input type="date" class="next-visit-date-input" value="${nextVisitDate}">
            </div>
            <div class="date-box">
              <label>フォロー予定日</label>
              <input type="date" class="follow-date-input" value="${followDate}">
            </div>
          </div>

          <a class="route-link" href="${googleMapsDirectionsUrl(office.address)}" target="_blank" rel="noopener noreferrer">
            徒歩ルートをGoogleマップで開く
          </a>

          <textarea class="memo-box" placeholder="営業メモを入力">${memo}</textarea>
        `;
        listEl.appendChild(item);

        const icon = L.divIcon({
          className: "custom-number-icon",
          html: `
            <div style="
              width:30px;height:30px;border-radius:999px;
              background:${markerColor(salesStatus, visited, today, followToday, overdue)};
              color:#fff;display:flex;align-items:center;justify-content:center;
              font-weight:700;border:2px solid #fff;
              box-shadow:0 2px 8px rgba(0,0,0,0.25);
            ">${index + 1}</div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker([office.lat, office.lng], { icon }).addTo(map);
        marker.bindPopup(`
          <b>${index + 1}. ${office.name}</b><br>
          ${office.ward}<br>
          ${office.type}<br>
          状態: ${salesStatus}<br>
          電話時刻: ${callTime || "未記録"}<br>
          訪問日: ${visitDate || "未設定"}<br>
          次回訪問日: ${nextVisitDate || "未設定"}<br>
          フォロー予定日: ${followDate || "未設定"}<br>
          ${office.address}<br>
          <a class="tel-link auto-call-link" href="tel:${office.phone.replace(/-/g, "")}">${office.phone}</a><br>
          <a href="${googleMapsDirectionsUrl(office.address)}" target="_blank" rel="noopener noreferrer">徒歩ルートを開く</a>
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
            e.target.classList.contains("status-btn") ||
            e.target.classList.contains("visit-date-input") ||
            e.target.classList.contains("next-visit-date-input") ||
            e.target.classList.contains("follow-date-input") ||
            e.target.classList.contains("auto-call-link")
          ) return;

          document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
          item.classList.add("active");
          map.setView([office.lat, office.lng], 16);
          marker.openPopup();

          setTimeout(() => {
            const popupLinks = document.querySelectorAll(".leaflet-popup-content .auto-call-link");
            popupLinks.forEach(link => {
              link.addEventListener("click", () => markCalledFromPhoneTap(office), { once: true });
            });
          }, 50);
        });

        item.querySelector(".visit-toggle").addEventListener("change", (e) => {
          const checked = e.target.checked;
          setVisitState(office.id, checked);
          if(checked && !getVisitDate(office.id)) setVisitDate(office.id, todayStr());
          renderListAndMap(currentRenderedData);
          updateSummary(currentRenderedData);

          if(checked){
            setStatus(`${office.name} を訪問済みにしました。`);
            jumpToNextUnvisited();
          }else{
            setStatus(`${office.name} の訪問済みを解除しました。`);
          }
        });

        item.querySelector(".today-toggle").addEventListener("change", (e) => {
          const checked = e.target.checked;
          setTodayTarget(office.id, checked);
          renderListAndMap(currentRenderedData);
          updateSummary(currentRenderedData);
          setStatus(`${office.name} を${checked ? "今日回る先" : "今日回る先から解除"}にしました。`);
        });

        item.querySelectorAll(".status-btn").forEach(btn => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const status = btn.dataset.status;
            setSalesStatus(office.id, status);
            renderListAndMap(currentRenderedData);
            updateSummary(currentRenderedData);
            setStatus(`${office.name} を「${status}」に更新しました。`);
          });
        });

        item.querySelector(".visit-date-input").addEventListener("change", (e) => {
          setVisitDate(office.id, e.target.value);
          renderListAndMap(currentRenderedData);
          updateSummary(currentRenderedData);
          setStatus(`${office.name} の訪問日を保存しました。`);
        });

        item.querySelector(".next-visit-date-input").addEventListener("change", (e) => {
          setNextVisitDate(office.id, e.target.value);
          renderListAndMap(currentRenderedData);
          updateSummary(currentRenderedData);
          setStatus(`${office.name} の次回訪問日を保存しました。`);
        });

        item.querySelector(".follow-date-input").addEventListener("change", (e) => {
          setFollowDate(office.id, e.target.value);
          renderListAndMap(currentRenderedData);
          updateSummary(currentRenderedData);
          setStatus(`${office.name} のフォロー予定日を保存しました。`);
        });

        item.querySelector(".memo-box").addEventListener("input", (e) => {
          setMemo(office.id, e.target.value);
        });

        item.querySelector(".next-btn").addEventListener("click", (e) => {
          e.stopPropagation();
          jumpToNextUnvisited(index + 1);
        });

        item.querySelectorAll(".auto-call-link").forEach(link => {
          link.addEventListener("click", () => {
            markCalledFromPhoneTap(office);
          });
        });
      });

      if(linePoints.length >= 2){
        routeLine = L.polyline(linePoints, {
          weight: 4,
          opacity: 0.7
        }).addTo(map);
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

    function sortFollowPriority(){
      const sorted = [...getFilteredData()].sort((a, b) => {
        const diff = followPriorityScore(b) - followPriorityScore(a);
        if(diff !== 0) return diff;
        return a.name.localeCompare(b.name, "ja");
      });
      renderListAndMap(sorted);
      setStatus("フォロー優先順に並べ替えました。");
    }

    function resetFilters(){
      wardFilter.value = "all";
      typeFilter.value = "all";
      salesStatusFilter.value = "all";
      todayFilter.value = "all";
      followFilter.value = "all";
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
          currentPosition = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };

          if(userMarker) map.removeLayer(userMarker);
          if(searchMarker){
            map.removeLayer(searchMarker);
            searchMarker = null;
          }

          userMarker = L.marker([currentPosition.lat, currentPosition.lng]).addTo(map)
            .bindPopup("現在地")
            .openPopup();

          map.setView([currentPosition.lat, currentPosition.lng], 15);

          const address = await reverseGeocode(currentPosition.lat, currentPosition.lng);
          setStatus(address ? `現在地を取得しました。<br>${address}` : "現在地を取得しました。");
        },
        () => {
          setStatus("現在地を取得できませんでした。位置情報の許可をご確認ください。");
          alert("現在地を取得できませんでした。");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
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
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=ja&q=${encodeURIComponent(query + " 大阪")}`;
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

      setStatus(`「${query}」を検索しています…`);

      const result = await geocodePlace(query);
      if(!result){
        setStatus(`「${query}」は見つかりませんでした。`);
        alert("場所が見つかりませんでした。");
        return;
      }

      currentPosition = {
        lat: result.lat,
        lng: result.lng
      };

      if(searchMarker) map.removeLayer(searchMarker);
      if(userMarker){
        map.removeLayer(userMarker);
        userMarker = null;
      }

      searchMarker = L.marker([result.lat, result.lng]).addTo(map)
        .bindPopup(`検索地点<br>${result.name}`)
        .openPopup();

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
        alert("先に現在地を取得するか、場所検索をしてください。");
        return;
      }

      const ordered = nearestNeighborSort(
        currentPosition,
        filtered.map(x => ({ ...x, distanceFromPrev:null, distanceFromStart:null }))
      );

      renderListAndMap(ordered);
      setStatus("現在地を起点に、徒歩営業しやすい順へ並べ替えました。");
    }

    function sortTodayByWalkingOrder(){
      const todayItems = getFilteredData().filter(o => isTodayTarget(o.id));
      if(todayItems.length === 0){
        alert("今日回る先がありません。");
        return;
      }
      if(!currentPosition){
        alert("先に現在地を取得するか、場所検索をしてください。");
        return;
      }

      const ordered = nearestNeighborSort(
        currentPosition,
        todayItems.map(x => ({ ...x, distanceFromPrev:null, distanceFromStart:null }))
      );

      renderListAndMap(ordered);
      setStatus("今日回る先だけを徒歩順に並べ替えました。");
    }

    function jumpToNextUnvisited(startIndex = 0){
      const data = currentRenderedData;
      if(data.length === 0) return;

      let nextIndex = -1;

      for(let i = startIndex; i < data.length; i++){
        if(!getVisitState(data[i].id)){
          nextIndex = i;
          break;
        }
      }

      if(nextIndex === -1){
        for(let i = 0; i < startIndex; i++){
          if(!getVisitState(data[i].id)){
            nextIndex = i;
            break;
          }
        }
      }

      if(nextIndex === -1){
        setStatus("すべて訪問済みです。お疲れさまでした。");
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
      const todayItems = offices.filter(o => isTodayTarget(o.id));
      const todayVisited = todayItems.filter(o => getVisitState(o.id));
      const called = todayItems.filter(o => getSalesStatus(o.id) === "電話した");
      const absent = todayItems.filter(o => getSalesStatus(o.id) === "不在");
      const revisit = todayItems.filter(o => getSalesStatus(o.id) === "再訪問");
      const hot = todayItems.filter(o => getSalesStatus(o.id) === "見込みあり");
      const contract = todayItems.filter(o => getSalesStatus(o.id) === "契約候補");
      const followToday = offices.filter(o => isFollowToday(o.id));
      const overdue = offices.filter(o => isFollowOverdue(o.id));

      const today = new Date();
      const dateText = `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日`;

      let report = "";
      report += `【営業日報】\n`;
      report += `日付：${dateText}\n\n`;
      report += `■本日の予定件数\n${todayItems.length}件\n\n`;
      report += `■本日の訪問済み件数\n${todayVisited.length}件\n\n`;
      report += `■営業状況集計\n`;
      report += `電話した：${called.length}件\n`;
      report += `不在：${absent.length}件\n`;
      report += `再訪問：${revisit.length}件\n`;
      report += `見込みあり：${hot.length}件\n`;
      report += `契約候補：${contract.length}件\n\n`;

      report += `■本日フォロー予定\n${followToday.length}件\n`;
      report += `■期限超過フォロー\n${overdue.length}件\n\n`;

      report += `■本日の訪問先詳細\n`;
      if(todayItems.length === 0){
        report += `本日の予定登録はありません。\n`;
      } else {
        todayItems.forEach((office, idx) => {
          const memo = getMemo(office.id).trim();
          report += `${idx + 1}. ${office.name}\n`;
          report += `区：${office.ward}\n`;
          report += `種別：${office.type}\n`;
          report += `状態：${getSalesStatus(office.id)}\n`;
          report += `電話時刻：${getCallTime(office.id) || "未記録"}\n`;
          report += `訪問済み：${getVisitState(office.id) ? "はい" : "いいえ"}\n`;
          report += `訪問日：${getVisitDate(office.id) || "未設定"}\n`;
          report += `次回訪問日：${getNextVisitDate(office.id) || "未設定"}\n`;
          report += `フォロー予定日：${getFollowDate(office.id) || "未設定"}\n`;
          report += `電話：${office.phone}\n`;
          report += `住所：${office.address}\n`;
          report += `メモ：${memo ? memo : "なし"}\n\n`;
        });
      }

      report += `■期限超過フォロー先\n`;
      if(overdue.length === 0){
        report += `なし\n\n`;
      } else {
        overdue.forEach((office, idx) => {
          report += `${idx + 1}. ${office.name} / フォロー予定日: ${getFollowDate(office.id)}\n`;
        });
        report += `\n`;
      }

      report += `■総括\n`;
      if(contract.length > 0){
        report += `契約候補が出ています。優先フォロー推奨です。\n`;
      }else if(hot.length > 0){
        report += `見込み先があるため、早めの再接触が有効です。\n`;
      }else if(overdue.length > 0){
        report += `期限超過のフォロー先があります。優先対応が必要です。\n`;
      }else if(revisit.length > 0 || absent.length > 0){
        report += `再訪問・不在先の再アプローチが必要です。\n`;
      }else{
        report += `本日の対応内容をもとに次回アクション設定をお願いします。\n`;
      }

      dailyReportEl.value = report;
      setStatus("本日の営業日報を作成しました。");
    }

    async function copyDailyReport(){
      const text = dailyReportEl.value.trim();
      if(!text){
        alert("先に日報を作成してください。");
        return;
      }

      try{
        await navigator.clipboard.writeText(text);
        setStatus("営業日報をコピーしました。");
        alert("日報をコピーしました。");
      }catch(e){
        dailyReportEl.select();
        document.execCommand("copy");
        setStatus("営業日報をコピーしました。");
        alert("日報をコピーしました。");
      }
    }

    function exportSalesData(){
      const rows = [[
        "順番","事業所名","区","種別","電話","住所","今日回る","訪問済み","営業状態",
        "電話時刻","訪問日","次回訪問日","フォロー予定日","メモ"
      ]];

      currentRenderedData.forEach((office, index) => {
        rows.push([
          index + 1,
          office.name,
          office.ward,
          office.type,
          office.phone,
          office.address,
          isTodayTarget(office.id) ? "はい" : "いいえ",
          getVisitState(office.id) ? "はい" : "いいえ",
          getSalesStatus(office.id),
          getCallTime(office.id),
          getVisitDate(office.id),
          getNextVisitDate(office.id),
          getFollowDate(office.id),
          getMemo(office.id).replace(/\n/g, " ")
        ]);
      });

      const csv = rows.map(row =>
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ).join("\n");

      const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "eigyo_app_complete.csv";
      link.click();
      URL.revokeObjectURL(url);

      setStatus("営業データをCSVで出力しました。");
    }

    function clearVisitData(){
      if(!confirm("訪問記録、営業状態、今日予定、日付、電話時刻、メモをすべて消しますか？")) return;

      offices.forEach(office => {
        localStorage.removeItem("visit_" + office.id);
        localStorage.removeItem("memo_" + office.id);
        localStorage.removeItem("sales_status_" + office.id);
        localStorage.removeItem("today_target_" + office.id);
        localStorage.removeItem("visit_date_" + office.id);
        localStorage.removeItem("next_visit_date_" + office.id);
        localStorage.removeItem("follow_date_" + office.id);
        localStorage.removeItem("call_time_" + office.id);
      });

      dailyReportEl.value = "";
      renderListAndMap(currentRenderedData);
      setStatus("営業記録をすべて消去しました。");
    }

    renderListAndMap(offices);

    setTimeout(() => {
      map.invalidateSize();
      fitVisibleMarkers();
    }, 400);
  </script>
</body>
</html>
