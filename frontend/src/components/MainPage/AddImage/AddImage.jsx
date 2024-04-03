import React from 'react';
import './AddImage.css';
import { IoCloseSharp } from "react-icons/io5";

import AddImageJS from './AddImageJS';
export default function AddImage({ handle }) {
  const {
    getInputProps,
    getRootProps,
    isDragActive,
    handleRemoveImage,
    handleInputChange,
    handleUpload,
    userImages
  } = AddImageJS()

  return (
    <div className='AddImage c f'>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {
          isDragActive ?
          <p>Drop the file here ...</p> :
          <p>Click to Add Image</p>
        }
      </div>
      <div className='photos c f'>
        {userImages.map((image, index) => (
          <div className='img c f' key={index}>
            <img src={URL.createObjectURL(image.image)} alt="" />
            <div onClick={() => handleRemoveImage(index)} className='remove c'>
              <IoCloseSharp />
            </div>
            <form onSubmit={handleUpload} className='input c f'>
              <input 
                type="text"
                name="title"
                maxLength={20} 
                placeholder='Title'
                required 
                value={image.title}
                onChange={(event) => handleInputChange(index, event)}
              />
              <textarea 
                name="description"
                value={image.description}
                onChange={(event) => handleInputChange(index, event)}
                rows="3"
                maxLength={100}
                required 
                placeholder='Description'>
              </textarea>
              <button type="submit">Submit</button>
            </form>
          </div>
        ))}
      </div>
      <button onClick={() => handle('')} className='return'>Return</button>
    </div>
  );
}
