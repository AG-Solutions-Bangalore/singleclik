import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ContextPanel } from "../../../utils/ContextPanel";
import { RiEditLine } from "react-icons/ri";
import MUIDataTable from "mui-datatables";

const CategoryList = () => {
  const [categoryListData, setCategoryListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategoryListData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-categories-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCategoryListData(response.data?.categories);
      } catch (error) {
        console.error("Error fetching category list data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryListData();
    setLoading(false);
  }, []);

  const columns = [
    {
      name: "slNo",
      label: "SL No",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          return tableMeta.rowIndex + 1;
        },
      },
    },
    {
      name: "category_image",
      label: "IMAGE",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (image) => {
          const imageUrl = image
            ? `https://singleclik.com/api/storage/app/public/categories_images/${image}`
            : "https://singleclik.com/api/storage/app/public/no_image.jpg";
          return (
            <img
              src={imageUrl}
              alt="Member"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
          );
        },
      },
    },
    {
      name: "category",
      label: "Category",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "category_type",
      label: "Category Type",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          if (value == 0) {
            return "Business";
          } else if (value == 1) {
            return "Service";
          } else if (value == "0,1") {
            return "Business/Service";
          }
          return "Unknown";
        },
      },
    },
    {
      name: "category_status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "id",
      label: "ACTION",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id, tableMeta) => {
          return (
            <div className="flex items-center space-x-2">
              <RiEditLine
                onClick={() => navigate(`/category-edit/${id}`)}
                title="Edit Category Info"
                className="h-5 w-5 cursor-pointer"
              />
            </div>
          );
        },
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    
  };
  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Category List
        </h3>
        <Link
          to="/add-category"
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
        >
          + Add Category
        </Link>
      </div>
      <div className="mt-5">
        <MUIDataTable
          data={categoryListData ? categoryListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default CategoryList;
