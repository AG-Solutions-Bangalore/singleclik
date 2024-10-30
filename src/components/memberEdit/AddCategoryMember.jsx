import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
  } from "@material-tailwind/react";
import BASE_URL from '../../base/BaseUrl';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiFileText } from 'react-icons/fi';

const AddCategoryMember = ({ open, handleOpenCategory ,id,fetchData}) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        category: "",
        catg_id: "",
     
      });
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
          try {
            const response = await axios.get(
              `${BASE_URL}/api/panel-fetch-categories`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            setCategories(response.data.categories);
          } catch (error) {
            console.error("Error fetching Categories:", error);
          }
        };
    
        fetchCategories();
      }, []);

      
  const onInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setProfile({ ...profile, catg_id: value, });
    
    }  else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-400  bg-[#f3f1f2]  rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!profile.catg_id) {
      setError("Please select a category");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-user-categories`,
        {
          u_id: id, // User ID from params
          u_catg_id: profile.catg_id, // Selected subcategory ID
          u_catg_other_sub_category: "", // leave emplty
          u_catg_other_category:"", // leave empty
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == "200") {
        handleOpenCategory(); // Close dialog
        toast.success("Category Added Succesfully");
        fetchData();

        setProfile({
            category: "",
            catg_id: "",
        });

        fetch;
      } else {
        setError(response.data.message || "Failed to add sub-category");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.response?.data?.message || "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} handler={handleOpenCategory}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>Add SubCategory</DialogHeader>
        <DialogBody>
          {error && (
            <div className="mb-4 text-red-500 text-sm font-medium">{error}</div>
          )}
          <div className="mb-4">
            <label
              className="text-gray-700 font-bold mb-2 flex items-center"
              htmlFor="category"
            >
              <FiFileText className="mr-2 text-yellow-600" />
              Category<span className="text-red-500">&nbsp;*</span>
            </label>
            <select
              id="category"
              name="category"
              value={profile.catg_id || ""}
              onChange={onInputChange}
              required
              className={inputClass}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>

       
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpenCategory}
            className="mr-1"
            type="button"
            disabled={isSubmitting}
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            type="submit"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? "Submitting..." : "Confirm"}</span>
          </Button>
        </DialogFooter>
      </form>
  </Dialog>
  )
}

export default AddCategoryMember



