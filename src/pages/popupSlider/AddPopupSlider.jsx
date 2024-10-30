import React, { useState } from 'react'
import Layout from '../../layout/Layout'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../base/BaseUrl';
import { toast } from 'react-toastify';
import { Button, Input } from '@material-tailwind/react';
import { MdArrowBack, MdSend } from 'react-icons/md';

const AddPopupSlider = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [popupSlider, setPopupSlider] = useState({
        slider_url: "",
      slider_images: "",
    });
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const navigate = useNavigate();
  
    const onInputChange = (e) => {
        setPopupSlider({
        ...popupSlider,
        [e.target.name]: e.target.value,
      });
    };
    const onSubmit = (e) => {
      e.preventDefault();
      setIsButtonDisabled(true);
      const data = new FormData();
      data.append("slider_url", popupSlider.slider_url);
      data.append("slider_images", selectedFile);
  
      axios({
        url: BASE_URL + "/api/panel-create-popup-slider",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.data.code == "200") {
          toast.success("Popup Slider Create  succesfull");
  
          setPopupSlider({
            slider_url: "",
            slider_images: "",
          });
          navigate("/popup-slider");
        } else {
          toast.error("duplicate entry");
        }
      });
    };
  return (
   <Layout>
    <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
          <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
            Create Popup Slider
          </h3>
        </div>
        <div className="w-full mt-5 p-4 bg-white shadow-lg rounded-xl">
          <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

                    {/* File Upload Field */}
              <div className="form-group">
                <Input
                  label="Popup Slider Image"
                  type="file"
                  name="slider_images"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full px-4 pb-2 border border-gray-400 rounded-md  transition-all"
                />
              </div>
              {/* 2 */}
              <div className="form-group">
                <Input
                  type="text"
                  name="slider_url"
                  onChange={(e) => onInputChange(e)}
                  value={popupSlider.slider_url}
                  label="Popup Slider Url"
                  required
                  className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
                />
              </div>
           
  
          
            </div>
  
            {/* Buttons */}
            <div className="flex justify-center space-x-4">
              {/* Submit Button */}
  
              <Button
                type="submit"
                className="mr-2 mb-2"
                disabled={isButtonDisabled}
              >
                <div className="flex gap-1">
                  <MdSend className="w-4 h-4" />
                  <span>{isButtonDisabled ? "Submiting...." : "Submit"}</span>
                </div>
              </Button>
  
              {/* Back Button */}
  
              <Link to="/adv-slider">
                <Button className="mr-2 mb-2" >
                  <div className="flex gap-1">
                    <MdArrowBack className="w-5 h-5" />
                    <span>Back</span>
                  </div>
                </Button>
              </Link>
            </div>
          </form>
        </div>
   </Layout>
  )
}

export default AddPopupSlider