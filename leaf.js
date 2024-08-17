
let map = L.map('map').setView([1.3521, 103.8198], 11);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
const iconMapping = {
  "Exit A": "img/1.png",
  "Exit B": "img/2.png",
  "Exit C": "img/3.png",
  "Exit D": "img/4.png",
  "Exit E": "img/5.png",
  "Exit F": "img/6.png",
  "Exit G": "img/7.png",
  "Exit H": "img/8.png",
  "Exit I": "img/9.png",
  "Exit J": "img/10.png",
  "Exit K": "img/11.png",
  "Exit L": "img/12.png",
  "Exit M": "img/13.png",
  "Exit 1": "img/1.png",
  "Exit 2": "img/2.png",
  "Exit 3": "img/3.png",
  "Exit 4": "img/4.png",
  "Exit 5": "img/5.png",
  "Exit 6": "img/6.png",
  "Exit 7": "img/7.png",
  "Exit 8": "img/8.png",
  "Exit 9": "img/9.png",
  "Exit 10": "img/10.png",
  "Exit 11": "img/11.png",
  "Exit 12": "img/12.png",
  "Exit 13": "img/13.png",
};

// Function to create custom icons
function createCustomIcon(exitCode) {
  const images = iconMapping[exitCode];
  
  // Create a div element for the custom marker
  const div = document.createElement('div');
  div.className = 'custom-icon';
  
  // Add images to the div
  if (Array.isArray(images)) {
    images.forEach((src, index) => {
      const img = document.createElement('img');
      img.src = src;
      img.style.position = 'absolute';
      img.style.top = '0';
      img.style.left = `${index * 20}px`; // Adjust position for overlap
      div.appendChild(img);
    });
  } else {
    // Single image case
    const img = document.createElement('img');
    img.src = images;
    div.appendChild(img);
  }
  
  return L.divIcon({
    className: '', // No extra class
    html: div.outerHTML, // Use the div's outerHTML for the custom icon
    iconSize: [25, 25], // Size of the icon
    iconAnchor: [12, 24], // Anchor point of the icon
    popupAnchor: [0, -24] // Popup anchor point
  });
}

// Function to extract attributes from the description
function extractAttributes(description) {
  // Extract station name and clean it
  const stationNameMatch = description.match(/<th>STATION_NA<\/th>\s*<td>([^<]+)<\/td>/);
  let stationName = stationNameMatch ? stationNameMatch[1] : "No Name";
  stationName = stationName.replace(/ MRT STATION$/, ''); // Remove " MRT STATION" if present
  
  // Extract exit code
  const exitCodeMatch = description.match(/<th>EXIT_CODE<\/th>\s*<td>(Exit [A-M]|Exit [1-9]|Exit 10|Exit 11|Exit 12|Exit 13)<\/td>/);
  const exitCode = exitCodeMatch ? exitCodeMatch[1] : "No Exit Code";
  
  return {
    stationName,
    exitCode
  };
}

// Fetch and display GeoJSON data for MRT stations
axios.get('mrt/LTAMRTStationExit.geoJSON')
  .then(response => {
    const geojsonData = response.data;

    L.geoJSON(geojsonData, {
      onEachFeature: function (feature, layer) {
        if (feature.properties) {
          let description = feature.properties.Description || "No Description";
          let { stationName, exitCode } = extractAttributes(description);

          // Create popup content
          let popupContent = `<b>${stationName}</b><br>${exitCode}`;
          layer.bindPopup(popupContent);
        }
      },
      pointToLayer: function (feature, latlng) {
        let description = feature.properties.Description || "No Description";
        let { exitCode } = extractAttributes(description);
        let icon = createCustomIcon(exitCode);

        return L.marker(latlng, {
          icon: icon
        });
      }
    }).addTo(map);
  })
  .catch(error => console.error('Error loading GeoJSON data:', error));

  axios.get('mrt/ProcessedGeoJSON.geoJSON')
  .then(response => {
    // console.log(response.data); // Debug: Check the structure of the GeoJSON data
    var geojsonData = response.data;
    L.geoJSON(geojsonData, {
      onEachFeature: function (feature, layer) {
        // console.log(feature.properties); // Debug: Check the properties of each feature
        if (feature.properties && feature.properties.STN_NAM_DE) {
          layer.bindPopup(feature.properties.STN_NAM_DE);
        }
      },
      style: function (feature) {
        return {
          fillColor: "#ff0000",
          color: "#ff0000",
          weight: 2,
          opacity: 1
        };
      }
    }).addTo(map);
  })
  .catch(error => console.error('Error loading GeoJSON data:', error));

//   function fetchBusStops() {
//     fetch('bus/BusStops.xml')  // Load local XML file
//         .then(response => response.text())  // Get response as text
//         .then(xmlString => {
//             // Parse XML string into an XML document
//             const parser = new DOMParser();
//             const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

//             // Extract bus stop entries
//             const entries = xmlDoc.getElementsByTagName('entry');
//             Array.from(entries).forEach(entry => {
//                 const busStopCode = entry.getElementsByTagName('d:BusStopCode')[0].textContent;
//                 const roadName = entry.getElementsByTagName('d:RoadName')[0].textContent;
//                 const description = entry.getElementsByTagName('d:Description')[0].textContent;
//                 const latitude = parseFloat(entry.getElementsByTagName('d:Latitude')[0].textContent);
//                 const longitude = parseFloat(entry.getElementsByTagName('d:Longitude')[0].textContent);

