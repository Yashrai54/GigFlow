import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

const MyBids = () => {
    const location = useLocation()
    const [bids, setBids] = useState(location.state?.Bids || [])
    const [projectStatus, setProjectStatus] = useState('Open') 
    const [isHiring, setIsHiring] = useState(false)
    const projectId = location.state?.project

    const handleHire = async (bidId) => {
        if (isHiring) return 
        
        try {
            setIsHiring(true)
            
            await axios.patch(`http://localhost:4000/api/project/${projectId}/status`, {
                status: 'Assigned'
            }, { withCredentials: true })

            await axios.patch(`http://localhost:4000/api/bid/${bidId}/status`, {
                status: 'hired'
            }, { withCredentials: true })

            await axios.patch(`http://localhost:4000/api/bid/reject-others`, {
                projectId,
                acceptedBidId: bidId
            }, { withCredentials: true })

            setBids(prevBids => prevBids.map(bid => {
                if (bid._id === bidId) {
                    return { ...bid, status: 'hired' }
                } else if (bid.status?.toLowerCase() === 'pending') {
                    return { ...bid, status: 'rejected' }
                }
                return bid
            }))

            setProjectStatus('Assigned')

            alert('Freelancer hired successfully!')
            
        } catch (error) {
            console.error('Error hiring freelancer:', error)
            alert('Failed to hire freelancer. Please try again.')
        } finally {
            setIsHiring(false)
        }
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            hired: { bg: 'bg-green-100', text: 'text-green-800', label: 'Hired' },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
        }
        
        const config = statusConfig[status?.toLowerCase()] || statusConfig.pending
        
        return (
            <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-sm font-medium`}>
                {config.label}
            </span>
        )
    }

    if (!bids || bids.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No bids found</h3>
                    <p className="mt-1 text-sm text-gray-500">There are no bids for this project yet.</p>
                </div>
            </div>
        )
    }

    // Check if someone is already hired
    const hasHiredBid = bids.some(bid => bid.status?.toLowerCase() === 'hired')

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Project Bids</h1>
                    <p className="text-gray-600 mt-2">
                        {bids.length} {bids.length === 1 ? 'bid' : 'bids'} received
                    </p>
                    
                    {hasHiredBid && (
                        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-green-800 font-medium">
                                    Project Assigned - A freelancer has been hired for this project
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {bids.map((bid) => (
                        <div 
                            key={bid._id || bid.id} 
                            className={`bg-white rounded-lg shadow-md p-6 transition-all border 
                                ${bid.status?.toLowerCase() === 'hired' 
                                    ? 'border-green-300 ring-2 ring-green-100' 
                                    : bid.status?.toLowerCase() === 'rejected'
                                    ? 'border-gray-200 opacity-75'
                                    : 'border-gray-200 hover:shadow-lg'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            Budget: ${bid.budget}
                                        </h3>
                                        {getStatusBadge(bid.status)}
                                    </div>
                                    
                                  
                                </div>
                            </div>

                            <div className="mt-4">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Proposal</h4>
                                <p className="text-gray-600 leading-relaxed">{bid.message}</p>
                            </div>

                            {bid.status?.toLowerCase() === 'pending' && !hasHiredBid && (
                                <div className="mt-6">
                                    <button 
                                        onClick={() => handleHire(bid._id)}
                                        disabled={isHiring}
                                        className={`w-full px-6 py-3 rounded-lg transition-colors font-medium
                                            ${isHiring 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            }`}
                                    >
                                        {isHiring ? 'Processing...' : 'Hire Freelancer'}
                                    </button>
                                </div>
                            )}

                            {bid.status?.toLowerCase() === 'rejected' && hasHiredBid && (
                                <div className="mt-4 text-sm text-gray-500 italic">
                                    Not selected - Another freelancer was hired
                                </div>
                            )}

                            {bid.status?.toLowerCase() === 'hired' && (
                                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-green-800 font-medium text-sm">
                                        Freelancer Hired
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyBids