import { Form } from "@remix-run/react"
import { BiUpArrowAlt } from "react-icons/bi"
import { BsClipboardData } from "react-icons/bs"

export default function PossibleFeatureCard({ cardData, user }){

    return(
        <div className='possibleFeatureCard'>
            <div className='possibleFeatureBookmark'>
            </div>
            <Form className='possibleFeatureUpvoteWrapper' method='post'>
                <input type="hidden" name='possibleFeatureId' value={cardData.possibleFeatureId} />
                <input type="hidden" name='variant' value={cardData.users ? cardData.users.map(i => i.id).includes(user.id) ? 'downvote' : "upvote" : "upvote"} />
                <button className='possibleFeatureUpvote' type="submit">
                    <p className='possibleFeatureUpvoteIcon' style={{
                        transform: cardData?.users?.map(i => i.id).includes(user.id) ? "rotate(180deg)" : "rotate(0deg)"
                    }}><BiUpArrowAlt /></p>
                    <p className='possibleFeatureUpvoteText'>{cardData.upvotes}</p>
                </button>    
            </Form>
            <div className='possibleFeatureContent'>
                <div className='possibleFeatureTitle'>
                    <p className='possibleFeatureTitleText'>{cardData.title}</p>
                </div>
                <div className='possibleFeatureMetadata'>
                    <p className='possibleFeatureMetadataText'>{cardData.type}{cardData.status === 'unapproved' && " (Pending Review)"}</p>

                </div>
                <div className="possibleFeatureDescription">
                    <p className='possibleFeatureDescriptionText'>{cardData.description}</p>
                </div>
            </div>
        </div>
    )
}