//                 // Create a marker and add to the map
//                 L.marker([latitude, longitude])
//                     .addTo(map)
//                     .bindPopup(`<b>${description}</b><br>${roadName}`);
//             });
//         })
//         .catch(error => console.error('Error fetching data:', error));
// }

// Fetch bus stops and add markers
// fetchBusStops();
//   function fetchBusStops() {
//     // Fetch local JSON file
//     fetch('bus/BusStops.json')  // Adjust the path if necessary
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok ' + response.statusText);
//         }
//         return response.json();
//       })
//       .then(data => {
//         // Process the data and add markers
//         var busStops = data.value;
//         busStops.forEach(function(stop) {
//           L.marker([stop.Latitude, stop.Longitude])
//             .addTo(map)
//             .bindPopup(`<b>${stop.Description}</b><br>${stop.RoadName}`);
//         });
//       })
//       .catch(error => console.error('Error fetching data:', error));
//   }
  
//   // Fetch bus stops and add markers
//   fetchBusStops();

//   function fetchBusStops2() {
//     fetch('https://datamall2.mytransport.sg/ltaodataservice/BusStops', {
//       headers: {
//         'AccountKey': 'LI8D5j1CQYmo+ZwU5QdGtg==', // Replace with your actual account key if needed
//         'accept': 'application/json'
//       }
//     })
//     .then(response => response.json())
//     .then(data => {
//       // Process the data and add markers to the map
//       var busStops = data.value;
//       busStops.forEach(function(stop) {
//         L.marker([stop.Latitude, stop.Longitude])
//           .addTo(map)
//           .bindPopup(`<b>${stop.Description}</b><br>${stop.RoadName}`);
//       });
//     })
//     .catch(error => console.error('Error fetching data:', error));
//   }
  
//   // Fetch bus stops and add markers
//   fetchBusStops2();
  function fetchBusStops() {
    fetch('https://datamall2.mytransport.sg/ltaodataservice/BusStops', {
      headers: {
        'AccountKey': 'LI8D5j1CQYmo+ZwU5QdGtg==',  // Replace with your actual account key if needed
        'accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      // Process the data and add markers
      var busStops = data.value;
      busStops.forEach(function(stop) {
        L.marker([stop.Latitude, stop.Longitude])
          .addTo(map)
          .bindPopup(`<b>${stop.Description}</b><br>${stop.RoadName}`);
      });
    })
    .catch(error => console.error('Error fetching data:', error));
  }

//   // Fetch bus stops and add markers
//   fetchBusStops();
//   const busStopCoordinates = {
//     "65009": [1.3000, 103.8000],
//     "97009": [1.3500, 103.8500],
//     "65199": [1.3100, 103.8200],
//     "96119": [1.3200, 103.8300],
//     "96111": [1.3300, 103.8400],
//     "65191": [1.3400, 103.8500],
//     "10499": [1.3600, 103.8600],
//     "77009": [1.3700, 103.8700]
// };

// // Example bus service data (parsed from JSON/XML)
// const busServices = [
//     {
//         "ServiceNo": "118",
//         "Operator": "GAS",
//         "Direction": 1,
//         "Category": "TRUNK",
//         "OriginCode": "65009",
//         "DestinationCode": "97009",
//         "AM_Peak_Freq": "5-08",
//         "AM_Offpeak_Freq": "8-12",
//         "PM_Peak_Freq": "8-10",
//         "PM_Offpeak_Freq": "09-14",
//         "LoopDesc": ""
//     },
//     // ... other services
// ];

// // Add bus stops to the map
// busServices.forEach(service => {
//     const originCoords = busStopCoordinates[service.OriginCode];
//     const destinationCoords = busStopCoordinates[service.DestinationCode];

//     if (originCoords) {
//         L.marker(originCoords)
//             .addTo(map)
//             .bindPopup(`<b>Service: ${service.ServiceNo}</b><br>Operator: ${service.Operator}<br>Direction: ${service.Direction}`);
//     }

//     if (destinationCoords) {
//         L.marker(destinationCoords)
//             .addTo(map)
//             .bindPopup(`<b>Service: ${service.ServiceNo}</b><br>Operator: ${service.Operator}<br>Direction: ${service.Direction}`);
//     }
// });
const apiUrl = 'https://datamall2.mytransport.sg/ltaodataservice/TrainLines';
async function fetchTrainLineData(trainLine) {
  try {
      const response = await fetch(`${apiUrl}?TrainLine=${trainLine}`, {
          headers: {
              'AccountKey': 'LI8D5j1CQYmo+ZwU5QdGtg==', // Replace with your actual AccountKey
              'Accept': 'application/json'
          }
      });
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      displayTrainLineData(data);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

function displayTrainLineData(data) {
  const list = document.getElementById('data-list');
  list.innerHTML = ''; // Clear previous data
  data.value.forEach(item => {
      const listItem = document.createElement('li');
      listItem.textContent = `Station: ${item.Station}, StartTime: ${item.StartTime}, EndTime: ${item.EndTime}, CrowdLevel: ${item.CrowdLevel}`;
      list.appendChild(listItem);
  });
}

document.getElementById('train-line-select').addEventListener('change', (event) => {
  const selectedLine = event.target.value;
  fetchTrainLineData(selectedLine);
});

// Fetch initial data for the default selected line
fetchTrainLineData(document.getElementById('train-line-select').value);