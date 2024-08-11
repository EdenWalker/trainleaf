let map = L.map('map').setView([1.3521, 103.8198], 13);


// let map = L.map('map').setView([1.3521, 103.8198], 11);

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
// Create a marker cluster group
let markerClusterLayer = L.markerClusterGroup({
  maxClusterRadius: 60, 
  disableClusteringAtZoom: 16 }
);

// Function to create custom icons
function createCustomIcon(exitCode) {
  const images = iconMapping[exitCode];
  
  const div = document.createElement('div');
  div.className = 'custom-icon';
  
  if (Array.isArray(images)) {
    images.forEach((src, index) => {
      const img = document.createElement('img');
      img.src = src;
      img.style.position = 'absolute';
      img.style.top = '0';
      img.style.left = `${index * 20}px`;
      div.appendChild(img);
    });
  } else {
    const img = document.createElement('img');
    img.src = images;
    div.appendChild(img);
  }
  
  return L.divIcon({
    className: '',
    html: div.outerHTML,
    iconSize: [25, 25],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
}

// Function to extract attributes from description
function extractAttributes(description) {
  // Extract station name
  const stationNameMatch = description.match(/<th>STATION_NA<\/th>\s*<td>([^<]+)<\/td>/);
  const stationName = stationNameMatch ? stationNameMatch[1].replace(/ MRT STATION$/, '') : "No Name";

  // Extract exit code
  const exitCodeMatch = description.match(/<th>EXIT_CODE<\/th>\s*<td>(Exit [A-Z0-9]+)<\/td>/);
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
console.log(response.data)
    L.geoJSON(geojsonData, {
      onEachFeature: function (feature, layer) {
        console.log(feature.properties); 
        if (feature.properties) {
          let description = feature.properties.Description || "No Description";
          let { stationName, exitCode } = extractAttributes(description);

          let popupContent = `<b>${stationName}</b><br>${exitCode}`;
          layer.bindPopup(popupContent);
        }
      },
      pointToLayer: function (feature, latlng) {
        console.log(feature.properties.Description); 
        let description = feature.properties.Description || "No Description";
        let { exitCode } = extractAttributes(description);
        let icon = createCustomIcon(exitCode);

        // Create and add marker to cluster layer
        let marker = L.marker(latlng, { icon: icon });
        markerClusterLayer.addLayer(marker);
      }
    }).addTo(map);

    // Add marker cluster layer to map
    map.addLayer(markerClusterLayer);
  })
  .catch(error => console.error('Error loading GeoJSON data:', error));


// Function to extract attributes from the description



  axios.get('mrt/ProcessedGeoJSON.geoJSON')
  .then(response => {

    var geojsonData = response.data;
    L.geoJSON(geojsonData, {
      onEachFeature: function (feature, layer) {
       
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





  function fetchBusStops() {
    // Fetch local JSON file
    fetch('bus/BusStops.json')  // Adjust the path if necessary
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
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
  
  // Fetch bus stops and add markers
  fetchBusStops();

  // function fetchBusStops2() {
  //   fetch('http://datamall2.mytransport.sg/ltaodataservice/BusStops', {
  //     headers: {
  //       'AccountKey': 'LI8D5j1CQYmo+ZwU5QdGtg==', // Replace with your actual account key if needed
  //       'accept': 'application/json'
  //     }
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     // Process the data and add markers to the map
  //     var busStops = data.value;
  //     busStops.forEach(function(stop) {
  //       L.marker([stop.Latitude, stop.Longitude])
  //         .addTo(map)
  //         .bindPopup(`<b>${stop.Description}</b><br>${stop.RoadName}`);
  //     });
  //   })
  //   .catch(error => console.error('Error fetching data:', error));
  // }
  
  // // Fetch bus stops and add markers
  // fetchBusStops2();
  // function fetchBusStops() {
  //   fetch('http://datamall2.mytransport.sg/ltaodataservice/BusStops', {
  //     headers: {
  //       'AccountKey': 'LI8D5j1CQYmo+ZwU5QdGtg==',  // Replace with your actual account key if needed
  //       'accept': 'application/json'
  //     }
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     // Process the data and add markers
  //     var busStops = data.value;
  //     busStops.forEach(function(stop) {
  //       L.marker([stop.Latitude, stop.Longitude])
  //         .addTo(map)
  //         .bindPopup(`<b>${stop.Description}</b><br>${stop.RoadName}`);
  //     });
  //   })
  //   .catch(error => console.error('Error fetching data:', error));
  // }

  // // Fetch bus stops and add markers
  // fetchBusStops();
