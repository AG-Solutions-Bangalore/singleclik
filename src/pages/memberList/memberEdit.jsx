import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import { Button, Input, Textarea } from "@material-tailwind/react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
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
    category: "",
    sub_category: "",
    subcategory:"",
    other_category: "",
    other_sub_category: "",
    whatsapp: "",
    website: "",
    about_us: "",
    catg_id:"",
    area: "",
    photo: "",
    referred_by_code: "",
    status: "",
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedSubCategoryValue, setSelectedSubCategoryValue] = useState('');

  // for pagination 
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo = storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  //
  const avatarUrl = useRef(
    "https://avatarfiles.alphacoders.com/161/161002.jpg"
  );
  const [modalOpen, setModalOpen] = useState(false);

  const updateAvatar = (imgSrc) => {
    avatarUrl.current = imgSrc;
  };

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
          setMember(response.data.user);
        } else { 
          toast.error("No user data found");
          console.error("no user data found")
          
          navigate("/member-list");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchMemberData();
  }, [id, navigate]);

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
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching Categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchSubCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-sub-categories-by-value/${member?.catg_id || ""}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSubCategories(response.data.categoriessub);
    } catch (error) {
      console.error("Error fetching Sub Categories:", error);
    }
  }, [member.catg_id]);
  useEffect(() => {
    if (member.catg_id) {
      fetchSubCategories();
    }
  }, [member.catg_id]);

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

    if (name === "category") {
      setMember({ ...member, catg_id: value, sub_category: "" });
      setSelectedSubCategoryValue("")
    }
    if (name === "sub_category") {
      const selectedOption = subcategories.find(sub => sub.id === value);
      if (selectedOption) {
        setSelectedSubCategoryValue(selectedOption.subcategory); // Store the selected subcategory value
      }
    }
    
  };

  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/member-list?page=${pageNo}`);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    var form = document.getElementById("memberId").checkValidity();
    if (!form) {
      toast.error("Fill all required field");
      return;
    }
    setIsButtonDisabled(true);
    const formData = new FormData();
    Object.keys(member).forEach((key) => {
      if (key === "category") {
        formData.append("category", member.catg_id);
      } else if (key === "sub_category") {
        formData.append("sub_category", member.sub_category); // Use the subcategory ID
      } else if (key === "subcategory") {
        formData.append("subcategory", selectedSubCategoryValue); // Use the selected subcategory value
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
          <Link to={`/category-view/${id}`}>
          <Button title="Category View" className="bg-green-500 hover:bg-red-500">
            Category
          </Button>
          </Link>
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

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
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
                label="Business Profile"
                required
              >
                {profileOptions.map((data) => (
                  <MenuItem key={data.value} value={data.value}>
                    {data.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* <div>
              <FormControl fullWidth>
                <InputLabel id="category-select-label">
                  <span className="text-sm relative bottom-[6px]">
                    Category <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="category-select-label"
                  id="category-select"
                  name="category"
                  value={member.catg_id || ""}
                  onChange={(e) => onInputChange(e)}
                  label="Service *"
                
                >
                  {categories.map((categoriesdata, key) => (
                    <MenuItem key={key} value={categoriesdata.id}>
                      {categoriesdata.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {member.catg_id == "31" && (
              <div>
                <Input
                  label="Other Category"
                  type="text"
                  name="other_category"
                  value={member.other_category}
                  onChange={(e) => onInputChange(e)}
                  className="w-full border border-gray-700 rounded-md p-2"
                
                />
              </div>
            )}

            {member.catg_id == "31" && (
              <div>
                <Input
                  label="Other Sub Category"
                  type="text"
                  name="other_sub_category"
                  value={member.other_sub_category}
                  onChange={(e) => onInputChange(e)}
                  className="w-full border border-gray-700 rounded-md p-2"
              
                />
              </div>
            )}
            {member.catg_id != "31" && (
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
                    value={member.sub_category}
                    onChange={(e) => onInputChange(e)}
                    label="Sub Category *"
                   
                  >
                    {subcategories.map((categoriesdata, key) => (
                      <MenuItem key={key} value={categoriesdata.id}>
                        {categoriesdata.subcategory}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
            {member.sub_category == "94" && (
              <div>
                <Input
                  label="Other Sub Category"
                  type="text"
                  name="other_sub_category"
                  value={member.other_sub_category}
                  onChange={(e) => onInputChange(e)}
                  className="w-full border border-gray-700 rounded-md p-2"
                
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
