
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>営業アプリ｜大阪市全区 完全版</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
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
      max-width:1640px;
      margin:0 auto;
      padding:14px;
    }

    .box,.panel{
      background:#fff;
      border-radius:16px;
      box-shadow:0 8px 22px rgba(0,0,0,0.08);
      margin-bottom:14px;
    }

    .box{ padding:12px; }
    .panel{ overflow:hidden; }

    .panel-title{
      padding:14px 16px;
      font-weight:700;
      border-bottom:1px solid #eef1f7;
      background:#fafcff;
    }

    .notice{
      background:#fff8e8;
      border:1px solid #f3d38f;
      color:#6c4d00;
      border-radius:12px;
      padding:12px;
      line-height:1.8;
      font-size:13px;
    }

    .row{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
      align-items:center;
    }

    select,input,button,textarea{
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

    .green-btn{ background:#16a34a; }
    .orange-btn{ background:#f97316; }
    .red-btn{ background:#c51616; }
    .gray-btn{ background:#7d8aa5; }

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

    .layout{
      display:grid;
      grid-template-columns:540px 1fr;
      gap:14px;
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

    .source{
      margin-top:8px;
      font-size:12px;
      line-height:1.6;
      color:#5f6b7d;
      background:#f8fbff;
      border:1px solid #e6eefc;
      border-radius:10px;
      padding:8px 10px;
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

    .badge.called{ background:#e8f0ff; color:#1f5ed8; }
    .badge.absent{ background:#fff3e8; color:#c46b00; }
    .badge.revisit{ background:#f6ebff; color:#7a34c2; }
    .badge.hot{ background:#e9f9ef; color:#138548; }
    .badge.contract{ background:#eaf7ff; color:#0070a8; }
    .badge.done{ background:#e8f6e8; color:#208340; }
    .badge.todaybadge{ background:#f4eaff; color:#7a34c2; }

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
      color:#fff;
      text-decoration:none;
      display:inline-block;
    }

    .small-btn.green{ background:#16a34a; }
    .small-btn.orange{ background:#f97316; }
    .small-btn.gray{ background:#7d8aa5; }
    .small-btn.purple{ background:#8b5cf6; }
    .small-btn.teal{ background:#0f9fb8; }

    .visit-check{
      display:flex;
      align-items:center;
      gap:6px;
      font-size:13px;
      font-weight:700;
      color:#2c4b85;
    }

    .memo-box{
      width:100%;
      min-height:72px;
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

    .subgrid{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:14px;
    }

    .big-text{
      width:100%;
      min-height:220px;
      resize:vertical;
      font-size:13px;
      line-height:1.6;
    }

    .code-box{
      margin-top:10px;
      background:#f8fbff;
      border:1px solid #dbe7fb;
      border-radius:12px;
      padding:12px;
      font-size:12px;
      line-height:1.7;
      white-space:pre-wrap;
      word-break:break-word;
    }

    a.tel-link{
      color:#2146d0;
      text-decoration:none;
      font-weight:700;
    }

    .footer{
      font-size:12px;
      color:#5f6b7d;
      line-height:1.8;
    }

    @media (max-width: 1100px){
      .layout{ grid-template-columns:1fr; }
      .list{ height:420px; }
      #map{ height:58vh; min-height:380px; }
      .subgrid{ grid-template-columns:1fr; }
    }
  </style>
</head>
<body>
  <header>営業アプリ｜大阪市全区 完全版</header>

  <div class="wrap">
    <div class="box">
      <div class="notice">
        このアプリは<strong>公開されている事業所情報</strong>の表示を前提にしています。<br>
        <strong>利用者氏名、家族情報、病歴、私用携帯、個人メールアドレス</strong>は入力しないでください。<br>
        メモは<strong>端末内保存のみ</strong>です。公開情報ベースの営業メモだけにしてください。
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

        <input id="keyword" type="text" placeholder="区名・駅名・事業所名・住所・電話で検索" />
        <input id="placeSearch" type="text" placeholder="梅田駅・本町駅・天王寺駅などを検索" />

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
        <div class="panel-title" style="margin:-12px -12px 12px -12px; border-radius:16px 16px 0 0;">居宅をCSVで追加</div>
        <div class="footer">
          CSV列順：<strong>区名,種別,事業所名,住所,電話,緯度,経度,出典,確認日,検索補助語</strong><br>
          追加するのは<strong>公開事業所情報のみ</strong>にしてください。<br>
          検索補助語には駅名などを入れられます。例：<strong>本町駅 堺筋本町 中央区</strong>
        </div>
        <textarea id="csvInput" class="big-text" placeholder="例:
中央区,居宅介護支援事業所,サンプル中央ケア,大阪市中央区南本町1-1-1,06-0000-1111,34.680,135.509,介護保険事業所台帳情報,2026-03,本町駅 堺筋本町 中央区"></textarea>
        <div class="row" style="margin-top:10px;">
          <button class="green-btn" onclick="importCSV()">CSV追加</button>
          <button class="orange-btn" onclick="loadCSVExample()">例を入れる</button>
        </div>
      </div>

      <div class="box">
        <div class="panel-title" style="margin:-12px -12px 12px -12px; border-radius:16px 16px 0 0;">本日の営業日報</div>
        <textarea id="dailyReport" class="big-text" placeholder="日報作成を押すとここに入ります。"></textarea>
      </div>
    </div>

    <div class="box">
      <div class="panel-title" style="margin:-12px -12px 12px -12px; border-radius:16px 16px 0 0;">1件ずつ追加</div>
      <div class="row">
        <input id="newWard" placeholder="区名">
        <select id="newType">
          <option value="地域包括支援センター">地域包括支援センター</option>
          <option value="総合相談窓口（ブランチ）">総合相談窓口（ブランチ）</option>
          <option value="居宅介護支援事業所">居宅介護支援事業所</option>
        </select>
        <input id="newName" placeholder="事業所名">
        <input id="newPhone" placeholder="電話番号">
        <input id="newAddress" placeholder="住所">
        <input id="newLat" placeholder="緯度">
        <input id="newLng" placeholder="経度">
        <input id="newSource" placeholder="出典">
        <input id="newChecked" placeholder="確認日">
        <input id="newKeywords" placeholder="検索補助語 例: 本町駅 堺筋本町 中央区">
        <button class="green-btn" onclick="addOfficeFromForm()">追加</button>
      </div>
      <div id="addSnippet" class="code-box">必要ならここに追加用コードを表示します。</div>
    </div>
  </div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const OFFICES = [
      { id:"kita", ward:"北区", type:"地域包括支援センター", name:"北区地域包括支援センター", address:"大阪市北区神山町15-11", phone:"06-6313-5568", lat:34.7054, lng:135.5069, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"北区 扇町駅 中崎町駅 梅田 天満" },
      { id:"kita-oyodo", ward:"北区", type:"地域包括支援センター", name:"北区大淀地域包括支援センター", address:"大阪市北区長柄中1-1-21", phone:"06-6354-1165", lat:34.7118, lng:135.5122, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"北区 天神橋筋六丁目駅 天六 中津駅" },
      { id:"branch-kita-umeda", ward:"北区", type:"総合相談窓口（ブランチ）", name:"梅田東ブランチ", address:"大阪市北区芝田2-10-39", phone:"06-6372-0804", lat:34.7079, lng:135.4946, source:"大阪市 総合相談窓口（ブランチ）一覧", checked:"2026-04-22", keywords:"北区 梅田駅 大阪駅 中津駅" },
      { id:"branch-kita-toyosaki", ward:"北区", type:"総合相談窓口（ブランチ）", name:"豊崎ブランチ", address:"大阪市北区本庄西2-6-15", phone:"06-6371-6233", lat:34.7141, lng:135.4994, source:"大阪市 総合相談窓口（ブランチ）一覧", checked:"2026-04-22", keywords:"北区 中津駅 天神橋筋六丁目駅 天六" },

      { id:"miyakojima", ward:"都島区", type:"地域包括支援センター", name:"都島区地域包括支援センター", address:"大阪市都島区都島本通3-12-31", phone:"06-6929-9500", lat:34.7046, lng:135.5288, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"都島区 都島駅 野江内代駅" },
      { id:"miyakojima-hokubu", ward:"都島区", type:"地域包括支援センター", name:"都島区北部地域包括支援センター", address:"大阪市都島区大東町2-2-18", phone:"06-6926-3800", lat:34.7227, lng:135.5305, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"都島区 城北公園通駅" },
      { id:"branch-miyakojima-nakano", ward:"都島区", type:"総合相談窓口（ブランチ）", name:"中野ブランチ", address:"大阪市都島区中野町5-10-70", phone:"06-6922-3550", lat:34.7029, lng:135.5273, source:"大阪市 総合相談窓口（ブランチ）一覧", checked:"2026-04-22", keywords:"都島区 桜ノ宮駅 都島駅" },
      { id:"branch-miyakojima-takakura", ward:"都島区", type:"総合相談窓口（ブランチ）", name:"高倉ブランチ", address:"大阪市都島区御幸町2-10-12", phone:"06-6929-8886", lat:34.7158, lng:135.5330, source:"大阪市 総合相談窓口（ブランチ）一覧", checked:"2026-04-22", keywords:"都島区 野江内代駅" },
      { id:"branch-miyakojima-yodogawa", ward:"都島区", type:"総合相談窓口（ブランチ）", name:"淀川ブランチ", address:"大阪市都島区毛馬町5-5-23", phone:"06-6929-8801", lat:34.7230, lng:135.5207, source:"大阪市 総合相談窓口（ブランチ）一覧", checked:"2026-04-22", keywords:"都島区 城北公園通駅" },

      { id:"fukushima", ward:"福島区", type:"地域包括支援センター", name:"福島区地域包括支援センター", address:"大阪市福島区海老江6-2-22", phone:"06-6454-6330", lat:34.6950, lng:135.4683, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"福島区 海老江駅 野田阪神駅 野田駅" },
      { id:"branch-fukushima-shimofukushima", ward:"福島区", type:"総合相談窓口（ブランチ）", name:"下福島ブランチ", address:"大阪市福島区福島4-6-24", phone:"06-4798-0270", lat:34.6934, lng:135.4807, source:"大阪市 総合相談窓口（ブランチ）一覧", checked:"2026-04-22", keywords:"福島区 新福島駅 中之島駅 福島駅" },
      { id:"branch-fukushima-noda", ward:"福島区", type:"総合相談窓口（ブランチ）", name:"野田ブランチ", address:"大阪市福島区吉野5-6-11", phone:"06-6464-0105", lat:34.6846, lng:135.4704, source:"大阪市 総合相談窓口（ブランチ）一覧", checked:"2026-04-22", keywords:"福島区 野田駅 西九条駅 玉川駅" },

      { id:"konohana", ward:"此花区", type:"地域包括支援センター", name:"此花区地域包括支援センター", address:"大阪市此花区伝法3-2-27", phone:"06-6462-1225", lat:34.6828, lng:135.4485, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"此花区 伝法駅 千鳥橋駅" },
      { id:"konohana-nanseibu", ward:"此花区", type:"地域包括支援センター", name:"此花区南西部地域包括支援センター", address:"大阪市此花区春日出中1-22-13", phone:"06-6462-9301", lat:34.6647, lng:135.4542, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"此花区 安治川口駅 春日出" },
      { id:"branch-konohana-kasugade", ward:"此花区", type:"総合相談窓口（ブランチ）", name:"春日出ブランチ", address:"大阪市此花区西九条1-1-2", phone:"06-6467-2933", lat:34.6782, lng:135.4659, source:"大阪市 総合相談窓口（ブランチ）一覧", checked:"2026-04-22", keywords:"此花区 西九条駅 千鳥橋駅" },

      { id:"chuo", ward:"中央区", type:"地域包括支援センター", name:"中央区地域包括支援センター", address:"大阪市中央区上本町西2-5-25", phone:"06-6763-8139", lat:34.6730, lng:135.5203, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"中央区 谷町六丁目 谷町六丁目駅 谷六 上本町 松屋町" },
      { id:"chuo-hokubu", ward:"中央区", type:"地域包括支援センター", name:"中央区北部地域包括支援センター", address:"大阪市中央区農人橋3-1-3 ドミール堺筋本町1階", phone:"06-6944-2116", lat:34.6809, lng:135.5125, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"中央区 本町 本町駅 堺筋本町 堺筋本町駅 谷町四丁目 谷町四丁目駅" },

      { id:"nishi", ward:"西区", type:"地域包括支援センター", name:"西区地域包括支援センター", address:"大阪市西区新町4-5-14", phone:"06-6539-8075", lat:34.6767, lng:135.4893, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"西区 西長堀駅 阿波座駅 西大橋駅" },
      { id:"branch-nishi-hananoi", ward:"西区", type:"総合相談窓口（ブランチ）", name:"花乃井ブランチ", address:"大阪市西区江之子島1-8-44", phone:"06-6225-2662", lat:34.6818, lng:135.4851, source:"大阪市 総合相談窓口（ブランチ）一覧", checked:"2026-04-22", keywords:"西区 阿波座駅 中之島駅" },

      { id:"minato", ward:"港区", type:"地域包括支援センター", name:"港区地域包括支援センター", address:"大阪市港区弁天2-15-1", phone:"06-6575-1212", lat:34.6698, lng:135.4617, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"港区 弁天町駅" },
      { id:"minato-nanbu", ward:"港区", type:"地域包括支援センター", name:"港区南部地域包括支援センター", address:"大阪市港区池島1-1-18", phone:"06-6536-8162", lat:34.6548, lng:135.4507, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"港区 朝潮橋駅" },
      { id:"branch-minato-konan", ward:"港区", type:"総合相談窓口（ブランチ）", name:"港南ブランチ", address:"大阪市港区市岡1-5-30", phone:"06-4395-8888", lat:34.6640, lng:135.4594, source:"大阪市 総合相談窓口（ブランチ）一覧", checked:"2026-04-22", keywords:"港区 弁天町駅" },

      { id:"taisho", ward:"大正区", type:"地域包括支援センター", name:"大正区地域包括支援センター", address:"大阪市大正区小林西1-14-3", phone:"06-6555-0693", lat:34.6495, lng:135.4728, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"大正区 大正駅 小林" },
      { id:"taisho-hokubu", ward:"大正区", type:"地域包括支援センター", name:"大正区北部地域包括支援センター", address:"大阪市大正区北村3-5-10", phone:"06-6552-4440", lat:34.6557, lng:135.4694, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"大正区 大正駅 北村" },

      { id:"tennoji", ward:"天王寺区", type:"地域包括支援センター", name:"天王寺区地域包括支援センター", address:"大阪市天王寺区六万体町5-26", phone:"06-6774-3386", lat:34.6589, lng:135.5166, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"天王寺区 四天王寺前夕陽ヶ丘駅 谷町九丁目駅" },
      { id:"branch-tennoji-yuhigaoka", ward:"天王寺区", type:"総合相談窓口（ブランチ）", name:"夕陽丘ブランチ", address:"大阪市天王寺区北山町9-6", phone:"06-6773-1811", lat:34.6536, lng:135.5221, source:"大阪市 総合相談窓口（ブランチ）一覧", checked:"2026-04-22", keywords:"天王寺区 桃谷駅 四天王寺前夕陽ヶ丘駅" },

      { id:"naniwa", ward:"浪速区", type:"地域包括支援センター", name:"浪速区地域包括支援センター", address:"大阪市浪速区難波中3-8-8", phone:"06-6636-6029", lat:34.6614, lng:135.4964, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"浪速区 難波駅 なんば駅 大国町駅" },
      { id:"branch-naniwa-nihonbashi", ward:"浪速区", type:"総合相談窓口（ブランチ）", name:"日本橋ブランチ", address:"大阪市浪速区恵美須東2-1-4", phone:"06-6632-2340", lat:34.6532, lng:135.5065, source:"大阪市 総合相談窓口（ブランチ）一覧", checked:"2026-04-22", keywords:"浪速区 恵美須町駅 日本橋駅 新今宮駅" },

      { id:"nishiyodogawa", ward:"西淀川区", type:"地域包括支援センター", name:"西淀川区地域包括支援センター", address:"大阪市西淀川区千舟2-7-7", phone:"06-6478-2943", lat:34.7117, lng:135.4554, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"西淀川区 御幣島駅" },
      { id:"nishiyodogawa-nanseibu", ward:"西淀川区", type:"地域包括支援センター", name:"西淀川区南西部地域包括支援センター", address:"大阪市西淀川区福町2-4-16", phone:"06-6476-3550", lat:34.6922, lng:135.4312, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"西淀川区 福駅" },

      { id:"yodogawa", ward:"淀川区", type:"地域包括支援センター", name:"淀川区地域包括支援センター", address:"大阪市淀川区三国本町2-14-3", phone:"06-6394-2914", lat:34.7360, lng:135.4868, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"淀川区 三国駅 新大阪駅" },
      { id:"yodogawa-tobu", ward:"淀川区", type:"地域包括支援センター", name:"淀川区東部地域包括支援センター", address:"大阪市淀川区西宮原1-6-45", phone:"06-6350-7310", lat:34.7368, lng:135.4927, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"淀川区 新大阪駅 東三国駅" },

      { id:"higashiyodogawa", ward:"東淀川区", type:"地域包括支援センター", name:"東淀川区地域包括支援センター", address:"大阪市東淀川区菅原4-4-37", phone:"06-6370-7190", lat:34.7439, lng:135.5297, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"東淀川区 淡路駅 下新庄駅" },
      { id:"higashiyodogawa-hokubu", ward:"東淀川区", type:"地域包括支援センター", name:"東淀川区北部地域包括支援センター", address:"大阪市東淀川区井高野2-1-59", phone:"06-6349-5001", lat:34.7657, lng:135.5440, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"東淀川区 井高野駅 瑞光四丁目駅" },

      { id:"higashinari-nanbu", ward:"東成区", type:"地域包括支援センター", name:"東成区南部地域包括支援センター", address:"大阪市東成区大今里南3-11-2", phone:"06-6977-7032", lat:34.6657, lng:135.5480, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"東成区 今里駅 新深江駅" },
      { id:"higashinari-hokubu", ward:"東成区", type:"地域包括支援センター", name:"東成区北部地域包括支援センター", address:"大阪市東成区中道2-4-15", phone:"06-6971-9700", lat:34.6827, lng:135.5414, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"東成区 玉造駅 森ノ宮駅" },

      { id:"ikuno", ward:"生野区", type:"地域包括支援センター", name:"生野区地域包括支援センター", address:"大阪市生野区勝山北3-13-20", phone:"06-6712-3103", lat:34.6529, lng:135.5376, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"生野区 桃谷駅" },
      { id:"ikuno-higashi", ward:"生野区", type:"地域包括支援センター", name:"東生野地域包括支援センター", address:"大阪市生野区小路3-17-10", phone:"06-6758-8816", lat:34.6612, lng:135.5600, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"生野区 小路駅 北巽駅" },

      { id:"asahi", ward:"旭区", type:"地域包括支援センター", name:"旭区地域包括支援センター", address:"大阪市旭区高殿6-16-1", phone:"06-6957-2200", lat:34.7250, lng:135.5448, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"旭区 関目高殿駅" },
      { id:"asahi-seibu", ward:"旭区", type:"地域包括支援センター", name:"旭区西部地域包括支援センター", address:"大阪市旭区中宮2-15-7", phone:"06-6958-5030", lat:34.7211, lng:135.5366, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"旭区 千林大宮駅 城北公園通駅" },

      { id:"joto", ward:"城東区", type:"地域包括支援センター", name:"城東区地域包括支援センター", address:"大阪市城東区中央2-11-16", phone:"06-6936-1133", lat:34.7008, lng:135.5442, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"城東区 蒲生四丁目駅 野江駅" },

      { id:"tsurumi", ward:"鶴見区", type:"地域包括支援センター", name:"鶴見区地域包括支援センター", address:"大阪市鶴見区諸口5-浜6-12", phone:"06-6913-7512", lat:34.7056, lng:135.5825, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"鶴見区 横堤駅" },

      { id:"abeno", ward:"阿倍野区", type:"地域包括支援センター", name:"阿倍野区地域包括支援センター", address:"大阪市阿倍野区帝塚山1-3-8", phone:"06-6628-1400", lat:34.6258, lng:135.5015, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"阿倍野区 姫松駅 帝塚山駅" },
      { id:"abeno-hokubu", ward:"阿倍野区", type:"地域包括支援センター", name:"阿倍野区北部地域包括支援センター", address:"大阪市阿倍野区阿倍野筋3-10-1", phone:"06-6760-4018", lat:34.6456, lng:135.5109, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"阿倍野区 阿倍野駅 天王寺駅" },

      { id:"suminoe", ward:"住之江区", type:"地域包括支援センター", name:"住之江区地域包括支援センター", address:"大阪市住之江区御崎4-6-10", phone:"06-6686-2235", lat:34.6152, lng:135.4831, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"住之江区 住之江公園駅" },

      { id:"sumiyoshi", ward:"住吉区", type:"地域包括支援センター", name:"住吉区地域包括支援センター", address:"大阪市住吉区浅香1-8-47", phone:"06-6692-8803", lat:34.6164, lng:135.5099, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"住吉区 あびこ駅 杉本町駅" },

      { id:"higashisumiyoshi", ward:"東住吉区", type:"地域包括支援センター", name:"東住吉区地域包括支援センター", address:"大阪市東住吉区田辺2-10-18", phone:"06-6622-0055", lat:34.6219, lng:135.5280, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"東住吉区 南田辺駅 田辺駅" },

      { id:"hirano", ward:"平野区", type:"地域包括支援センター", name:"平野区地域包括支援センター", address:"大阪市平野区平野東2-1-30", phone:"06-6795-1666", lat:34.6208, lng:135.5521, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"平野区 平野駅" },

      { id:"nishinari", ward:"西成区", type:"地域包括支援センター", name:"西成区地域包括支援センター", address:"大阪市西成区岸里1-5-20", phone:"06-6656-0080", lat:34.6386, lng:135.4941, source:"大阪市 地域包括支援センター一覧", checked:"2026-04-22", keywords:"西成区 岸里駅 天下茶屋駅" }
    ];

    const offices = [...OFFICES];
    const wardSelect = document.getElementById("wardFilter");
    const typeFilter = document.getElementById("typeFilter");
    const salesStatusFilter = document.getElementById("salesStatusFilter");
    const todayFilter = document.getElementById("todayFilter");
    const keywordInput = document.getElementById("keyword");
    const placeSearchInput = document.getElementById("placeSearch");
    const statusBox = document.getElementById("statusBox");
    const csvInput = document.getElementById("csvInput");
    const dailyReportEl = document.getElementById("dailyReport");
    const addSnippetEl = document.getElementById("addSnippet");
    const listEl = document.getElementById("list");

    const totalCountEl = document.getElementById("totalCount");
    const todayCountEl = document.getElementById("todayCount");
    const visitedCountEl = document.getElementById("visitedCount");
    const remainingCountEl = document.getElementById("remainingCount");
    const calledCountEl = document.getElementById("calledCount");
    const hotCountEl = document.getElementById("hotCount");

    function rebuildWardOptions(){
      const wards = [...new Set(offices.map(o => o.ward))].sort((a,b)=>a.localeCompare(b,"ja"));
      const current = wardSelect.value || "all";
      wardSelect.innerHTML = '<option value="all">全区</option>';
      wards.forEach(ward => {
        const option = document.createElement("option");
        option.value = ward;
        option.textContent = ward;
        wardSelect.appendChild(option);
      });
      if([...wardSelect.options].some(o => o.value === current)) wardSelect.value = current;
    }
    rebuildWardOptions();

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
    let currentRenderedData = [...offices];

    function normalizeText(text){
      return String(text || "")
        .toLowerCase()
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
        .replace(/\s+/g, " ")
        .replace(/　/g, " ")
        .replace(/ヶ/g, "ケ")
        .replace(/之/g, "の")
        .trim();
    }

    function splitKeywords(text){
      return normalizeText(text)
        .split(" ")
        .map(s => s.trim())
        .filter(Boolean);
    }

    function safeId(text){
      return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\u3040-\u30ff\u3400-\u9fff-]/g, "").slice(0, 40) || ("office-" + Date.now());
    }

    function todayStr(){
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    }

    function nowTimeStr(){
      const d = new Date();
      return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
    }

    function sanitizeMemo(text){
      let t = String(text || "");
      t = t.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig, "[email-redacted]");
      t = t.replace(/0\d{1,4}-\d{1,4}-\d{3,4}/g, "[phone-redacted]");
      t = t.replace(/\b\d{7,}\b/g, "[number-redacted]");
      return t;
    }

    function getVisitState(id){ return localStorage.getItem("visit_" + id) === "1"; }
    function setVisitState(id, value){ localStorage.setItem("visit_" + id, value ? "1" : "0"); }
    function getMemo(id){ return localStorage.getItem("memo_" + id) || ""; }
    function setMemo(id, text){ localStorage.setItem("memo_" + id, sanitizeMemo(text)); }
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
          office.ward,
          office.type,
          office.name,
          office.address,
          office.phone,
          office.source || "",
          office.keywords || ""
        ].join(" "));

        const keywordOk =
          keywords.length === 0 ||
          keywords.every(word => searchableText.includes(word));

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
            <a class="tel-link auto-call-link" href="tel:${office.phone.replace(/-/g, "")}">${office.phone}</a>
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

          <textarea class="memo-box" placeholder="公開事業所対応メモのみ。個人情報は入力しないでください。">${memo}</textarea>
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
          出典: ${office.source || "未設定"}<br>
          確認日: ${office.checked || "未設定"}<br>
          <a href="tel:${office.phone.replace(/-/g, "")}">${office.phone}</a><br>
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
          setStatus(`${office.name} の訪問状態を更新しました。`);
        });

        item.querySelector(".today-toggle").addEventListener("change", (e) => {
          setTodayTarget(office.id, e.target.checked);
          renderListAndMap(currentRenderedData);
          updateSummary(currentRenderedData);
          setStatus(`${office.name} の今日予定を更新しました。`);
        });

        item.querySelectorAll("[data-status]").forEach(btn => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            setSalesStatus(office.id, btn.dataset.status);
            if(btn.dataset.status === "電話した") setCallTime(office.id, nowTimeStr());
            renderListAndMap(currentRenderedData);
            updateSummary(currentRenderedData);
            setStatus(`${office.name} を「${btn.dataset.status}」に更新しました。`);
          });
        });

        item.querySelector(".memo-box").addEventListener("input", (e) => {
          setMemo(office.id, e.target.value);
          if(e.target.value !== sanitizeMemo(e.target.value)){
            e.target.value = sanitizeMemo(e.target.value);
            setStatus("メモ内のメール・電話番号らしき情報を自動で伏せました。");
          }
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
          if(searchMarker){
            map.removeLayer(searchMarker);
            searchMarker = null;
          }

          userMarker = L.marker([currentPosition.lat, currentPosition.lng]).addTo(map).bindPopup("現在地").openPopup();
          map.setView([currentPosition.lat, currentPosition.lng], 15);

          const address = await reverseGeocode(currentPosition.lat, currentPosition.lng);
          setStatus(address ? `現在地を取得しました。<br>${address}` : "現在地を取得しました。");
        },
        () => {
          setStatus("現在地を取得できませんでした。位置情報の許可をご確認ください。");
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

      setStatus(`「${query}」を検索しています…`);
      const result = await geocodePlace(query);
      if(!result){
        setStatus(`「${query}」は見つかりませんでした。`);
        alert("場所が見つかりませんでした。");
        return;
      }

      currentPosition = { lat: result.lat, lng: result.lng };

      if(searchMarker) map.removeLayer(searchMarker);
      if(userMarker){
        map.removeLayer(userMarker);
        userMarker = null;
      }

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
        alert("先に現在地を取得するか、場所検索をしてください。");
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
        alert("先に現在地を取得するか、場所検索をしてください。");
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
        setStatus("すべて訪問済みです。");
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

      report += `■公開事業所ベースの記録\n`;
      visible.forEach((office, idx) => {
        report += `${idx + 1}. ${office.name}\n`;
        report += `区：${office.ward}\n`;
        report += `種別：${office.type}\n`;
        report += `状態：${getSalesStatus(office.id)}\n`;
        report += `訪問済み：${getVisitState(office.id) ? "はい" : "いいえ"}\n`;
        report += `今日予定：${isTodayTarget(office.id) ? "はい" : "いいえ"}\n`;
        report += `電話時刻：${getCallTime(office.id) || "未記録"}\n`;
        report += `電話：${office.phone}\n`;
        report += `住所：${office.address}\n`;
        report += `出典：${office.source || "未設定"}\n`;
        report += `確認日：${office.checked || "未設定"}\n`;
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
        setStatus("日報をコピーしました。");
        alert("日報をコピーしました。");
      }catch(e){
        dailyReportEl.select();
        document.execCommand("copy");
        setStatus("日報をコピーしました。");
        alert("日報をコピーしました。");
      }
    }

    function exportSalesData(){
      const rows = [[
        "区名","種別","事業所名","住所","電話","営業状態","訪問済み","今日予定","電話時刻","出典","確認日","検索補助語","メモ"
      ]];

      currentRenderedData.forEach(office => {
        rows.push([
          office.ward,
          office.type,
          office.name,
          office.address,
          office.phone,
          getSalesStatus(office.id),
          getVisitState(office.id) ? "はい" : "いいえ",
          isTodayTarget(office.id) ? "はい" : "いいえ",
          getCallTime(office.id),
          office.source || "",
          office.checked || "",
          office.keywords || "",
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
      link.download = "eigyo_osakashi_complete.csv";
      link.click();
      URL.revokeObjectURL(url);
      setStatus("CSVを出力しました。");
    }

    function importCSV(){
      const text = csvInput.value.trim();
      if(!text){
        alert("CSVを貼ってください。");
        return;
      }

      const lines = text.split(/\r?\n/).filter(Boolean);
      let count = 0;

      lines.forEach(line => {
        const cols = line.split(",").map(v => v.trim());
        if(cols.length < 10) return;

        const [ward, type, name, address, phone, latStr, lngStr, source, checked, keywords] = cols;
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        if(!ward || !type || !name || !address || !phone || Number.isNaN(lat) || Number.isNaN(lng)) return;

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

    function loadCSVExample(){
      csvInput.value = [
        "中央区,居宅介護支援事業所,サンプル中央ケア,大阪市中央区南本町1-1-1,06-0000-1111,34.680,135.509,介護保険事業所台帳情報,2026-03,本町駅 堺筋本町 中央区",
        "北区,居宅介護支援事業所,サンプル北ケア,大阪市北区芝田1-1-1,06-0000-2222,34.705,135.498,介護保険事業所台帳情報,2026-03,大阪駅 梅田駅 北区"
      ].join("\n");
    }

    function addOfficeFromForm(){
      const ward = document.getElementById("newWard").value.trim();
      const type = document.getElementById("newType").value;
      const name = document.getElementById("newName").value.trim();
      const phone = document.getElementById("newPhone").value.trim();
      const address = document.getElementById("newAddress").value.trim();
      const lat = parseFloat(document.getElementById("newLat").value.trim());
      const lng = parseFloat(document.getElementById("newLng").value.trim());
      const source = document.getElementById("newSource").value.trim();
      const checked = document.getElementById("newChecked").value.trim();
      const keywords = document.getElementById("newKeywords").value.trim();

      if(!ward || !type || !name || !phone || !address || Number.isNaN(lat) || Number.isNaN(lng)){
        alert("全部入れてください。");
        return;
      }

      const id = safeId(`${ward}-${name}-${phone}`);
      offices.push({
        id, ward, type, name, address, phone, lat, lng,
        source: source || "手動追加",
        checked: checked || todayStr(),
        keywords: keywords || ""
      });

      rebuildWardOptions();
      addSnippetEl.textContent =
        `{ id:"${id}", ward:"${ward}", type:"${type}", name:"${name}", address:"${address}", phone:"${phone}", lat:${lat}, lng:${lng}, source:"${source || "手動追加"}", checked:"${checked || todayStr()}", keywords:"${keywords || ""}" },`;

      renderListAndMap(offices);
      setStatus(`${name} を追加しました。`);
    }

    renderListAndMap(offices);

    setTimeout(() => {
      map.invalidateSize();
      fitVisibleMarkers();
    }, 400);
  </script>
</body>
</html>
