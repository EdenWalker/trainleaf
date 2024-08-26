let map = L.map('map').setView([1.3521, 103.8198], 11);



L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
const iconMapping = {
  "Exit A": "img/A.png",
  "Exit B": "img/B.png",
  "Exit C": "img/C.png",
  "Exit D": "img/D.png",
  "Exit E": "img/E.png",
  "Exit F": "img/F.png",
  "Exit G": "img/G.png",
  "Exit H": "img/H.png",
  "Exit I": "img/I.png",
  "Exit J": "img/J.png",
  "Exit K": "img/K.png",
  "Exit L": "img/J.png", 
  "Exit M": "img/M.png", 
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
function createCustomIcon(exitCode) {
  const src = iconMapping[exitCode];
  return L.divIcon({
    className: 'custom-icon',
    html: `<img src="${src}" style="width: 25px; height: 25px;" />`,
    iconSize: [25, 25],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
}

// Function to create cluster icons
function createClusterIcon(cluster) {
  const childCount = cluster.getChildCount();
  const stationName = cluster.getAllChildMarkers()[0].options.stationName;
  return L.divIcon({
    html: `<div class="custom-cluster-icon"><div class="cluster-icon-title">${stationName}</div><div class="cluster-icon-number">${childCount}</div></div>`,
    className: 'custom-cluster',
    iconSize: [40, 40]
  });
}

// Function to extract attributes from description
function extractAttributes(description) {
  const stationNameMatch = description.match(/<th>STATION_NA<\/th>\s*<td>([^<]+)<\/td>/);
  const stationName = stationNameMatch ? stationNameMatch[1].replace(/ MRT STATION$/, '') : "No Name";
  const exitCodeMatch = description.match(/<th>EXIT_CODE<\/th>\s*<td>(Exit [A-Z0-9]+)<\/td>/);
  const exitCode = exitCodeMatch ? exitCodeMatch[1] : "No Exit Code";
  return { stationName, exitCode };
}

// Fetch and display GeoJSON data for MRT stations
// function fetchAndDisplayMarkers(selectedLine) {
//   axios.get('mrt/LTAMRTStationExit.geoJSON')
//     .then(response => {
//       const geojsonData = response.data;
//       const stationClusters = {};

//       // Clear existing markers and clusters
//       map.eachLayer(layer => {
//         if (layer instanceof L.MarkerClusterGroup) {
//           map.removeLayer(layer);
//         }
//       });

//       L.geoJSON(geojsonData, {
//         onEachFeature: function (feature, layer) {
//           if (feature.properties) {
//             const description = feature.properties.Description || "No Description";
//             const { stationName, exitCode } = extractAttributes(description);
//             const popupContent = `<b>${stationName}</b><br>${exitCode}`;
//             layer.bindPopup(popupContent);

//             if (!stationClusters[stationName]) {
//               stationClusters[stationName] = L.markerClusterGroup({
//                 maxClusterRadius: 60,
//                 disableClusteringAtZoom: 16,
//                 iconCreateFunction: createClusterIcon
//               });
//               map.addLayer(stationClusters[stationName]);
//             }

//             const icon = createCustomIcon(exitCode);
//             const marker = L.marker(layer.getLatLng(), { icon });
//             marker.bindPopup(popupContent);
//             stationClusters[stationName].addLayer(marker);

//             if (selectedLine === 'ALL' || feature.properties.lineName === selectedLine) {
//               if (!lineLayers[selectedLine]) {
//                 lineLayers[selectedLine] = L.layerGroup().addTo(map);
//               }
//               lineLayers[selectedLine].addLayer(marker);
//             }
//           }
//         }
//       });
//     })
//     .catch(error => console.error('Error loading GeoJSON data:', error));
//}

// Fetch initial markers for the default selected line
// document.getElementById('train-line-select').addEventListener('change', (event) => {
//   fetchAndDisplayMarkers(event.target.value);
// });
// fetchAndDisplayMarkers(document.getElementById('train-line-select').value);

// // Function to fetch and display train line data
const apiUrl = 'https://datamall2.mytransport.sg/ltaodataservice/PCDRealTime';
async function fetchTrainLineData(trainLine) {
  try {
    const response = await fetch(`${apiUrl}?TrainLine=${trainLine}`, {
      headers: {
        'AccountKey': 'LI8D5j1CQYmo+ZwU5QdGtg==',
        'Accept': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    displayTrainLineData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function displayTrainLineData(data) {
  const list = document.getElementById('data-list');
  list.innerHTML = '';
  data.value.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = `Station: ${item.Station}, CrowdLevel: ${item.CrowdLevel}`;
    list.appendChild(listItem);
  });
}

// document.getElementById('train-line-select').addEventListener('change', (event) => {
//   fetchTrainLineData(event.target.value);
// });
// fetchTrainLineData(document.getElementById('train-line-select').value);

// Fetch and display MRT stations with a custom icon
const MrtIcon2 = L.icon({
  iconUrl: 'img/MRT.png',
  iconSize: [20, 20],
  iconAnchor: [10, 20],
  popupAnchor: [0, -20]
});

axios.get('mrt/MRTStation.geoJSON')
  .then(response => {
    const MRTStation = response.data;
    L.geoJSON(MRTStation, {
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.Description) {
          layer.bindPopup(feature.properties.Name);
        }
      },
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: MrtIcon2 });
      }
    }).addTo(map);
  })


  // Fetch MRT lines data

  axios.get('mrt/mrtbyline.js')
  .then(response => {
      const mrtLines = response.data;

      mrtLines.forEach(line => {
          if (line.stations) {
              addLineLayer(line.stations, line.operator);
          } else if (line.loops) {
              Object.values(line.loops).forEach(loopStations => {
                  addLineLayer(loopStations, line.operator);
              });
          }
      });

      setupFilters();
  });

function addLineLayer(stations, operator) {
  // Extract coordinates and create polyline
  const coordinates = stations.map(station => [station.lat, station.lon]);

  // Create a polyline for the MRT line
  const polyline = L.polyline(coordinates, { color: getLineColor(operator) }).addTo(map);

  // Store polyline in lineLayers object by operator
  lineLayers[operator] = polyline;
}

function getLineColor(operator) {
  const colors = {
      'SBST': 'blue',
      'SMRT': 'red',
      'CCL': 'orange',
      'DTL': 'blue',
      'EWL': 'green',
      'NEL': 'purple',
      'NSL': 'red',
      'tel' : 'brown',
      'BPL': 'brown',
      'SLRT': 'pink',
      'PLRT': 'gray'
  };
  return colors[operator] || 'black';
}

function setupFilters() {
  document.querySelectorAll('.train-line-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', function() {
          if (this.value === 'ALL') {
              // Show all lines if 'All Stations' is checked
              if (this.checked) {
                  Object.values(lineLayers).forEach(layer => map.addLayer(layer));
              } else {
                  Object.values(lineLayers).forEach(layer => map.removeLayer(layer));
              }
          } else {
              // Toggle specific line layers
              if (this.checked) {
                  if (lineLayers[this.value]) {
                      map.addLayer(lineLayers[this.value]);
                  }
              } else {
                  if (lineLayers[this.value]) {
                      map.removeLayer(lineLayers[this.value]);
                  }
              }

              // Show/hide all lines if 'All Stations' checkbox is not checked
              document.querySelector('.train-line-checkbox[value="ALL"]').checked = false;
          }
      });
  });
}



