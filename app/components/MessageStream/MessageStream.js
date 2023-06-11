import { useState, useEffect, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import MessageStreamMetadata from "~/components/MessageStream/MessageStreamMetadata";
import MessageStreamFeatureRequests from "~/components/MessageStream/MessageStreamFeatureRequests";
import MessageStreamClusters from "~/components/MessageStream/MessageStreamClusters";
export default function MessageStream(props) {

  const [isExpanded, setIsExpanded] = useState(false);
  const [pins, setPinned] = useState([]);
  const paneRef = useRef(null);
  const pinnedFetcher = useFetcher();
  const [pinnedCards, setPinnedCards] = useState([])
  const [remainingCards, setRemainingCards] = useState([])
  const [dataView, setDataView] = useState("featureRequests")

  useEffect(() => {
    setPinned(props.data.filter(d => d.pinned === true).map(e => e.featureRequestId))
  }, [props.data])


  const pinCard = (fr_id) => {
    // if not in pins, add it
    if (!pins.includes(fr_id)) {
      setPinned([...pins, fr_id]);
      pinnedFetcher.submit({ fr_id: fr_id,
                             featureId: props.featureId,
                             pinnedStatus: true
                           }, { method: 'post', action: "/utils/set-pinned"})
    } else {
      // if in pins, remove it
      setPinned(pins.filter(pin => pin !== fr_id));
      pinnedFetcher.submit({ fr_id: fr_id,
                             featureId: props.featureId,
                             pinnedStatus: false
                           }, { method: 'post', action: "/utils/set-pinned"})
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
          setDataView={setDataView}
        />
        {
          {
            "featureRequests": <MessageStreamFeatureRequests 
                                  pinnedCards={pinnedCards} 
                                  remainingCards={remainingCards} 
                                  pinCard={pinCard} 
                                  isExpanded={isExpanded} />,
            "clusters": <MessageStreamClusters />
          }[dataView]
        }
      </div>
    </>
  )
}
