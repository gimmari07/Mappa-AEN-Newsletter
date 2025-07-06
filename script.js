
const map = L.map('map').setView([20, 0], 2);

// Basemap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Load country geoJSON
fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
  .then(res => res.json())
  .then(geojson => {
    fetch('webapp_data_by_country.json')
      .then(data => data.json())
      .then(countryData => {
        L.geoJSON(geojson, {
          style: feature => ({
            color: countryData[feature.properties.ADMIN] ? '#0078D4' : '#ccc',
            weight: 1,
            fillOpacity: 0.5
          }),
          onEachFeature: (feature, layer) => {
            const name = feature.properties.ADMIN;
            if (countryData[name]) {
              const entries = countryData[name]
                .map(d => `<b>${d.title}</b><br>${d.description}${d.link ? `<br><a href="${d.link}" target="_blank">Link</a>` : ''}`)
                .join("<hr>");
              layer.on('click', () => {
                L.popup()
                  .setLatLng(layer.getBounds().getCenter())
                  .setContent(`<h4>${name}</h4>${entries}`)
                  .openOn(map);
              });
              layer.bindTooltip(name);
            }
          }
        }).addTo(map);
      });
  });
