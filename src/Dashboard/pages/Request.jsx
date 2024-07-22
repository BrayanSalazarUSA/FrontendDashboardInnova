import React, { useContext, useState, useEffect, useRef } from "react";

import { Header } from "../components";

import { Toast } from "primereact/toast";
import "../pages/css/Outlet/Outlet.css";
import "../pages/css/Reports/Reports.css";
import TypewriterText from "../components/Texts/TypewriterTex";
import { useTranslation } from "react-i18next";
import { getRequests } from "../helper/getRequest";
import TableSkeleton from "../components/TableSkeleton";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  ContextMenu,
  Filter,
  Page,
  Search,
  PdfExport,
  Inject,
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import { contextMenuItems } from "../data/dummy";
import { GridRequests } from "../tablesTemplates/Reports/GridRequests";

const Request = () => {
  const toast = useRef(null);
  const property = JSON.parse(localStorage.getItem("propertySelected"));
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTable, setRefreshTable] = useState(false);
  const { t } = useTranslation("global");

  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      const requests = await getRequests();
      setRequests(requests);
      setLoading(false);
    };

    fetchRequest();
  }, [refreshTable]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const columns = GridRequests();
  return (
    <div className="mx-7 bg-white rounded-3xl overflow-auto">
      <div className="background">
        <Toast ref={toast} />
        <Header
          title={<TypewriterText text={`Request - ${property?.name}`} />}
        />
      </div>
        <div className="card flex justify-start">
          <>
            <Toast ref={toast} />
            {loading ? (
              <TableSkeleton />
            ) : (
              <GridComponent
                id="gridcomp"
                dataSource={requests}
                allowPaging
                allowSorting
                allowExcelExport
                allowPdfExport
                contextMenuItems={contextMenuItems}
                toolbar={["Search"]}
                allowResizing
              >
                <Inject
                  services={[
                    Resize,
                    Sort,
                    ContextMenu,
                    Filter,
                    Page,
                    PdfExport,
                    Search,
                    Toolbar,
                  ]}
                />
                <ColumnsDirective>
                  {columns.map((item, index) => (
                    <ColumnDirective key={index} {...item} />
                  ))}
                </ColumnsDirective>
              </GridComponent>
            )}
          </>
        </div>
        
    </div>
  );
};

export default Request;
