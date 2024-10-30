import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Card, Input } from "@material-tailwind/react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { MdArrowBack, MdSend } from "react-icons/md";
const status = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
];

const SubCategoryEdit = () => {
  const [categoriesSub, setCategoriesSub] = useState({
    category_id: "",
    subcategory: "",
    subcategory_status: "",
  });
  const [categories, setCategories] = useState([]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const onInputChange = (e) => {
    setCategoriesSub({
      ...categoriesSub,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    axios({
      url: `${BASE_URL}/api/panel-fetch-sub-categories-by-id/${id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setCategoriesSub(res.data?.categoriessub);
    });
  }, []);
  useEffect(() => {
    axios({
      url: `${BASE_URL}/api/panel-fetch-categories`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setCategories(res.data.categories);
    });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    setIsButtonDisabled(true);

    let data = {
      category_id: categoriesSub.category_id,
      subcategory: categoriesSub.subcategory,
      subcategory_status: categoriesSub.subcategory_status,
    };

    axios({
      url: `${BASE_URL}/api/panel-update-sub-categories/${id}`,
      method: "Put",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == "200") {
        toast.success("update succesfull");
        navigate("/");
      } else {
        toast.error("duplicate entry");
      }
    });

    // setIsButtonDisabled(false);
  };
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Sub Category </h1>
        <form
          id="addIndiv"
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          autoComplete="off"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5 mb-4">
            {/* Full Name Field */}
            <div>
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
                  name="category_id"
                  onChange={(e) => onInputChange(e)}
                  value={categoriesSub.category_id}
                  label="Category Name"
                  required
                >
                  {categories.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <Input
                name="subcategory"
                type="text"
                onChange={(e) => onInputChange(e)}
                value={categoriesSub.subcategory}
                label="Sub Category Name"
                required
                className="w-full px-4 py-3 border border-gray-500 rounded-md  transition-all"
              />
            </div>

            {/* Status Dropdown */}

            <div>
              <FormControl fullWidth>
                <InputLabel id="service-select-label">
                  <span className="text-sm relative bottom-[6px]">
                    Category Status <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="service-select-label"
                  id="service-select"
                  name="subcategory_status"
                  onChange={(e) => onInputChange(e)}
                  value={categoriesSub.subcategory_status}
                  label="Category Status"
                  required
                >
                  {status.map((data) => (
                    <MenuItem key={data.label} value={data.value}>
                      {data.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="flex justify-center mt-6 space-x-4">
            <Button
              type="submit"
              className="mr-2 mb-2"
              color="primary"
              onClick={onSubmit}
              disabled={isButtonDisabled}
            >
              <div className="flex gap-1">
                <MdSend className="w-4 h-4" />
                <span>{isButtonDisabled ? "Updating..." : "Update"}</span>
              </div>
            </Button>

            <Link to="/">
              <Button className="mr-2 mb-2" color="primary">
                <div className="flex gap-1">
                  <MdArrowBack className="w-4 h-4" />
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

export default SubCategoryEdit;
