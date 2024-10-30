import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { Button, Input } from "@material-tailwind/react";

import { toast } from "react-toastify";
import { MdArrowBack, MdSend } from "react-icons/md";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
const SubCategoryAdd = () => {
  const [categoriesSub, setCategoriesSub] = useState({
    category: "",
    subcategory: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCategories(response.data?.categories);
      } catch (error) {
        console.error("Error fetching category data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
    setLoading(false);
  }, []);
  const onInputChange = (e) => {
    setCategoriesSub({
      ...categoriesSub,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    let data = {
      category: categoriesSub.category,
      subcategory: categoriesSub.subcategory,
    };

    axios({
      url: BASE_URL + "/api/panel-create-sub-categories",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == "200") {
        toast.success("Sub Category succesfull");

        setCategoriesSub({
          category: "",
          subcategory: "",
        });
        navigate("/");
      } else {
        toast.error("duplicate entry");
      }
    });
    setIsButtonDisabled(false);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Create Sub Category
        </h3>
      </div>
      <div className="w-full mt-5 p-4 bg-white shadow-lg rounded-xl">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Service Select Field */}
            <div className="form-group">
              {/* <Select
                name="service_id"
                onChange={(e) => onInputChange(e)}
                value={categoriesSub.category}
                label="Category Name"
                required
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              >
                {categories.map((option) => (
                  <SelectOption key={option.id} value={option.id}>
                    {option.category}
                  </SelectOption>
                ))}
              </Select> */}
              <FormControl fullWidth>
                <InputLabel id="service-select-label">
                  <span className="text-sm relative bottom-[6px]">
                    Category Name <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="service-select-label"
                  id="service-select"
                  name="category"
                  onChange={(e) => onInputChange(e)}
                  value={categoriesSub.category}
                  label="Category Name"
                  required
                >
                  {categories.map((data) => (
                    <MenuItem key={data.id} value={String(data.id)}>
                      {data.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Service Sub Field */}
            <div className="form-group">
              <Input
                type="text"
                name="subcategory"
                onChange={(e) => onInputChange(e)}
                value={categoriesSub.subcategory}
                label="Sub Category Name"
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

            <Link to="/sub-category">
              <Button className="mr-2 mb-2">
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
  );
};

export default SubCategoryAdd;
