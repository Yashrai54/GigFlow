import { Router } from "express";
import { getBid, rejectAllOtherBids, saveBid, updateBidStatus } from "../controllers/bidController.js";

const bidRouter = Router()

bidRouter.post("/create",saveBid)
bidRouter.get("/getbids",getBid)
bidRouter.patch('/:bidId/status', updateBidStatus)
bidRouter.patch('/reject-others', rejectAllOtherBids)



export default bidRouter