import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import MUIDataTable from "mui-datatables";
import { RiEditLine } from "react-icons/ri";
import ToggleSwitch from "../ToggleSwitch";
import { ContextPanel } from "../../utils/ContextPanel";
import { toast } from "react-toastify";
import { MdOutlineDelete } from "react-icons/md";
import AddCategoryMember from "./AddCategoryMember";
import { Button } from "@material-tailwind/react";
import AddSubCategoryMember from "./AddSubCategoryMember";

const CategoryView = () => {
  const { id } = useParams();
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const { isPanelUp } = useContext(ContextPanel);
  const [loading, setLoading] = useState(false);

  //
  const [openModal, setOpenModal] = useState(false);
  const [openSubModal, setOpenSubModal] = useState(false);
  const handleOpenCat = () => setOpenModal(!openModal);
  const handleOpenSubCat = () => setOpenSubModal(!openSubModal);
  //


  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-member-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.user) {
        setCategory(response.data?.categories);
        console.table("category view", response.data.categories);
        setSubCategory(response.data?.subcategories);
        console.table("sub category view", response.data.subcategories);
      } else {
        toast.error("No Category data found");
        console.error("no Category data found");

        navigate(`/member-edit/${id}`);
      }
    } catch (error) {
      console.error("Error fetching Category data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // update the status of category
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
        url: BASE_URL + `/api/panel-update-user-categories-status/${id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.code == "200") {

        setCategory((prevUserListData) => {
          return prevUserListData.map((user) => {
            if (user.id === id) {
              const newStatus =
                user.u_catg_status === "Active" ? "Inactive" : "Active";

              if (newStatus === "Active") {
                toast.success("Category Activated Successfully");
              } else {
                toast.success("Category Inactivated Successfully");
              }

              return { ...user, u_catg_status: newStatus };
            }
            return user;
          });
        });
        fetchData()
      } else {
        toast.error("Errro occur while Inactive the Category");
      }
    } catch (error) {
      console.error("Error fetching Category activate data", error);
      toast.error("Error fetching Category activate data");
    } finally {
      setLoading(false);
    }
  };

  // status update for the sub categroy
  const handleSubUpdate = async (e, id) => {
    e.preventDefault();
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios({
        url: BASE_URL + "/api/panel-update-user-sub-categories-status/" + id,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.code == "200") {
        setSubCategory((prevUserListData) => {
          return prevUserListData.map((user) => {
            if (user.id === id) {
              const newStatus =
                user.u_subcatg_status === "Active" ? "Inactive" : "Active";

              if (newStatus === "Active") {
                toast.success("SubCategory Activated Successfully");
              } else {
                toast.success("SubCategory Inactivated Successfully");
              }

              return { ...user, u_subcatg_status: newStatus };
            }
            return user;
          });
        });
      } else {
        toast.error("Errro occur while Inactive the SubCategory");
      }
    } catch (error) {
      console.error("Error fetching SubCategory activate data", error);
      toast.error("Error fetching SubCategory activate data");
    } finally {
      setLoading(false);
    }
  };


  // delete function for Category 
// panel-delete-user-categories/{id}
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
        url: BASE_URL + "/api/panel-delete-user-categories/" + id, 
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.code == "200") {
        toast.success("Category Deleted  succesfully")
        setCategory((prevUserListData) => 
          prevUserListData.filter((user) => user.id !== id && user.u_catg_status === user.u_catg_status)
        );
        fetchData()
       
      } else {
        toast.error("Errro occur while delete the  Category");
      }
    } catch (error) {
      console.error("Error Category delete data", error);
      toast.error("Error Category delete data");
    } finally {
      setLoading(false);
    }
  };


  // delete function for subcategory 

  const handleSubDelete = async (e, id) => {
    e.preventDefault();
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios({
        url: BASE_URL + "/api/panel-delete-user-sub-categories/" + id, 
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.code == "200") {
        toast.success("SubCategory Deleted  succesfully")
        setSubCategory((prevUserListData) => 
          prevUserListData.filter((user) => user.id !== id && user.u_subcatg_status === user.u_subcatg_status)
        );
        fetchData()
       
      } else {
        toast.error("Errro occur while delete the  SubCategory");
      }
    } catch (error) {
      console.error("Error SubCategory delete data", error);
      toast.error("Error SubCategory delete data");
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
      name: "category",
      label: "Category name",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "u_catg_status",
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
          const user = category[tableMeta.rowIndex];
          return (
            <div className="flex items-center space-x-2">
              <ToggleSwitch
                isActive={user.u_catg_status === "Active"}
                onToggle={(e) => handleUpdate(e, id)}
              />
              <MdOutlineDelete
                 onClick={(e)=>handleDelete(e,id)}
                title="Delete Category"
                className="h-5 w-5 cursor-pointer  text-red-500 hover:text-green-700 hover:animate-pulse"
              />
            </div>
          );
        },
      },
    },
  ];
  const columnsSub = [
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
      name: "subcategory",
      label: "SubCategory name",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "u_subcatg_status",
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
          const user = subCategory[tableMeta.rowIndex];
          return (
            <div className="flex items-center space-x-2">
              <ToggleSwitch
                isActive={user.u_subcatg_status === "Active"}
                onToggle={(e) => handleSubUpdate(e, id)}
              />
              <MdOutlineDelete
                 onClick={(e)=>handleSubDelete(e,id)}
                title="Delete SubCategory"
                className="h-5 w-5 cursor-pointer text-red-500 hover:text-green-700 hover:animate-pulse"
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
    customToolbar: () => {
        return (
          <Button
          onClick={handleOpenCat}
            className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow-md"
          >
            + Category
          </Button>
        );
      },
  };
  const optionsSub = {
    selectableRows: "none",
    elevation: 0,

    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    customToolbar: () => {
        return (
          <Button
          onClick={handleOpenSubCat}
            className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow-md"
          >
            + SubCategory
          </Button>
        );
      },
  };
  return (
    <Layout>
      <>
        <div className="flex  gap-5 flex-col lg:flex-row justify-between   ">
          <div className="mt-5 w-full " >
            <MUIDataTable
              title={"Category List"}
              data={category ? category : []}
              columns={columns}
              options={options}
            />
          </div>
          <div className="mt-5 w-full ">
            <MUIDataTable
              title={"SubCategory List"}
              data={subCategory ? subCategory : []}
              columns={columnsSub}
              options={optionsSub}
            />
          </div>
        </div>
        <AddCategoryMember open={openModal} handleOpenCategory={handleOpenCat} id={id} fetchData={fetchData} />
        <AddSubCategoryMember open={openSubModal} handleOpenSubCategory={handleOpenSubCat} id={id} fetchData={fetchData}  />
      </>
    </Layout>
  );
};

export default CategoryView;
