import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import { Button, Chip, Input, Textarea } from "@material-tailwind/react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  OutlinedInput,
  Box,
 
} from "@mui/material";
import { FiUpload } from "react-icons/fi";
import { MdArrowBack, MdSend } from "react-icons/md";
import { toast } from "react-toastify";
import Modal from "../../components/imageModal/Modal";
const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
const profileOptions = [
  { value: "0", label: "Business" },
  { value: "1", label: "Service" },
  { value: "0,1", label: "Business/Service" },
];
const MemberEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [member, setMember] = useState({
    name: "",
    company_name: "",
    mobile: "",
    email: "",
    profile_type: "",
    categories: [], 
    subcategories: [], 
    other_category: "",
    other_sub_category: "",
    whatsapp: "",
    website: "",
    about_us: "",
    area: "",
    photo: "",
    referred_by_code: "",
    status: "",
  });
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  // for pagination 
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo = storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  const avatarUrl = useRef(
    "https://avatarfiles.alphacoders.com/161/161002.jpg"
  );


  const updateAvatar = (imgSrc) => {
    avatarUrl.current = imgSrc;
  };

  // Fetch member data
  useEffect(() => {
    const fetchMemberData = async () => {
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
          // Transform API data to match new state structure
          const userData = response.data.user;
          const categories = response.data.categories.map((cat) => ({
            id: cat.id,
            u_catg_id: cat.u_catg_id,
            category: cat.category,
          }));
          const subcategories = response.data.subcategories.map((subcat) => ({
            id: subcat.id,
            u_subcatg_id: subcat.u_subcatg_id,
            subcategory: subcat.subcategory,
          }));

          setMember({
            ...userData,
            categories: categories,
            subcategories: subcategories,
          });
        } else {
          toast.error("No user data found");
          navigate("/member-list");
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
        toast.error("Error fetching member data");
      }
    };

    fetchMemberData();
  }, [id, navigate]);
 // Fetch available categories
 useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-categories`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAvailableCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching Categories:", error);
    }
  };

  fetchCategories();
}, []);
 // Fetch subcategories for selected categories
 const fetchSubCategories = useCallback(async (categoryIds) => {
  try {
    const subcategoriesPromises = categoryIds.map((catId) =>
      axios.get(
        `${BASE_URL}/api/panel-fetch-sub-categories-by-value/${catId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
    );

    const responses = await Promise.all(subcategoriesPromises);
    const allSubcategories = responses.flatMap(
      (response) => response.data.categoriessub
    );

    // Remove duplicates based on id
    const uniqueSubcategories = Array.from(
      new Map(allSubcategories.map((item) => [item.id, item])).values()
    );

    setAvailableSubcategories(uniqueSubcategories);
  } catch (error) {
    console.error("Error fetching Sub Categories:", error);
  }
}, []);

useEffect(() => {
  if (member.categories.length > 0) {
    const categoryIds = member.categories.map((cat) => cat.id);
    fetchSubCategories(categoryIds);
  }
}, [member.categories, fetchSubCategories]);

const handleCategoryChange = (event) => {
  const {
    target: { value },
  } = event;

  const selectedCategories = availableCategories.filter((cat) =>
    value.includes(cat.id)
  );

  setMember((prev) => ({
    ...prev,
    categories: selectedCategories,
    subcategories: [], // Reset subcategories when categories change
  }));
};

const handleSubcategoryChange = (event) => {
  const {
    target: { value },
  } = event;

  const selectedSubcategories = availableSubcategories.filter((subcat) =>
    value.includes(subcat.id)
  );

  setMember((prev) => ({
    ...prev,
    subcategories: selectedSubcategories,
  }));
};

const validateOnlyDigits = (inputtxt) => {
  const phoneno = /^\d+$/;
  return phoneno.test(inputtxt) || inputtxt.length === 0;
};

