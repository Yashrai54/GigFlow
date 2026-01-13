import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const MyProjects = () => {
    const [myProjects, setMyProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [bids,setBids] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchMyProjects() {
            try {
                const res = await axios.get("http://localhost:4000/api/project/myprojects", { withCredentials: true })
                console.log(res.data)

                setMyProjects(res.data.projects)

            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchMyProjects()
    }, [])


    async function getBids(projectId) {
        try{
            const res = await axios.get("http://localhost:4000/api/bid/getbids",{
                params:{projectId},
                withCredentials:true
            })
            setBids(res.data.Bids)
            console.log(res.data.Bids)
            console.log(projectId)
            navigate("/mybids",{state:{Bids:res.data.Bids,project:projectId}})
        }   
        catch(error){
            console.log(error)
        }
    }
    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-lg text-gray-600">Loading...</div>
        </div>
    )
    
    if (error) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-lg text-red-600">Error: {error}</div>
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Projects</h1>
            
            {myProjects.length === 0 ? (
                <p className="text-gray-600">No projects found.</p>
            ) : (
                <ul className="space-y-4">
                    {myProjects.map((p) => (
                        <li key={p.id || p._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{p.title}</h3>
                            <p className="text-gray-600 mb-5">{p.description}</p>
                            <Button
                                        variant="contained"
                                        onClick={() => getBids(p._id)}
                                        sx={{ textTransform: 'none' }}
                                        placeholder="See Bids"
                                        className=' mt-6 '
                                      >
                                        See Bids
                                      </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default MyProjects