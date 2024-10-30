import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import MUIDataTable from "mui-datatables";
import { ContextPanel } from '../../utils/ContextPanel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../base/BaseUrl';
import { RiEditLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { GrUpdate } from 'react-icons/gr';

const HoldUser = () => {
    const [holdUserData, setHoldUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  const fetchHoldUserData = async () => {
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-hold-users-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHoldUserData(response.data?.user);
    } catch (error) {
      console.error("Error fetching hold user list data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    
    fetchHoldUserData();
    
  }, []);


  const handleActivate = async (e, id) => {
    e.preventDefault();
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios({
        url: BASE_URL + "/api/panel-update-hold-users-type/" + id,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.code == "200") {
        toast.success("User Activate succesfully")
        fetchHoldUserData();
      } else {
        toast.error("Errro occur while activate the profile");
      }
    } catch (error) {
      console.error("Error fetching user hold activate data", error);
      toast.error("Error fetching user hold activate data");
    } finally {
      setLoading(false);
    }
  };

  
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
      label: "Full Name",
      options: {
        filter: false,
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

    {
        name: "id",
        label: "ACTION",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (id) => {
            return (
              <div className="flex items-center space-x-2">
                <GrUpdate
                  onClick={(e) => handleActivate(e,id)}
                  title="Activate the user"
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
        
      <div className="mt-5">
        <MUIDataTable
        title={"Hold User List"}
          data={holdUserData ? holdUserData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  )
}

export default HoldUser