import { useD3 } from '~/utils/useD3';
import { useWindowSize } from "~/utils/useWindowSize";
import React, {useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import * as d3 from 'd3';
import { teardown } from '@mui/utils/useIsFocusVisible';

// DISPLAY CONTROL MANAGEMENT
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function PointField({ data, clusters, searchResults, filterBrushedData,
                                   resetBrushFilter, zoomObject, setZoomObject,
                                   displayControl, resetZoomedData, headerCollapsed}) {

  // COMPONENT STRUCTURE
  const xDomain = [-0.05, 1.05]
  const yDomain = [-0.10, 1.15]

  const [containerHeight, setContainerHeight] = useState(0)  
  const [containerWidth, setContainerWidth] = useState(0)  

  const prevDisplayControl = usePrevious(displayControl)

//   DATA RENDERING
  useEffect(()=>{
    var x = d3.scaleLinear()
    .domain(xDomain)
    .range([0, ref.current.clientWidth]);

    // Y-AXIS
    var y = d3.scaleLinear()
      .domain(yDomain)
      .range([ref.current.clientHeight, 0]);

    // UTILITY FUNCTIONS
    // // ANIMATE DATA
    function animateData(){
        d3.selectAll(".frNode")
          .data(data)
          .transition()
             .duration(1000)
             .ease(d3.easeCubicInOut)
             .attr('cx', d => x(d.xDim))
             .attr('cy', d => y(d.yDim))
    }

    // // RENDER CLUSTERS
    function renderClusters(){

        const clusterLayer = d3.select("#canvas-svg").insert("g").attr("id", "clusterlayer")

        const clusterNodes = clusterLayer.selectAll('dot')
            .data(clusters)
            .join('circle')
              .attr('class', "clusterNode")
              .attr("r", 0)
              .style('opacity', 0)
              .attr('cx', d => x(d.xDim))
              .attr('cy', d => y(d.yDim))
              .attr('fill', "rgba(119, 153, 141, 0.7)")
              .on("click", function(e){
                console.log("DATA", e.target.__data__)
                setZoomObject({"id": e.target.__data__.id, "type": e.target.__data__.type})
              })
              .transition(1000)
                .delay(500)
                .attr("r", 35)
                .style('opacity', 0.2)
      }

    // // TEAR DOWN CLUSTERS
    function tearDownClusters(){
        // TEAR DOWN CLUSTER BLOBS
        d3.select(ref.current)
          .selectAll(".clusterNode")
          .transition()
          .duration(500)
          .attr('r', 0)
          .remove()
        
          d3.select("#cluster-layer").remove()
      }

    // TEAR DOWN ALL DATA OBJECTS
    // tearDownClusters()

    // RENDER ALL OBJECTS
    animateData()
    // displayControl.clusters && renderClusters()

  }, [data])


// DATA INSTANTIATION
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

    const brushLayer = svg.append("g")
                             .attr("id", "brushlayer")

    const brush = d3.brush()
                    .on("start brush end", brushed)
                    .on("end", function({selection}){
                        // filterBrushedStreamData({selection})
                        if(!selection){
                        resetBrushFilter()
                        }
                    })

    brushLayer.call(brush);
    
    },
    [data.length, containerHeight, containerWidth]
);


const measuredRef = useCallback(node => {
  if (node !== null) {
    setContainerHeight(node.getBoundingClientRect().height); 
    setContainerWidth(node.getBoundingClientRect().width);
  }
}, []);


  useEffect(()=>{
    console.log("CONTAINER HEIGHT, CONTAINER WIDTH", containerHeight, containerWidth)
  }, [containerHeight, containerWidth])

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
