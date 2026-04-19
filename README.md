<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>営業アプリ｜徒歩営業順</title>
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  />
  <style>
    *{ box-sizing:border-box; }

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
      max-width:1300px;
      margin:0 auto;
      padding:14px;
    }

    .filter-box{
      background:#fff;
      border-radius:16px;
      padding:12px;
      box-shadow:0 8px 22px rgba(0,0,0,0.08);
      margin-bottom:14px;
    }

    .filter-row{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
      align-items:center;
    }

    select, button, input{
      padding:12px;
      border-radius:12px;
      border:1px solid #d9e0ef;
      font-size:14px;
    }

    button{
      background:#2146d0;
      color:#fff;
      border:none;
      cursor:pointer;
    }

    button:hover{ opacity:0.92; }

    .grid{
      display:grid;
      grid-template-columns:390px 1fr;
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
      height:76vh;
      overflow:auto;
    }

    .card{
      padding:14px 16px;
      border-bottom:1px solid #eef1f7;
      cursor:pointer;
      transition:0.2s;
    }

    .card:hover{ background:#f5f8ff; }

    .card.active{
      background:#eaf0ff;
      border-left:5px solid #2146d0;
    }

    .topline{
      display:flex;
      justify-content:space-between;
      gap:10px;
      align-items:flex-start;
    }

    .order-badge{
      min-width:34px;
      height:34px;
      border-radius:999px;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#2146d0;
      color:#fff;
      font-weight:700;
      font-size:14px;
      flex-shrink:0;
    }

    .name{
      font-weight:700;
      margin-bottom:6px;
      line-height:1.5;
    }

    .meta{
      font-size:13px;
      color:#536076;
      line-height:1.65;
      margin-top:6px;
    }

    .distance{
      margin-top:8px;
      font-size:13px;
      color:#2146d0;
      font-weight:700;
    }

    .badge-row{
      margin-top:8px;
      display:flex;
      flex-wrap:wrap;
      gap:6px;
    }

    .badge{
      display:inline-block;
      padding:4px 8px;
      border-radius:999px;
      font-size:12px;
      background:#eef3ff;
      color:#2146d0;
    }

    #map{
      width:100%;
      height:76vh;
      min-height:500px;
      background:#d8dde8;
    }

    .footer-note{
      margin-top:12px;
      font-size:12px;
      color:#5b6472;
      line-height:1.7;
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

    @media (max-width: 980px){
      .grid{
        grid-template-columns:1fr;
      }
      .list{
        height:320px;
      }
      #map{
        height:58vh;
        min-height:380px;
      }
    }
  </style>
