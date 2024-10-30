import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { ContextPanel } from "../../utils/ContextPanel";

import MUIDataTable from "mui-datatables";
import { RiEditLine } from "react-icons/ri";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
const PopupSlider = () => {
    const [popupListData, setPopupListData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isPanelUp } = useContext(ContextPanel);
    const navigate = useNavigate();
    useEffect(() => {
      const fetchPopupListData = async () => {
        try {
          if (!isPanelUp) {
            navigate("/maintenance");
            return;
          }
          setLoading(true);
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${BASE_URL}/api/panel-fetch-popup-slider-list`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          setPopupListData(response.data?.slider);
        } catch (error) {
          console.error("Error fetching pop upslider list data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPopupListData();
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
        name: "slider_images",
        label: "IMAGE",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (image) => {
            const imageUrl = image
              ? `https://singleclik.com/api/storage/app/public/slider_images/${image}`
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
        name: "slider_url",
        label: "URL",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "slider_status",
        label: "Status",
        options: {
          filter: true,
          sort: false,
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
                  onClick={() => navigate(`/popup-slider-edit/${id}`)}
                  title="Edit Popup Slider "
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
          Popup Slider List
        </h3>
        <Link
          to="/add-popup-slider"
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
        >
          + Add Popup Slider
        </Link>
      </div>
      <div className="mt-5">
        <MUIDataTable
          data={popupListData ? popupListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default PopupSlider;
