import React, { useState, useEffect, useRef } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'
// const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`//?page=1

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([])
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [newImages, setNewImages] = useState(false)
  const mounted = useRef(false);

  const fetchImages = async () => {
    setLoading(true);
    let url;//construct our url adding my access key API
    const urlPage = `&page=${page}`;
    const urlQuery =`&query=${searchQuery}`

    if (searchQuery) {//if a search it's being made then...
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`//...use the search endpoint
    } else {
      url = `${mainUrl}${clientID}${urlPage}`//otherwise use the mainUrl
    }
  try {
    const response = await fetch(url)
    const data = await response.json()
    setPhotos((oldData) => {
    //if we're doing a searching, then we need wiping out the default images just returning the resultant of the search
      if (searchQuery && page === 1) {//in the initial rendering search result just set the photos to the data itself
        return data.results
      }
      else if (searchQuery) {//when fetching data from a search several times, then yes, add the previous result and the new ones
        return [...oldData, ...data.results]//when using search query the data gets back nested
      } else {
        return [...oldData, ...data]//keep the previous photos(in this case the default ones) and add the new data(photos) from the last fetch
      }
    });
    setNewImages(false);
    setLoading(false);
  } catch (error) {
    setNewImages(false);
    setLoading(false);
    console.log(error)
  }
  }
  
  //fetch images
  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line
  }, [page])

  useEffect(()=> {//this code is to make sure that runs only after the initial render
    if (!mounted.current){
      mounted.current = true;
      return;
    }
    if (!newImages) return
    if (loading) return
    setPage((prevPage)=> {
      return prevPage + 1
    })
  },[newImages])


  //scroll event
  const event = ()=> {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2){
      setNewImages(true)
    }
  }
  useEffect(()=> {
    window.addEventListener('scroll', event);
    return ()=> window.removeEventListener('scroll',event);
  },[])

  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!searchQuery) return;
    if(page === 1){
      fetchImages();
      return;
    }
    setPage(1);//
   // fetchImages()//technically we don't need this fetching anymore as the useEffect is in charge
    
  }


  return <main>
    <section className="search">
      <form action="" className="search-form">
        <input
          value={searchQuery}
          onChange={(e)=>{setSearchQuery(e.target.value)}}
          type="text"
          placeholder="search"
          className="form-input" />
        <button type="submit" className="submit-btn" onClick={handleSubmit}>
          <FaSearch/>
        </button>
      </form>
    </section>
    <section className="photos">
      <div className="photos-center">
        {photos.map((photo, index) => {
          return <Photo key={index} {...photo}/>
        })}
      </div>
      {loading && <h2 className="loading">Loading...</h2>}
    </section>
  </main>
}

export default App


// console.log(`innerHeight ${window.innerHeight}`)
// console.log(`scrollY ${window.scrollY}`)
// console.log(`body height ${document.body.scrollHeight}`)
//These are the values obtained with the scroll event. 
//The fetching caused by the scroll, will only get done if loading is not true
//and the sizes of window.innerHeight + window.scrollY are greater than or equal to 
// document.body.scrollHeight - 1. These two conditionals are set to avoid a continuos
//fetching data while we are in the bottom of the page.
//To change the number of the page that will be displayed, we'll use a hook that will 
//increment it's value once we reach the bottom of the page.
//When fetching data based on a search query, the response gets back in a different structure than the mainUrl
//

/* 


//create a function inside the useEffect, that will have track of the scroll event
  useEffect(() => {
    const event = window.addEventListener('scroll', () => {
      if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 1) {
        setPage((oldPage) => {
          return oldPage + 1;
        })
      }
     })
    return () => window.removeEventListener('scroll', event);
    // eslint-disable-next-line
  },[])
  
  */