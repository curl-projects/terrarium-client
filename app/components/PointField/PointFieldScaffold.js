import * as d3 from 'd3';
import PointField from "~/components/PointField/PointField.js"
import { useEffect, useState } from 'react';
import _, { rest } from "underscore";
import network from '../../../public/assets/network.svg';
import refresh from '../../../public/assets/refresh.svg';
import measure from '../../../public/assets/measure.svg';
var gaussian = require('gaussian');
import { CgZoomOut } from "react-icons/cg";
import Tooltip from '@mui/material/Tooltip';
import { FormControlUnstyledContext } from '@mui/base';


export default function PointFieldScaffold(props){
  const [xMin, xMax] = [0, 1]
  const [yMin, yMax] = [0, 1]

  const [dataObj, setDataObj] = useState(generateUniformCoords(props.data))
  const [clusters, setClusters] = useState([])
  const [displayControl, setDisplayControl] = useState({data: true, clusters: false, ranked: false})
  const [stableCoords, setStableCoords] = useState([])

  useEffect(()=>{
    console.log("SCAFFOLD DATA", props.data)
    displayControl.clusters 
      ? generateClusters()
      : generateUniform()
  }, [props.data])

  useEffect(()=>{
    generateRanked()
  }, [props.semanticDimensions])

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

  function findNormalizedScore(datapoint, data, key){
    if(key === 'score'){
      return (datapoint - Math.min(...data.map(i => parseFloat(i[key])))) / (Math.max(...data.map(i => parseFloat(i[key]))) - Math.min(...data.map(i => parseFloat(i[key]))))
    }
    else{
      return (datapoint - Math.min(...data.map(i => parseFloat(i.featureRequest[key])))) / (Math.max(...data.map(i => parseFloat(i.featureRequest[key]))) - Math.min(...data.map(i => parseFloat(i.featureRequest[key]))))
    }
  }

  function generateRankedCoords(data){
    const coordsArray = []
    const jitterConstant = 0.02
    for(let idx in data){
      let obj = {...data[idx],
                 "xDim": {"Relevance": props.semanticDimensions[0].normalized ? findNormalizedScore(parseFloat(data[idx].score), data, 'score') : parseFloat(data[idx].score),
                          "Engineering Lift": props.semanticDimensions[0].normalized ? findNormalizedScore(parseFloat(data[idx].featureRequest.challengingScore), data, 'challengingScore') : data[idx].featureRequest.challengingScore,
                          "Usefulness": props.semanticDimensions[0].normalized ? findNormalizedScore(parseFloat(data[idx].featureRequest.usefulScore), data, 'usefulScore') : data[idx].featureRequest.usefulScore,
                          "Specificity": props.semanticDimensions[0].normalized ? findNormalizedScore(parseFloat(data[idx].featureRequest.specificScore), data, 'specificScore') : data[idx].featureRequest.specificScore,
                         }[props.semanticDimensions[0].dimension] + jitterConstant * (Math.random() * 2 - 1), // normalize based on range in data
                 "yDim": {"Relevance": props.semanticDimensions[1].normalized ? findNormalizedScore(parseFloat(data[idx].score), data, 'score') : parseFloat(data[idx].score),
                          "Engineering Lift": props.semanticDimensions[1].normalized ? findNormalizedScore(parseFloat(data[idx].featureRequest.challengingScore), data, 'challengingScore') : data[idx].featureRequest.challengingScore,
                          "Usefulness": props.semanticDimensions[1].normalized ? findNormalizedScore(parseFloat(data[idx].featureRequest.usefulScore), data, 'usefulScore') : data[idx].featureRequest.usefulScore,
                          "Specificity": props.semanticDimensions[1].normalized ? findNormalizedScore(parseFloat(data[idx].featureRequest.specificScore), data, 'specificScore') : data[idx].featureRequest.specificScore,
                          }[props.semanticDimensions[1].dimension] + jitterConstant * (Math.random() * 2 - 1), // normalize based on range in data
                }
      coordsArray.push(obj)
    }

    return coordsArray
  }

// + jitterConstant * (Math.random() * 2 - 1)
  // GENERATOR FUNCTIONS
  function generateClusterCoords(data){
    const labels = data.map(a => a.featureRequest.cluster.clusterId)
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


  function generateClusterUnitCoords(data, clusterCoordsArray, dispersionFactor=10000){
    const clusterUnits = []

    for(let idx in data){
      let cluster = data[idx].featureRequest.cluster.clusterId

      let obj = {...data[idx],
                 "xDim": clusterCoordsArray.find(clus => clus.id === cluster)['xDim'] + gaussian(0, (xMax-xMin)/dispersionFactor).random()[0],
                 "yDim": clusterCoordsArray.find(clus => clus.id === cluster)['yDim'] + gaussian(0, (yMax-yMin)/dispersionFactor).random()[0],
                }
      clusterUnits.push(obj)

    }
    return clusterUnits
  }

  // FULL GENERATORS
  function generateUniform(e){
    // GENERATOR FUNCTIONS
    props.setZoomObject(null)

    const coordsArray = generateUniformCoords(props.data)
    setDataObj(coordsArray)
    setDisplayControl({data: true, clusters: false, ranked: false})
  }

  function generateRanked(e){
    props.setZoomObject(null)
    const coordsArray = generateRankedCoords(props.data)
    setDataObj(coordsArray)
    setDisplayControl({data: true, clusters: false, ranked: true})
  }

  function generateClusters(resetZoom){
    // RESET THE ZOOM SO THE CLUSTERS RENDER PROPERLY
    resetZoom && props.setZoomObject(null)

    // generate uniformly distributed cluster coordinates
    const clusterCoordsArray = generateClusterCoords(props.data)
    const clusterUnitsArray = generateClusterUnitCoords(props.data, clusterCoordsArray)
    setDataObj(clusterUnitsArray)
    setClusters(clusterCoordsArray)
    setDisplayControl({data: true, clusters: true, ranked: false})
    }
  
  function resetZoom(){
    props.setZoomObject(null)
  }


  useEffect(()=>{
    (props.triggerClusters && !displayControl.clusters) && generateClusters()
    props.setTriggerClusters(false)
  }, [props.triggerClusters])

  useEffect(()=>{
    (props.triggerRanked && !displayControl.ranked) && generateRanked()
    props.setTriggerRanked(false)
  }, [props.triggerRanked])

  function handleRankedTooltip(){
    generateRanked()
    props.setDataView('semanticDimensions')
  }

  return(
    <>
      <PointField
        data={dataObj}
        clusters={clusters}
        displayControl = {displayControl}
        zoomObject={props.zoomObject}
        setZoomObject={props.setZoomObject}
        resetZoomedData={props.resetZoomedData}
        style={{height: "100%"}}
        filterBrushedData={props.filterBrushedData}
        resetBrushFilter={props.resetBrushFilter}
        headerCollapsed={props.headerCollapsed}
        setDataView={props.setDataView}
        setExpandSpecificCard={props.setExpandSpecificCard}
        generateClusters={generateClusters}
        placeholder={props.placeholder}
        />
      <button style={{
        position: 'absolute',
        bottom: 20,
        right: 140,
        zIndex: 100,
        height: '40px',
        width: '40px',
        cursor: 'pointer'
      }}>
    </button>
      {!props.zoomObject &&
      <>
      <Tooltip title="Distribute" placement='top' arrow>
      <img
          onClick={generateUniform}
          src={refresh}
          alt="Redistribute Data"
          style={{
            position: 'absolute',
            bottom: 30,
            right: 170,
            zIndex: 100,
            height: '40px',
            width: '40px',
            cursor: 'pointer'
          }} />
        </Tooltip>
      <Tooltip title="Rank" placement='top' arrow>
        <img
          onClick={handleRankedTooltip}
          src={measure}
          alt="Rank Data"
          style={{
            position: 'absolute',
            bottom: 30,
            right: 100,
            zIndex: 100,
            height: '40px',
            width: '40px',
            cursor: 'pointer'
          }} />
        </Tooltip>
      {/* {props.clustersGenerated === 'completed' && */}
      <Tooltip title="Cluster" placement='top' arrow>
        <img
          onClick={() => generateClusters(false)}
          src={network}
          alt="Generate Clusters"
          style={{
            position: 'absolute',
            bottom: 30,
            right: 30,
            zIndex: 100,
            height: '40px',
            width: '40px',
            cursor: 'pointer'
          }} />
        </Tooltip>
        </>
        }
        {props.zoomObject &&
        <Tooltip title="Reset Zoom" placement='top' arrow>
          <div 
          onClick={resetZoom}
          src={refresh}
          alt="Reset Zoom"
          style={{
            position: 'absolute',
            bottom: 30,
            right: 30,
            zIndex: 100,
            height: '40px',
            width: '40px',
            cursor: 'pointer'}}>
              <CgZoomOut style={{height: "40px", width: "40px", color: "#CCCCCC"}}/>
          </div>
          </Tooltip>
          }

        <div style={{
            position: 'absolute',
            left: 10,
            bottom: 10,
          }}>
      
        </div>
    </>

  )
}
