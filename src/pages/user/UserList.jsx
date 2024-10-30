import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import { ContextPanel } from "../../utils/ContextPanel";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { RiEditLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { MdCheckCircle, MdDeleteOutline, MdRemoveCircle } from "react-icons/md";
import ToggleSwitch from "../../components/ToggleSwitch";


const UserList = () => {
  const [userListData, setUserListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserListData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-user-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserListData(response.data?.user);
      } catch (error) {
        console.error("Error fetching user list data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserListData();
    setLoading(false);
  }, []);

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios({
        url: BASE_URL + "/api/panel-update-user-status/" + id,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.code == "200") {
        setUserListData((prevUserListData) => {
          return prevUserListData.map((user) => {
            if (user.id === id) {
              const newStatus =
                user.status === "Active" ? "Inactive" : "Active";

              if (newStatus === "Active") {
                toast.success("User Activated Successfully");
              } else {
                toast.success("User Inactivated Successfully");
              }

              return { ...user, status: newStatus };
            }
            return user;
          });
        });
      } else {
        toast.error("Errro occur while Inactive the profile");
      }
    } catch (error) {
      console.error("Error fetching user activate data", error);
      toast.error("Error fetching user activate data");
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios({
        url: BASE_URL + "/api/panel-delete-users/" + id, 
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.code == "200") {
        toast.success("User Deleted  succesfully")
        setUserListData((prevUserListData) => 
          prevUserListData.filter((user) => user.id !== id && user.status === user.status)
        );
       
      } else {
        toast.error("Errro occur while delete the user profile");
      }
    } catch (error) {
      console.error("Error user delete data", error);
      toast.error("Error user delete data");
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
      label: "Full name",
      options: {
        filter: true,
        sort: true,
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
        customBodyRender: (id, tableMeta) => {
          const user = userListData[tableMeta.rowIndex];
          return (
            <div className="flex">
              <ToggleSwitch
                isActive={user.status === "Active"}
                onToggle={(e) => handleUpdate(e, id)}
              />
              <MdDeleteOutline
              onClick={(e)=>handleDelete(e,id)}
              title="Delete the user" className="w-6 h-6 text-red-700 cursor-pointer" />
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
          title={"User List"}
          data={userListData ? userListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default UserList;
