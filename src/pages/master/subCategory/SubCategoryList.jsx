import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MUIDataTable from "mui-datatables";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { RiEditLine } from "react-icons/ri";

const SubCategoryList = () => {
  const [subCategoryListData, setSubCategoryListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSubCategoryListData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-sub-categories-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSubCategoryListData(response.data?.subcategories);
      } catch (error) {
        console.error("Error fetching Sub category list data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubCategoryListData();
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
      name: "category",
      label: "Category",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "subcategory",
      label: "Category Type",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "subcategory_status",
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
                onClick={() => navigate(`/sub-category-edit/${id}`)}
                title="Edit Sub Category "
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
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 25],
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    setRowProps: (rowData) => {
      return {
        style: {
          borderBottom: "10px solid #f1f7f9",
        },
      };
    },
  };
  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Sub Category List
        </h3>
        <Link
          to="/add-subCategory"
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
        >
          + Add Sub Category
        </Link>
      </div>
      <div className="mt-5">
        <MUIDataTable
          data={subCategoryListData ? subCategoryListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default SubCategoryList;
