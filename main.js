import data from "./geoJson";

var worldBounds = L.latLngBounds(
  L.latLng(-90, -180), // Southwest corner (bottom-left)
  L.latLng(90, 180) // Northeast corner (top-right)
);

var map = L.map("map", {
  maxBounds: worldBounds,
  center: [0, 0], // Initial map center
  zoom: 2, // Initial zoom level
})
  .setView([0, 0], 2)
  .setMinZoom(2)
  .setMaxZoom(10);

const dataToGeoJson = tryToFilter(data);

//all countries
L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "©OpenStreetMap, ©CartoDB",
  }
).addTo(map);

map.zoomControl.setPosition("bottomright");

function content(properties) {
  const extraData = [
    {
      CountryName: "Portugal",
      CountryAbrv: "PT",
      Description: "Portugal description 1",
      HasRestrictionsToApply: true,
      TotalValueNotLicensed: 105,
      LicensedToOtherOwners: "5",
    },
    {
      CountryName: "Spain",
      CountryAbrv: "ES",
      Description: "dafsdfasdf",
      TotalValueNotLicensed: 40,
      LicensedToOtherOwners: "2",
    },
  ];

  const values = filterByCountryAbrv(properties.ISO2, extraData);

  if (!values) return;

  return `<span style="font-weight: bold">${properties.NAME}</span> (${
    properties.ISO2
  })<br><br>
    ${values ? values.Description : ""}<br>

    ${
      values ? "Total Value Not Licensed " + values.TotalValueNotLicensed : ""
    }<br>
    ${
      values ? "Licensed To Other Owners " + values.LicensedToOtherOwners : ""
    }<br>
    ${
      values.HasRestrictionsToApply
        ? "<span style='color: red; font-weight: bold'>Has restrictions to apply</span>"
        : ""
    }<br>
  `;
}

function tryToFilter(data, ISO2 = "PT") {
  for (var i = 0; i < data.features.length; i++) {
    var feature = data.features[i];
    if (feature.properties.ISO2 === ISO2) {
      return feature;
    }
  }
}

function filterByCountryAbrv(countryISO2, extraData) {
  var filtered = extraData.find((x) => x.CountryAbrv === countryISO2);
  return filtered;
}

//function to zoom into a country
map.flyTo([39.909736, -9.667969], 3);

//country selected with a layer on top
var secondLayer = L.geoJSON(dataToGeoJson, {
  style: {
    fillColor: "#8A428F",
    weight: 0,
    opacity: 1,
    color: "white",
    dashArray: "1",
    fillOpacity: 1,
  },
  onEachFeature: (feature, layer) => {
    layer
      .bindPopup(feature.properties.NAME)
      .setPopupContent(content(feature.properties));
  },
}).addTo(map);

// remove a specific layer when its created.
//map.removeLayer(layer);

secondLayer.on("mouseover", handleMouseOver);
secondLayer.on("mouseout", handleMouseOut);
secondLayer.on("click", handleClick);

function handleMouseOver(e) {
  var layer = e.layer; // The layer that was hovered over
  var laglng = e.latlng;
  console.log(e);

  // Display the popup content
  if (!layer.isPopupOpen()) {
    // If the popup is not open, open it
    layer.openPopup([laglng.lat, laglng.lng]);
  }

  this.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7,
  });
}

function handleMouseOut(e) {
  var layer = e.layer; // The layer that was unhovered
  // Close the popup when the mouse leaves the layer

  this.setStyle({
    fillColor: "#8A428F",
    weight: 0,
    opacity: 1,
    color: "white",
    dashArray: "1",
    fillOpacity: 1,
  });

  layer.closePopup();
}

function handleClick(e) {
  var layer = e.layer; // The layer that was clicked
  var laglng = e.latlng;

  // Check if the popup is open
  if (!layer.isPopupOpen()) {
    layer.closePopup();
  } else {
    layer.openPopup([laglng.lat, laglng.lng]);
  }
}
