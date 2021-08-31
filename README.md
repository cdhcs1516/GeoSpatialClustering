# Geo-Spatial Data Clustering Tool


This project was developed based on React and [mapbox/supercluster](https://github.com/mapbox/supercluster). If you only cares the cluster results rather than showing on map, this tool is a good option for you. The infomation of clusters and points(including corresponding cluster id) can be saved to local excel files.

![image](https://github.com/cdhcs1516/GeoSpatialClustering/blob/master/imgs/page.png)

## Work on your own data

Currently, this tool only supports online data. The data format should be an array of JSON dicts. To make the tool working for your own data, you also need to slightly modify the codes in "onInitial" function in "App.js" to fit for the specific format.

## Parameters for settings

This is an interactive web tool so that you can set the essential parameters as you like. Currently, there are 7 parameters can be adjusted.
- Url of data
- Four lat-lng coordinations of the bounding box you want to focus.
- Current zoom level for clustering
- Searching radius for clustering

Please refer to the [repository](https://github.com/mapbox/supercluster) to see the usage of the parameters.

## Run this tool

### `npm install`

Install all packages needed for the application.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Tips

You may need to click the "Load Data and Initialize SuperCluster" button twice to make sure you have loaded the data.