const onInputChange = (e) => {
  const { name, value } = e.target;
  if (
    (name === "mobile" || name === "whatsapp") &&
    !validateOnlyDigits(value)
  ) {
    return;
  }
  setMember({ ...member, [name]: value });
};

  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/member-list?page=${pageNo}`);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const form = document.getElementById("memberId").checkValidity();
    if (!form) {
      toast.error("Fill all required field");
      return;
    }
    setIsButtonDisabled(true);
    const formData = new FormData();
    Object.keys(member).forEach((key) => {
      if (key === "categories") {
        formData.append("categories", JSON.stringify(member.categories));
      } else if (key === "subcategories") {
        formData.append("subcategories", JSON.stringify(member.subcategories));
      } else {
        formData.append(key, member[key]);
      }
    });
      
      



    if (selectedFile1) formData.append("photo", selectedFile1);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-update-member/${id}?_method=PUT`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.code == "200") {
        toast.success("update succesfull");
        navigate(`/member-list?page=${pageNo}`);
      } else {
        if (response.data.code == "401") {
          toast.error("Mobile No Duplicate Entry");
        } else {
          toast.error("Email Id Duplicate Entry");
        }
      }
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Error updating member");
    } finally {
      setIsButtonDisabled(false);
    }
  };
  const inputClass =
    "w-full px-3 py-2 border border-gray-400  bg-[#f3f1f2]  rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  return (
    <Layout>
      
      <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Edit Member</h1>
        </div>

        {/* Personal Details */}
        <h2 className="text-lg font-semibold mb-2">Personal Details</h2>
        <hr className="mb-4" />

        <form id="memberId" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Fullname */}
            <div>
              <Input
                label="Full Name"
                type="text"
                required
                name="name"
                value={member.name}
                onChange={onInputChange}
                className="w-full border border-gray-700 rounded-md p-2"
              />
            </div>

            {/* Company */}
            <div>
              <Input
                label="Company"
                type="text"
                name="company_name"
                value={member.company_name}
                onChange={onInputChange}
                className="w-full border border-gray-700 rounded-md p-2"
                required
              />
            </div>

            {/* Email */}
            <div>
              <Input
                label="Email"
                type="email"
                name="email"
                value={member.email}
                onChange={onInputChange}
                className="w-full border border-gray-700 rounded-md p-2"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Mobile No */}
            <div>
              <Input
                label="Mobile No"
                type="text"
                name="mobile"
                maxLength={10}
                minLength={10}
                value={member.mobile}
                onChange={onInputChange}
                className="w-full border border-gray-700 rounded-md p-2"
                required
              />
            </div>

            {/* WhatsApp No */}
            <div>
              <Input
                label="Whats App"
                type="text"
                maxLength={10}
                minLength={10}
                name="whatsapp"
                value={member.whatsapp}
                onChange={(e) => onInputChange(e)}
                className="w-full border border-gray-700 rounded-md p-2"
                required
              />
            </div>

            {/* Website */}
            <div>
              <Input
                label="Website"
                type="text"
                name="website"
                value={member.website}
                onChange={(e) => onInputChange(e)}
                className="w-full border border-gray-700 rounded-md p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Business Profile */}
            <FormControl fullWidth>
              <InputLabel id="service-select-label">
                <span className="text-sm relative bottom-[6px]">
                  Business Profile <span className="text-red-700">*</span>
                </span>
              </InputLabel>
              <Select
                sx={{ height: "40px", borderRadius: "5px" }}
                labelId="service-select-label"
                id="service-select"
                name="profile_type"
                value={member.profile_type}
                onChange={onInputChange}
                label="Status *"
                required
              >
                {profileOptions.map((data) => (
                  <MenuItem key={data.value} value={data.value}>
                    {data.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div>
              <FormControl fullWidth>
              <InputLabel id="categories-label">Categories *</InputLabel>
                <Select
                  // sx={{ height: "40px", borderRadius: "5px" }}
                   labelId="categories-label"
                id="categories"
              
                  multiple
                  name
                  value={member.categories.map((cat) => cat.id)}
                  onChange={handleCategoryChange}
                  input={<OutlinedInput label="Categories *" />}
                  required
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {member.categories.map((category) => (
                        <Chip key={category.id} label={category.category} />
                      ))}
                    </Box>
                  )}
                >
                  {availableCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.category}
                  </MenuItem>
                ))}
                </Select>
              </FormControl>
            </div>

            {/* {member.catg_id == "31" && (
              <div>
                <Input
                  label="Other Category"
                  type="text"
                  name="other_category"
                  value={member.other_category}
                  onChange={(e) => onInputChange(e)}
                  className="w-full border border-gray-700 rounded-md p-2"
                  required
                />
              </div>
            )} */}

            {/* {member.catg_id == "31" && (
              <div>
                <Input
                  label="Other Sub Category"
                  type="text"
                  name="other_sub_category"
                  value={member.other_sub_category}
                  onChange={(e) => onInputChange(e)}
                  className="w-full border border-gray-700 rounded-md p-2"
                  required
                />
              </div>
            )} */}
            {/* {member.catg_id != "31" && ( */}
              <div>
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">
                    <span className="text-sm relative bottom-[6px]">
                      Sub Category <span className="text-red-700">*</span>
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="sub_category-select-label"
                    id="sub_category-select"
                    name="sub_category"
                    value={member.subcategories.map((subcat) => subcat.id)}
                onChange={handleSubcategoryChange}
                    label="Sub Category *"
                    required
                  >
                    {availableSubcategories.map((categoriesdata, key) => (
                      <MenuItem key={key} value={categoriesdata.id}>
                        {categoriesdata.subcategory}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            {/* )} */}
            {/* {member.sub_category == "94" && (
              <div>
                <Input
                  label="Other Sub Category"
                  type="text"
                  name="other_sub_category"
                  value={member.other_sub_category}
                  onChange={(e) => onInputChange(e)}
                  className="w-full border border-gray-700 rounded-md p-2"
                  required
                />
              </div>
            )} */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Area */}
            <div>
              <Input
                label="Area"
                type="text"
                name="area"
                value={member.area}
                onChange={(e) => onInputChange(e)}
                className="w-full border border-gray-700 rounded-md p-2"
              />
            </div>
            {/* Photo */}
            {/* <div>
              <Input
                label="Photo"
                type="file"
                name="photo"
                onChange={(e) => setSelectedFile1(e.target.files[0])}
                className="w-full border border-gray-700 rounded-md p-2"
              />

              <small>{member.photo}</small>
            </div> */}
            <div
              className={`${inputClass} flex items-center justify-between h-12 `}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={avatarUrl.current}
                  alt="Avatar"
                  className="w-10 h-10 rounded-lg border-2 border-gray-300"
                />
                <button
                  type="button"
                  className={`${inputClass} bg-white hover:bg-gray-50 text-gray-700 text-sm`}
                  // onClick={() => setModalOpen(true)}
                  onClick={(e) => {
                    e.preventDefault();
                    setModalOpen(true);
                  }}
                >
                  Choose Image
                </button>
                <small className=" text-[10px]">{member.photo}</small>
              </div>

              {modalOpen && (
                <Modal
                  onFileChange={(file) => setSelectedFile1(file)}
                  updateAvatar={updateAvatar}
                  closeModal={() => setModalOpen(false)}
                />
              )}
            </div>

            {/* Status */}
            <FormControl fullWidth>
              <InputLabel id="service-select-label">
                <span className="text-sm relative bottom-[6px]">
                  Status <span className="text-red-700">*</span>
                </span>
              </InputLabel>
              <Select
                sx={{ height: "40px", borderRadius: "5px" }}
                labelId="service-select-label"
                id="service-select"
                name="status"
                value={member.status}
                onChange={onInputChange}
                label="Status *"
                required
              >
                {statusOptions.map((data) => (
                  <MenuItem key={data.value} value={data.value}>
                    {data.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
            {/* About Your Buisness */}
            <div>
              <Textarea
                label="About Your Buisness"
                type="text"
                name="about_us"
                value={member.about_us}
                onChange={(e) => onInputChange(e)}
                className="w-full border border-gray-700 rounded-md p-2"
                required
              />
            </div>
          </div>

          <div className="mt-4 text-center">
            <Button
              type="submit"
              className="mr-2 mb-2"
              onClick={onSubmit}
              disabled={isButtonDisabled}
            >
              <div className="flex gap-1">
                <MdSend className="w-4 h-4" />
                <span>{isButtonDisabled ? "Updating..." : "Update"}</span>
              </div>
            </Button>

            
              <Button onClick={handleBack} className="mr-2 mb-2">
                <div className="flex gap-1">
                  <MdArrowBack className="w-4 h-4" />
                  <span>Back</span>
                </div>
              </Button>
            
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default MemberEdit;