</head>
<body>
  <header>営業アプリ｜天王寺区・阿倍野区 徒歩営業順</header>

  <div class="wrap">
    <div class="filter-box">
      <div class="filter-row">
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

        <input id="keyword" type="text" placeholder="事業所名・住所で検索" />

        <button onclick="applyFilters()">絞り込み</button>
        <button onclick="resetFilters()">リセット</button>
        <button onclick="sortByWalkingOrder()">現在地から徒歩順に並べる</button>
        <button onclick="fitVisibleMarkers()">地図を全件表示</button>
      </div>
    </div>

    <div class="grid">
      <div class="panel">
        <div class="panel-title">営業先リスト（徒歩営業順）</div>
        <div id="list" class="list"></div>
      </div>

      <div class="panel">
        <div class="panel-title">地図</div>
        <div id="map"></div>
      </div>
    </div>

    <div class="footer-note">
      「現在地から徒歩順に並べる」を押すと、現在地から近い順に訪問しやすい並びへ変更します。<br>
      カードを押すと地図移動、電話番号タップで発信、Googleマップ導線も使えます。
    </div>
  </div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const offices = [
      {
        name: "天王寺区地域包括支援センター",
        ward: "天王寺区",
        type: "地域包括支援センター",
        address: "大阪市天王寺区六万体町5-26",
        phone: "06-6774-3386",
        lat: 34.6589,
        lng: 135.5166
      },
      {
        name: "阿倍野区北部地域包括支援センター",
        ward: "阿倍野区",
        type: "地域包括支援センター",
        address: "大阪市阿倍野区阿倍野筋3-10-1 あべのベルタ106",
        phone: "06-6760-4018",
        lat: 34.6456,
        lng: 135.5109
      },
      {
        name: "阿倍野区中部地域包括支援センター",
        ward: "阿倍野区",
        type: "地域包括支援センター",
        address: "大阪市阿倍野区阪南町1-57-2 オルセ阿倍野1階",
        phone: "06-6629-8686",
        lat: 34.6356,
        lng: 135.5159
      },
      {
        name: "阿倍野区地域包括支援センター",
        ward: "阿倍野区",
        type: "地域包括支援センター",
        address: "大阪市阿倍野区帝塚山1-3-8",
        phone: "06-6628-1400",
        lat: 34.6258,
        lng: 135.5015
      },
      {
        name: "うえろくケアプランセンター",
        ward: "天王寺区",
        type: "居宅介護支援事業所",
        address: "大阪市天王寺区上本町8丁目4-11 KIMURAビル3F",
        phone: "06-6772-6223",
        lat: 34.6624,
        lng: 135.5208
      },
      {
        name: "四天王寺ケアプランセンター",
        ward: "天王寺区",
        type: "居宅介護支援事業所",
        address: "大阪市天王寺区玉造元町1-29",
        phone: "06-6763-4115",
        lat: 34.6735,
        lng: 135.5310
      },
      {
        name: "夕陽ヶ丘ケアサービス居宅介護支援事業所",
        ward: "天王寺区",
        type: "居宅介護支援事業所",
        address: "大阪市天王寺区勝山2丁目8-23",
        phone: "06-6771-3015",
        lat: 34.6538,
        lng: 135.5278
      },
      {
        name: "介護支援センターなかよし天王寺",
        ward: "天王寺区",
        type: "居宅介護支援事業所",
        address: "大阪市天王寺区烏ヶ辻1-8-9 烏ヶ辻コーポ103",
        phone: "06-4302-5500",
        lat: 34.6555,
        lng: 135.5308
      },
      {
        name: "居宅介護支援事業所ケアリーチ",
        ward: "天王寺区",
        type: "居宅介護支援事業所",
        address: "大阪市天王寺区上汐3丁目2-16 アリビオ上本町604号室",
        phone: "06-6777-9433",
        lat: 34.6621,
        lng: 135.5180
      },
      {
        name: "ケア21阿倍野",
        ward: "阿倍野区",
        type: "居宅介護支援事業所",
        address: "大阪市阿倍野区昭和町1-8-26 パレロイヤルビル201号",
        phone: "06-6626-2055",
        lat: 34.6377,
        lng: 135.5184
      },
      {
        name: "阿倍野区医師会ケアセンター",
        ward: "阿倍野区",
        type: "居宅介護支援事業所",
        address: "大阪市阿倍野区阿倍野筋5-8-26 大阪市阿倍野区医師会館3F",
        phone: "06-6624-1665",
        lat: 34.6387,
        lng: 135.5068
      },
      {
        name: "居宅介護支援事業所 るぅぷけぁ",
        ward: "阿倍野区",
        type: "居宅介護支援事業所",
        address: "大阪市阿倍野区阪南町2-1-11",
        phone: "06-6654-3012",
        lat: 34.6339,
        lng: 135.5161
      },
      {
        name: "介護支援センターはなみずき",
        ward: "阿倍野区",
        type: "居宅介護支援事業所",
        address: "大阪市阿倍野区王子町3丁目8-4",
        phone: "06-6654-3277",
        lat: 34.6276,
        lng: 135.5038
      },
      {
        name: "居宅支援倶楽部",
        ward: "阿倍野区",
        type: "居宅介護支援事業所",
        address: "大阪市阿倍野区松虫通3-1-18 パインヒルズ105",
        phone: "06-6615-9160",
        lat: 34.6309,
        lng: 135.5060
      }
    ];

    const map = L.map("map").setView([34.646, 135.519], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const listEl = document.getElementById("list");
    const wardFilter = document.getElementById("wardFilter");
    const typeFilter = document.getElementById("typeFilter");
    const keywordInput = document.getElementById("keyword");

    let markers = [];
    let visibleMarkers = [];
    let currentData = [...offices];
    let currentPosition = null;
    let userMarker = null;
    let routeLine = null;

    function googleMapsUrl(address){
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
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
      return Math.round((km / 4.5) * 60);
    }

    function formatDistance(km){
      if(km < 1){
        return `${Math.round(km * 1000)}m`;
      }
      return `${km.toFixed(2)}km`;
    }

    function getFilteredData(){
      const ward = wardFilter.value;
      const type = typeFilter.value;
      const keyword = keywordInput.value.trim().toLowerCase();

      return offices.filter(office => {
        const wardOk = ward === "all" || office.ward === ward;
        const typeOk = type === "all" || office.type === type;
        const keywordOk = keyword === "" ||
          office.name.toLowerCase().includes(keyword) ||
          office.address.toLowerCase().includes(keyword);
        return wardOk && typeOk && keywordOk;
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

    function renderListAndMap(data){
      currentData = [...data];
      listEl.innerHTML = "";
      clearMarkers();

      const linePoints = [];
      if(currentPosition){
        linePoints.push([currentPosition.lat, currentPosition.lng]);
      }

      data.forEach((office, index) => {
        const item = document.createElement("div");
        item.className = "card";

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
            <a class="tel-link" href="tel:${office.phone.replace(/-/g, "")}">${office.phone}</a>
          </div>

          <div class="distance">${distanceText}</div>

          <div class="badge-row">
            <span class="badge">${office.ward}</span>
            <span class="badge">${office.type}</span>
          </div>

          <a class="route-link" href="${googleMapsDirectionsUrl(office.address)}" target="_blank" rel="noopener noreferrer">
            徒歩ルートをGoogleマップで開く
          </a>
        `;
        listEl.appendChild(item);

        const icon = L.divIcon({
          className: "custom-number-icon",
          html: `
            <div style="
              width:30px;
              height:30px;
              border-radius:999px;
              background:#2146d0;
              color:#fff;
              display:flex;
              align-items:center;
              justify-content:center;
              font-weight:700;
              border:2px solid #fff;
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
          ${office.address}<br>
          <a href="tel:${office.phone.replace(/-/g, "")}">${office.phone}</a><br>
          <a href="${googleMapsDirectionsUrl(office.address)}" target="_blank" rel="noopener noreferrer">徒歩ルートを開く</a>
        `);

        markers.push(marker);
        visibleMarkers.push(marker);
        linePoints.push([office.lat, office.lng]);

        item.addEventListener("click", () => {
          document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
          item.classList.add("active");
          map.setView([office.lat, office.lng], 16);
          marker.openPopup();
        });
      });

      if(linePoints.length >= 2){
        routeLine = L.polyline(linePoints, {
          weight: 4,
          opacity: 0.7
        }).addTo(map);
      }

      fitVisibleMarkers();
    }

    function fitVisibleMarkers(){
      const layers = [];
      if(userMarker) layers.push(userMarker);
      layers.push(...visibleMarkers);
      if(layers.length === 0) return;
      const group = L.featureGroup(layers);
      map.fitBounds(group.getBounds().pad(0.2));
    }

    function applyFilters(){
      renderListAndMap(getFilteredData());
    }

    function resetFilters(){
      wardFilter.value = "all";
      typeFilter.value = "all";
      keywordInput.value = "";
      renderListAndMap(offices);
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
        if(ordered.length === 0){
          next.distanceFromStart = bestDistance;
        }
        ordered.push(next);
        current = { lat: next.lat, lng: next.lng };
      }

      return ordered;
    }

    function sortByWalkingOrder(){
      const filtered = getFilteredData();

      if(filtered.length === 0){
        alert("該当する営業先がありません。");
        return;
      }

      if(!navigator.geolocation){
        alert("この端末では現在地取得に対応していません。");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          currentPosition = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };

          if(userMarker){
            map.removeLayer(userMarker);
          }

          userMarker = L.marker([currentPosition.lat, currentPosition.lng]).addTo(map)
            .bindPopup("現在地");

          const ordered = nearestNeighborSort(currentPosition, filtered.map(x => ({...x})));
          renderListAndMap(ordered);
        },
        () => {
          alert("現在地を取得できませんでした。位置情報を許可してもう一度お試しください。");
        }
      );
    }

    renderListAndMap(offices);

    setTimeout(() => {
      map.invalidateSize();
      fitVisibleMarkers();
    }, 400);
  </script>
</body>
</html>
