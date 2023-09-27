## Purpose

The purpsose of this poc is to test some functionalites of using leaflet.js for an OutSystems project

## Library used

I use for render the map with some overlays and information this library:

- [leaflet.js](https://leafletjs.com/index.html)

## Run the project

> npm install

> npm run dev

## Data

The data of this project is totally fake, I use this data for the example:

```javascript
const extraData = [
  {
    CountryName: "Portugal",
    CountryAbrv: "PT",
    Description: "Portugal description 1",
    HasRestrictionsToApply: true,
    TotalValueNotLicensed: 105,
    LicensedToOtherOwners: "5",
  },
];
```

For the rendering of the map I use the data from my file geoJson.js. In this file we a have a geoJson object with the data of the countries.

For populate correctly the data of each popup I use the function onEachFeature of leaflet.js. This function is called for each feature of the geoJson object. In this function I use the function content to render the content of the popup.

```javascript
 onEachFeature: (feature, layer) => {
    layer
      .bindPopup(feature.properties.NAME)
      .setPopupContent(content(feature.properties));
  },
```

The function content is a simple function that return a string with the html of the popup.

```javascript
function content(values) {
  if (!values) return;

  return `your html here...`;
}
```

For filter some of my geoJson file I created this function:

```javascript
function tryToFilter(data, ISO2 = "PT") {
  for (var i = 0; i < data.features.length; i++) {
    var feature = data.features[i];
    if (feature.properties.ISO2 === ISO2) {
      return feature;
    }
  }
}
```

The parameter ISO2 is the country code of the country that I want to filter. And the data parameter is the geoJson object.

## Conclusion

For using this methos in OutSystems we need to create a web block with the html and javascript of the map and then we can use this web block in our application.

Each function that we use in the javascript of the web block we need to create a function in the javascript of the application and call the function of the web block.
