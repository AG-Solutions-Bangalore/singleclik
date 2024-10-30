import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import MUIDataTable from 'mui-datatables';
import { ContextPanel } from '../../utils/ContextPanel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../base/BaseUrl';

const FeedbackList = () => {
    const [feedbackData, setFeedbackData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isPanelUp } = useContext(ContextPanel);
    const navigate = useNavigate();
    useEffect(() => {
      const fetchFeedData = async () => {
        try {
          if (!isPanelUp) {
            navigate("/maintenance");
            return;
          }
          setLoading(true);
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${BASE_URL}/api/fetch-feedback-list`,
         
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          setFeedbackData(response.data?.feedback);
        } catch (error) {
          console.error("Error fetching feedback list data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchFeedData();
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
        name: "name",
        label: "Full name",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "feedback_subject",
        label: "Subject",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "feedback_description",
        label: "Description",
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
          title={"Feedback List"}
          data={feedbackData ? feedbackData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  )
}

export default FeedbackList