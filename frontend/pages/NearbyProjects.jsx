import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Drawer, IconButton, TextField } from '@mui/material'
import { FaMessage, FaPaperPlane } from "react-icons/fa6"
import socket from '../socket'
import axios from 'axios'

const NearbyProjects = () => {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [budget, setBudget] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleDrawer = (project = null) => {
    if (project && project.status?.toLowerCase() === 'assigned') {
      alert('This project has already been assigned to a freelancer.')
      return
    }
    
    setSelectedProject(project)
    setOpen(!open)
    
    if (!project) {
      setMessage("")
      setBudget(0)
      setMessages([])
    }
  }

  const projects = location.state?.projects || []
  const displayMessage = location.state?.message || ""
  const roomId = selectedProject?._id

  useEffect(() => {
    setMessages([])
    if (!roomId) return
    socket.emit("joinRoom", roomId)
    socket.on("recieveMessage", (msg) => {
      const self = msg.sender === socket.id
      if (!self)
        setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.off("recieveMessage")
    }
  }, [roomId])

  const sendMessage = () => {
    if (!message.trim()) return

    socket.emit("sendMessage", { roomId, text: message, budget: Number(budget) })
    setMessages((prev) => [...prev, { text: message, budget, self: true }])
  }

  const createBid = async (projectId) => {
    if (isSubmitting) return
    
    try {
      setIsSubmitting(true)
      
      const res = await axios.post("https://gigflow-capn.onrender.com/api/bid/create",
        {
          message,
          budget: Number(budget),
          projectId
        },
        { withCredentials: true }
      )

      console.log(res.data.message)
      alert("Proposal submitted successfully!")
      
      setMessage("")
      setBudget(0)
      toggleDrawer()
      
    } catch (error) {
      console.log("Error occurred:", error)
      
      if (error.response?.data?.message) {
        alert(error.response.data.message)
      } else if (error.response?.status === 400) {
        alert("This project has already been assigned.")
      } else {
        alert("Failed to submit proposal. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getProjectStatusBadge = (status) => {
    if (status?.toLowerCase() === 'assigned') {
      return (
        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
          Assigned
        </span>
      )
    }
    return (
      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
        Open
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {displayMessage && (
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">{displayMessage}</h2>
          {projects.length > 0 && (
            <p className="text-gray-600 mt-2">
              {projects.length} project{projects.length > 1 ? 's' : ''} found
            </p>
          )}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
            <svg 
              className="mx-auto h-16 w-16 text-gray-400 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Projects Found
            </h3>
            <p className="text-gray-600">
              {displayMessage.includes("No Results") 
                ? "Try adjusting your search terms or browse all projects"
                : "There are no projects available at the moment. Check back soon!"}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {projects.map(p => {
            const isAssigned = p.status?.toLowerCase() === 'assigned'
            
            return (
              <div
                className={`bg-white p-6 rounded-lg border transition-all
                  ${isAssigned 
                    ? 'border-gray-300 opacity-75' 
                    : 'border-gray-200 hover:border-sky-500 hover:shadow-md'
                  }`}
                key={p._id}
              >
                <div className="flex justify-between items-start mb-2">
                  <h1 className="font-semibold text-xl text-gray-800">{p.title}</h1>
                  {getProjectStatusBadge(p.status)}
                </div>
                
                <p className="text-gray-600 mb-4">{p.description}</p>
                
                {p.budget && (
                  <p className="text-gray-700 font-medium mb-4">
                    Budget: ${p.budget}
                  </p>
                )}
                
                <Button
                  variant="contained"
                  startIcon={<FaMessage />}
                  onClick={() => toggleDrawer(p)}
                  disabled={isAssigned}
                  sx={{ 
                    textTransform: 'none',
                    backgroundColor: isAssigned ? '#9ca3af' : '#0ea5e9',
                    '&:hover': {
                      backgroundColor: isAssigned ? '#9ca3af' : '#0284c7'
                    },
                    '&:disabled': {
                      backgroundColor: '#9ca3af',
                      color: '#ffffff'
                    }
                  }}
                >
                  {isAssigned ? 'Project Assigned' : 'Send Proposal'}
                </Button>
                
                {isAssigned && (
                  <p className="text-xs text-gray-500 mt-2 italic">
                    This project is no longer accepting proposals
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Drawer
        open={open}
        onClose={() => toggleDrawer()}
        anchor='right'
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 }
          }
        }}
      >
        <div className="h-full flex flex-col">
          <header className="bg-sky-600 text-white p-4 flex items-center justify-between shadow-md">
            <div>
              <h2 className="font-semibold text-lg">Send Proposal</h2>
              {selectedProject && (
                <p className="text-sm opacity-90">{selectedProject.title}</p>
              )}
            </div>
            <IconButton
              onClick={() => toggleDrawer()}
              sx={{ color: 'white' }}
            >
              ✕
            </IconButton>
          </header>

          <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`${
                      msg.self 
                        ? 'bg-sky-500 text-white ml-auto' 
                        : 'bg-white text-gray-800 border border-gray-200'
                    } p-3 rounded-lg shadow-sm max-w-xs`}
                  >
                    <p className="text-sm mb-1">{msg.text}</p>
                    {msg.budget && (
                      <p className="text-xs font-semibold">Budget: ${msg.budget}</p>
                    )}
                    <span className="text-xs opacity-70">{msg.time || 'now'}</span>
                  </div>
                ))
              )}
            </div>
          </main>

          <footer className="bg-white border-t border-gray-200 p-4">
            <div className="flex flex-col gap-3">
              <TextField
                fullWidth
                size="small"
                placeholder="Your proposal message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                multiline
                maxRows={3}
                disabled={isSubmitting}
              />

              <TextField
                type="number"
                fullWidth
                size="small"
                placeholder="Your bid amount ($)"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                inputProps={{ min: 0 }}
                disabled={isSubmitting}
              />

              <Button
                variant="contained"
                endIcon={<FaPaperPlane />}
                onClick={() => {
                  sendMessage()
                  createBid(selectedProject._id)
                }}
                disabled={!message.trim() || !budget || budget <= 0 || isSubmitting}
                fullWidth
                sx={{ 
                  textTransform: 'none',
                  backgroundColor: '#0ea5e9',
                  '&:hover': {
                    backgroundColor: '#0284c7'
                  }
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Send Proposal'}
              </Button>
            </div>
          </footer>
        </div>
      </Drawer>
    </div>
  )
}

export default NearbyProjects
