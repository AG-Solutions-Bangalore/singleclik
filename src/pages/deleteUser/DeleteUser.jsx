import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../layout/Layout'

import MUIDataTable from "mui-datatables";
import { useNavigate } from 'react-router-dom';
import { ContextPanel } from '../../utils/ContextPanel';
import axios from 'axios';
import BASE_URL from '../../base/BaseUrl';

const DeleteUser = () => {
    const [deleteData, setDeleteData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isPanelUp } = useContext(ContextPanel);
    const navigate = useNavigate();
    useEffect(() => {
      const fetchDeleteData = async () => {
        try {
          if (!isPanelUp) {
            navigate("/maintenance");
            return;
          }
          setLoading(true);
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${BASE_URL}/api/panel-fetch-deleted-users-list`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          setDeleteData(response.data?.user);
        } catch (error) {
          console.error("Error fetching delete user list data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDeleteData();
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
        name: "photo",
        label: "IMAGE",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (image) => {
            const imageUrl = image
              ? `https://singleclik.com/api/storage/app/public/user_images/${image}`
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
        name: "name",
        label: "Full name",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "company_name",
        label: "Company",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "mobile",
        label: "Mobile",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "profile_type",
        label: "Profile",
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
        name: "status",
        label: "STATUS",
        options: {
          filter: true,
          sort: false,
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
         <div className="mt-5">
        <MUIDataTable
          title={"Delete User List"}
          data={deleteData ? deleteData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  )
}

export default DeleteUser