import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { FiFileText } from "react-icons/fi";
import { toast } from "react-toastify";

const AddSubCategoryMember = ({
  open,
  handleOpenSubCategory,
  id,
  fetchData,
}) => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    category: "",
    catg_id: "",
    u_subcatg_id: "",
  });

  const [categories, setCategories] = useState([]);
  const [categoriesSub, setCategoriesSub] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-user-categories-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCategories(response.data?.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = useCallback(async () => {
    if (!profile.catg_id) return;
    try {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-register-sub-categories-by-value/${
          profile.catg_id || ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCategoriesSub(response.data.categoriessub || []);
    } catch (error) {
      console.error("Error fetching sub-categories:", error);
    }
  }, [profile?.catg_id]);

  useEffect(() => {
    fetchCategories();
  }, [fetchData]);

  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);

  const onInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setProfile({ ...profile, catg_id: value, u_subcatg_id: "" });
      setCategoriesSub([]);
    } else if (name === "sub_category") {
      setProfile({ ...profile, u_subcatg_id: value });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-400  bg-[#f3f1f2]  rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!profile.u_subcatg_id) {
      setError("Please select a sub-category");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-user-sub-categories`,
        {
          u_id: id, // User ID from params
          u_subcatg_id: profile.u_subcatg_id, // Selected subcategory ID
          u_subcatg_other_sub_category: "",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == "200") {
        handleOpenSubCategory(); // Close dialog
        toast.success("SubCategory Added Succesfully");
        fetchData();

        setProfile({
          category: "",
          catg_id: "",
          u_subcatg_id: "",
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
    <Dialog open={open} handler={handleOpenSubCategory}>
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

          {/* // subcategory  */}
          <div className="mb-4">
            <label
              className="text-gray-700 font-bold mb-2 flex items-center"
              htmlFor="sub_category"
            >
              <FiFileText className="mr-2 text-pink-600" /> Sub Category
              <span className="text-red-500">&nbsp;*</span>
            </label>
            <select
              id="sub_category"
              name="sub_category"
              value={profile.u_subcatg_id || ""}
              onChange={onInputChange}
              required
              className={inputClass}
              disabled={!profile.catg_id}
            >
              <option value="">Select Sub Category</option>
              {categoriesSub.map((subCategory) => (
                <option key={subCategory.id} value={subCategory.id}>
                  {subCategory.subcategory}
                </option>
              ))}
            </select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpenSubCategory}
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
  );
};

export default AddSubCategoryMember;
