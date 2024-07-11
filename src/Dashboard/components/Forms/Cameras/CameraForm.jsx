import { InputText } from "primereact/inputtext";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { postCamera } from "../../../helper/Cameras/postCamera";
import { MdScreenRotationAlt } from "react-icons/md";
import { BsArrowRightShort, BsArrowUpShort } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import '../../../pages/css/Outlet/Outlet.css'

export const CameraForm = ({ properties, setCameraFormFlag, setCameraSaved, cameraSaved, onClose }) => {

  const navigate = useNavigate();
  const { cameraForm, setCameraForm } = useContext(UserContext);
  const [validationErrors, setValidationErrors] = useState({});

  const initialState = {
    name: '',
    brand: '',
    installedByUs: '',
    dateInstalled: null,
    imageFile: null,  
    imageUrl: '',     
    status: '',
    type: '',
    property: '',

  };

  const {
    name,
    brand,
    installedByUs,
    dateInstalled,
    imageFile,
    status,
    type,
    property,
    // lon,
    // lat,
    // rotation,
  } = cameraForm;
  const statusList = ["Working", "Offline", "Vandalized"];
  const { t, i18n } = useTranslation("global");


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (cameraForm.imageUrl) {
        URL.revokeObjectURL(cameraForm.imageUrl);
      }
      const imageUrl = URL.createObjectURL(file);
      setCameraForm(prevState => ({
        ...prevState,
        imageFile: file,
        imageUrl: imageUrl  
      }));
    }
  };

  useEffect(() => {
    setCameraForm(cameraForm ? { ...initialState, ...cameraForm } : initialState);
  }, []);



  const handleSaveCamera = async () => {
    if (validateCameraForm()) {
    
    if (typeof setCameraSaved === "function") {
      await postCamera(cameraForm, t);
      setCameraSaved(!cameraSaved);
      setCameraFormFlag(false);
      setCameraForm({});
    } else {
      console.error('setCameratSaved is not a function', { setCameraSaved });
    }
  }


  };

  const validateCameraForm = () => {
    const errors = {};

    if (!name.trim()) errors.name = t("dashboard.cameras.dialog.validation.name-required");
    if (!brand.trim()) errors.brand = t("dashboard.cameras.dialog.validation.brand-required");
    if (!type) errors.type = t("dashboard.cameras.dialog.validation.type-required");
    if (!status) errors.status = t("dashboard.cameras.dialog.validation.status-required");
    if (!installedByUs) errors.installedByUs = t("dashboard.cameras.dialog.validation.installedBy-required");
    if (!property) errors.property = t("dashboard.cameras.validation.dialog.property-required");
    if (!imageFile) errors.imageFile = t("dashboard.cameras.dialog.validation.image-required");

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; 
  };

console.log(cameraForm)

  return (
    <div>
      <div className="flex">
        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">{t("dashboard.cameras.dialog.camera-name")}</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText
              value={name}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, name: e.target.value };
                })
              }
              placeholder={t("dashboard.cameras.dialog.camera-name-placeholder")}
            />
          </div>
            {validationErrors.name && <small className="p-error">{validationErrors.name}</small>}
        </div>
        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">{t("dashboard.cameras.dialog.brand")}</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText
              value={brand}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, brand: e.target.value };
                })
              }
              placeholder={t("dashboard.cameras.dialog.brand-placeholder")}
            />
          </div>
          {validationErrors.brand && <small className="p-error">{validationErrors.brand}</small>}
        </div>

      </div>
      
      <div className="flex">
        <div className="p-inputgroup my-3 ml-3 flex flex-col w-full">
          <label htmlFor="cameraType">{t("dashboard.cameras.dialog.type")}</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <Dropdown
              id="cameraType"
              value={type}
              onChange={(e) => setCameraForm((prev) => ({ ...prev, type: e.value }))}
              options={["Dome", "PTZ", "Bullet", "LPR", "Box"]}
              placeholder={t("dashboard.cameras.dialog.type-placeholder")}
              className="w-full"
            />
          </div>
          {validationErrors.type && (
            <small className="p-error" style={{ paddingLeft: '2.5rem' }}>{validationErrors.type}</small>
          )}
        </div>
      </div>

      <div className="flex">
        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">{t("dashboard.cameras.dialog.camera-status")}</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>

            <Dropdown
              value={status}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, status: e.value };
                })
              }
              options={statusList}
              placeholder={t("dashboard.cameras.dialog.camera-status-placeholder")}
              className="w-full md:w-14rem"
            />
          </div>
          {validationErrors.status && <small className="p-error">{validationErrors.status}</small>}

        </div>
        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">{t("dashboard.cameras.dialog.installed-by")}</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>

            <Dropdown
              value={installedByUs}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, installedByUs: e.value };
                })
              }
              options={["Yes", "No"]}
              placeholder={t("dashboard.cameras.dialog.installed-by-placeholder")}
              className="w-full md:w-14rem"
            />
          </div>
          {validationErrors.installedByUs && <small className="p-error">{validationErrors.installedByUs}</small>}

        </div>
              
      </div>

      <div className="flex">
        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">{t("dashboard.cameras.dialog.property")}</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <Dropdown
              value={property}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, property: e.value };
                })
              }
              options={properties}
              optionLabel="name"
              placeholder={t("dashboard.cameras.dialog.property-placeholder")}
              className="w-full md:w-14rem"
            />
          </div>
          {validationErrors.property && <small className="p-error">{validationErrors.property}</small>}
        </div>  
      </div>

      
      <div className="w-full p-3">
        <div className="p-inputgroup my-3 flex flex-col">
          <div className="file-upload-container">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
              style={{ display: 'none' }}
            />
            <label htmlFor="image" className="file-input-label">{t("dashboard.cameras.dialog.search-img")}</label>
            {cameraForm.imageUrl && (
              <div className="image-preview-container mt-3 flex flex-col items-center">
                <img src={cameraForm.imageUrl} alt="Preview" className="image-preview" style={{ maxHeight: '300px', maxWidth: '100%', borderRadius: '10%' }} />
                <span className="file-name mt-2">{cameraForm.imageFile ? cameraForm.imageFile.name : ''}</span>
              </div>
            )}
            {validationErrors.imageFile && <small className="p-error">{validationErrors.imageFile}</small>}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-around mt-5 ">
        <Button icon="pi pi-times" severity="danger" label={t('dashboard.cameras.dialog.cancel')} onClick={onClose} />
        <div className="w-3"></div>
        <button
          className="send-button"
          onClick={handleSaveCamera}
        >
          <div class="svg-wrapper-1">
            <div class="svg-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  fill="currentColor"
                  d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                ></path>
              </svg>
            </div>
          </div>
          <span>
            {t("dashboard.cameras.dialog.send")}
          </span>
        </button>

      </div>

      {/* <div className="flex">
        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">Latitud</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <BsArrowUpShort></BsArrowUpShort>
            </span>

            <InputText
              value={lat}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, lat: e.target.value };
                })
              }
              placeholder="Lat"
            />
          </div>
        </div>
        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">Longitud</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <BsArrowRightShort />
            </span>

            <InputText
              value={lon}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, lon: e.target.value };
                })
              }
              placeholder="Lng"
            />
          </div>
        </div>
        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">Rotation</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <MdScreenRotationAlt />
            </span>
            <InputText
              value={rotation}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, rotation: e.target.value };
                })
              }
              placeholder="Rotation"
            />
          </div>
        </div>
      </div> */}
    </div>
  );
};


