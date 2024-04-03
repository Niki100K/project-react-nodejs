import React, { useContext, useState } from 'react'
import './MainPage.css'

import { FcSearch } from "react-icons/fc";
import { IoAdd } from "react-icons/io5";
import { AiOutlineAim } from "react-icons/ai";

import AddImage from './AddImage/AddImage';

import { AppContext } from '../../AppContext';
export default function MainPage() {
  const {imagesData, API, handleFetch } = useContext(AppContext)
  const [correctSetting, setCorrectSetting] = useState('')
  const handleSetting = (type) => {
    setCorrectSetting(type)
  }
  const [searchTerm, setSearchTerm] = useState('');
  const filteredImages = imagesData.filter(info =>
    info.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    info.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    info.id.toString().includes(searchTerm.toLowerCase())
  );
  const [markImages, setMarkImages] = useState([])
  const handleMark = (index) => {
    setMarkImages(prev => {
      if (prev.includes(index)) {
        return prev.filter(obj => obj !== index)
      } else {
        return [...prev, index]
      }
    })
  }
  const [fetchingData, setFetchingData] = useState(false)
  const handleDelete = async () => {
    if (fetchingData) {
      return
    }
    try {
      setFetchingData(true)
      const response = await fetch(`${API}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markImages: markImages,
        }),
      })
      const data = await response.json()
      console.log(data);
      setFetchingData(false)
      handleFetch()
      setMarkImages([])
    } catch (error) {
      setFetchingData(false)
      console.error(error);
    }
  }
  return (
    <div className='MainPage c'>
      <div className='filter c f'>
        <h2>Search Image</h2>
        <div className='input c'>
          <input 
            type="text"
            placeholder=''
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <label className='c' htmlFor=""><FcSearch /> Search Title</label>
        </div>
        {correctSetting === '' &&
          <div className='btn c f'>
            <button onClick={() => handleSetting('image')}><IoAdd />Add Image</button>
          </div>
        }
        {correctSetting === 'image' && <AddImage handle={handleSetting} />}
        {markImages.length > 0 &&
        <React.Fragment>
          <strong>{markImages.length}</strong>
          <dfn>Are you sure you want to delete {markImages.length} images</dfn>
          <button onClick={handleDelete}>Delete</button>
        </React.Fragment>
        }
      </div>
      <div className='images c spa'>
        {filteredImages.map((info, index) => (
          <div onClick={() => handleMark(info.id)} className='img c f transition' key={index}>
            <img src={info.url} alt="" />
            <h3>{info.title}</h3>
            <p>{info.description}</p>
            {markImages.includes(info.id) &&
              <div className='circle c'><AiOutlineAim /></div>
            }
          </div>
        ))}
      </div>
    </div>
  )
}
