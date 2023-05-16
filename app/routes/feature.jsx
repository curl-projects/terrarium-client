import { Outlet, Link, useParams, useMatches } from "@remix-run/react";
import cn from 'classnames'
import FeatureHeader from "~/components/Header/FeatureHeader"

export default function Feature(){
  const params = useParams();
  const matches = useMatches();
  
  return(
    <>
      <FeatureHeader />
        <div className="notepadPadding">
          <div className='notepadTabBar'>
            <Link to={`/feature/discovery/${params["*"]}`}>
              <div className={cn('notepadTab discovery',
                                  {"notepadTabActive": matches[2].pathname.includes('discovery')}
                                )}>
                <p className="notepadTabLabel">Discovery</p>
              </div>
            </Link>
            <Link to={`/feature/notepad/${params["*"]}`}>
              <div className={cn('notepadTab writing',
                                  {"notepadTabActive": matches[2].pathname.includes('notepad')}
                                )}>
                <p className="notepadTabLabel">Notepad</p>
              </div>
            </Link>
          </div>
            <Outlet />
        </div>
    </>
  )
}
