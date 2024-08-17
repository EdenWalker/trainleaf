const fs = require('fs');

// Input and output files
const inputJsonFile = 'bus/BusRoutes.json';
const outputGeoJsonFile = 'bus/BusRoutes.geojson';

// Function to convert JSON to GeoJSON
const convertJsonToGeoJson = () => {
  fs.readFile(inputJsonFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      console.log('Parsed JSON Data:', jsonData); // Inspect the data here
      
      // Check if jsonData has the expected structure
      if (!Array.isArray(jsonData.value)) {
        throw new Error('Expected jsonData.value to be an array');
      }

      // Convert to GeoJSON format
      const features = jsonData.value.map(item => {
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [parseFloat(item.Longitude), parseFloat(item.Latitude)]
          },
          properties: {
            ServiceNo: item.ServiceNo,
            Operator: item.Operator,
            Direction: item.Direction,
            StopSequence: item.StopSequence,
            BusStopCode: item.BusStopCode,
            Distance: item.Distance,
            WD_FirstBus: item.WD_FirstBus,
            WD_LastBus: item.WD_LastBus,
            SAT_FirstBus: item.SAT_FirstBus,
            SAT_LastBus: item.SAT_LastBus,
            SUN_FirstBus: item.SUN_FirstBus,
            SUN_LastBus: item.SUN_LastBus
          }
        };
      });

      const geoJson = {
        type: 'FeatureCollection',
        features: features
      };

      fs.writeFile(outputGeoJsonFile, JSON.stringify(geoJson, null, 2), err => {
        if (err) {
          console.error('Error writing GeoJSON file:', err);
        } else {
          console.log('GeoJSON file created successfully.');
        }
      });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
    }
  });
};

// Run the conversion function
convertJsonToGeoJson();
