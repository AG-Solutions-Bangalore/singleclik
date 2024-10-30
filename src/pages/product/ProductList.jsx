import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../layout/Layout'

import MUIDataTable from "mui-datatables";
import { ContextPanel } from '../../utils/ContextPanel';
import { Link, useNavigate } from 'react-router-dom';
import { RiEditLine } from 'react-icons/ri';
import axios from 'axios';
import BASE_URL from '../../base/BaseUrl';

const ProductList = () => {
    const [productListData, setProductListData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isPanelUp } = useContext(ContextPanel);
    const navigate = useNavigate();
    
    useEffect(() => {
      const fetchProductListData = async () => {
        try {
          if (!isPanelUp) {
            navigate("/maintenance");
            return;
          }
          setLoading(true);
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${BASE_URL}/api/panel-fetch-product-list`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          setProductListData(response.data?.product);
        } catch (error) {
          console.error("Error fetching Product list data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProductListData();
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
        name: "product_images",
        label: "Product Image",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (image) => {
            const imageUrl = image
              ? `https://singleclik.com/api/storage/app/public/product_images/${image}`
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
        name: "product_name",
        label: "Product Name",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "product_status",
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
                  onClick={() => navigate(`/edit-product/${id}`)}
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
      
    };
  return (
    <Layout>
         <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Products List
        </h3>
        <Link
          to="/add-product"
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
        >
          + Add Product
        </Link>
      </div>
      <div className="mt-5">
        <MUIDataTable
          data={productListData ? productListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  )
}

export default ProductList