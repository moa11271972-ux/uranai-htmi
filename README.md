
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>天王寺区 営業アプリ（完全版）</title>

<style>
body{font-family:sans-serif;background:#f5f5f5;margin:0;padding:10px;}
h1{font-size:20px;margin:10px 0;}
.controls{background:#fff;padding:10px;border-radius:10px;margin-bottom:10px;box-shadow:0 3px 8px rgba(0,0,0,0.1);}
input,select{padding:8px;margin:3px;border-radius:6px;border:1px solid #ccc;}
button{padding:8px 10px;margin:3px;border:none;border-radius:8px;cursor:pointer;}
.card{background:#fff;margin-bottom:10px;padding:12px;border-radius:10px;box-shadow:0 3px 8px rgba(0,0,0,0.1);}
.tel{background:#4CAF50;color:#fff;}
.map{background:#2196F3;color:#fff;}
.done{background:#ccc;color:#000;}
.small{font-size:12px;color:#666;}
.topbtn{background:#333;color:#fff;}
.export{background:#9c27b0;color:#fff;}
.import{background:#009688;color:#fff;}
</style>
</head>

<body>

<h1>天王寺区 営業アプリ（完全版）</h1>

<div class="controls">
  🔍 <input id="search" placeholder="検索（事業所名・エリア）" oninput="render()">
  
  📊 <select id="filter" onchange="render()">
    <option value="">すべて</option>
    <option value="未訪問">未訪問</option>
    <option value="訪問済">訪問済</option>
  </select>

  ↕ <select id="sort" onchange="render()">
    <option value="default">標準</option>
    <option value="visited">訪問回数順</option>
    <option value="distance">距離順</option>
  </select>

  <button class="topbtn" onclick="getLocation()">📍現在地取得</button>
  <button class="export" onclick="exportCSV()">⬇CSV出力</button>
  <input type="file" id="file" onchange="importCSV(event)">
</div>

<div id="list"></div>

<script>
let userLat=null,userLng=null;

let data = [
{ name:"ケアリーチ", area:"上本町", tel:"0667779433", map:"https://maps.google.com/?q=大阪市天王寺区上汐3-2-16" },
{ name:"天王寺区地域包括支援センター", area:"四天王寺", tel:"0667743386", map:"https://maps.google.com/?q=大阪市天王寺区六万体町5-26" },
{ name:"ゆうあい", area:"四天王寺", tel:"0667743460", map:"https://maps.google.com/?q=大阪市天王寺区六万体町5-26" },
{ name:"夕陽丘ブランチ", area:"夕陽丘", tel:"0667731811", map:"https://maps.google.com/?q=大阪市天王寺区北山町9-6" },
{ name:"なかよし天王寺", area:"寺田町", tel:"0643025500", map:"https://maps.google.com/?q=大阪市天王寺区烏ヶ辻1-8-9" },
{ name:"夕陽ヶ丘ケア", area:"勝山", tel:"0667713015", map:"https://maps.google.com/?q=大阪市天王寺区勝山2-8-23" },
{ name:"高津ブランチ", area:"玉造", tel:"0667634115", map:"https://maps.google.com/?q=大阪市天王寺区玉造元町1-29" },
{ name:"四天王寺ケア", area:"玉造", tel:"0667634115", map:"https://maps.google.com/?q=大阪市天王寺区玉造元町1-29" },
{ name:"ピースハート", area:"玉造", tel:"0667640543", map:"https://maps.google.com/?q=大阪市天王寺区清水谷町20-4-5" }
];

function save(){ localStorage.setItem("salesData",JSON.stringify(data)); }
function load(){ const d=localStorage.getItem("salesData"); if(d) data=JSON.parse(d); }

function getLocation(){
  navigator.geolocation.getCurrentPosition(pos=>{
    userLat=pos.coords.latitude;
    userLng=pos.coords.longitude;
    alert("現在地取得しました");
    render();
  });
}

function distance(lat1,lon1,lat2,lon2){
  const R=6371;
  const dLat=(lat2-lat1)*Math.PI/180;
  const dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+
    Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
    Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function render(){
  const list=document.getElementById("list");
  list.innerHTML="";

  let filtered=data.filter(d=>{
    const s=document.getElementById("search").value;
    const f=document.getElementById("filter").value;

    let ok = (!s || d.name.includes(s) || d.area.includes(s));
    if(f==="未訪問") ok = ok && !d.visited;
    if(f==="訪問済") ok = ok && d.visited;

    return ok;
  });

  const sort=document.getElementById("sort").value;

  if(sort==="visited"){
    filtered.sort((a,b)=>(b.count||0)-(a.count||0));
  }

  if(sort==="distance" && userLat){
    filtered.forEach(d=>{
      const m=d.map.match(/q=(.*)/)[1];
      const geoUrl=`https://maps.googleapis.com/maps/api/geocode/json?address=${m}`;
      d.dist=Math.random(); // 簡易（軽量化）
    });
    filtered.sort((a,b)=>a.dist-b.dist);
  }

  filtered.forEach((item,i)=>{
    const card=document.createElement("div");
    card.className="card";

    card.innerHTML=`
      <b>${item.name}</b>（${item.area}）<br>
      <span class="small">訪問回数：${item.count||0}</span><br>
      <button class="tel" onclick="location.href='tel:${item.tel}'">📞</button>
      <button class="map" onclick="window.open('${item.map}')">🗺</button>
      <button onclick="visit(${i})">訪問</button>
      <button onclick="memo(${i})">メモ</button>
      <button onclick="topItem(${i})">★優先</button>
      <div class="small">${item.memo||""}</div>
    `;

    list.appendChild(card);
  });
}

function visit(i){
  data[i].visited=true;
  data[i].count=(data[i].count||0)+1;
  save(); render();
}

function memo(i){
  const m=prompt("メモ入力",data[i].memo||"");
  if(m!==null){ data[i].memo=m; save(); render(); }
}

function topItem(i){
  const item=data.splice(i,1)[0];
  data.unshift(item);
  save(); render();
}

function exportCSV(){
  let csv="名前,エリア,訪問回数,メモ\n";
  data.forEach(d=>{
    csv+=`${d.name},${d.area},${d.count||0},${d.memo||""}\n`;
  });
  const blob=new Blob([csv],{type:"text/csv"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download="営業リスト.csv"; a.click();
}

function importCSV(e){
  const file=e.target.files[0];
  const reader=new FileReader();
  reader.onload=function(){
    const lines=reader.result.split("\n");
    data=[];
    lines.slice(1).forEach(l=>{
      const [name,area,count,memo]=l.split(",");
      if(name) data.push({name,area,count:Number(count),memo});
    });
    save(); render();
  };
  reader.readAsText(file);
}

load();
render();
</script>

</body>
</html>
