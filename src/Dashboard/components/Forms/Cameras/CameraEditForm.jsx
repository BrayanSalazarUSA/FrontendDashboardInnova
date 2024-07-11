import { InputText } from "primereact/inputtext";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { putImageCamera } from "../../../helper/Cameras/UpdateCamera/putImageCamera";
import { MdScreenRotationAlt } from "react-icons/md";
import { BsArrowRightShort, BsArrowUpShort } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import "../../../pages/css/Cameras/Cameras.css"
import Swal from "sweetalert2";
import { putEditCamera } from "../../../helper/Cameras/UpdateCamera/putEditCamera";
import '../../../pages/css/Outlet/Outlet.css'


export const CameraEditForm = ({ camera, onClose }) => {
    const [cameraForm, setCameraForm] = useState({});
    const {
        name,
        brand,
        installedByUs,
        dateInstalled,
        imageFile,
        status,
        type,
    } = cameraForm || {};

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
        if (camera) {
            const imageUrl = camera.image ? `${process.env.REACT_APP_S3_BUCKET_URL}/${camera.image}` : '';

            setCameraForm({
                ...camera,
                imageFile: null,  
                imageUrl: imageUrl  
            });
        }
    }, [camera]);

    const handleUpdateCameraImage = async () => {
        if (cameraForm.imageFile) {
            const result = await putImageCamera(camera.id, cameraForm.imageFile, t);
            if (result) {
                onClose(result); 
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: t("dashboard.cameras.update.swal.caution"),
                text: t("dashboard.cameras.update.swal.different-image"),
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                customClass: {
                    container: 'swal-overlay'
                }
            });
        }
    };

    const handleUpdateCameraInfo = async () => {
        if (cameraForm) {
            try {
                const updatedCamera = await putEditCamera(camera.id, cameraForm, t);
                if (updatedCamera) {
                    onClose(updatedCamera); 
                }
            } catch (error) {
                console.log("Failed to update camera info: ", error);
            }
        }
    };


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
                </div>
            </div>

            <div className="flex">
                <div className="p-inputgroup my-3 ml-3 flex flex-col">
                    <label htmlFor="username">{t("dashboard.cameras.dialog.type")}</label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <Dropdown
                            value={type}
                            onChange={(e) =>
                                setCameraForm((i) => {
                                    return { ...cameraForm, type: e.value };
                                })
                            }
                            options={["Dome", "PTZ", "Bullet", "LPR", "Box"]}
                            placeholder={t("dashboard.cameras.dialog.type-placeholder")}
                            className="w-full md:w-14rem"
                        />
                    </div>
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
                    </div>
                </div>
                <Button
                    label={t("dashboard.cameras.update.update-button")}
                    icon="pi pi-refresh"
                    className="p-button update-camera-button"
                    onClick={handleUpdateCameraImage}
                />
            </div>

            <div className="w-full flex justify-around   mt-7">
                <Button icon="pi pi-times" severity="danger" label={t('dashboard.cameras.dialog.cancel')} onClick={onClose} />
                <div className="w-3"></div>
                <button
                    className="send-button"
                    onClick={handleUpdateCameraInfo}
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

        </div>
    );
};

