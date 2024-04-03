import { useContext, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { AppContext } from '../../../AppContext';
export default function AddImageJS() {
    const [userImages, setUserImages] = useState([]);
    const { handleFetch } = useContext(AppContext)
    const onDrop = (acceptedFiles) => {
      setUserImages([...acceptedFiles.map(file => ({
        image: file,
        title: file.name,
        description: '',
      }))]);
      console.log(acceptedFiles);
    };
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 });
  
    const handleRemoveImage = (index) => {
      setUserImages(prev => {
        return prev.filter((_, indexObj) => indexObj !== index)
      });
    };
  
    const handleInputChange = (index, event) => {
      const { name, value } = event.target;
      setUserImages(prev => {
        const updatedImages = [...prev];
        updatedImages[index][name] = value;
        return updatedImages;
      });
    };
  
    const [fetchingData, setFetchingData] = useState(false)
    const handleUpload = async (e) => {
      e.preventDefault()
  
      if (fetchingData) {
        return
      }
      try {
        setFetchingData(true)
        const formData = new FormData();
        formData.append('image', userImages[0].image);
        formData.append('title', userImages[0].title);
        formData.append('description', userImages[0].description);
        
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          console.log('Image uploaded successfully');
        } else {
          console.error('Failed to upload image');
        }
        setFetchingData(false)
        setUserImages([])
        handleFetch()
      } catch (error) {
        console.error('Error uploading image', error);
        setFetchingData(false)
      }
    }
  return {
    getInputProps,
    getRootProps,
    isDragActive,
    handleRemoveImage,
    handleInputChange,
    handleUpload,
    userImages,
  }
}
