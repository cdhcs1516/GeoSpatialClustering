import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Supercluster from 'supercluster';
import {exportToCSV} from './exportToExcel';
import React, { useState } from 'react'

export default function App() {

  const [dataUrl, setDataUrl] = useState("");
  const [numPts, setNumPts] = useState(0);
  const [westLng, setWestLng] = useState(-180.0);
  const [eastLng, setEastLng] = useState(180.0);
  const [northLat, setNorthLat] = useState(90.0);
  const [southLat, setSouthLat] = useState(-90.0);
  const [radius, setRadius] = useState(30);
  const [zoom, setZoom] = useState(4);
  const [points, setPoints] = useState({});
  const [clusterIndex, setClusterIndex] = useState({});
  const [numCluster, setNumCluster] = useState(-1);

  const onSubmit = (e) => {
    e.preventDefault();

    fetch(dataUrl)
      .then(function (response) {
        
        return response.json();
      })
      .then(function (data) {
        console.log(data.length);
        const pts = data.map(marker => ({
          type: "Feature",
          properties: {cluster: false, markerId: marker.id},
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(marker.stoplng),
              parseFloat(marker.stoplat)
            ]
          }
        }));
        setPoints(pts);
        console.log(points);
        if (points.length > 0) {
          setNumPts(points.length);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
    
    const index = new Supercluster({
      radius: radius,
      maxZoom: 16
    })
    index.load(points);
    setClusterIndex(index);
  }

  const getCorrespondingCluster = (markerId, mapsClusterToMarkers) => {
    for (const [key, value] of mapsClusterToMarkers) {
      if (value.has(markerId)) {
        return key;
      }
    }
    return -1;
  }

  const onProcess = (e) => {
    e.preventDefault();

    const curCluster = clusterIndex.getClusters([westLng, southLat, eastLng, northLat], zoom);
    setNumCluster(curCluster.length)

    console.log(curCluster);
  }

  const saveClusters = () => {
    const curCluster = clusterIndex.getClusters([westLng, southLat, eastLng, northLat], zoom);
    setNumCluster(curCluster.length)

    let saved_clusters = curCluster.map(cluster => ({
      clusterId: cluster.id,
      count: cluster.properties.point_count,
      longitude: cluster.geometry.coordinates[0],
      latitude: cluster.geometry.coordinates[1]
    }));

    exportToCSV(saved_clusters, 'clusters');
  }

  const saveMarkers = () => {
    const curCluster = clusterIndex.getClusters([westLng, southLat, eastLng, northLat], zoom);
    setNumCluster(curCluster.length)

    const mapsClusterToMarkers = new Map();

    curCluster.forEach(cluster => {
      let markerSet = new Set(clusterIndex.getLeaves(cluster.id, Infinity).map(leaf => (leaf.properties.markerId)));
      mapsClusterToMarkers.set(cluster.id, markerSet);
    });

    let saved_markers = points.map(pt => ({
      markerId: pt.properties.markerId,
      longitude: pt.geometry.coordinates[0],
      latitude: pt.geometry.coordinates[1],
      clusterId: getCorrespondingCluster(pt.properties.markerId, mapsClusterToMarkers)
    }));

    exportToCSV(saved_markers, 'markers');
  }

  
  return (
    <div>
      <div className="project">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-auto">
              <h5 className="display-4 text-center">GeoSpatial Clustering Tool</h5>
              <hr />
              <form>
                <p>Url of JSON Data</p>
                <div className="form-group">
                  <input
                    type="url"
                    className="form-control form-control-lg"
                    placeholder="Data Url"
                    name="dataUrl"
                    value={dataUrl}
                    onChange={(e) => setDataUrl(e.target.value)}
                  />
                </div>
                <p>West Longitude of BBox</p>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="West Longitude"
                    name="westLng"
                    value={westLng}
                    onChange={(e) => setWestLng(e.target.value)}
                  />
                </div>
                <p>East Longitude of BBox</p>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="East Longitude"
                    name="eastLng"
                    value={eastLng}
                    onChange={(e) => setEastLng(e.target.value)}
                  />
                </div>
                <p>North Latitude of BBox</p>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="North Latitude"
                    name="northLat"
                    value={northLat}
                    onChange={(e) => setNorthLat(e.target.value)}
                  />
                </div>
                <p>South Latitude of BBox</p>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="South Latitude"
                    name="southLat"
                    value={southLat}
                    onChange={(e) => setSouthLat(e.target.value)}
                  />
                </div>
                <p>Current Zoom Level (from 0 to 16)</p>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="Zoom Level"
                    name="zoom"
                    value={zoom}
                    onChange={(e) => setZoom(e.target.value)}
                  />
                </div>
                <p>Radius (px) for Clustering</p>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="Radius"
                    name="radius"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                  />
                </div>
                <hr/>
                <p>Number of Points Loaded</p>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="Number of Points Loaded"
                    name="numPts"
                    value={numPts}
                    disabled
                  />
                </div>
                <button onClick={onSubmit} className="btn btn-primary btn-block mt-4">Load Data and Initialize SuperCluster</button>
              </form>

              {/* for results and download */}
              <hr/>
              <h5 className="display-4 text-center">Cluster Result</h5>
              <hr/>
              <form>
                <p>Number of Clusters</p>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="Number of Clusters"
                    name="numCluster"
                    value={numCluster}
                    disabled
                  />
                </div>
                
                <button onClick={onProcess} className="btn btn-primary btn-block mt-4">Process Cluster</button>
              </form>
              <hr/>
              <div className="d-grid gap-2 col-3 mx-auto">
                <button onClick={saveClusters} className="btn btn-primary">Save Clusters</button>
                <button onClick={saveMarkers} className="btn btn-primary">Save Markers</button>
              </div>
              <hr/>
              <p className="text-center">Implemented by Donghui Chen based on React and mapbox/supercluster.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  
}
