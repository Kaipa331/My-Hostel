import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { HomePage } from "./components/HomePage";
import { HostelDetails } from "./components/HostelDetails";
import { LandlordAuth } from "./components/LandlordAuth";
import { LandlordDashboard } from "./components/LandlordDashboard";
import { AddEditHostel } from "./components/AddEditHostel";
import { AdminAuth } from "./components/AdminAuth";
import { AdminDashboard } from "./components/AdminDashboard";
import { StudentAuth } from "./components/StudentAuth";
import { StudentDashboard } from "./components/StudentDashboard";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "hostel/:id", Component: HostelDetails },
      { path: "landlord/auth", Component: LandlordAuth },
      { path: "landlord/dashboard", Component: LandlordDashboard },
      { path: "landlord/hostel/add", Component: AddEditHostel },
      { path: "landlord/hostel/edit/:id", Component: AddEditHostel },
      { path: "admin/auth", Component: AdminAuth },
      { path: "admin/dashboard", Component: AdminDashboard },
      { path: "student/auth", Component: StudentAuth },
      { path: "student/dashboard", Component: StudentDashboard },
      { path: "*", Component: NotFound },
    ],
  },
]);
