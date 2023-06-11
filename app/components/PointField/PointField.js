import { useD3 } from '~/utils/useD3';
import { useWindowSize } from "~/utils/useWindowSize";
import React, {useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import * as d3 from 'd3';
import { display } from '@mui/system';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function PointField({ data, clusters, searchResults, filterBrushedData,
                                   resetBrushFilter, zoomObject, setZoomObject,
                                   displayControl, resetZoomedData, headerCollapsed,
                                  setDataView, setExpandSpecificCard}) {

  // the weird domains create padding around the svg
  const xDomain = [-0.05, 1.05]
  const yDomain = [-0.10, 1.15]

  const [containerHeight, setContainerHeight] = useState(0)  
  const [containerWidth, setContainerWidth] = useState(0)  

  const [windowWidth, windowHeight] = useWindowSize();

  const prevDisplayControl = usePrevious(displayControl)

  // GENERAL FUNCTIONS
  function renderClusters(x, y){

    const clusterLayer = d3.select("#canvas-svg").insert("g").attr("id", "clusterlayer")

    const clusterNodes = clusterLayer.selectAll('dot')
        .data(clusters)
        .join('circle')
          .attr('class', "clusterNode")
          .attr('id', d => `cluster-${d.id}`)
          .attr("r", 0)
          .style('opacity', 0)
          .attr('cx', d => x(d.xDim))
          .attr('cy', d => y(d.yDim))
          .attr('fill', "rgba(119, 153, 141, 0.7)")
          .on("click", function(e){
            setDataView("clusters")
            setExpandSpecificCard({cardId: e.target.__data__.id, cardType: "cluster"})
            setZoomObject({"id": e.target.__data__.id, "type": e.target.__data__.type})
          })
          .transition(500)
            .delay(200)
            .attr("r", 35)
            .style('opacity', 0.2)
  }

  useEffect(()=>{
    var x = d3.scaleLinear()
    .domain(xDomain)
    .range([0, ref.current.clientWidth]);

    // Y-AXIS
    var y = d3.scaleLinear()
      .domain(yDomain)
      .range([ref.current.clientHeight, 0]);

    function renderData(){
        d3.selectAll(".frNode")
          .data(data)
          .transition()
             .duration(500)
             .ease(d3.easeCubicInOut)
             .attr('cx', d => x(d.xDim))
             .attr('cy', d => y(d.yDim))
    }

    function tearDownClusters(){
      // TEAR DOWN CLUSTER BLOBS
      d3.select(ref.current)
        .selectAll(".clusterNode")
        .transition()
        .duration(500)
        .attr('r', 0)
        .remove()
      
        d3.select("#clusterlayer").remove()
    }

    tearDownClusters()

    renderData()
    displayControl.clusters && renderClusters(x, y)

  }, [data, displayControl])

  // ZOOM EFFECTS
  useEffect(()=>{
    function zoomed(event){
      const pointTransform = event.transform;

      d3.select("#dotlayer").attr("transform", pointTransform)
      d3.select("#regionlayer").attr("transform", pointTransform)
      d3.select("#clusterlayer").attr("transform", pointTransform)
      d3.select("#annotationlayer").attr("transform", pointTransform)
      d3.select("#brushlayer").attr("transform", pointTransform)
      d3.select("#labellayer").attr("transform", pointTransform)
    }

    const zoom = d3.zoom()
    .extent([[0, 0], [containerWidth, containerHeight]])
    .translateExtent([[0, 0], [containerWidth, containerHeight]])
    .on("zoom", zoomed);

    if(zoomObject && clusters.length !== 0){
      var x = d3.scaleLinear()
      .domain(xDomain)
      .range([0, containerWidth]);

      // Y-AXIS
      var y = d3.scaleLinear()
        .domain(yDomain)
        .range([containerHeight, 0]);

      let zoomObjectMap = {
        'cluster': "cluster",
        'regionCluster': 'regionCluster'
      }

      const clusterIdName =  zoomObjectMap[zoomObject.type]

      const transforms = [[]].concat(d3.groups(data, d => d[clusterIdName]).map(([key, data])=> {
        const [x0, x1] = d3.extent(data, d => d["xDim"]).map(x);
        const [y1, y0] = d3.extent(data, d => d['yDim']).map(y);
        let margin = 10
        const k = 0.1*Math.min(containerWidth / (x1+2*margin - x0), containerHeight / (y1+2*margin - y0));
        const tx = (containerWidth - k * (x0 + x1)) / 2;
        const ty = (containerHeight - k * (y0 + y1)) / 2;
        return [data[0][clusterIdName], d3.zoomIdentity.translate(tx, ty).scale(k)];
      }))

      const transform = transforms.find((el) => el[0] === zoomObject.id)

      d3.select('svg').transition().duration(1000).call(zoom.transform, transform[1]);
    }
    else{
      d3.select('svg').transition().duration(1000).call(zoom.transform, d3.zoomIdentity.scale(1));
    }
  }, [zoomObject, displayControl, containerHeight, containerWidth])

   // INNER SEARCH
   useEffect(()=>{
    if(searchResults && searchResults.length !== 0){
      const stringSearchResults = searchResults.map(a => `#fr-${a}`)
      const activePoints = d3.select(ref.current)
        .selectAll(stringSearchResults.join(","))
          .classed("searchSelected", true)
    }
    if(searchResults && searchResults.length === 0){
      d3.select(ref.current)
        .selectAll('.searchSelected')
        .classed("searchSelected", false)
    }
  }, [searchResults])


  const ref = useD3(
    (svg) => {
        // rerender the canvas on data, hieght, or width change
    d3.select("#canvas-svg").selectAll("*").remove();

    const margin = {top: 0, right: 0, bottom: 0, left: 0};

    // X-AXIS
    var x = d3.scaleLinear()
      .domain(xDomain)
      .range([0, containerWidth]);

    // Y-AXIS
    var y = d3.scaleLinear()
      .domain(yDomain)
      .range([containerHeight, 0]);

    const dots = svg.insert("g").attr('id', 'dotlayer')
      .selectAll("dot")
      .data(data)
      .join('circle')
        .attr('id', d => `fr-${d.fr_id}`)
        .attr('class', 'frNode')
        .attr('cx', d => x(d.xDim))
        .attr('cy', d => y(d.yDim))
        .attr('r', 5)
        .attr('fill', "rgba(119, 153, 141, 0.5)")
        .attr("stroke", 'rgba(119, 153, 141, 1)')
        .attr("stroke-width", 2)
      
      // repaint brush whenever canvas changes
    function brushed({selection}){
      let value = [];
      if (selection){
        const [[x0, y0], [x1, y1]] = selection;
        dots.style("fill", "rgba(119, 153, 141, 0.5)")
            .filter(d => x0 <= x(d.xDim) && x(d.xDim) < x1 && y0 <= y(d.yDim) && y(d.yDim) < y1)
            .style("fill", "rgba(119, 153, 141, 1)")
            .data();

      } else {
        dots.style("#69b3a2")
      }
    }

    function filterBrushedStreamData({selection}){
      if(selection){
        const [[x0, y0], [x1, y1]] = selection;
        const dataPoints = dots.filter(d => x0 <= x(d.xDim) && x(d.xDim) < x1 && y0 <= y(d.yDim) && y(d.yDim) < y1)
        filterBrushedData(dataPoints.data())
      }
    }

    const brushLayer = svg.append("g")
                           .attr("id", "brushlayer")

    const brush = d3.brush()
                    .on("start brush end", brushed)
                    .on("end", function({selection}){
                        filterBrushedStreamData({selection})
                        if(!selection){
                        resetBrushFilter()
                        }
                    })

    brushLayer.call(brush)

    // re-establish clusters if they exist
    if(displayControl.clusters){
      renderClusters(x, y)
    }

    },
    [data.length, containerHeight, containerWidth]
  );

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setContainerHeight(node.getBoundingClientRect().height); 
      setContainerWidth(node.getBoundingClientRect().width);
    }
  }, []);

  return (
    <div className='svgContainer'>
        <svg
        viewBox={`0 0 ${containerWidth} ${containerHeight}`}
        preserveAspectRatio="none"
        id="canvas-svg"
        ref={(el) => {ref.current=el; measuredRef(el)}}
        className='svgContentResponsive'
        >
        </svg>
    </div>
  );
}