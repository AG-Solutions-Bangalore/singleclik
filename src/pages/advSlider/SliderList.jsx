import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import { ContextPanel } from '../../utils/ContextPanel';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../base/BaseUrl';
import { RiEditLine } from 'react-icons/ri';
import MUIDataTable from "mui-datatables";
import { IoIosArrowBack, IoIosArrowDropright, IoIosArrowForward } from 'react-icons/io';

const SliderList = () => {
    const [sliderListData, setSliderListData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isPanelUp } = useContext(ContextPanel);
    const navigate = useNavigate();
    const location = useLocation();
    
    const [page, setPage] = useState(0);
    const rowsPerPage = 2;
    const totalSliders = sliderListData?.total_slider
    const searchParams = new URLSearchParams(location.search);
    const pageParam = searchParams.get('page');
    useEffect(() => {
      if (pageParam) {
        setPage(parseInt(pageParam) - 1);
      }else{
        const storedPageNo = localStorage.getItem("page-no");
        if (storedPageNo) {
          setPage(parseInt(storedPageNo) - 1);
          navigate(`/adv-slider?page=${storedPageNo}`); // Update the URL with stored page-no
        }else{
          localStorage.setItem("page-no", 1)
          setPage(0)
        }
      }
    }, [location]);
    
    useEffect(() => {
      const fetchSliderListData = async () => {
        try {
          if (!isPanelUp) {
            navigate("/maintenance");
            return;
          }
          setLoading(true);
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${BASE_URL}/api/panel-fetch-adv-slider-list`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          setSliderListData(response.data?.slider || []);
        } catch (error) {
          console.error("Error fetching slider list data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSliderListData();
      setLoading(false);
    }, []);


    const handleEdit = (e,id)=>{
      e.preventDefault()
      localStorage.setItem("page-no",pageParam)
      navigate(`/slider-edit/${id}`)
    }
  
    const columns = [
      {
        name: "slNo",
        label: "SL No",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta) => {
            return page * rowsPerPage + tableMeta.rowIndex + 1;
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
          customBodyRender: (id) => {
            return (
              <div className="flex items-center space-x-2">
                <RiEditLine
                  onClick={(e) => handleEdit(e,id)}
                  title="Edit Slider Info"
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
      count: totalSliders,
      rowsPerPage: rowsPerPage,
      page: page,
      onChangePage: (currentPage) => {
        setPage(currentPage);
        navigate(`/adv-slider?page=${currentPage + 1}`);
      },
      customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => {
        return (
          <div className="flex justify-end items-center p-4">
           
           <span className="mx-4">
            <span className='text-red-600'>{page + 1}</span>-{rowsPerPage} of {Math.ceil(count / rowsPerPage)}
            </span>
              <IoIosArrowBack 
                  onClick={page === 0 ? null : () => changePage(page - 1)}
              
              className={`w-6 h-6 cursor-pointer ${page === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600'}  hover:text-red-600`}
              />
              <IoIosArrowForward
             onClick={page >= Math.ceil(count / rowsPerPage) - 1 ? null : () => changePage(page + 1)}
               className={`w-6 h-6 cursor-pointer ${page >= Math.ceil(count / rowsPerPage) - 1 ?'text-gray-400 cursor-not-allowed' : 'text-blue-600'}  hover:text-red-600`}
              />
            
          </div>
        );
      },
      
    };
  return (
   <Layout>
       <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Adv Slider List
        </h3>
        <Link
          to="/add-slider"
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
        >
          + Add Slider
        </Link>
      </div>
      <div className="mt-5">
        <MUIDataTable
            data={sliderListData}
          columns={columns}
          options={options}
        />
      </div>
   </Layout>
  )
}

export default SliderList