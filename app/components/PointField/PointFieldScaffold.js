import * as d3 from 'd3';
import PointField from "~/components/PointField/PointField.js"
import { useEffect, useState } from 'react';
import _, { rest } from "underscore";
import network from '../../../public/assets/network.svg';
import refresh from '../../../public/assets/refresh.svg';
var gaussian = require('gaussian');
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { CgZoomOut } from "react-icons/cg";


export default function PointFieldScaffold(props){
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
  function generateClusterUnitCoords(data, clusterCoordsArray, dispersionFactor=10000){
    const clusterUnits = []

    for(let idx in data){
      let cluster = data[idx].cluster.internalClusterId

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
    setDisplayControl({data: true, clusters: false})
  }

  function generateClusters(e){
    // RESET THE ZOOM SO THE CLUSTERS RENDER PROPERLY
    props.setZoomObject(null)

    // GENERATOR FUNCTIONS
    function generateClusterCoords(data){
      const labels = data.map(a => a.cluster.internalClusterId)
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
    const clusterCoordsArray = generateClusterCoords(props.data)
    const clusterUnitsArray = generateClusterUnitCoords(props.data, clusterCoordsArray)
    setDataObj(clusterUnitsArray)
    setClusters(clusterCoordsArray)
    setDisplayControl({data: true, clusters: true})
    }
  
  function resetZoom(){
    props.setZoomObject(null)
  }


  useEffect(()=>{
    (props.triggerClusters && !displayControl.clusters) && generateClusters()
    props.setTriggerClusters(false)
  }, [props.triggerClusters])

  return(
    <>
      <PointField
        data={dataObj}
        clusters={clusters}
        displayControl = {displayControl}
        searchResults={props.searchResults}
        zoomObject={props.zoomObject}
        setZoomObject={props.setZoomObject}
        resetZoomedData={props.resetZoomedData}
        style={{height: "100%"}}
        filterBrushedData={props.filterBrushedData}
        resetBrushFilter={props.resetBrushFilter}
        headerCollapsed={props.headerCollapsed}
        setDataView={props.setDataView}
        setExpandSpecificCard={props.setExpandSpecificCard}
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
      <img
          onClick={generateUniform}
          src={refresh}
          alt="Redistribute Data"
          style={{
            position: 'absolute',
            bottom: 30,
            right: 30,
            zIndex: 100,
            height: '40px',
            width: '40px',
            cursor: 'pointer'
          }} />
      {props.clustersGenerated === 'completed' &&
        <img
          onClick={generateClusters}
          src={network}
          alt="Generate Clusters"
          style={{
            position: 'absolute',
            bottom: 30,
            right: 100,
            zIndex: 100,
            height: '40px',
            width: '40px',
            cursor: 'pointer'
          }} />
      }
        </>
        }
        {props.zoomObject &&
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
          }

        <div style={{
            position: 'absolute',
            left: 10,
            bottom: 10,
          }}>
          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                views={['year', 'month']}
                label="After"
                minDate={dayjs('2012-03-01')}
                maxDate={dayjs('2023-06-01')}
                value={props.dateValue}
                onChange={(newValue) => {
                  props.setDateValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} helperText={null} />}
              />
          </LocalizationProvider> */}
        </div>
    </>

  )
}
