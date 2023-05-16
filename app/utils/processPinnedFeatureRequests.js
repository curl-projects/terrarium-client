export function processPinnedFeatureRequests(featureRequests){
    let pinnedFeature = []
    for(let feature of featureRequests){
        for(let featureRequest of feature.featureRequests){
            pinnedFeature.push({...featureRequest, feature: feature.title})
        }
    }
    return pinnedFeature
}