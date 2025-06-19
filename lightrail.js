var station = 260;
var response_json = "";
var decode = "";
var result = "";
var ReloadDelay = 10000; // 3 seconds


function GetStationName() {
    // Object containing station names mapped to their numbers
    const stations = {
        // --- 第1收費區 (Fare Zone 1) ---
        "蝴蝶": 15, "Butterfly": 15,
        "豐景園": 260, "Goodview Garden": 260,
        "輕鐵車廠": 20, "Light Rail Depot": 20,
        "龍門": 30, "Lung Mun": 30,
        "美樂": 10, "Melody Garden": 10,
        "三聖": 920, "Sam Shing": 920,
        "兆禧": 240, "Siu Hei": 240,
        "兆麟": 265, "Siu Lun": 265,
        "屯門碼頭": 1, "Tuen Mun Ferry Pier": 1,
        "屯門泳池": 250, "Tuen Mun Swimming Pool": 250,

        // --- 第2收費區 (Fare Zone 2) ---
        "澤豐": 80, "Affluence": 80,
        "蔡意橋": 75, "Choy Yee Bridge": 75,
        "河田": 70, "Ho Tin": 70,
        "何福堂": 310, "Hoh Fuk Tong": 310,
        "建安": 60, "Kin On": 60,
        "鳴琴": 200, "Ming Kum": 200,
        "銀圍": 230, "Ngan Wai": 230,
        "安定": 270, "On Ting": 270,
        "景峰": 330, "Prime View": 330,
        "杯渡": 300, "Pui To": 300,
        "新墟": 320, "San Hui": 320,
        "山景北": 180, "Shan King (North)": 180,
        "山景南": 190, "Shan King (South)": 190,
        "石排": 170, "Shek Pai": 170,
        "大興北": 212, "Tai Hing (North)": 212,
        "大興南": 220, "Tai Hing (South)": 220,
        "市中心": 280, "Town Centre": 280,
        "青山村": 40, "Tsing Shan Tsuen": 40,
        "青雲": 50, "Tsing Wun": 50,
        "屯門": 295, "Tuen Mun": 295,
        "友愛": 275, "Yau Oi": 275,

        // --- 第3收費區 (Fare Zone 3) ---
        "青松": 120, "Ching Chung": 120,
        "鍾屋村": 370, "Chung Uk Tsuen": 370,
        "鳳地": 340, "Fung Tei": 340,
        "麒麟": 110, "Kei Lun": 110,
        "建生": 130, "Kin Sang": 130,
        "藍地": 350, "Lam Tei": 350,
        "良景": 150, "Leung King": 150,
        "泥圍": 360, "Nai Wai": 360,
        "新圍": 160, "San Wai": 160,
        "兆康": 100, "Siu Hong": 100,
        "田景": 140, "Tin King": 140,
        "屯門醫院": 90, "Tuen Mun Hospital": 90
    };

    return {
        getStationNumber: (name) => stations[name] || "Station not found",
        getStationNames: (number) => Object.keys(stations).filter(key => stations[key] === number) || "Station number not found"
    };
}

window.GetETA = GetETA;
function getSelectedStation() {
    var stationSelect = document.getElementById('station');
    return parseInt(stationSelect.value);
}
// Function to decode and expand the JSON data
function decodeJson(data) {
    // Store the JSON data as formatted text
    response_json = JSON.stringify(data, null, 2);
    console.log("Extracted JSON Text:");
    console.log(response_json);
    
    return data; // Return the parsed JSON data
}

