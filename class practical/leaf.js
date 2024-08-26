// // Initialize map
let map = L.map('map').setView([1.3521, 103.8198], 11);

// Add tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Data URLs
const url1 = 'https://gist.githubusercontent.com/kunxin-chor/a5f5cab3e8a6ad0868134334c1432d9a/raw/ca55e99903d5913fc0e701ddab139472fe7fe4fa/nature.json';
const url2 = 'https://gist.githubusercontent.com/kunxin-chor/a5f5cab3e8a6ad0868134334c1432d9a/raw/ca55e99903d5913fc0e701ddab139472fe7fe4fa/malls.json';
const url3 = 'https://gist.githubusercontent.com/kunxin-chor/a5f5cab3e8a6ad0868134334c1432d9a/raw/ca55e99903d5913fc0e701ddab139472fe7fe4fa/hdb.json';

// Layer groups and marker clusters
let group1 = L.layerGroup();
let group2 = L.layerGroup();
let group3 = L.layerGroup();

let markerClusterLayer1 = L.markerClusterGroup();
let markerClusterLayer2 = L.markerClusterGroup();
let markerClusterLayer3 = L.markerClusterGroup();

// Function to create markers
function createMarkers(data, markerClusterLayer) {
  for (let i = 0; i < data.length; i++) { //we can change data.length to a certain amt such as 20 as data sets can be big.
    const item = data[i];
    const { coordinates, name } = item;
    const marker = L.marker([coordinates[0], coordinates[1]])
      .bindPopup(name);
    markerClusterLayer.addLayer(marker);
}

  // same thing but different formatting
  // data.forEach(item => {
  //   const { coordinates, name } = item;
  //   const marker = L.marker([coordinates[0], coordinates[1]])
  //     .bindPopup(name);
  //   markerClusterLayer.addLayer(marker);
  // });
}

// Fetch data and add markers
axios.get(url1)
  .then(response => {
    createMarkers(response.data, markerClusterLayer1);
    group1.addLayer(markerClusterLayer1);
    map.addLayer(group1); // Ensure the group is added to the map
  })
  .catch(error => console.error('Error fetching nature data:', error));

axios.get(url2)
  .then(response => {
    createMarkers(response.data, markerClusterLayer2);
    group2.addLayer(markerClusterLayer2);
    map.addLayer(group2); // Ensure the group is added to the map
  })
  .catch(error => console.error('Error fetching malls data:', error));

axios.get(url3)
  .then(response => {
    createMarkers(response.data, markerClusterLayer3);
    group3.addLayer(markerClusterLayer3);
    map.addLayer(group3); // Ensure the group is added to the map
  })
  .catch(error => console.error('Error fetching HDB data:', error));

// Layer control
const overlays = {
  "Nature": group1,
  "Malls": group2,
  "HDB": group3
};

L.control.layers(null, overlays).addTo(map);
