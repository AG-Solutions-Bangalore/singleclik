import { Link, NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  TableCellsIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  IconButton,
  Typography,
  Collapse,
} from "@material-tailwind/react";
import { TbStackPop } from "react-icons/tb";
import { CgProductHunt } from "react-icons/cg";
import { TbCategory2 } from "react-icons/tb";
import { TfiLayoutSlider } from "react-icons/tfi";
import { PiCardholderLight } from "react-icons/pi";
import { FiUsers } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { MdOutlineAdd, MdOutlineBusinessCenter, MdOutlineDelete, MdOutlineFeedback, MdOutlineSpaceDashboard, MdToday } from "react-icons/md";
import { FcFeedback } from "react-icons/fc";
import { IoIosNotificationsOutline } from "react-icons/io";
const SideNav = ({ openSideNav, setOpenSideNav }) => {
  const sidenavRef = useRef(null);
  const { pathname } = useLocation();

  const [openBookingMenu, setOpenBookingMenu] = useState(false);

  // Hardcoded sidenavType to "dark"
  const sidenavType = "dark";

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-green-300 to-purple-900 shadow-lg shadow-blue-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  // close sidebar when clicking outside

  useEffect(() => {
    function handClickOutside(e) {
      if (sidenavRef.current && !sidenavRef.current.contains(e.target)) {
        setOpenSideNav(false);
      }
    }

    document.addEventListener("mousedown", handClickOutside);
    return () => {
      document.removeEventListener("mousedown", handClickOutside);
    };
  }, [setOpenSideNav]);

  // Close sidebar on route change
  useEffect(() => {
    setOpenSideNav(false);
  }, [pathname, setOpenSideNav]);

  const sideItems = [
    {
      to: "/home",
      label: "Dashboard",
      Icon: MdOutlineSpaceDashboard,
    },
    {
      to: "/member-list",
      label: "Businesses",
      Icon: MdOutlineBusinessCenter,
    },
    {
      to: "/user-list",
      label: "Consumers",
      Icon: FiUsers,
    },
    {
      to: "/category",
      label: "Category",
      Icon: TbCategory2,
    },
   
    {
      to: "/adv-slider",
      label: "Adv Slider",
      Icon: TfiLayoutSlider,
    },
    {
      to: "/popup-slider",
      label: "Pop up Slider",
      Icon: TbStackPop,
    },
    {
      to: "/hold-user",
      label: "Hold User",
      Icon: PiCardholderLight,
    },
    {
      to: "/delete-user",
      label: "Delete User",
      Icon: MdOutlineDelete,
    },
    {
      to: "/product",
      label: "Products",
      Icon: CgProductHunt,
    },
    {
      to: "/feedback",
      label: "Feedback",
      Icon: MdOutlineFeedback,
    },
    {
      to: "/notification",
      label: "Notification",
      Icon: IoIosNotificationsOutline,
    },
  ];

  const handleBookingButtonClick = () => {
    // Toggle the booking menu open/close
    setOpenBookingMenu((prevState) => !prevState);
  };

  const handleItemClick = () => {
    // Clear page-no from localStorage
    localStorage.removeItem("page-no");
  };
  return (
    <aside
      ref={sidenavRef}
      className={`${sidenavTypes[sidenavType]} ${
        openSideNav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-[272px] rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className={`relative`}>
        <Link to="/home" className="flex items-center justify-center p-4">
          <div className="flex items-center">
            <img
              src="https://www.ag-solutions.in/assets/images/logo.png"
              alt="Logo"
              className="h-12 w-auto"
            />
            <div className="ml-3 logo-text">
              <div className="logo-title text-white text-lg font-bold">
                <span className="font-black">AG</span> Solution
              </div>
              <div className="logo-sub-title text-gray-400 text-sm">
                Single Click Solution
              </div>
            </div>
          </div>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSideNav(false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4">
        <ul className="mb-4  overflow-y-auto lg:h-[calc(100vh-150px)]  md:h-[calc(100vh-200px)] h-[calc(100vh-200px)] custom-scroll">
   
      {sideItems.map(({ to, label, Icon }, index) => (
        <li key={index}>
          <NavLink to={to} onClick={handleItemClick}>
            {({ isActive }) => (
              <Button
                variant={isActive ? "gradient" : "text"}
                color="white"
                className="flex items-center gap-4 px-4 capitalize"
                fullWidth
              >
                <Icon className="w-5 h-5 text-inherit" />
                <Typography
                  color="inherit"
                  className="font-medium capitalize"
                >
                  {label}
                </Typography>
              </Button>
            )}
          </NavLink>
        </li>
      ))}
 
          {/* <li>
            <NavLink to="/home">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <MdOutlineSpaceDashboard className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Dashboard
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/member-list">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <MdOutlineBusinessCenter className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Businesses
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/user-list">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <FiUsers className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Consumers
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/category">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <TbCategory2 className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Category
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/adv-slider">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <TfiLayoutSlider className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Adv Slider
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/popup-slider">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <TbStackPop className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Pop up Slider
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/hold-user">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <PiCardholderLight className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Hold User
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/delete-user">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <MdOutlineDelete className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                   Delete User
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/product">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <CgProductHunt className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                   Products
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li> */}
          

          {/* Add more hardcoded routes here as needed */}
        </ul>
      </div>
    </aside>
  );
};
export default SideNav;
