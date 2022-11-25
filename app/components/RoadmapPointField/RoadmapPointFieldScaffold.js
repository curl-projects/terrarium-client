import * as d3 from 'd3';
import RoadmapPointField from "~/components/RoadmapPointField/RoadmapPointField.js"
import { useEffect, useState } from 'react';
import _ from "underscore";
var gaussian = require('gaussian');

export default function RoadmapPointFieldScaffold(props){
  const [xMin, xMax] = [0, 1]
  const [yMin, yMax] = [0, 1]

  const [dataObj, setDataObj] = useState(generateUniformCoords(props.data))
  const [clusters, setClusters] = useState([])
  const [regions, setRegions] = useState([])
  const [displayControl, setDisplayControl] = useState({data: true, clusters: false, regions: false})

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
    setDisplayControl({data: true, clusters: false, regions: false})
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
    setDisplayControl({data: true, clusters: true, regions: false})
    }

  function generateRegions(e, clustered){

    // GENERATOR FUNCTIONS
    function generateRegionCoords(data, labelName){

      const svg = d3.select('svg')

      const viewBox = svg.attr("viewBox").split(",")
      const svgDims = {
        height: parseFloat(viewBox[3]),
        width: parseFloat(viewBox[2]),
      }

      const labels = data.map(a => a[labelName])
      const regionLabels = Array.from(new Set(labels))
      const regionCoordsArray = []


      const nRows = Math.ceil(regionLabels.length/2)
      var regionHeight = 200
      var regionWidth = 0
      var gap = 20

      if(regionLabels.length === 1){

        regionWidth = svgDims.width / 2
        regionHeight = svgDims.height / 2

        for(let i in regionLabels){
          let obj = {}
          obj["id"] = regionLabels[i]
          obj['xDim'] = (0.5*svgDims.width-0.5*regionWidth)/svgDims.width
          obj['yDim'] = (0.5*svgDims.height+0.5*regionHeight)/svgDims.height
          obj['width'] = regionWidth
          obj['height'] = regionHeight
          regionCoordsArray.push(obj)
        }
      }

      else if(regionLabels.length === 2){
        gap = 40

        regionHeight = (svgDims.height-3*gap) / 2
        regionWidth = svgDims.width - 2.5*gap

        console.log("HELLO!", regionHeight)
        for(let i in regionLabels){
          let obj = {}
          obj["id"] = regionLabels[i]
          obj['xDim'] = gap/svgDims.width
          obj['yDim'] = ((gap + regionHeight) * (parseInt(i)+1))/svgDims.height
          obj['width'] = regionWidth
          obj['height'] = regionHeight
          regionCoordsArray.push(obj)
        }
      }

      else if(nRows >= 2){
        gap=80/(nRows-1)
        regionWidth = (svgDims.width - 3*gap)/2
        regionHeight = (svgDims.height - (nRows+1)*gap)/nRows

        for(let i in regionLabels){
          let rowMultiplier = Math.floor((parseInt(i))/nRows) + 1
          let colMultiplier = ((parseInt(i)) % nRows) + 1
          let obj = {}
          obj["id"] = regionLabels[i]

          obj['xDim'] = (((gap + regionWidth) * rowMultiplier)-regionWidth)/svgDims.width
          obj['yDim'] = (((gap + regionHeight) * colMultiplier))/svgDims.height
          obj['width'] = regionWidth
          obj['height'] = regionHeight
          regionCoordsArray.push(obj)
        }
      }

      return regionCoordsArray

    }
    function generateRegionClusterCoords(data, regionCoordsArray){

      const svg = d3.select('svg')

      const viewBox = svg.attr("viewBox").split(",")
      const svgDims = {
        height: parseFloat(viewBox[3]),
        width: parseFloat(viewBox[2]),
      }

      const [regionWidth, regionHeight] = [regionCoordsArray[0].width, regionCoordsArray[0].height]
      var num = 0
      const padding = 30

      const regionClusterCoordsArray = []

      for(let region of regionCoordsArray){
        // find all clusters within the region
        let filteredData = data.filter(a => a.region == region.id)
        let labels = filteredData.map(a => a.regionCluster)
        let regionClusterLabels = Array.from(new Set(labels))

        for(let i in regionClusterLabels){
          num+=1
          let obj = {}

          obj['id'] = regionClusterLabels[i]
          obj['xDim'] = (Math.random() * (regionWidth-padding)/svgDims.width) + (region.xDim + padding/svgDims.width)
          obj['yDim'] = (Math.random() * (regionHeight-padding)/svgDims.height) + (region.yDim - (regionHeight + padding)/svgDims.height)
          obj['type'] = 'regionCluster'
          regionClusterCoordsArray.push(obj)
        }
      }
        console.log('I!!', num)
        return regionClusterCoordsArray
    }
    function generateRegionUnitCoords(data, labelName, regionCoordsArray, padding=20, dispersionFactor=150){
      const svg = d3.select('svg')
      const [regionWidth, regionHeight] = [regionCoordsArray[0].width, regionCoordsArray[0].height]
      const viewBox = svg.attr("viewBox").split(",")
      const svgDims = {
        height: parseFloat(viewBox[3]),
        width: parseFloat(viewBox[2]),
      }

      console.log("REGIONWIDTH CLOSE", regionWidth)
      const regionUnits = []

      for(let idx in data){
        let xGauss = gaussian(0, ((regionWidth-2*padding)/svgDims.width)/dispersionFactor)
        let yGauss = gaussian(0, ((regionHeight-2*padding)/svgDims.height)/dispersionFactor)
        let region = data[idx][labelName]

        let obj = {...data[idx],
                   "xDim": (regionCoordsArray.find(reg => reg.id === region)['xDim'])+(0.5*regionWidth/svgDims.width) + xGauss.random(1)[0],
                   "yDim": (regionCoordsArray.find(clus => clus.id === region)['yDim'])-(0.5*regionHeight/svgDims.height) + yGauss.random(1)[0]
                  }

        regionUnits.push(obj)
      }
        return regionUnits
    }

    if(clustered){
      const regionCoordsArray = generateRegionCoords(props.data, 'region')
      const regionClusterCoordsArray = generateRegionClusterCoords(props.data, regionCoordsArray)
      const regionClusterUnitsArray = generateClusterUnitCoords(props.data, 'regionCluster', regionClusterCoordsArray, true)
      setRegions(regionCoordsArray)
      setClusters(regionClusterCoordsArray)
      setDataObj(regionClusterUnitsArray)
      setDisplayControl({data: true, clusters: true, regions: true})
    }
    else{
      const regionCoordsArray = generateRegionCoords(props.data, 'region')
      const regionUnitsArray = generateRegionUnitCoords(props.data, 'region', regionCoordsArray)
      setRegions(regionCoordsArray)
      setDataObj(regionUnitsArray)
      setDisplayControl({data: true, clusters: false, regions: true})
    }

  }


  return(
    <>
      <RoadmapPointField
        data={dataObj}
        clusters={clusters}
        regions={regions}
        displayControl = {displayControl}
        searchResults={props.searchResults}
        zoomObject={props.zoomObject}
        setZoomObject={props.setZoomObject}
        resetZoomedData={props.resetZoomedData}
        style={{height: "100%"}}
        filterBrushedData={props.filterBrushedData}
        resetBrushFilter={props.resetBrushFilter}
        />
      <button
        onClick={generateClusters}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 180,
          height: '40px',
          width: '60px'
        }}>
          Cluster Data
        </button>
        <button
          onClick={generateUniform}
          style={{
            position: 'absolute',
            bottom: 30,
            right: 260,
            height: '40px',
            width: '60px'
          }}>
            Uniformly Distribute Data
        </button>
        <button
          onClick={()=>props.setZoomObject(null)}
          style={{
            position: 'absolute',
            bottom: 30,
            right: 340,
            height: '40px',
            width: '60px'
          }}>
            Reset Zoom
        </button>
        <button
          onClick={(e) => generateRegions(e, false)}
          style={{
            position: 'absolute',
            bottom: 30,
            right: 420,
            height: '40px',
            width: '60px'
          }}>
            Generate Regions
        </button>
        <button
          onClick={(e) => generateRegions(e, true)}
          style={{
            position: 'absolute',
            bottom: 30,
            right: 500,
            height: '40px',
            width: '60px'
          }}>
            Generate Clustered Regions
        </button>
    </>

  )
}
