import React, { useRef, useState, useEffect, useContext } from "react";
import { FaPrint } from "react-icons/fa";
import { IoReturnDownBack } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactToPrint from "react-to-print";
import axios from "axios";
import { ContextPanel } from "../../utils/ContextPanel";
import BASE_URL from "../../base/BaseUrl";
import Layout from "../../layout/Layout";

const MemberView = () => {
  const componentRef = useRef();
  const { id } = useParams();
  const [profile, setProfile] = useState({});
  const [profileCategory, setProfileCategory] = useState([]);
  const [profileSubCategory, setProfileSubCategory] = useState([]);

  const [activeCart, setActiveCart] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileViewData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-member-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(response.data?.user);
        setProfileCategory(response.data?.categories);
        setProfileSubCategory(response.data?.subcategories);
        console.log("sub category ",response.data?.subcategories)
      } catch (error) {
        console.error("Error fetching Profile list data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileViewData();
  }, [id, isPanelUp, navigate]);
  
  return (
    <Layout>

  
   
      <div className=" mt-5 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Link to="/member-list">
                <IoReturnDownBack className="w-8 h-8 border border-red-500 hover:border-blue-500 bg-blue-100 hover:bg-red-100 border-dashed p-1 rounded-lg text-blue-500 hover:text-red-700" />
              </Link>
              <span>Profile Details</span>
            </h1>
            <ReactToPrint
              trigger={() => (
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
                  <FaPrint />
                  <span>Print</span>
                </button>
              )}
              content={() => componentRef.current}
            />
          </div>

          <div ref={componentRef} className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h2 className=" text-3xl border-b border-black border-dashed font-semibold">
                  {profile.name} - {profile.status}
                </h2>
              </div>
              <img
                className="w-24 h-24 object-cover border-2 border-red-500  rounded-full"
                src={profile.photo
                  ? `https://singleclik.com/api/storage/app/public/user_images/${profile.photo}`
                  : "https://singleclik.com/api/storage/app/public/no_image.jpg"}
                alt={profile.name}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg overflow-hidden">
                <h3 className="font-semibold text-lg bg-red-200 p-3">Contact Information</h3>
                <table className="w-full">
                  <tbody>
                    {[
                      { label: "Company", value: profile.company_name },
                      { label: "Mobile", value: profile.mobile },
                      { label: "WhatsApp", value: profile.whatsapp },
                      { label: "Email", value: profile.email },
                      { label: "Website", value: profile.website },
                    ].map((item, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <th className="text-left p-3 bg-gray-50">{item.label}</th>
                        <td className="p-3">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <h3 className="font-semibold text-lg bg-green-200 p-3">Identification</h3>
                <table className="w-full">
                  <tbody>
                    {[
                      { label: "Business Profile", value: profile.profile_type == 0 ? "Business" : profile.profile_type == 1 ? "Service" : "Business/Service" },
                      { label: "Business Category", value: profileCategory.map((item)=>(<p>{item.category}</p>)) },
                      { label: "Sub Category", value: profileSubCategory.map((item)=>(<p>{item.subcategory}</p>)) },
                      { label: "Area", value: profile.area }, 
                      { label: "Referral Code", value: profile.referral_code },
                    ].map((item, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <th className="text-left p-3 bg-gray-50">{item.label}</th>
                        <td className="p-3">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <h3 className="font-semibold text-lg bg-blue-200 p-3">About Your Business</h3>
              <p className="p-3">{profile.about_us}</p>
            </div>
          </div>
        </div>
      </div>
 
    </Layout>
  );
};

export default MemberView;  