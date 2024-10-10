import React from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineBarChart } from "react-icons/ai";
import { FiShoppingBag, FiPieChart, FiUsers } from "react-icons/fi";
import { BsMap, BsFillBuildingsFill } from "react-icons/bs";
import { HiDocumentReport, HiUserCircle } from "react-icons/hi";
import { GiPoliceBadge } from "react-icons/gi";
import { RiAppsFill, RiAppStoreFill, RiCalendarTodoFill } from "react-icons/ri";
import { FaCalendar, FaDesktop, FaWindows } from "react-icons/fa";

const SidebarLinks = () => {
    const [t, i18n] = useTranslation("global");
    return [
        {
            title: (
                <span>
                    {t("dashboard.dashboard-sliderbar.dashboard-section.dashboard-tittle")}
                </span>
            ),           
             links: [
                {
                    name: t("dashboard.dashboard-sliderbar.dashboard-section.home"),
                    icon: <FiShoppingBag />,
                    url: "",
                    permit: "Yes",
                },
            ],
        },
        {
            title: (
                <span >
                    {t("dashboard.dashboard-sliderbar.integral-management-section.integral-tittle")}
                </span>
            ),
            links: [
                {
                    name: t("dashboard.dashboard-sliderbar.integral-management-section.reports"),
                    icon: <HiDocumentReport />,
                    url: "reports",
                    permit: "Yes",
                },

       
        {
          name: t("dashboard.dashboard-sliderbar.integral-management-section.cameras"),
          icon: <HiUserCircle />,
          url: "cameras",
          permit: "Yes",
        },
        {
          name: t(
            "dashboard.dashboard-sliderbar.integral-management-section.users"
          ),
          icon: <FiUsers />,
          url: "Users",
          permit: "No",
        },
        {
          name: t(
            "dashboard.dashboard-sliderbar.integral-management-section.agents"
          ),
          icon: <HiUserCircle />,
          url: "Agents",
          permit: "No",
        },
        {
          name: t(
            "dashboard.dashboard-sliderbar.integral-management-section.cases"
          ),
          icon: <GiPoliceBadge/>,
          url: "Cases",
          permit: "No",
        },
        {
          name: t(
            "dashboard.dashboard-sliderbar.integral-management-section.properties"
          ),
          icon: <BsFillBuildingsFill/>,
          url: "properties",
          permit: "No",
        },
        {
          name: t(
            "dashboard.dashboard-sliderbar.integral-management-section.map"
          ),
          icon: <BsMap/>,
          url: "Mapa",
          permit: "Yes",
        },
          {
          name:"Requests",
          icon: <RiCalendarTodoFill/>,
          url: "Request",
          permit: "Yes",
        },  
          {
          name:"Desktop App",
          icon: <FaWindows/>,
          url: "App",
          permit: "No",
        },
          {
          name:"Calendar",
          icon: <FaCalendar/>,
          url: "calendar",
          permit: "No",
        } 
      ],
    },
    { 
      title: (
        <span>
          {t("dashboard.dashboard-sliderbar.graphical-insights-section.graphical-tittle")}
        </span> 
      ),
      links: [
        {
          name: t(
            "dashboard.dashboard-sliderbar.graphical-insights-section.report-bar"
          ),
          icon: <AiOutlineBarChart />,
          url: "bar",
          permit: "Yes",
        },
        {
          name: t(
            "dashboard.dashboard-sliderbar.graphical-insights-section.types-of-cases"
          ),
          icon: <FiPieChart />,
          url: "pie-reports",
          permit: "Yes",
        },
        {
          name: t(
            "dashboard.dashboard-sliderbar.graphical-insights-section.types-of-levels"
          ),
          icon: <FiPieChart />,
          url: "pie-levels",
          permit: "Yes",
        },

       {
            name: t("dashboard.dashboard-sliderbar.graphical-insights-section.reports-per-month"),
            icon: <AiOutlineBarChart />,
          url: "stacked",
             permit: "Yes",
         },
      ],
    },
  ];
};
export default SidebarLinks;
