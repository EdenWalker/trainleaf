let map = L.map('map').setView([1.3521, 103.8198], 11);


// let map = L.map('map').setView([1.3521, 103.8198], 11);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
const iconMapping = {
  "Exit A": "img/01.jpg",
  "Exit B": "img/02.jpg",
  "Exit C": "img/03.jpg",
  "Exit D": "img/04.jpg",
  "Exit E": "img/05.jpg",
  "Exit F": "img/06.jpg",
  "Exit G": "img/07.jpg",
  "Exit H": "img/08.jpg",
  "Exit I": "img/09.jpg",
  "Exit J": ["img/01.jpg", "img/00.jpg"],
  "Exit K": ["img/01.jpg", "img/01.jpg"],
  "Exit L": ["img/01.jpg", "img/02.jpg"],
  "Exit M": ["img/01.jpg", "img/03.jpg"],
  "Exit 1": "img/01.jpg",
  "Exit 2": "img/02.jpg",
  "Exit 3": "img/03.jpg",
  "Exit 4": "img/04.jpg",
  "Exit 5": "img/05.jpg",
  "Exit 6": "img/06.jpg",
  "Exit 7": "img/07.jpg",
  "Exit 8": "img/08.jpg",
  "Exit 9": "img/09.jpg",
  "Exit 10": ["img/01.jpg", "img/00.jpg"],
  "Exit 11": ["img/01.jpg", "img/01.jpg"],
  "Exit 12": ["img/01.jpg", "img/02.jpg"],
  "Exit 13": ["img/01.jpg", "img/03.jpg"]
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
    console.log(response.data); // Debug: Check the structure of the GeoJSON data
    var geojsonData = response.data;
    L.geoJSON(geojsonData, {
      onEachFeature: function (feature, layer) {
        console.log(feature.properties); // Debug: Check the properties of each feature
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
    fetch('http://datamall2.mytransport.sg/ltaodataservice/BusStops', {
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

  // Fetch bus stops and add markers
  fetchBusStops();
