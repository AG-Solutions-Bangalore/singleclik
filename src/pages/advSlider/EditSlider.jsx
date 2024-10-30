import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../layout/Layout'
import { Link, useNavigate, useParams } from 'react-router-dom';
import BASE_URL from '../../base/BaseUrl';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, Card, IconButton, Input } from "@material-tailwind/react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { MdArrowBack, MdEdit, MdSend } from "react-icons/md";


const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

const EditSlider = () => {
    const [selectedFile, setSelectedFile] = useState(null);
  const [advSlider, setAdvSlider] = useState({
    slider_images: "",
    slider_url: "",
    slider_status: "",
  });
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo = storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  // const pageNo = localStorage.getItem("page-no" || "1")
  console.log("edit page n",pageNo)

  const onInputChange = (e) => {
    setAdvSlider({
      ...advSlider,
      [e.target.name]: e.target.value,
    });
  };

  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/adv-slider?page=${pageNo}`);
  };

  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-adv-slider-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAdvSlider(response.data.slider);
      } catch (error) {
        console.error("Error fetching ADv Slider:", error);
      }
    };

    fetchSlider();
  }, [id]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("slider_url", advSlider.slider_url);
    formData.append("slider_status", advSlider.slider_status);
    formData.append("slider_images", selectedFile);

    try {
      setIsButtonDisabled(true);
     
      const response = await axios.post(
        `${BASE_URL}/api/panel-update-adv-slider/${id}?_method=PUT`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.code == "200") {
        toast.success("Adv Slider updated successfully");
        navigate(`/adv-slider?page=${pageNo}`);
      } else {
        toast.error("Duplicate entry");
      }
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const imageUrl = advSlider.slider_images
    ? `https://singleclik.com/api/storage/app/public/slider_images/${advSlider.slider_images}`
    : "https://singleclik.com/api/storage/app/public/no_image.jpg";


  return (
  <Layout>
       <div className="flex justify-start gap-2 mt-10">
        <Card className="p-6 w-full  shadow-lg rounded-lg ">
          <div className="text-center">
            <h2 className="text-2xl border-b border-dashed border-green-900 font-bold text-gray-800 mb-4">
                Adv Slider Edit
            </h2>
          </div>
          <div className=" relative w-44  m-auto flex flex-col items-center mb-4">
            <img
              src={imageUrl}
              alt="Category"
              className="w-32 h-32 border-2 border-red-500  rounded-full mb-2"
            />
            <div className="absolute bottom-0 right-0 transform  -translate-x-6 -translate-y-1/4">
              <div
                className=" border bg-green-400 cursor-pointer hover:bg-blue-300 border-black rounded-full p-[3px] "
                onClick={() => fileInputRef.current.click()}
              >
                <MdEdit className="w-6 h-6 text-black" />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                name="slider_images"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                style={{ display: "none" }}
              />
            </div>
            {selectedFile && (
              <p className="text-gray-600 text-sm">{selectedFile.name}</p>
            )}
          </div>

         
          <form
            id="categoryForm"
            autoComplete="off"
            onSubmit={handleSubmit}
            className="mt-2"
          >

<div className="text-center mb-4">
          <Input
                  type="text"
                  name="slider_url"
                  onChange={(e) => onInputChange(e)}
                  value={advSlider.slider_url}
                  label="Slider Url"
                  required
                  className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
                />
          </div>
            <div className="mb-4">
              <FormControl fullWidth>
                <InputLabel>
                  <span className="text-sm">
                    Adv Slider Status <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  name="slider_status"
                  value={advSlider.slider_status}
                  onChange={onInputChange}
                  required
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="flex justify-between">
              <Button type="submit" disabled={isButtonDisabled}>
                <div className="flex gap-1">
                  <MdSend className="w-4 h-4" />
                  <span> {isButtonDisabled ? "Updating..." : "Update"}</span>
                </div>
              </Button>
             
                <Button onClick={handleBack}>
                  <div className=" flex gap-1">
                    <MdArrowBack className="w-4 h-4" />
                    <span>Back</span>
                  </div>
                </Button>
             
            </div>
          </form>
        </Card>
       
      </div>
  </Layout>
  )
}

export default EditSlider