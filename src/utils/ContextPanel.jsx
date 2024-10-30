import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../base/BaseUrl";
import axios from "axios";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const [isPanelUp, setIsPanelUp] = useState(true);

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkPanelStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/panel-check-status`);
      const datas = await response.data;
      setIsPanelUp(datas);
      if (datas?.success) {
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = location.pathname;

    if (error) {
      localStorage.clear();
      navigate("/maintenance");
    } else if (isPanelUp?.success) {
      if (token) {
        const allowedPaths = [
          "/home",
          "/member-list",
          "/member-view",
          "/member-edit",
          "/category-view",
          "/category",
          "/category-edit",
          "/sub-category",
          "/add-subCategory",
          "/add-category",
          "/sub-category-edit",
          "/user-list",
          "/adv-slider",
          "/add-slider",
          "/slider-edit",
          "/popup-slider",
          "/add-popup-slider",
          "/popup-slider-edit",
          "/hold-user",
          "/delete-user",
          "/product",
          "/add-product",
          "/edit-product",
          "/feedback",
          "/notification",
          "/add-notification",
          "/edit-notification"

        ];
        const isAllowedPath = allowedPaths.some((path) =>
          currentPath.startsWith(path)
        );
        if (isAllowedPath) {
          navigate(currentPath);
        } else {
          navigate("/home");
        }
      } else {
        if (
          currentPath === "/" ||
          currentPath === "/register" ||
          currentPath === "/forget-password"
        ) {
          navigate(currentPath);
        } else {
          navigate("/"); // Redirect to login if no token
        }
      }
    }
  }, [error, navigate, isPanelUp, location.pathname]);

  useEffect(() => {
    checkPanelStatus();
    const intervalId = setInterval(checkPanelStatus, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ContextPanel.Provider value={{ isPanelUp, setIsPanelUp }}>
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
