import { useD3 } from '~/utils/useD3';
import { useWindowSize } from "~/utils/useWindowSize";
import React, {useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function PointField({ data, clusters, searchResults, filterBrushedData,
                                   resetBrushFilter, zoomObject, setZoomObject,
                                   displayControl, resetZoomedData}) {

  // the weird domains create padding around the svg
  const xDomain = [-0.05, 1.05]
  const yDomain = [-0.10, 1.15]

  const [containerHeight, setContainerHeight] = useState(0)  
  const [containerWidth, setContainerWidth] = useState(0)  

  // const xDomain = [0, 1]
  // const yDomain = [0, 1]
  const [windowWidth, windowHeight] = useWindowSize();

  const prevDisplayControl = usePrevious(displayControl)

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

    renderData()

  }, [data])

  const ref = useD3(
    (svg) => {
    d3.select("#canvas-svg").selectAll("*").remove();
      const margin = {top: 0, right: 0, bottom: 0, left: 0};
      const width = ref.current.clientWidth;
      const height = ref.current.clientHeight;

      // X-AXIS
      var x = d3.scaleLinear()
        .domain(xDomain)
        .range([0, ref.current.clientWidth]);

      // Y-AXIS
      var y = d3.scaleLinear()
        .domain(yDomain)
        .range([ref.current.clientHeight, 0]);

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
