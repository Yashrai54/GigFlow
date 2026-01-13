import { BidModel } from "../models/bid.model.js"
import ProjectModel from "../models/project.model.js"

export async function saveBid(req,res){
    const {projectId,message,budget} = req.body
    const userId = req.user?.userId

    console.log(projectId,message,budget)
    console.log(userId)
    if(!message || !budget){
        return res.status(400).json({"message": " all fields required"})
    }
    if(!projectId){
        return res.status(400).json({"message":"No project found"})
    }

    if(!userId){
        return res.status(400).json({"message":"user not authenticated"})
    }

    const newBid = new BidModel({
        projectId,
        userId,
        message,
        budget,
        status:"Pending"
    })

    try{
        await newBid.save()
        return res.status(201).json({"message":"success"})
    }
    catch(error){
            return res.status(500).json({ message: "Server error" })
    }
}

export async function getBid(req,res) {
    const projectId = req.query.projectId

    if(!projectId){
        return res.status(400).json({"message":"No project found"})
    }

    try{
        const bids = await BidModel.find({projectId})
        console.log(bids)
        return res.status(200).json({"message":"Bids found",Bids:bids})
    }
    catch(error){
        return res.status(500).json({"message":"Server Error"})
    }
}

export const updateBidStatus =async(req,res)=>{
    try{
        const { bidId } = req.params
        const { status } = req.body
        const userId = req.user.userId

        const bid = await BidModel.findById(bidId).populate('projectId')
         if (!bid) {
            console.log(bid)
            return res.status(404).json({ message: 'Bid not found' })
        }
         if (bid.projectId.clientId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this bid' })
        }
        bid.status = status
        await bid.save()

        res.status(200).json({ 
            success: true,
            message: 'Bid status updated successfully',
            bid 
        })
    }
    catch(error){
                res.status(500).json({ message: 'Server error', error: error.message })

    }
}
export const rejectAllOtherBids = async(req,res)=>{
    try{
       const { projectId, acceptedBidId } = req.body
       const userId = req.user.userId

       const project = await ProjectModel.findById(projectId)
        if (project.clientId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to perform this action' })
        }
    const result = await BidModel.updateMany(
            { 
                projectId: projectId,
                _id: { $ne: acceptedBidId },
                status: 'pending' 
            },
            { 
                status: 'rejected' 
            }
        )

        res.status(200).json({ 
            success: true,
            message: 'Other bids rejected successfully',
            modifiedCount: result.modifiedCount 
        })
    }
    catch(error){
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}