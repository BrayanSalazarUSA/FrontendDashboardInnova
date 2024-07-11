import React, { useContext, useEffect, useState } from "react";
import {
  GridComponent,
  Inject,
  ColumnsDirective,
  ColumnDirective,
  Search,
  Page,
  Toolbar,
} from "@syncfusion/ej2-react-grids";


import { Header } from "../components";

import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { CameraForm, CameraFormFooter, } from "../components/Forms/Cameras/CameraForm";
import { CameraEditForm } from "../components/Forms/Cameras/CameraEditForm";
import useFetchProperties from "../Hooks/useFetchProperties";
import { getCameras } from "../helper/getCameras";
import { UserContext } from "../../context/UserContext";
import { cameraGrid, cameraGridAdmin } from "../data/dummy";
import { useTranslation } from "react-i18next";
import TableSkeleton from "../components/TableSkeleton";
import TypewriterText from "../components/Texts/TypewriterTex";
import '../pages/css/Outlet/Outlet.css'

const Cameras = () => {
  const toolbarOptions = ["Search"];
  const navigate = useNavigate();
  const editing = { allowDeleting: true, allowEditing: true };
  const { t, i18n } = useTranslation("global");

  const [camerasList, setCamerasList] = useState([]);
  let propertiesUser = JSON.parse(localStorage.getItem("user"));
  let listOfPropertiesByUser = propertiesUser.properties;
  const { propertyContext, setCameraForm, setPropertyContext, cameraSaved, setCameraSaved, cameraFormFlag, setCameraFormFlag } = useContext(UserContext);

  let propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
  let idStorage = propertyStorage.id;
  let id = propertyContext.id || idStorage;
  let user = JSON.parse(localStorage.getItem("user"));
  let userRole = user.role.rolName;
  const [loading, setLoading] = useState(true);

  const [selectedCamera, setSelectedCamera] = useState(null);

  useEffect(() => {
    getCameras(propertyContext.id || id, navigate).then((data) =>
      setCamerasList(data)
    );
    setLoading(false)
  }, [propertyContext, cameraSaved]);

  const handleClose = () => {
    setCameraFormFlag(false);
    setCameraForm({});
  };

  const handleCloseEdit = (updatedCamera) => {
    setLoading(false)
    setSelectedCamera(null);
    if (updatedCamera) {
      getCameras(propertyContext.id || id, navigate).then(setCamerasList);
    }
  };

  return (
    <>
      <Dialog
        header={t("dashboard.cameras.dialog.add-camera")}
        visible={cameraFormFlag}
        style={{ width: "50vw" }}
        modal
        dismissableMask
        onHide={handleClose}
      >
        <CameraForm
          properties={listOfPropertiesByUser} cameraSaved={cameraSaved}
          setCameraFormFlag={setCameraFormFlag}
          setCameraSaved={setCameraSaved}
          onClose={handleClose} />
      </Dialog>

      <Dialog
        header={t("dashboard.cameras.dialog.edit-camera")}
        visible={selectedCamera !== null}
        style={{ width: "50vw" }}
        modal
        dismissableMask
        onHide={() => setSelectedCamera(null)}
      >
        <CameraEditForm camera={selectedCamera} onClose={handleCloseEdit} />
      </Dialog>

      <div className="mx-7 bg-white rounded-3xl overflow-auto">
        <div className="background">
          <Header title={
            <TypewriterText text={`${t("dashboard.cameras.title")} ${propertyContext.name}`} />
          } />
          <div className="card flex justify-start ">
            {userRole == "Admin" ? (

              <button
                className="button ml-7"
                onClick={() => {
                  setCameraFormFlag(true)
                }}
              >
                {t("dashboard.cameras.dialog.add-camera")}
                <AiOutlinePlusCircle className="ml-2" />
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>

        {loading ? <TableSkeleton /> : (
          <GridComponent
            dataSource={camerasList}
            width="auto"
            allowPaging
            key={i18n.language}
            allowSorting
            pageSettings={{ pageCount: 5 }}
            editSettings={editing}
            toolbar={toolbarOptions}
            allowResizing={true}
          >

            <ColumnsDirective>
              {userRole === "Admin" ?
                cameraGridAdmin(t, setSelectedCamera).map((item, index) => (
                  <ColumnDirective key={index} {...item} />
                )) : cameraGrid(t).map((item, index) => (
                  <ColumnDirective key={index} {...item} />
                ))}
            </ColumnsDirective>

            <Inject services={[Search, Page, Toolbar]} />
          </GridComponent>
        )}
      </div>
    </>
  );
};
export default Cameras;