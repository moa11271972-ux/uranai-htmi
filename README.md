<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>営業アプリ｜大阪市全区 Premium</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { box-sizing: border-box; }

    body{
      margin:0;
      font-family:"Hiragino Sans","Yu Gothic","Meiryo",sans-serif;
      background:linear-gradient(180deg,#fffdf8 0%, #f7f1e4 100%);
      color:#2b2418;
    }

    header{
      background:linear-gradient(135deg,#b08a3c,#e7c770 55%,#9b772f);
      color:#fffdf7;
      padding:18px 16px;
      text-align:center;
      font-size:22px;
      font-weight:700;
      letter-spacing:0.04em;
      box-shadow:0 6px 18px rgba(122,93,33,0.22);
    }

    .wrap{
      max-width:1680px;
      margin:0 auto;
      padding:14px;
    }

    .toolbar,.panel,.box{
      background:rgba(255,252,245,0.97);
      border-radius:18px;
      box-shadow:0 10px 28px rgba(124,97,45,0.10);
      border:1px solid rgba(198,165,94,0.20);
    }

    .toolbar,.box{
      padding:12px;
      margin-bottom:14px;
    }

    .row{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
      align-items:center;
    }

    select,input,button,textarea{
      border:1px solid #dbc796;
      border-radius:12px;
      padding:12px;
      font-size:14px;
      background:#fffdf8;
      color:#2f271b;
    }

    input{ min-width:150px; }

    button{
      border:none;
      background:linear-gradient(135deg,#b7903f,#d9b867);
      color:#fffef9;
      cursor:pointer;
      white-space:nowrap;
      box-shadow:0 4px 12px rgba(166,128,49,0.18);
    }

    button:hover{ opacity:0.94; }

    .green-btn{ background:linear-gradient(135deg,#8a6b2f,#b79245); }
    .orange-btn{ background:linear-gradient(135deg,#b67b2d,#d9a24e); }
    .red-btn{ background:linear-gradient(135deg,#9a6a2f,#c89a4e); }
    .purple-btn{ background:linear-gradient(135deg,#8a7444,#b89b5c); }

    .status-box{
      margin-top:10px;
      padding:10px 12px;
      background:#fffaf0;
      border:1px solid #e5d0a0;
      border-radius:12px;
      font-size:13px;
      color:#5d4a26;
      line-height:1.7;
    }

    .chips{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
      margin-top:10px;
    }

    .chip{
      background:#f8efdc;
      color:#8b6a2a;
      padding:8px 12px;
      border-radius:999px;
      font-size:13px;
      font-weight:700;
      border:1px solid #e5d0a0;
    }

    .chip.red{
      background:#fff0e5;
      color:#9a5d27;
    }

    .chip.orange{
      background:#fff5e6;
      color:#a06b1f;
    }

    .layout{
      display:grid;
      grid-template-columns:540px 1fr;
      gap:14px;
    }

    .panel{
      overflow:hidden;
    }

    .panel-title{
      padding:14px 16px;
      font-weight:700;
      border-bottom:1px solid #eee0bc;
      background:linear-gradient(180deg,#fffaf0 0%, #f7ecd1 100%);
      color:#6b5325;
    }

    .list{
      height:78vh;
      overflow:auto;
    }

    .card{
      padding:14px 16px;
      border-bottom:1px solid #f0e4c8;
      cursor:pointer;
      transition:0.2s;
      background:#fffdf8;
    }

    .card:hover{ background:#fff8ec; }
    .card.active{ background:#fff4de; border-left:5px solid #ba9444; }
    .card.visited{ background:#f8f4ea; }
    .card.today{ box-shadow: inset 0 0 0 2px #c7a45a; }
    .card.follow-today{ background:#fff3e3; box-shadow: inset 0 0 0 2px #d7a24a; }
    .card.follow-overdue{ background:#fff0e8; box-shadow: inset 0 0 0 3px #b77b3d; }

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
      background:linear-gradient(135deg,#ba9444,#e4c16e);
      color:#fffefb;
      font-weight:700;
      flex-shrink:0;
      box-shadow:0 3px 8px rgba(158,120,42,0.20);
    }

    .name{
      font-weight:700;
      line-height:1.5;
      margin-bottom:2px;
      color:#3a2d18;
    }

    .kana{
      font-size:12px;
      color:#8a7450;
      margin-bottom:6px;
    }

    .meta{
      font-size:13px;
      color:#6a5838;
      line-height:1.7;
      margin-top:6px;
    }

    .distance{
      margin-top:8px;
      font-size:13px;
      color:#9b752d;
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
      background:#fbf3df;
      color:#8b6a2a;
      border:1px solid #ead7a9;
    }

    .badge.called{ background:#f7eed9; color:#9a7428; }
    .badge.absent{ background:#fff0db; color:#b16c1e; }
    .badge.revisit{ background:#f5ead7; color:#8d6b31; }
    .badge.hot{ background:#eef2e5; color:#6a6d28; }
    .badge.contract{ background:#edf3eb; color:#52703d; }
    .badge.done{ background:#eef3e8; color:#56703d; }
    .badge.todaybadge{ background:#f9efd8; color:#a47a28; }
    .badge.followbadge{ background:#fff0dd; color:#b2702c; font-weight:700; }
    .badge.overduebadge{ background:#b9833d; color:#fffdf8; font-weight:700; }

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
      background:linear-gradient(135deg,#b7903f,#d9b867);
    }

    .small-btn.green{ background:linear-gradient(135deg,#8f7741,#b89a5b); }
    .small-btn.orange{ background:linear-gradient(135deg,#c08a39,#dbab57); }
    .small-btn.gray{ background:linear-gradient(135deg,#8f8060,#b9a57d); }
    .small-btn.purple{ background:linear-gradient(135deg,#9a8454,#c0a56a); }
    .small-btn.teal{ background:linear-gradient(135deg,#7f8a5a,#aab274); }

    .visit-check{
      display:flex;
      align-items:center;
      gap:6px;
      font-size:13px;
      font-weight:700;
      color:#6b5325;
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
      color:#7a6540;
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
      min-height:60px;
      margin-top:10px;
      resize:vertical;
      font-size:13px;
      line-height:1.5;
      background:#fffdf8;
    }

    #map{
      width:100%;
      height:78vh;
      min-height:520px;
      background:#efe5cf;
    }

    .subgrid{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:14px;
      margin-top:14px;
    }

    .code-box{
      margin-top:10px;
      background:#fffaf0;
      border:1px solid #ead7a9;
      border-radius:12px;
      padding:12px;
      font-size:12px;
      line-height:1.7;
      white-space:pre-wrap;
      word-break:break-word;
      color:#5f4b28;
    }

    .big-text{
      width:100%;
      min-height:240px;
      resize:vertical;
      font-size:13px;
      line-height:1.6;
    }

    a.tel-link{
      color:#9a7428;
      text-decoration:none;
      font-weight:700;
    }

    a.route-link{
      display:inline-block;
      color:#a07827;
      text-decoration:none;
      font-size:13px;
      font-weight:700;
    }

    @media (max-width: 1150px){
      .layout{ grid-template-columns:1fr; }
      .list{ height:430px; }
      #map{ height:58vh; min-height:380px; }
      .subgrid{ grid-template-columns:1fr; }
      .date-grid{ grid-template-columns:1fr; }
    }
  </style>
</head>
<body>
  <header>営業アプリ｜大阪市全区 Premium</header>

  <div class="wrap">
    <div class="toolbar">
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

        <select id="followFilter">
          <option value="all">フォロー日 全て</option>
          <option value="today">今日フォロー予定のみ</option>
          <option value="overdue">期限超過のみ</option>
          <option value="set">日付設定ありのみ</option>
          <option value="unset">日付未設定のみ</option>
        </select>

        <input id="keyword" type="text" placeholder="事業所名・かな・住所で検索" />
        <input id="placeSearch" type="text" placeholder="梅田駅・天王寺駅などを検索" />

        <button onclick="applyFilters()">絞り込み</button>
        <button onclick="resetFilters()">リセット</button>
        <button onclick="getCurrentLocation()">現在地取得</button>
        <button onclick="searchPlaceAndMove()">場所検索</button>
        <button onclick="sortByWalkingOrder()">近い順</button>
        <button onclick="sortTodayByWalkingOrder()">今日予定を近い順</button>
        <button class="purple-btn" onclick="sortFollowPriority()">フォロー優先</button>
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

    <div class="subgrid">
      <div class="box">
        <div class="panel-title" style="margin:-12px -12px 0 -12px; border-radius:16px 16px 0 0;">居宅をCSVで一括追加</div>
        <div style="margin-top:12px; font-size:13px; line-height:1.7;">
          CSVの列順は<br>
          <b>区名,種別,事業所名,事業所名かな,住所,電話,緯度,経度</b><br>
          です。種別は「居宅介護支援事業所」で入れてください。
        </div>
        <textarea id="csvInput" class="big-text" placeholder="例:
区名,種別,事業所名,事業所名かな,住所,電話,緯度,経度
北区,居宅介護支援事業所,みどりケアプランセンター,みどりけあぷらんせんたー,大阪市北区芝田1-1-1,06-0000-1111,34.705,135.498"></textarea>
        <div class="row" style="margin-top:10px;">
          <button class="green-btn" onclick="importCSV()">CSV追加</button>
          <button class="orange-btn" onclick="loadCSVExample()">例を入れる</button>
        </div>
      </div>

      <div class="box">
        <div class="panel-title" style="margin:-12px -12px 0 -12px; border-radius:16px 16px 0 0;">本日の営業日報</div>
        <textarea id="dailyReport" class="big-text" style="margin-top:12px;" placeholder="日報作成を押すとここに入ります。"></textarea>
      </div>
    </div>

    <div class="box">
      <div class="panel-title" style="margin:-12px -12px 0 -12px; border-radius:16px 16px 0 0;">1件ずつ追加したいとき</div>
      <div class="row" style="margin-top:12px;">
        <input id="newWard" placeholder="区名">
        <select id="newType">
          <option value="地域包括支援センター">地域包括支援センター</option>
          <option value="総合相談窓口（ブランチ）">総合相談窓口（ブランチ）</option>
          <option value="居宅介護支援事業所">居宅介護支援事業所</option>
        </select>
        <input id="newName" placeholder="事業所名">
        <input id="newKana" placeholder="事業所名かな">
        <input id="newPhone" placeholder="電話番号">
        <input id="newAddress" placeholder="住所">
        <input id="newLat" placeholder="緯度">
        <input id="newLng" placeholder="経度">
        <button class="green-btn" onclick="addOfficeFromForm()">追加</button>
      </div>
      <div id="addSnippet" class="code-box">必要なら、ここに追加用コードも出せます。</div>
    </div>
  </div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const offices = [
      { id:"kita", ward:"北区", type:"地域包括支援センター", name:"北区地域包括支援センター", kana:"きたくちいきほうかつしえんせんたー", address:"大阪市北区神山町15-11", phone:"06-6313-5568", lat:34.7054, lng:135.5069 },
      { id:"kita-oyodo", ward:"北区", type:"地域包括支援センター", name:"北区大淀地域包括支援センター", kana:"きたくおおよどちいきほうかつしえんせんたー", address:"大阪市北区長柄中1-1-21", phone:"06-6354-1165", lat:34.7118, lng:135.5122 },
      { id:"branch-kita-umeda", ward:"北区", type:"総合相談窓口（ブランチ）", name:"梅田東ブランチ", kana:"うめだひがしぶらんち", address:"大阪市北区芝田2-10-39", phone:"06-6372-0804", lat:34.7079, lng:135.4946 },
      { id:"branch-kita-toyosaki", ward:"北区", type:"総合相談窓口（ブランチ）", name:"豊崎ブランチ", kana:"とよさきぶらんち", address:"大阪市北区本庄西2-6-15", phone:"06-6371-6233", lat:34.7141, lng:135.4994 },

      { id:"miyakojima", ward:"都島区", type:"地域包括支援センター", name:"都島区地域包括支援センター", kana:"みやこじまくちいきほうかつしえんせんたー", address:"大阪市都島区都島本通3-12-31", phone:"06-6929-9500", lat:34.7046, lng:135.5288 },
      { id:"miyakojima-hokubu", ward:"都島区", type:"地域包括支援センター", name:"都島区北部地域包括支援センター", kana:"みやこじまくほくぶちいきほうかつしえんせんたー", address:"大阪市都島区大東町2-2-18", phone:"06-6926-3800", lat:34.7227, lng:135.5305 },
      { id:"branch-miyakojima-nakano", ward:"都島区", type:"総合相談窓口（ブランチ）", name:"中野ブランチ", kana:"なかのぶらんち", address:"大阪市都島区中野町5-10-70", phone:"06-6922-3550", lat:34.7029, lng:135.5273 },

      { id:"fukushima", ward:"福島区", type:"地域包括支援センター", name:"福島区地域包括支援センター", kana:"ふくしまくちいきほうかつしえんせんたー", address:"大阪市福島区海老江6-2-22", phone:"06-6454-6330", lat:34.6950, lng:135.4683 },
      { id:"branch-fukushima-shimofukushima", ward:"福島区", type:"総合相談窓口（ブランチ）", name:"下福島ブランチ", kana:"しもふくしまぶらんち", address:"大阪市福島区福島4-6-24", phone:"06-4798-0270", lat:34.6934, lng:135.4807 },
      { id:"branch-fukushima-noda", ward:"福島区", type:"総合相談窓口（ブランチ）", name:"野田ブランチ", kana:"のだぶらんち", address:"大阪市福島区吉野5-6-11", phone:"06-6464-0105", lat:34.6846, lng:135.4704 },

      { id:"konohana", ward:"此花区", type:"地域包括支援センター", name:"此花区地域包括支援センター", kana:"このはなくちいきほうかつしえんせんたー", address:"大阪市此花区伝法3-2-27", phone:"06-6462-1225", lat:34.6828, lng:135.4485 },
      { id:"konohana-nanseibu", ward:"此花区", type:"地域包括支援センター", name:"此花区南西部地域包括支援センター", kana:"このはなくなんせいぶちいきほうかつしえんせんたー", address:"大阪市此花区春日出中1-22-13", phone:"06-6462-9301", lat:34.6647, lng:135.4542 },
      { id:"branch-konohana-kasugade", ward:"此花区", type:"総合相談窓口（ブランチ）", name:"春日出ブランチ", kana:"かすがでぶらんち", address:"大阪市此花区西九条1-1-2", phone:"06-6467-2933", lat:34.6782, lng:135.4659 },

      { id:"chuo", ward:"中央区", type:"地域包括支援センター", name:"中央区地域包括支援センター", kana:"ちゅうおうくちいきほうかつしえんせんたー", address:"大阪市中央区上本町西2-5-25", phone:"06-6763-8139", lat:34.6730, lng:135.5203 },
      { id:"chuo-hokubu", ward:"中央区", type:"地域包括支援センター", name:"中央区北部地域包括支援センター", kana:"ちゅうおうくほくぶちいきほうかつしえんせんたー", address:"大阪市中央区農人橋3-1-3", phone:"06-6944-2116", lat:34.6809, lng:135.5125 },

      { id:"nishi", ward:"西区", type:"地域包括支援センター", name:"西区地域包括支援センター", kana:"にしくちいきほうかつしえんせんたー", address:"大阪市西区新町4-5-14", phone:"06-6539-8075", lat:34.6767, lng:135.4893 },
      { id:"branch-nishi-hananoi", ward:"西区", type:"総合相談窓口（ブランチ）", name:"花乃井ブランチ", kana:"はなのいぶらんち", address:"大阪市西区江之子島1-8-44", phone:"06-6225-2662", lat:34.6818, lng:135.4851 },

      { id:"minato", ward:"港区", type:"地域包括支援センター", name:"港区地域包括支援センター", kana:"みなとくちいきほうかつしえんせんたー", address:"大阪市港区弁天2-15-1", phone:"06-6575-1212", lat:34.6698, lng:135.4617 },
      { id:"minato-nanbu", ward:"港区", type:"地域包括支援センター", name:"港区南部地域包括支援センター", kana:"みなとくなんぶちいきほうかつしえんせんたー", address:"大阪市港区池島1-1-18", phone:"06-6536-8162", lat:34.6548, lng:135.4507 },

      { id:"taisho", ward:"大正区", type:"地域包括支援センター", name:"大正区地域包括支援センター", kana:"たいしょうくちいきほうかつしえんせんたー", address:"大阪市大正区小林西1-14-3", phone:"06-6555-0693", lat:34.6495, lng:135.4728 },
      { id:"taisho-hokubu", ward:"大正区", type:"地域包括支援センター", name:"大正区北部地域包括支援センター", kana:"たいしょうくほくぶちいきほうかつしえんせんたー", address:"大阪市大正区北村3-5-10", phone:"06-6552-4440", lat:34.6557, lng:135.4694 },

      { id:"tennoji", ward:"天王寺区", type:"地域包括支援センター", name:"天王寺区地域包括支援センター", kana:"てんのうじくちいきほうかつしえんせんたー", address:"大阪市天王寺区六万体町5-26", phone:"06-6774-3386", lat:34.6589, lng:135.5166 },
      { id:"branch-tennoji-yuhigaoka", ward:"天王寺区", type:"総合相談窓口（ブランチ）", name:"夕陽丘ブランチ", kana:"ゆうひがおかぶらんち", address:"大阪市天王寺区北山町9-6", phone:"06-6773-1811", lat:34.6536, lng:135.5221 },

      { id:"naniwa", ward:"浪速区", type:"地域包括支援センター", name:"浪速区地域包括支援センター", kana:"なにわくちいきほうかつしえんせんたー", address:"大阪市浪速区難波中3-8-8", phone:"06-6636-6029", lat:34.6614, lng:135.4964 },
      { id:"branch-naniwa-nihonbashi", ward:"浪速区", type:"総合相談窓口（ブランチ）", name:"日本橋ブランチ", kana:"にっぽんばしぶらんち", address:"大阪市浪速区恵美須東2-1-4", phone:"06-6632-2340", lat:34.6532, lng:135.5065 },

      { id:"nishiyodogawa", ward:"西淀川区", type:"地域包括支援センター", name:"西淀川区地域包括支援センター", kana:"にしよどがわくちいきほうかつしえんせんたー", address:"大阪市西淀川区千舟2-7-7", phone:"06-6478-2943", lat:34.7117, lng:135.4554 },
      { id:"nishiyodogawa-nanseibu", ward:"西淀川区", type:"地域包括支援センター", name:"西淀川区南西部地域包括支援センター", kana:"にしよどがわくなんせいぶちいきほうかつしえんせんたー", address:"大阪市西淀川区福町2-4-16", phone:"06-6476-3550", lat:34.6922, lng:135.4312 },

      { id:"yodogawa", ward:"淀川区", type:"地域包括支援センター", name:"淀川区地域包括支援センター", kana:"よどがわくちいきほうかつしえんせんたー", address:"大阪市淀川区三国本町2-14-3", phone:"06-6394-2914", lat:34.7360, lng:135.4868 },
      { id:"yodogawa-tobu", ward:"淀川区", type:"地域包括支援センター", name:"淀川区東部地域包括支援センター", kana:"よどがわくとうぶちいきほうかつしえんせんたー", address:"大阪市淀川区西宮原1-6-45", phone:"06-6350-7310", lat:34.7368, lng:135.4927 },

      { id:"higashiyodogawa", ward:"東淀川区", type:"地域包括支援センター", name:"東淀川区地域包括支援センター", kana:"ひがしよどがわくちいきほうかつしえんせんたー", address:"大阪市東淀川区菅原4-4-37", phone:"06-6370-7190", lat:34.7439, lng:135.5297 },
      { id:"higashiyodogawa-hokubu", ward:"東淀川区", type:"地域包括支援センター", name:"東淀川区北部地域包括支援センター", kana:"ひがしよどがわくほくぶちいきほうかつしえんせんたー", address:"大阪市東淀川区井高野2-1-59", phone:"06-6349-5001", lat:34.7657, lng:135.5440 },

      { id:"higashinari-nanbu", ward:"東成区", type:"地域包括支援センター", name:"東成区南部地域包括支援センター", kana:"ひがしなりくなんぶちいきほうかつしえんせんたー", address:"大阪市東成区大今里南3-11-2", phone:"06-6977-7032", lat:34.6657, lng:135.5480 },
      { id:"higashinari-hokubu", ward:"東成区", type:"地域包括支援センター", name:"東成区北部地域包括支援センター", kana:"ひがしなりくほくぶちいきほうかつしえんせんたー", address:"大阪市東成区中道2-4-15", phone:"06-6971-9700", lat:34.6827, lng:135.5414 },

      { id:"ikuno", ward:"生野区", type:"地域包括支援センター", name:"生野区地域包括支援センター", kana:"いくのくちいきほうかつしえんせんたー", address:"大阪市生野区勝山北3-13-20", phone:"06-6712-3103", lat:34.6529, lng:135.5376 },
      { id:"ikuno-higashi", ward:"生野区", type:"地域包括支援センター", name:"東生野地域包括支援センター", kana:"ひがしいくのちいきほうかつしえんせんたー", address:"大阪市生野区小路3-17-10", phone:"06-6758-8816", lat:34.6612, lng:135.5600 },

      { id:"asahi", ward:"旭区", type:"地域包括支援センター", name:"旭区地域包括支援センター", kana:"あさひくちいきほうかつしえんせんたー", address:"大阪市旭区高殿6-16-1", phone:"06-6957-2200", lat:34.7250, lng:135.5448 },
      { id:"asahi-seibu", ward:"旭区", type:"地域包括支援センター", name:"旭区西部地域包括支援センター", kana:"あさひくせいぶちいきほうかつしえんせんたー", address:"大阪市旭区中宮2-15-7", phone:"06-6958-5030", lat:34.7211, lng:135.5366 },

      { id:"joto", ward:"城東区", type:"地域包括支援センター", name:"城東区地域包括支援センター", kana:"じょうとうくちいきほうかつしえんせんたー", address:"大阪市城東区中央2-11-16", phone:"06-6936-1133", lat:34.7008, lng:135.5442 },

      { id:"tsurumi", ward:"鶴見区", type:"地域包括支援センター", name:"鶴見区地域包括支援センター", kana:"つるみくちいきほうかつしえんせんたー", address:"大阪市鶴見区諸口5-浜6-12", phone:"06-6913-7512", lat:34.7056, lng:135.5825 },

      { id:"abeno", ward:"阿倍野区", type:"地域包括支援センター", name:"阿倍野区地域包括支援センター", kana:"あべのくちいきほうかつしえんせんたー", address:"大阪市阿倍野区帝塚山1-3-8", phone:"06-6628-1400", lat:34.6258, lng:135.5015 },
      { id:"abeno-hokubu", ward:"阿倍野区", type:"地域包括支援センター", name:"阿倍野区北部地域包括支援センター", kana:"あべのくほくぶちいきほうかつしえんせんたー", address:"大阪市阿倍野区阿倍野筋3-10-1", phone:"06-6760-4018", lat:34.6456, lng:135.5109 },

      { id:"suminoe", ward:"住之江区", type:"地域包括支援センター", name:"住之江区地域包括支援センター", kana:"すみのえくちいきほうかつしえんせんたー", address:"大阪市住之江区御崎4-6-10", phone:"06-6686-2235", lat:34.6152, lng:135.4831 },

      { id:"sumiyoshi", ward:"住吉区", type:"地域包括支援センター", name:"住吉区地域包括支援センター", kana:"すみよしくちいきほうかつしえんせんたー", address:"大阪市住吉区浅香1-8-47", phone:"06-6692-8803", lat:34.6164, lng:135.5099 },

      { id:"higashisumiyoshi", ward:"東住吉区", type:"地域包括支援センター", name:"東住吉区地域包括支援センター", kana:"ひがしすみよしくちいきほうかつしえんせんたー", address:"大阪市東住吉区田辺2-10-18", phone:"06-6622-0055", lat:34.6219, lng:135.5280 },

      { id:"hirano", ward:"平野区", type:"地域包括支援センター", name:"平野区地域包括支援センター", kana:"ひらのくちいきほうかつしえんせんたー", address:"大阪市平野区平野東2-1-30", phone:"06-6795-1666", lat:34.6208, lng:135.5521 },

      { id:"nishinari", ward:"西成区", type:"地域包括支援センター", name:"西成区地域包括支援センター", kana:"にしなりくちいきほうかつしえんせんたー", address:"大阪市西成区岸里1-5-20", phone:"06-6656-0080", lat:34.6386, lng:135.4941 }
    ];

    const wardSelect = document.getElementById("wardFilter");
    const listEl = document.getElementById("list");
    const typeFilter = document.getElementById("typeFilter");
    const salesStatusFilter = document.getElementById("salesStatusFilter");
    const todayFilter = document.getElementById("todayFilter");
    const followFilter = document.getElementById("followFilter");
    const keywordInput = document.getElementById("keyword");
    const placeSearchInput = document.getElementById("placeSearch");
    const statusBox = document.getElementById("statusBox");
    const csvInput = document.getElementById("csvInput");
    const dailyReportEl = document.getElementById("dailyReport");
    const addSnippetEl = document.getElementById("addSnippet");

    const totalCountEl = document.getElementById("totalCount");
    const todayCountEl = document.getElementById("todayCount");
    const visitedCountEl = document.getElementById("visitedCount");
    const remainingCountEl = document.getElementById("remainingCount");
    const calledCountEl = document.getElementById("calledCount");
    const hotCountEl = document.getElementById("hotCount");
    const followTodayCountEl = document.getElementById("followTodayCount");
    const overdueCountEl = document.getElementById("overdueCount");

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

    function refreshWardOptions(){
      const currentValue = wardSelect.value || "all";
      const wards = [...new Set(offices.map(o => o.ward))].sort((a,b)=>a.localeCompare(b,"ja"));
      wardSelect.innerHTML = '<option value="all">全区</option>';
      wards.forEach(ward => {
        const option = document.createElement("option");
        option.value = ward;
        option.textContent = ward;
        wardSelect.appendChild(option);
      });
      if([...wardSelect.options].some(o => o.value === currentValue)){
        wardSelect.value = currentValue;
      }
    }

    refreshWardOptions();

    function safeId(text){
      return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\u3040-\u30ff\u3400-\u9fff-]/g, "").slice(0, 60) || ("office-" + Date.now());
    }

    function nowTimeStr(){
      const d = new Date();
      return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
    }

    function todayStr(){
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
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
    function getVisitDate(id){ return localStorage.getItem("visit_date_" + id) || ""; }
    function setVisitDate(id, value){ localStorage.setItem("visit_date_" + id, value); }
    function getNextVisitDate(id){ return localStorage.getItem("next_visit_date_" + id) || ""; }
    function setNextVisitDate(id, value){ localStorage.setItem("next_visit_date_" + id, value); }
    function getFollowDate(id){ return localStorage.getItem("follow_date_" + id) || ""; }
    function setFollowDate(id, value){ localStorage.setItem("follow_date_" + id, value); }

    function isFollowToday(id){
      const v = getFollowDate(id);
      return v !== "" && v === todayStr();
    }

    function isFollowOverdue(id){
      const v = getFollowDate(id);
      return v !== "" && v < todayStr();
    }

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

    function haversine(lat1, lon1, lat2, lon2) {
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

    function followPriorityScore(office){
      if(isFollowOverdue(office.id)) return 100;
      if(isFollowToday(office.id)) return 90;
      if(getSalesStatus(office.id) === "契約候補") return 80;
      if(getSalesStatus(office.id) === "見込みあり") return 70;
      if(getSalesStatus(office.id) === "再訪問") return 60;
      if(isTodayTarget(office.id)) return 50;
      return 10;
    }

    function updateSummary(data){
      const total = data.length;
      const today = data.filter(o => isTodayTarget(o.id)).length;
      const visited = data.filter(o => getVisitState(o.id)).length;
      const remaining = total - visited;
      const called = data.filter(o => getSalesStatus(o.id) === "電話した").length;
      const hot = data.filter(o => getSalesStatus(o.id) === "見込みあり").length;
      const followToday = data.filter(o => isFollowToday(o.id)).length;
      const overdue = data.filter(o => isFollowOverdue(o.id)).length;

      totalCountEl.textContent = `全件: ${total}`;
      todayCountEl.textContent = `今日予定: ${today}`;
      visitedCountEl.textContent = `訪問済み: ${visited}`;
      remainingCountEl.textContent = `未訪問: ${remaining}`;
      calledCountEl.textContent = `電話した: ${called}`;
      hotCountEl.textContent = `見込みあり: ${hot}`;
      followTodayCountEl.textContent = `今日フォロー: ${followToday}`;
      overdueCountEl.textContent = `期限超過: ${overdue}`;
    }

    function getFilteredData(){
      const ward = wardSelect.value;
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
          (office.name && office.name.toLowerCase().includes(keyword)) ||
          (office.kana && office.kana.toLowerCase().includes(keyword)) ||
          (office.address && office.address.toLowerCase().includes(keyword));

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

    function markerColor(office){
      const status = getSalesStatus(office.id);
      const visited = getVisitState(office.id);
      const today = isTodayTarget(office.id);
      const followToday = isFollowToday(office.id);
      const overdue = isFollowOverdue(office.id);

      if(overdue) return "#b9833d";
      if(followToday) return "#d7a24a";
      if(status === "契約候補") return "#7f8a5a";
      if(status === "見込みあり") return "#8f7741";
      if(status === "再訪問") return "#9a8454";
      if(status === "不在") return "#c08a39";
      if(status === "電話した") return "#b7903f";
      if(today) return "#c7a45a";
      if(visited) return "#8d9a73";
      if(office.type === "総合相談窓口（ブランチ）") return "#d3a34f";
      if(office.type === "居宅介護支援事業所") return "#9da66f";
      return "#ba9444";
    }

    function markCalled(office){
      setSalesStatus(office.id, "電話した");
      setCallTime(office.id, nowTimeStr());
      if(!getVisitDate(office.id)) setVisitDate(office.id, todayStr());
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
        const visitDate = getVisitDate(office.id);
        const nextVisitDate = getNextVisitDate(office.id);
        const followDate = getFollowDate(office.id);
        const followToday = isFollowToday(office.id);
        const overdue = isFollowOverdue(office.id);

        let cls = "card";
        if(visited) cls += " visited";
        if(today) cls += " today";
        if(followToday) cls += " follow-today";
        if(overdue) cls += " follow-overdue";

        const item = document.createElement("div");
        item.className = cls;

        const distanceText = office.distanceFromPrev != null
          ? `前地点から ${formatDistance(office.distanceFromPrev)} / 徒歩約${walkingMinutesFromKm(office.distanceFromPrev)}分`
          : (office.distanceFromStart != null
              ? `現在地から ${formatDistance(office.distanceFromStart)} / 徒歩約${walkingMinutesFromKm(office.distanceFromStart)}分`
              : "距離未計算");

        item.innerHTML = `
          <div class="topline">
            <div style="flex:1;">
              <div class="name">${office.name}</div>
              ${office.kana ? `<div class="kana">${office.kana}</div>` : ""}
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
            ${followToday ? '<span class="badge followbadge">今日フォロー</span>' : ""}
            ${overdue ? '<span class="badge overduebadge">期限超過</span>' : ""}
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
            <a class="route-link" href="${googleMapsWalkingUrl(office.address)}" target="_blank" rel="noopener noreferrer">徒歩ルート</a>
            <a class="route-link" href="${googleMapsTransitUrl(office.address)}" target="_blank" rel="noopener noreferrer">バス・電車ルート</a>
            <button class="small-btn gray next-btn">次へ</button>
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

          <textarea class="memo-box" placeholder="営業メモを入力">${memo}</textarea>
        `;
        listEl.appendChild(item);

        const icon = L.divIcon({
          className: "custom-number-icon",
          html: `
            <div style="
              width:30px;height:30px;border-radius:999px;
              background:${markerColor(office)};
              color:#fff;display:flex;align-items:center;justify-content:center;
              font-weight:700;border:2px solid #fff;
              box-shadow:0 2px 8px rgba(0,0,0,0.25);
            ">${index + 1}</div>
          `,
          iconSize: [30,30],
          iconAnchor: [15,15]
        });

        const marker = L.marker([office.lat, office.lng], { icon }).addTo(map);
        marker.bindPopup(`
          <b>${index + 1}. ${office.name}</b><br>
          ${office.kana ? office.kana + "<br>" : ""}
          ${office.ward}<br>
          ${office.type}<br>
          状態: ${salesStatus}<br>
          訪問日: ${visitDate || "未設定"}<br>
          次回訪問日: ${nextVisitDate || "未設定"}<br>
          フォロー予定日: ${followDate || "未設定"}<br>
          ${office.address}<br>
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
            e.target.classList.contains("auto-call-link") ||
            e.target.classList.contains("visit-date-input") ||
            e.target.classList.contains("next-visit-date-input") ||
            e.target.classList.contains("follow-date-input")
          ) return;

          document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
          item.classList.add("active");
          map.setView([office.lat, office.lng], 16);
          marker.openPopup();
        });

        item.querySelector(".visit-toggle").addEventListener("change", (e) => {
          setVisitState(office.id, e.target.checked);
          if(e.target.checked && !getVisitDate(office.id)) setVisitDate(office.id, todayStr());
          renderListAndMap(currentRenderedData);
          updateSummary(currentRenderedData);
          setStatus(`${office.name} の訪問状態を更新しました。`);
          if(e.target.checked) jumpToNextUnvisited(index + 1);
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
            if(btn.dataset.status === "電話した"){
              setCallTime(office.id, nowTimeStr());
              if(!getVisitDate(office.id)) setVisitDate(office.id, todayStr());
            }
            renderListAndMap(currentRenderedData);
            updateSummary(currentRenderedData);
            setStatus(`${office.name} を「${btn.dataset.status}」に更新しました。`);
          });
        });

        item.querySelector(".visit-date-input").addEventListener("change", (e) => {
          setVisitDate(office.id, e.target.value);
          setStatus(`${office.name} の訪問日を保存しました。`);
        });

        item.querySelector(".next-visit-date-input").addEventListener("change", (e) => {
          setNextVisitDate(office.id, e.target.value);
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

    function sortFollowPriority(){
      const sorted = [...getFilteredData()].sort((a, b) => {
        const diff = followPriorityScore(b) - followPriorityScore(a);
        if(diff !== 0) return diff;
        return a.name.localeCompare(b.name, "ja");
      });
      renderListAndMap(sorted);
      setStatus("フォロー優先順に並べ替えました。");
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
      const followToday = visible.filter(o => isFollowToday(o.id));
      const overdue = visible.filter(o => isFollowOverdue(o.id));

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
      report += `契約候補：${contract.length}件\n`;
      report += `今日フォロー：${followToday.length}件\n`;
      report += `期限超過：${overdue.length}件\n\n`;

      report += `■詳細\n`;
      visible.forEach((office, idx) => {
        report += `${idx + 1}. ${office.name}\n`;
        if(office.kana) report += `かな：${office.kana}\n`;
        report += `区：${office.ward}\n`;
        report += `種別：${office.type}\n`;
        report += `状態：${getSalesStatus(office.id)}\n`;
        report += `訪問済み：${getVisitState(office.id) ? "はい" : "いいえ"}\n`;
        report += `今日予定：${isTodayTarget(office.id) ? "はい" : "いいえ"}\n`;
        report += `電話時刻：${getCallTime(office.id) || "未記録"}\n`;
        report += `訪問日：${getVisitDate(office.id) || "未設定"}\n`;
        report += `次回訪問日：${getNextVisitDate(office.id) || "未設定"}\n`;
        report += `フォロー予定日：${getFollowDate(office.id) || "未設定"}\n`;
        report += `電話：${office.phone}\n`;
        report += `住所：${office.address}\n`;
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
        "区名","種別","事業所名","事業所名かな","住所","電話","営業状態","訪問済み","今日予定","電話時刻","訪問日","次回訪問日","フォロー予定日","メモ"
      ]];

      currentRenderedData.forEach(office => {
        rows.push([
          office.ward,
          office.type,
          office.name,
          office.kana || "",
          office.address,
          office.phone,
          getSalesStatus(office.id),
          getVisitState(office.id) ? "はい" : "いいえ",
          isTodayTarget(office.id) ? "はい" : "いいえ",
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
      link.download = "eigyo_osakashi_premium.csv";
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

      lines.forEach((line, index) => {
        const cols = line.split(",").map(v => v.trim());

        if(index === 0 && cols[0] === "区名") return;
        if(cols.length < 8) return;

        const [ward, type, name, kana, address, phone, latStr, lngStr] = cols;
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if(!ward || !type || !name || !address || !phone || Number.isNaN(lat) || Number.isNaN(lng)){
          return;
        }

        const id = safeId(`${ward}-${name}-${phone}`);
        if(offices.some(o => o.id === id)) return;

        offices.push({
          id,
          ward,
          type,
          name,
          kana,
          address,
          phone,
          lat,
          lng
        });

        count++;
      });

      refreshWardOptions();
      renderListAndMap(offices);
      setStatus(`${count}件 追加しました。`);
    }

    function loadCSVExample(){
      csvInput.value = [
        "区名,種別,事業所名,事業所名かな,住所,電話,緯度,経度",
        "北区,居宅介護支援事業所,みどりケアプランセンター,みどりけあぷらんせんたー,大阪市北区芝田1-1-1,06-0000-1111,34.705,135.498",
        "阿倍野区,居宅介護支援事業所,あべのケアサポート,あべのけあさぽーと,大阪市阿倍野区阿倍野筋1-1-1,06-0000-2222,34.645,135.513"
      ].join("\n");
    }

    function addOfficeFromForm(){
      const ward = document.getElementById("newWard").value.trim();
      const type = document.getElementById("newType").value;
      const name = document.getElementById("newName").value.trim();
      const kana = document.getElementById("newKana").value.trim();
      const phone = document.getElementById("newPhone").value.trim();
      const address = document.getElementById("newAddress").value.trim();
      const lat = parseFloat(document.getElementById("newLat").value.trim());
      const lng = parseFloat(document.getElementById("newLng").value.trim());

      if(!ward || !type || !name || !phone || !address || Number.isNaN(lat) || Number.isNaN(lng)){
        alert("全部入れてください。");
        return;
      }

      const id = safeId(`${ward}-${name}-${phone}`);
      offices.push({ id, ward, type, name, kana, address, phone, lat, lng });

      refreshWardOptions();
      addSnippetEl.textContent = `{ id:"${id}", ward:"${ward}", type:"${type}", name:"${name}", kana:"${kana}", address:"${address}", phone:"${phone}", lat:${lat}, lng:${lng} },`;
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
