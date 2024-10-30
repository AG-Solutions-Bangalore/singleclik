import React, { useContext, useState } from "react";
import Layout from "../../../layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { ContextPanel } from "../../../utils/ContextPanel";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import { toast } from "react-toastify";
import { MdArrowBack, MdSend } from "react-icons/md";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
const profile_type = [
  {
    value: "0",
    label: "Business",
  },
  {
    value: "1",
    label: "Service",
  },
  {
    value: "0,1",
    label: "Business/Service",
  },
];
import { Button, Input } from "@material-tailwind/react";

const CategoryAdd = () => {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [categories, setCategories] = useState({
    category: "",
    category_type: "",
    category_image: "",
    category_sort:"",
  });
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const onInputChange = (e) => {
    setCategories({
      ...categories,
      [e.target.name]: e.target.value,
    });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    const data = new FormData();
    data.append("category", categories.category);
    data.append("category_type", categories.category_type);
    data.append("category_sort", categories.category_sort);
    data.append("category_image", selectedFile);

    axios({
      url: BASE_URL + "/api/panel-create-categories",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == "200") {
        toast.success("Sub Category succesfull");

        setCategories({
          category: "",
          category_type: "",
          category_image: "",
          category_sort:"",
        });
        navigate("/category");
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
          Create Category
        </h3>
      </div>
      <div className="w-full mt-5 p-4 bg-white shadow-lg rounded-xl">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* 1 */}
            <div className="form-group">
              <Input
                type="text"
                name="category"
                onChange={(e) => onInputChange(e)}
                value={categories.category}
                label="Category Name"
                required
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>
            {/* 2  */}
            <div className="form-group">
              {/* <Select
                label="Category Type"
                name="category_type"
                onChange={(e) => onInputChange(e)}
                value={categories.category_type}
                required
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              >
                {profile_type.map((option) => (
                  <SelectOption key={option.value} value={option.value}>
                    {option.label}
                  </SelectOption>
                ))}
              </Select> */}
              <FormControl fullWidth>
                <InputLabel id="service-select-label">
                  <span className="text-sm relative bottom-[6px]">
                    Category Type <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="service-select-label"
                  id="service-select"
                  label="Category Type"
                  name="category_type"
                  onChange={(e) => onInputChange(e)}
                  value={categories.category_type}
                  required
                >
                  {profile_type.map((data) => (
                    <MenuItem key={data.value} value={String(data.value)}>
                      {data.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/*3 */}

            {/* File Upload Field */}
            <div className="form-group">
              <Input
                label="Category Image"
                type="file"
                name="category_image"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full px-4 pb-2 border border-gray-400 rounded-md  transition-all"
              />
            </div>
            <div className="form-group">
              <Input
                type="number"
                min="0"
                name="category_sort"
                onChange={(e) => onInputChange(e)}
                value={categories.category_sort}
                label="Category Sort"
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
              color="primary"
              disabled={isButtonDisabled}
            >
              <div className="flex gap-1">
                <MdSend className="w-4 h-4" />
                <span>{isButtonDisabled ? "Submiting...." : "Submit"}</span>
              </div>
            </Button>

            {/* Back Button */}

            <Link to="/category">
              <Button className="mr-2 mb-2" color="primary">
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

export default CategoryAdd;
