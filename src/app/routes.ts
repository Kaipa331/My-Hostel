import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import { HomePage } from "./components/HomePage";
import { HostelDetails } from "./components/HostelDetails";
import Auth from "./components/Auth";
import { LandlordDashboard } from "./components/LandlordDashboard";
import { AddEditHostel } from "./components/AddEditHostel";
import { AdminAuth } from "./components/AdminAuth";
import { AdminDashboard } from "./components/AdminDashboard";
import { StudentDashboard } from "./components/StudentDashboard";
import { AboutUs } from "./components/AboutUs";
import { Contact } from "./components/Contact";
import { HelpCenter } from "./components/HelpCenter";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { ForStudents } from "./components/ForStudents";
import { ForLandlords } from "./components/ForLandlords";
import { ListYourProperty } from "./components/ListYourProperty";
import { ReportIssue } from "./components/ReportIssue";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "hostel/:id", Component: HostelDetails },
      { path: "auth", Component: Auth },
      { path: "landlord/dashboard", Component: LandlordDashboard },
      { path: "landlord/hostel/add", Component: AddEditHostel },
      { path: "landlord/hostel/edit/:id", Component: AddEditHostel },
      { path: "admin/auth", Component: AdminAuth },
      { path: "admin/dashboard", Component: AdminDashboard },
      { path: "student/dashboard", Component: StudentDashboard },
      { path: "about", Component: AboutUs },
      { path: "contact", Component: Contact },
      { path: "help", Component: HelpCenter },
      { path: "privacy", Component: PrivacyPolicy },
      { path: "for-students", Component: ForStudents },
      { path: "for-landlords", Component: ForLandlords },
      { path: "list-property", Component: ListYourProperty },
      { path: "report-issue", Component: ReportIssue },
      { path: "*", Component: NotFound },
    ],
  },
]);