axios.get('mrt/mrtbyline.js')
.then(response => {
  const mrtLines = response.data;
  
  // Create a dictionary of stations by their lowercase names for easy lookup
  const stationsByName = {};
  let operator = '';

  // Process MRT lines data
  mrtLines.forEach(line => {
    if (line.stations) {
      // Process standard MRT stations
      processStations(line.stations, line.operator);
    } else if (line.loops) {
      // Process LRT lines with nested loops
      Object.values(line.loops).forEach(loopStations => {
        processStations(loopStations, line.operator);
      });
    }

    // Update the operator if not already set
    if (!operator && line.operator) {
      operator = line.operator;
    }
  });

  // Fetch GeoJSON data
  axios.get('mrt/ProcessedGeoJSON.geoJSON')
    .then(response => {
      const mrtpolygon = response.data;

      // Add GeoJSON data to the map
      addGeoJSONToMap(mrtpolygon, stationsByName, operator);
    })
    .catch(error => {
      console.error('Error fetching GeoJSON data:', error);
    });

})
.catch(error => {
  console.error('Error fetching MRT lines data:', error);
});

// Process stations and update the dictionary
function processStations(stations, lineOperator) {
stations.forEach(station => {
  const lowerCaseName = station.name.toLowerCase().trim();
  if (stationsByName[lowerCaseName]) {
    // Append new code if it already exists
    stationsByName[lowerCaseName].code += ` ${station.code}`;
  } else {
    // Add new station entry
    stationsByName[lowerCaseName] = {
      code: station.code,
      operator: lineOperator,
      displayName: capitalizeWords(station.name)
    };
  }
});
}

// Add GeoJSON data to the map
function addGeoJSONToMap(geoJSONData, stationsByName, defaultOperator) {
L.geoJSON(geoJSONData, {
  onEachFeature: function (feature, layer) {
    if (feature.properties && feature.properties.STN_NAM_DE) {
      const stationName = normalizeStationName(feature.properties.STN_NAM_DE);
      const station = stationsByName[stationName];

      if (station) {
        const popupContent = `
          Station: ${station.displayName}<br>
          Code: ${station.code}<br>
          Operator: ${station.operator || defaultOperator}
        `;
        layer.bindPopup(popupContent);
      } else {
        // Optionally log if station info is not available for debugging
        console.log(`Station information not available for: ${stationName}`);
      }
    }
  },
  style: function () {
    return {
      fillColor: "#ff0000",
      color: "#ff0000",
      weight: 2,
      opacity: 1
    };
  }
}).addTo(map);
}

// Normalize station names for comparison
function normalizeStationName(name) {
return name.toLowerCase().trim()
  .replace(/ mrt station$/, '')
  .replace(/ lrt station$/, '')
  .replace(/^\s+|\s+$/g, ''); // Remove leading/trailing spaces
}

// Helper function to capitalize the first letter of each word
function capitalizeWords(str) {
return str.replace(/\b\w/g, char => char.toUpperCase());
}