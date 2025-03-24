var map = L.map('map');

var tileLayer = L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
{attribution:'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18
});
tileLayer.addTo(map);

map.on('locationfound', onLocationFound); //現在地が取得出来た場合，onLocationFound()を実行
map.on('locationerror', onLocationError); //現在地が取得出来なかった場合，onLocationError()を実行
map.locate({setView: true, maxZoom: 18, timeout: 10000});

map.on('click', onMapClick)

var lat;
var lng;

//新しくピンを立てたマーカーの座標　マーカーから座標を取得しよう①
var mklat;
var mklng;
var mk;

//ノード情報配列 マーカーから座標を取得しよう①
var spot_data = [];

//TSP用の変数たち　TSPを解いてみよう②
var route;
var d = [];
var temp = [];

function onLocationFound(e) {
    map.setView([e.latlng.lat, e.latlng.lng], 16);

    lat = e.latlng.lat;
    lng = e.latlng.lng;

    var pulsingIcon = L.icon.pulse({iconSize:[16,16],color:'#1199fb'});
    L.marker([lat, lng],{icon: pulsingIcon}).addTo(map);

    spot_data.push({
            name: "Now",
            coord: {lat: lat, lng: lng},
    });
}

function onLocationError(e) {
    alert(e.message);
}
function onMapClick(e) {
    //地図のclickイベント呼び出される
    //クリック地点の座標にマーカーを追加、マーカーのclickイベントでonMarkerClick関数を呼び出し
    L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.3.1/dist/images/';

    //mk = L.marker(e.latlng,).on('click', onMarkerClick).addTo(map);

    switch(spot_data.length % 5){
        case(0):
        L.marker(e.latlng, {icon: L.spriteIcon('green')}).on('click', onMarkerClick).addTo(map);
        break;
        case(1):
        L.marker(e.latlng, {icon: L.spriteIcon('orange')}).on('click', onMarkerClick).addTo(map);
        break;
        case(2):
        L.marker(e.latlng, {icon: L.spriteIcon('yellow')}).on('click', onMarkerClick).addTo(map);
        break;
        case(3):
        L.marker(e.latlng, {icon: L.spriteIcon('red')}).on('click', onMarkerClick).addTo(map);
        break;
        case(4):
        L.marker(e.latlng, {icon: L.spriteIcon('purple')}).on('click', onMarkerClick).addTo(map);
        break;
        }

    mklat = e.latlng.lat;
    mklng = e.latlng.lng;
    //マーカーに座標表示
    //mk.bindPopup(String(mklat) + "," + String(mklng)).openPopup();
    //座標データの格納

    spot_data.push({
      name: "後で使うならここに入力",
      coord: {lat: mklat, lng: mklng},
    });
}
function onMarkerClick(e) {
    //マーカーのclickイベント呼び出される
    //クリックされたマーカーを地図のレイヤから削除する
    var del_lat = e.latlng.lat
    var del_lng = e.latlng.lng
    //選択したマーカーのデータをspot_dataから削除(座標が一致するデータを削除してる)
    for (var i = 0; i < spot_data.length; i++){
        if (spot_data[i].coord.lat === del_lat & spot_data[i].coord.lng === del_lng){
            spot_data.splice(i,1);
            break;
        }
    }
    map.removeLayer(e.target);
}
var i = 0;
var j = 0;
//CSSにボタン追加するのも忘れずに
//あとmodのダウンロードも
//ボタン押すと呼ばれる関数
function onClickTSP(e) {
    var count = 0;
    for (i = 0; i < spot_data.length; i++) {
        temp = [];
        for (j = 0; j < spot_data.length; j++){
            //とりあえず座標間のユークリッド距離を計算して距離行列へ
            temp.push(Math.sqrt( Math.pow( spot_data[j].coord.lat-spot_data[i].coord.lat, 2 ) + Math.pow( spot_data[j].coord.lng-spot_data[i].coord.lng, 2 ) ))
        }
        d.push(temp);
    };
    //TSPを解くための変数たち
    //今いるノード
    var now_node = 0
    //合計距離
    var sum_distance = 0
    //経路
    var route = [0]
    //一番短い距離
    var shortest = 10000
    //次のノード
    var next_node = 10

    //貪欲法
    for (var i = 0; i < spot_data.length-1; i ++){
        shortest = 10000
        for (var j = 0; j < spot_data.length; j++){
            if (!(route.includes(j))){
                if (d[now_node][j] < shortest){
                    shortest = d[now_node][j];
                    next_node = j;
                }
            }
        }
        sum_distance += shortest;
        now_node = next_node;
        route.push(now_node);
    }

    route.push(0);
    sum_distance += d[now_node][0];

    //mk.bindPopup(String(route) + "donyoku").openPopup();


    //以下2opt
    var flag = true;

    while(true){
        flag = true;
        for (i = 0; i < route.length-3; i ++){
            for (j = i+2; j < route.length-1; j ++){
                var p = route[i];
                var q = route[i+1];
                var r = route[j];
                var s = route[j+1];
                if ((d[p][r] + d[q][s]) < (d[p][q] + d[r][s])){
                    for (var k = 0; k < Math.floor(j-i)/2; k++){
                        var tmp1 = route[i+1+k];
                        var tmp2 = route[j-k];
                        route[i+1+k] = tmp2;
                        route[j-k] = tmp1;
                        sum_distance += d[p][r] + d[q][s] - (d[p][q] + d[r][s]);
                    }
                    flag = false;
                }
            }
        }
        if (flag){
            break;
        }
    }

    //mk.bindPopup(String(route) + "2opt").openPopup();
    //経路を実際に表示
    real_route = []

    for (var i = 0; i < route.length-1; i++){
        temp_route = L.Routing.control({
            waypoints: [
                L.latLng(spot_data[route[i]].coord.lat,spot_data[route[i]].coord.lng),
                L.latLng(spot_data[route[i+1]].coord.lat,spot_data[route[i+1]].coord.lng)
            ],
            createMarker: function() { return null; },
            routeWhileDragging: true
        }).addTo(map);
        real_route.push(temp_route)
    }
    }


