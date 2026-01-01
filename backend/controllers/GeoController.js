import ProjectModel from "../models/project.model.js"

export default async function nearbyProjects(req,res){
      const  {lat,lng} = req.params
      
      const projects = await ProjectModel.find({
        location:{
            $near:{
                $geometry:{
                    type:"Point",
                    coordinates:[lng,lat]
                },
                $maxDistance: 5000 // 5 km radius
            }
        }
      })

      if(!projects){
        console.log("No Projects found in your area")
        return res.status(400).json({"message":"No Projects  found in your area"})
      }
      return res.status(200).json({"message":"Success",foundProjects:projects})
}