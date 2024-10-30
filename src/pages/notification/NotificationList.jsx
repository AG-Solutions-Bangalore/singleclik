import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import { ContextPanel } from '../../utils/ContextPanel';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../base/BaseUrl';
import { RiEditLine } from 'react-icons/ri';
import MUIDataTable from 'mui-datatables';

const NotificationList = () => {
    const [notiListData, setNotitListData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isPanelUp } = useContext(ContextPanel);
    const navigate = useNavigate();
    
    useEffect(() => {
      const fetchNotiListData = async () => {
        try {
          if (!isPanelUp) {
            navigate("/maintenance");
            return;
          }
          setLoading(true);
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${BASE_URL}/api/fetch-notification-list`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          setNotitListData(response.data?.notification);
        } catch (error) {
          console.error("Error fetching Notification list data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchNotiListData();
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
        name: "notification_images",
        label: "Image",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (image) => {
            const imageUrl = image
              ? `https://singleclik.com/api/storage/app/public/notification_images/${image}`
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
        name: "notification_heading",
        label: "Heading",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "notification_des",
        label: "Description",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "notification_status",
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
                  onClick={() => navigate(`/edit-notification/${id}`)}
                  title="Edit Product "
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
      customToolbar: () => {
        return (
            <Link
          to="/add-notification"
          title='Add Work Order'
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow-md"
        >
          + Create
        </Link>
         
        );
      },
      
    };
  return (
    <Layout>
         
      <div className="mt-5">
        <MUIDataTable
        title="Notifiacation List"
          data={notiListData ? notiListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  )
}

export default NotificationList