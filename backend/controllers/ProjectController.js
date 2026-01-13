import ProjectModel from "../models/project.model.js";

export const addProject = async (req, res) => {
    try {
        const { title, description, budget } = req.body

        if (!title || !description || budget == null) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (!req.user?.userId) {
            console.log(req.user.userId)
            return res.status(401).json({ message: "Unauthorized" })
        }

        const newProject = new ProjectModel({
            clientId: req.user.userId,
            title,
            description,
            budget: Number(budget)
        })

        await newProject.save()

        return res.status(201).json({
            message: "Project created",
            createdProject: newProject
        })
    } catch (err) {
        return res.status(500).json({ message: "Server error" })
    }
}


export const getProjects = async (req, res) => {
    const clientId = req.user.userId
    if (!clientId) {
        console.log("user not authenticated")
        return res.status(400).json({ "message": "user not authenticated" })
    }
    try {
        const userProjects = await ProjectModel.find({ clientId })
        console.log("found")
        return res.status(200).json({ "message": "Projects Found", projects: userProjects })
    }
    catch (error) {
        console.log("server error")
        return res.status(500).json({ "message": "Server Error" })
    }
}

export const updateProject = async (req, res) => {
    const { projectId } = req.params
    const updates = {}

    const { updatedTitle, updatedDescription } = req.body

    if (updatedTitle) updates.title = updatedTitle
    if (updatedDescription) updates.description = updatedDescription

    if (Object.keys(updates).length === 0) {
        console.log("nothing recieved")
        return res.status(400).json({ message: "Nothing to update" });
    }

    if (!projectId) {
        console.log("no project")
        return res.status(400).json({ "message": "no project id found" })
    }

    try {
        const project = await ProjectModel.updateOne({ _id: projectId, clientId: req.user.userId }, {
            $set: updates
        })

        if (!project) {
            console.log("no project")
            return res.status(400).json({ "message": "No project found" })
        }
        console.log("updated")
        console.log(project)
        return res.status(200).json({ "message": "Successfully updated", updatedProject: project })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ "message": "Server Error" })
    }
}

export const deleteProject = async (req, res) => {
    const { projectId } = req.params
    if (!projectId) {
        console.log("no params found")
        return res.status(400).json({ "message": "no project id found" })
    }
    try {
        const project = await ProjectModel.deleteOne({ _id: projectId, clientId: req.user.userId })

        if (!project) {
            console.log("no project found")
            return res.status(400).json({ "message": "No project found" })
        }
        console.log("deleted")
        return res.status(200).json({ "message": "Successfully deleted" })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ "message": "Server Error" })
    }
}

export const getAllProjects = async (req, res) => {
    const clientId = req.user.userId

    if (!clientId) {
        return res.status(400).json({ "message": "user not authenticated" })
    }

    try {
        const AllProjects = await ProjectModel.find()
        return res.status(200).json({ 'message': "All Projects", projects: AllProjects })
    }
    catch (error) {
        return res.status(500).json({ "message": "Server Error" })
    }
}

export const updateProjectStatus = async (req, res) => {
    try {
        const { projectId } = req.params
        const { status } = req.body
        const userId = req.user.userId

        const project = await ProjectModel.findById(projectId)

        if (!project) {
            return res.status(404).json({ message: 'Project not found' })
        }
        if (project.clientId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this project' })
        }
        project.status = status
        await project.save()

        res.status(200).json({
            success: true,
            message: 'Project status updated successfully',
            project
        })

    }
    catch (error) {
        console.log("error", error.message)
        res.status(500).json({ message: 'Server error', error: error.message })

    }
}

