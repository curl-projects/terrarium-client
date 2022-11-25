import * as d3 from 'd3';
import RoadmapPointField from "~/components/RoadmapPointField/RoadmapPointField.js"
import { useEffect, useState } from 'react';
import _ from "underscore";
var gaussian = require('gaussian');
import network from '../../../public/assets/network.svg';
import refresh from '../../../public/assets/refresh.svg';

export default function RoadmapPointFieldScaffold(props){
  const [xMin, xMax] = [0, 1]
  const [yMin, yMax] = [0, 1]

  const [dataObj, setDataObj] = useState(generateUniformCoords(props.data))
  const [clusters, setClusters] = useState([])
  const [displayControl, setDisplayControl] = useState({data: true, clusters: false})


  useEffect(()=>{
    setDataObj(generateUniformCoords(props.data))
  }, [props.data])

  // SHARED FUNCTIONS
  function generateUniformCoords(data){
    const coordsArray = []
    for(let idx in data){
      let obj = {...data[idx],
                 "xDim": (Math.random() * (xMax-xMin)) + xMin,
                 "yDim": (Math.random() * (yMax-yMin)) + yMin,
                }

      coordsArray.push(obj)
    }

    return coordsArray
  }
  function generateClusterUnitCoords(data, labelName, clusterCoordsArray, region, dispersionFactor=10000){
    const clusterUnits = []

    for(let idx in data){
      let cluster = data[idx][labelName]
      let xGauss = gaussian(0, (xMax-xMin)/dispersionFactor)
      let yGauss = gaussian(0, (yMax-yMin)/dispersionFactor)

      let obj = {...data[idx],
                 "xDim": clusterCoordsArray.find(clus => clus.id === cluster)['xDim'] + xGauss.random(1)[0],
                 "yDim": clusterCoordsArray.find(clus => clus.id === cluster)['yDim'] + yGauss.random(1)[0],
                }
      clusterUnits.push(obj)
    }
    return clusterUnits
  }

  // FULL GENERATORS
  function generateUniform(e){
    // GENERATOR FUNCTIONS

    const coordsArray = generateUniformCoords(props.data)
    setDataObj(coordsArray)
    setDisplayControl({data: true, clusters: false})
  }

  function generateClusters(e){
    // RESET THE ZOOM SO THE CLUSTERS RENDER PROPERLY
    props.setZoomObject(null)

    // GENERATOR FUNCTIONS
    function generateClusterCoords(data, labelName){
      const labels = data.map(a => a[labelName])
      const clusterLabels = Array.from(new Set(labels))
      const clusterCoordsArray = []

      for(let i in clusterLabels){
        let obj = {}
        obj["id"] = clusterLabels[i]
        obj['xDim'] = (Math.random() * (xMax-xMin)) + xMin
        obj['yDim'] = (Math.random() * (yMax-yMin)) + yMin
        obj['type'] = 'cluster'
        clusterCoordsArray.push(obj)
      }
      return clusterCoordsArray
    }

    // generate uniformly distributed cluster coordinates
    const clusterCoordsArray = generateClusterCoords(props.data, 'kmeans_labels')
    const clusterUnitsArray = generateClusterUnitCoords(props.data, 'kmeans_labels', clusterCoordsArray, false)
    setDataObj(clusterUnitsArray)
    setClusters(clusterCoordsArray)
    setDisplayControl({data: true, clusters: true})
    }

  return(
    <>
      <RoadmapPointField
        data={dataObj}
        clusters={clusters}
        displayControl = {displayControl}
        zoomObject={props.zoomObject}
        setZoomObject={props.setZoomObject}
        resetZoomedData={props.resetZoomedData}
        style={{height: "100%"}}
        filterBrushedData={props.filterBrushedData}
        resetBrushFilter={props.resetBrushFilter}
        hoveredData={props.hoveredData}
        />
        <img
          onClick={generateClusters}
          src={network}
          alt="Generate Clusters"
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            zIndex: 100,
            height: '40px',
            width: '40px',
            cursor: 'pointer'
          }} />
          <img
            onClick={generateUniform}
            src={refresh}
            alt="Redistribute Data"
            style={{
              position: 'absolute',
              bottom: 20,
              right: 80,
              zIndex: 100,
              height: '40px',
              width: '40px',
              cursor: 'pointer'
            }} />
    </>

  )
}
