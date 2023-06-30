import { createPossibleFeature } from "~/models/possible-features";
import { authenticator } from "~/models/auth.server"

export async function action({ request }){
    const formData = await request.formData();

    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/",
      })

    const featureType = formData.get('featureType')
    const featureTitle = formData.get('featureTitle')
    const featureDescription = formData.get('featureDescription')
    
    const possibleFeature = await createPossibleFeature(featureType, featureTitle, featureDescription, user.id)
    
    return { possibleFeature }
}