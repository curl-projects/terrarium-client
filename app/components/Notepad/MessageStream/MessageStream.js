import { useState, useEffect, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import MessageStreamMetadata from "~/components/Notepad/MessageStream/MessageStreamMetadata";
import MessageCard from "~/components/Notepad/MessageStream/MessageCard";

export default function MessageStream(props) {

  const [isExpanded, setIsExpanded] = useState(false);
  const [pins, setPinned] = useState(props.data.filter(d => d.pinned === true).map(e => e.featureRequestId));
  const paneRef = useRef(null);
  const pinnedFetcher = useFetcher();
  const [pinnedCards, setPinnedCards] = useState([])
  const [remainingCards, setRemainingCards] = useState([])


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
    console.log("DATA", props.data)
    setPinnedCards(props.data.filter(d => pins.includes(d.featureRequestId)))
    setRemainingCards(props.data.filter(d => !pins.includes(d.featureRequestId)))
  }, [pins])


  useEffect(()=>{
    console.log("PINS", pins)
    console.log("PINNED CARDS", pinnedCards)
    console.log("REMAINING CARDS", remainingCards)
  }, [pinnedCards, remainingCards, pins])

  const scrollToTop = () => {
    paneRef.current.scrollIntoView();
  }

  return (
    <>

      <div ref={paneRef} className='flex relative flex-col align-middle pt-2 gap-2'>
        <MessageStreamMetadata
          data={props.data}
          zoomObject={props.zoomObject}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          scrollToTop={scrollToTop}
          paneRef={paneRef}
        />
        <div className="pl-10 pr-8 flex flex-col gap-2">
          {pinnedCards.map((cardData, idx) => (
            <MessageCard
              idx={idx}
              key={cardData.featureRequest.fr_id}
              cardData={cardData.featureRequest}
              isExpanded={isExpanded}
              pinCard={pinCard}
              isPinned={true}
            />
          ))}
          {pinnedCards.length > 0 && <h1 className="text-gray-400 text-xs font-medium pl-4">Remaining Feature Requests</h1>}
          {remainingCards.map((cardData, idx) => (
            <MessageCard
              idx={idx}
              key={cardData.featureRequest.fr_id}
              cardData={cardData.featureRequest}
              isExpanded={isExpanded}
              pinCard={pinCard}
            />
          ))}
        </div>

      </div>
    </>
  )
}