function formatSchedule(data) {
    if (!data || !data.platform_list)
        return;
    
    result = ""; // Clear previous results
    result = "車站: " + GetStationName().getStationNames(station) + "<br>";
    result = result + "System Time: " + data.system_time + "<br>";
    data.platform_list.forEach(function (platform) {
        console.log("Platform ".concat(platform.platform_id, ":"));
        result = result + platform.platform_id + " 號月台" + ":<br>";
        if (platform.route_list && platform.route_list.length > 0) {
            platform.route_list.forEach(function (route) {
                console.log("  ".concat(route.route_no, " - ").concat(route.dest_ch, " - ").concat(route.time_ch, "\n"));
                // console.log(`    Status: ${route.arrival_departure === 'D' ? 'Departing' : 'Arriving'}`);
                console.log('    ----------------\n');
                result = result + route.route_no + " // " + route.dest_ch + " // " + route.time_ch + " // 車長: " + route.train_length + "<br>";
            });
            result = result + "<br>";
        }
        else {
            console.log('  No scheduled trains');
            result = result + '是日列車服務已經中止<br>';
        }
        console.log('');
    });
    
    // Changed: Use innerHTML instead of textContent to render HTML tags
    document.getElementById('text').innerHTML = result;
    // setTimeout(() => GetETA(station), ReloadDelay);


}

// Fetch section
function GetETA(station_id) {
    station = station_id || getSelectedStation() || station; // Use the provided station_id or the selected one
    if (station < 0) {
        console.error("Invalid station ID");
        return;
    }
    console.log("Fetching ETA for station ID: ".concat(station));
    result = "";

    // Fetch the JSON data from the API
    fetch("https://rt.data.gov.hk/v1/transport/mtr/lrt/getSchedule?station_id=".concat(station))
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Couldn't fetch API!!");
            }
            return response.json(); // Parse the response as JSON
        })
        .then(function (data) {
            let decodedData = decodeJson(data); // Get the decoded JSON
            formatSchedule(decodedData); // Pass it to formatSchedule
        })
        .catch(function (error) { console.error(error); });
}
    
function GetEachStation(Route_Num) {
    const R507 = [1, 240, 250, 260, 265, 270, 280, 295, 70, 75, 230, 220, 212, 160, 150, 140];
    const R507_Dest = ["田景", "屯門碼頭"]; // Fixed syntax

    switch (Route_Num) {
        case 507:
            ScheduleFormatList(R507, R507_Dest, 507);
            break;
        case 505:
            // Implement logic for route 505
            break;
        default:
            console.error("Invalid Route Number");
    }
}

function ScheduleFormatList(stationArray, destArray, route_num) {
    result = "";  // Start with an empty result
    let orderedResults = {}; // Object to store results per station
    
    let fetchPromises = stationArray.map(station_id => 
        fetch(`https://rt.data.gov.hk/v1/transport/mtr/lrt/getSchedule?station_id=${station_id}`)
            .then(response => {
                if (!response.ok) throw new Error("Couldn't fetch API!");
                return response.json();
            })
            .then(data => {
                let decodedData = decodeJson(data);
                let stationName = GetStationName().getStationNames(station_id);
                
                let groupedRoutes = {}; // Object to group trains by destination
                
                decodedData.platform_list.forEach(platform => {
                    platform.route_list.forEach(route => {
                        if (route.route_no === String(route_num) && destArray.includes(route.dest_ch)) {
                            if (!groupedRoutes[route.dest_ch]) {
                                groupedRoutes[route.dest_ch] = `${route.route_no} // ${route.dest_ch} //`;
                            }
                            groupedRoutes[route.dest_ch] += ` ${route.time_ch} (${route.train_length}卡) ||`; // Append train info
                        }
                    });
                });

                // Ensure every station is recorded, even if no matching trains are found
                orderedResults[station_id] = groupedRoutes && Object.keys(groupedRoutes).length > 0
                    ? `**車站: ${stationName}**<br>` + Object.values(groupedRoutes).map(routeLine => routeLine.slice(0, -2)).join("<br>") + "<br>"
                    : `**車站: ${stationName}**<br>沒有可用的列車信息<br>`; // Ensure station appears even if no data is found
            })
            .catch(error => console.error(error))
    );

    // Wait for all fetch calls to finish, then output results in array order
    Promise.all(fetchPromises).then(() => {
        stationArray.forEach(station_id => {
            if (orderedResults[station_id]) {
                result += orderedResults[station_id]; // Add in defined array order
            }
        });
        document.getElementById('text').innerHTML = result;
    });
}
