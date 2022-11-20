import Header from "~/components/Header/Header";
import Kanban from "~/components/NewKanban/Kanban"

export default function Roadmap(){
  return(
    <>
      <Header />
      <div className="kanbanWrapper">
        <Kanban />
      </div>
    </>
  )
}
