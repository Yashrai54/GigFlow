import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import HomePageBg from '../src/assets/homebgg.png'
import { motion } from 'framer-motion'
import { CiSearch } from "react-icons/ci";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [allProjects, setAllProjects] = useState([])
  const [message, setMsg] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function getAllProjects() {
      await axios.get("https://gigflow-capn.onrender.com/api/project/all", {
        withCredentials: true
      }).then(res => {
        setAllProjects(res.data.projects || [])
        setError(null)
      }).catch((err) => setError("Failed to load projects. Please try again later."))
        .finally(() => setLoading(false))
    }
    getAllProjects()
  }, [])

  const navigate = useNavigate()
  
  function BrowseAll() {
    try {
      const displayMessage = allProjects.length === 0 
        ? "No Projects Available" 
        : "All Projects"
      
      navigate("/near", { 
        state: { 
          projects: allProjects, 
          message: displayMessage 
        } 
      })
    }
    catch (error) {
      setMsg("Something went wrong. Please try again.")
    }
  }
  
  function handleSearch() {
    if (!search.trim()) {
      setMsg("Please enter a search term")
      setTimeout(() => setMsg(""), 3000) 
      return
    }

    const filteredProjects = allProjects.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase())
    )
    
    const displayMessage = filteredProjects.length === 0 
      ? `No Results for "${search}"` 
      : `${filteredProjects.length} Result${filteredProjects.length > 1 ? 's' : ''} for "${search}"`
    
    navigate("/near", {
      state: {
        projects: filteredProjects,
        message: displayMessage
      }
    })
  }
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className='min-h-screen bg-[#F2FAFA]'>
      <Navbar />

      <main className='m-5 flex flex-col lg:flex-row justify-center items-center gap-[20px] lg:gap-[40px] px-4'>
        <motion.div 
          initial={{ opacity: 0, x: 0 }} 
          animate={{ opacity: 1, x: 30 }}
          transition={{ duration: 0.8, ease: "easeIn" }}
          className='w-full max-w-[500px] mt-10'
        >
          <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-black text-center lg:text-left'>
            Are you finding local clients?
          </h1>
          <p className='text-base md:text-lg lg:text-xl font-semibold w-full mt-5 text-center text-[#252525]'>
            Find work near you. Fast.
            Browse local gigs, connect with nearby clients, and get paid for what you do best
            — all in your area.
          </p>
          
          <div className='flex flex-col sm:flex-row items-center justify-center mt-10 gap-3 sm:gap-0'>
            <button 
              className={`bg-sky-500 text-white font-semibold px-6 sm:px-10 py-3 sm:py-4
                rounded-md w-full sm:w-auto transition-all duration-200
                ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-sky-600'}
              `}
              onClick={BrowseAll}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Browse Gigs'}
            </button>
            
            <input 
              type="search" 
              name="job-search" 
              id="job-search"
              placeholder='Search freelance work' 
              className='sm:ml-5 px-4 py-3 sm:py-4 border-2 border-sky-500 rounded-md outline-none
                transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 w-full sm:w-auto
              ' 
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              value={search}
            />
            
            <span className="items-center sm:ml-3">
              <CiSearch 
                size={30} 
                className={`${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:text-sky-500'} transition-colors`}
                onClick={handleSearch}
              />
            </span>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='mt-5 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center'
            >
              {error}
            </motion.div>
          )}
          
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='mt-5 p-4 bg-amber-100 border border-amber-400 text-amber-700 rounded-md text-center'
            >
              {message}
            </motion.div>
          )}
          
          {!loading && !error && (
            <p className='text-center mt-5 text-gray-600 text-sm'>
              {allProjects.length === 0 
                ? 'No gigs available yet - be the first to post!' 
                : `${allProjects.length} gig${allProjects.length > 1 ? 's' : ''} available`}
            </p>
          )}
        </motion.div>
        
        <div className='w-full max-w-[500px] h-auto mt-10 lg:mt-0'>
          <img src={HomePageBg} alt="Find local work" className='w-full h-auto' />
        </div>
      </main>
    </div>
  )
}

export default Home
