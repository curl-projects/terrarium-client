import { useState, useEffect } from "react";
import { useLoaderData, useFetcher } from "@remix-run/react"
import Header from "~/components/Header/Header"
import PageTitle from "~/components/Header/PageTitle.js"
import PossibleFeatureCard from "~/components/PossibleFeatures/PossibleFeatureCard"
import { authenticator } from "~/models/auth.server"
import { getPossibleFeatures, getUsersPossibleFeatures, removeUpvote, upvoteFeature } from "~/models/possible-features"
import TextField from '@mui/material/TextField';
import { MenuItem, Select } from "@mui/material"
import { BsPlus, BsX } from "react-icons/bs";

export async function loader({ request }){
    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/",
      })

    const possibleFeatures = await getPossibleFeatures()
    const userPossibleFeatures = await getUsersPossibleFeatures(user.id)

    return { possibleFeatures, user, userPossibleFeatures }
}

export async function action({ request }){
    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/",
      })

    const formData = await request.formData()
    const possibleFeatureId = formData.get("possibleFeatureId")
    const variant = formData.get('variant')
    if(variant === 'downvote'){
        const possibleFeature = await removeUpvote(possibleFeatureId, user.id);
        return { possibleFeature }
    }
    else if(variant === 'upvote'){
        const possibleFeature = await upvoteFeature(possibleFeatureId, user.id)
        return { possibleFeature}
    }
    else{
        console.error("Unexpected Variant:", variant)
        return {}
    }
}
export default function PossibleFeatures(){
    const loaderData = useLoaderData();

    const [bugTitle, setBugTitle] = useState("")
    const [bugDescription, setBugDescription] = useState("")
    const [bugType, setBugType] = useState("")
    const [submissionToggle, setSubmissionToggle] = useState(false)

    const newSubmissionFetcher = useFetcher()

    useEffect(() => {
        newSubmissionFetcher.state === 'submitting' && setSubmissionToggle(false)
    }, [newSubmissionFetcher])

    return(
        <div className='roadmapPageWrapper'>
            <Header />
            <PageTitle title='Possible Features' description="Tell me if there's anything wrong and vote on what Terrarium should implement next."/>
            <div className='possibleFeaturesScaffold'>
                <div className='innerFeaturesScaffold'>
                {loaderData.possibleFeatures.map((feature, idx) => 
                    <PossibleFeatureCard 
                        key={idx}
                        cardData={feature}
                        user={loaderData.user}
                    />
                )}
                </div>
                <div className='innerBugsScaffold'>
                    <p className='bugsScaffoldTitleText'>Submitted Feature Requests & Bugs </p>
                    <div className='existingSubmissionsWrapper'>
                        {loaderData.userPossibleFeatures.map((feature, idx) => 
                            <PossibleFeatureCard 
                                key={idx}
                                cardData={feature}
                                user={loaderData.user}
                                />
                        )}
                        <newSubmissionFetcher.Form className='newBugForm' method='post' action='/utils/new-submission'>
                            <input type='hidden' name='featureType' value={{'feature': "Feature", 'bug': "Bug"}[bugType]} />
                            <input type='hidden' name='featureTitle' value={bugTitle} />
                            <input type='hidden' name='featureDescription' value={bugDescription} />
                            {!submissionToggle 
                            ? <button className='submissionAddButton' onClick={() => setSubmissionToggle(!submissionToggle)}><BsPlus /></button>
                            : <>
                            <div style={{display: "flex", width: "100%", cursor: "pointer", alignItems: "center", marginBottom: "6px", justifyContent: 'flex-end'}}>
                            <div className='bugSubmit' onClick={() => setSubmissionToggle(false)}>
                                    <BsX />
                                </div>
                            </div>
                            <div className='bugsRow'>
                                <div className='bugsLabel'><p className='bugsLabelText'>Title</p></div>
                                <div className='bugsInputWrapper'>
                                    <TextField
                                        value={bugTitle}
                                        className='authUserTextField'
                                        onChange={(e) => setBugTitle(e.target.value)}
                                        style={{width: "100%", height: "100%"}}
                                    />
                                </div>
                            </div>
                            <div className='bugsRow' style={{height: "unset"}}>
                                <div className='bugsLabel'><p className='bugsLabelText'>Description</p></div>
                                <div className='bugsInputWrapper' style={{maxHeight: 'unset'}}>
                                    <TextField
                                        multiline={true}
                                        value={bugDescription}
                                        className='authUserTextField'
                                        onChange={(e) => setBugDescription(e.target.value)}
                                        style={{width: "100%", height: "100%", maxHeight: "unset"}}
                                    />
                                </div>
                            </div>
                            <div className='bugsRow'>
                                <div className='bugsLabel'><p className='bugsLabelText'>Type</p></div>
                                <div className='bugsInputWrapper'>
                                    <Select
                                        className='fileOptionInputSelect'
                                        defaultValue={""}
                                        onChange={(e) => setBugType(e.target.value)}
                                    >
                                        <MenuItem className='fileSelectMenuItem' value={"feature"}>Feature</MenuItem>
                                        <MenuItem className='fileSelectMenuItem' value={"bug"}>Bug</MenuItem>
                                    </Select>
                                </div>
                            </div>
                            {bugTitle && bugDescription && bugType &&
                                <button className='bugSubmit' type='submit'>
                                    <BsPlus />
                                </button>
                            }
                            </>
                            }
                        </newSubmissionFetcher.Form>
                    </div>
                </div>
            </div>
        </div>
    )
}