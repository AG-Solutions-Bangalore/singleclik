import { Route, Routes } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import SignIn from "./pages/auth/SignIn";
import SIgnUp from "./pages/auth/SIgnUp";
import Maintenance from "./pages/maintenance/Maintenance";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Profile from "./pages/profile/Profile";
import ChangePassword from "./pages/profile/ChangePassword";
import MemberList from "./pages/memberList/memberList";
import MemberView from "./pages/memberList/memberView";
import MemberEdit from "./pages/memberList/memberEdit";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-image-crop/dist/ReactCrop.css";
import CategoryList from "./pages/master/category/CategoryList";
import SubCategoryList from "./pages/master/subCategory/SubCategoryList";
import SubCategoryAdd from "./pages/master/subCategory/SubCategoryAdd";
import CategoryAdd from "./pages/master/category/CategoryAdd";
import CategoryEdit from "./pages/master/category/CategoryEdit";
import SubCategoryEdit from "./pages/master/subCategory/SubCategoryEdit";
import UserList from "./pages/user/UserList";
import SliderList from "./pages/advSlider/SliderList";
import PopupSlider from "./pages/popupSlider/PopupSlider";
import AddSlider from "./pages/advSlider/AddSlider";
import AddPopupSlider from "./pages/popupSlider/AddPopupSlider";
import EditSlider from "./pages/advSlider/EditSlider";
import EditPopupSlider from "./pages/popupSlider/EditPopupSlider";
import HoldUser from "./pages/holdUser/HoldUser";
import DeleteUser from "./pages/deleteUser/DeleteUser";
import ProductList from "./pages/product/ProductList";
import ProductAdd from "./pages/product/ProductAdd";
import ProductEdit from "./pages/product/ProductEdit";
import FeedbackList from "./pages/feedback/FeedbackList";
import NotificationList from "./pages/notification/NotificationList";
import AddNotification from "./pages/notification/AddNotification";
import EditNotification from "./pages/notification/EditNotification";
import CategoryView from "./components/memberEdit/CategoryView";
const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SIgnUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/maintenance" element={<Maintenance />} />

        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path="/change-password"
          element={<ProtectedRoute element={<ChangePassword />} />}
        />
        <Route path="/member-list" element={<MemberList />} />
        <Route path="/member-view/:id" element={<MemberView />} />
        <Route path="/member-edit/:id" element={<MemberEdit />} />
        <Route path="/category-view/:id" element={<CategoryView />} />
        <Route path="/category" element={<CategoryList />} />
        <Route path="/sub-category" element={<SubCategoryList />} />
        <Route path="/add-subCategory" element={<SubCategoryAdd />} />
        <Route path="/add-category" element={<CategoryAdd />} />
        <Route path="/category-edit/:id" element={<CategoryEdit />} />
        <Route path="/sub-category-edit/:id" element={<SubCategoryEdit />} />
        <Route path="/user-list" element={<UserList />} />
        <Route path="/adv-slider" element={<SliderList />} />
        <Route path="/popup-slider" element={<PopupSlider />} />
        <Route path="/add-slider" element={<AddSlider />} />
        <Route path="/slider-edit/:id" element={<EditSlider />} />
        <Route path="/add-popup-slider" element={<AddPopupSlider />} />
        <Route path="/popup-slider-edit/:id" element={<EditPopupSlider />} />
        <Route path="/hold-user" element={<HoldUser />} />
        <Route path="/delete-user" element={<DeleteUser />} />
        <Route path="/product" element={<ProductList />} />
        <Route path="/add-product" element={<ProductAdd />} />
        <Route path="/edit-product/:id" element={<ProductEdit />} />
        <Route path="/feedback" element={<FeedbackList />} />
        <Route path="/notification" element={<NotificationList />} />
        <Route path="/add-notification" element={<AddNotification />} />
        <Route path="/edit-notification/:id" element={<EditNotification />} />

        {/* <Route
          path="*"
          element={<ProtectedRoute element={<Navigate to="/" />} />}
        /> */}
      </Routes>
    </>
  );
};

export default App;
