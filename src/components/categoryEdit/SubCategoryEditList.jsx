import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import BASE_URL from '../../base/BaseUrl';
import { toast } from 'react-toastify';
import { Button, Card, IconButton, Input } from "@material-tailwind/react";
import { CiEdit } from "react-icons/ci";
import { RiArrowUpDoubleFill } from "react-icons/ri";
const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];
const SubCategoryEditList = () => {
  const [categoryData, setCategoryData] = useState({
        category: "",
        category_status: "",
        category_type: "",
        category_image: "",
        category_sort: "",
      });
  const [subcategories, setSubcategories] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedSubcategories, setEditedSubcategories] = useState([]);
  const [isSubcatButtonDisabled, setIsSubcatButtonDisabled] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-categories-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCategoryData(response.data.categories);
       
        setSubcategories(response.data.categoriessub);
        setEditedSubcategories(response.data.categoriessub); // for edit show
         
      } catch (error) {
        console.error("Error fetching category edit:", error);
      }
    };

    fetchCategory();
  }, [id]);

  const handleEditClick = (index) => {
    setEditIndex(index);
  };

  const handleUpdateSubCat = (e,index) => {
    e.preventDefault()
    
    setEditIndex(null);
    const subcategoryId = editedSubcategories[index].id;
    setIsSubcatButtonDisabled(true);

    let data = {
      category_id: editedSubcategories[index].category_id,
      subcategory: editedSubcategories[index].subcategory,
      subcategory_status: editedSubcategories[index].subcategory_status,
    };
    
    axios({
      url: `${BASE_URL}/api/panel-update-sub-categories/${subcategoryId}`,
      method: "Put",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == "200") {
        toast.success("Sub Category Updated");
        setIsSubcatButtonDisabled(false)
      } else {
        toast.error("duplicate entry");
        setIsSubcatButtonDisabled(false)
      }
    })
    
  };


  const handleChange = (index, field, value) => {
    const updatedSubcategories = [...editedSubcategories];
    updatedSubcategories[index][field] = value;
    setEditedSubcategories(updatedSubcategories);
  };
  return (
    <Card className="p-6 shadow-lg rounded-lg w-full h-[420px] ">
    <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-green-900">
      SubCategory List
    </h3>
    <div className="overflow-x-auto custom-scro">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-green-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Sl No
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Subcategory of {categoryData.category}
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Status
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {subcategories.map((subcat, index) => (
            <tr key={index} className="hover:bg-red-50 transition-colors">
              <td className="px-4 py-2 text-gray-700">{index + 1}</td>

              <td className="px-4 py-2 text-gray-700">
                {editIndex === index ? (
                  <input
                    type="text"
                    value={editedSubcategories[index].subcategory}
                    onChange={(e) => handleChange(index, "subcategory", e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  />
                ) : (
                  subcat.subcategory
                )}
              </td>
              <td className="px-4 py-2 text-gray-700">
                {editIndex === index ? (
                  <select
                    value={editedSubcategories[index].subcategory_status}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "subcategory_status",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  subcat.subcategory_status
                )}
              </td>
              <td className="px-4 py-2 text-gray-700">
                
                
                {editIndex === index ? (
                  <RiArrowUpDoubleFill
                    className="w-5 h-5 hover:text-green-800 cursor-pointer text-green-800"
                    onClick={(e) => handleUpdateSubCat(e,index)}
                    disabled={isSubcatButtonDisabled}
                  />
                ) : (
                  <CiEdit
                    className="w-5 h-5 hover:text-red-800 cursor-pointer text-green-800"
                    onClick={() => handleEditClick(index)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
  )
}

export default SubCategoryEditList