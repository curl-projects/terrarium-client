import { useState, useEffect, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import MessageStreamMetadata from "~/components/MessageStream/MessageStreamMetadata";
import MessageStreamFeatureRequests from "~/components/MessageStream/MessageStreamFeatureRequests";
import MessageStreamClusters from "~/components/MessageStream/MessageStreamClusters";
import MessageStreamAuthors from "~/components/MessageStream/MessageStreamAuthors";
import MessageStreamFilters from "~/components/MessageStream/MessageStreamFilters";
import { ProvidedColumnGroup } from "ag-grid-community";
export default function MessageStream(props) {

  const [isExpanded, setIsExpanded] = useState(false);
  const [pins, setPinned] = useState([]);
  const paneRef = useRef(null);
  const pinnedFetcher = useFetcher();
  const [pinnedCards, setPinnedCards] = useState([])
  const [remainingCards, setRemainingCards] = useState([])
  const [clusterData, setClusterData] = useState([])
  const [authorData, setAuthorData] = useState([])
  const [authorNames, setAuthorNames] = useState([])

  useEffect(() => {
    setPinned(props.data.filter(d => d.pinned === true).map(e => e.featureRequestId))
  }, [props.data])

  useEffect(()=>{
    if(props.data){
      if(props.data[0] && props.data[0].cluster){
        const organisedClusterData = props.data.reduce((group, featureRequest) => {
          const { internalClusterId } = featureRequest.cluster;
          group[internalClusterId] = group[internalClusterId] ?? [];
          group[internalClusterId].push(featureRequest)
          return group
      }, {});


        setClusterData(Object.values(organisedClusterData))
      }

      else{
        setClusterData([])
      }

      if(props.data[0] && props.data[0].featureRequest?.author){
        const organisedAuthorData = props.data.reduce((group, featureRequest) => {
          const { author } = featureRequest.featureRequest;
          group[author] = group[author] ?? [];
          group[author].push(featureRequest)
          return group
      }, {});
      
      const sortedAuthorData = Object.values(organisedAuthorData).sort((a, b) => b.length - a.length)

      setAuthorNames(Object.keys(organisedAuthorData))
      setAuthorData(sortedAuthorData)
      }
    }
    else{
      setAuthorData([])
    }
    }, [props.data])


  const pinCard = (fr_id) => {
    // if not in pins, add it
    if (!pins.includes(fr_id)) {
      setPinned([...pins, fr_id]);
      pinnedFetcher.submit({ fr_id: fr_id,
                             featureId: props.featureId,
                             pinnedStatus: true
                           }, { method: 'get', action: "/utils/set-pinned"})
    } else {
      // if in pins, remove it
      setPinned(pins.filter(pin => pin !== fr_id));
      pinnedFetcher.submit({ fr_id: fr_id,
                             featureId: props.featureId,
                             pinnedStatus: false
                           }, { method: 'get', action: "/utils/set-pinned"})
    }
  }

  useEffect(() => {
    const pane = paneRef.current;

    pane.addEventListener('scroll', () => {
      if (pane.scrollY > 200) {
        console.log("scrolling")
      }
    })
    return () => {
      pane.removeEventListener('scroll', () => {
        console.log("scrolling")
      })
    }
  }, [])

  useEffect(()=>{
    setPinnedCards(props.data.filter(d => pins.includes(d.featureRequestId)))
    setRemainingCards(props.data.filter(d => !pins.includes(d.featureRequestId)))
  }, [pins, props.data])


  const scrollToTop = () => {
    paneRef.current.scrollIntoView();
  }

  return (
    <>

      <div 
      ref={paneRef} 
      className='flex relative flex-col align-middle pt-2 gap-2'
      style={{backgroundColor: "#f3f4f6"}}
      >
        <MessageStreamMetadata
          data={props.data}
          zoomObject={props.zoomObject}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          scrollToTop={scrollToTop}
          paneRef={paneRef}
          clustersGenerated={props.clustersGenerated}
          clusterData={clusterData}
          authorData={authorData}
          filters={props.filters}
          setClustersGenerated={props.setClustersGenerated}
          setDataView={props.setDataView}
          clusterFetcher={props.clusterFetcher}
          featureTitle={props.featureTitle}
          setTriggerClusters={props.setTriggerClusters}
          invisibleFilters={props.invisibleFilters}
        />
        {
          {
            "featureRequests": <MessageStreamFeatureRequests 
                                  pinnedCards={pinnedCards} 
                                  remainingCards={remainingCards} 
                                  pinCard={pinCard} 
                                  isExpanded={isExpanded}
                                  expandSpecificCard={props.expandSpecificCard}
                                  searchText={props.searchText}
                                  setSearchText={props.setSearchText}
                                  />,
            "clusters": <MessageStreamClusters 
                            clustersGenerated={props.clustersGenerated}
                            clusterData={clusterData}
                            setClusterData={setClusterData}
                            isExpanded={isExpanded}
                            pinCard={pinCard}
                            pinnedCards={pinnedCards}
                            setZoomObject={props.setZoomObject}
                            expandSpecificCard={props.expandSpecificCard}
                        />,
            "authors": <MessageStreamAuthors 
                          authorData={authorData}
                          isExpanded={isExpanded}
                          pinCard={pinCard}
                          pinnedCards={pinnedCards}
                        />,
            "filters": <MessageStreamFilters 
                          filters={props.filters}
                          authorNames={authorNames}
                          invisibleFilters={props.invisibleFilters}
                          setInvisibleFilters={props.setInvisibleFilters}
                          />
                      
          }[props.dataView]
        }
      </div>
    </>
  )
}
