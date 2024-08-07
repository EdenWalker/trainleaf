let map = L.map('map').setView([1.3521, 103.8198], 11);


// let map = L.map('map').setView([1.3521, 103.8198], 11);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

axios.get('LTAMRTStationExitGEOJSON.geoJSON')
  .then(response => {
    var geojsonData = response.data;
    L.geoJSON(geojsonData, {
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.Description) {
          layer.bindPopup(feature.properties.Description);
        }
      },
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 8,
          fillColor: "#ff7800",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      }
    }).addTo(map);
  })
  .catch(error => console.error('Error loading GeoJSON data:', error));


  axios.get('ProcessedGeoJSON.geoJSON')
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

