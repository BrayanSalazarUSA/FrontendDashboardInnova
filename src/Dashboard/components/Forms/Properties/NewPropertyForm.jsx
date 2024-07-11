import React, { useContext, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { useTranslation } from "react-i18next";
import { postNewProperty } from "../../../helper/Properties/postNewProperty";
import { UserContext } from "../../../../context/UserContext";


export const NewPropertyForm = ({ onClose }) => {
    const { t } = useTranslation("global");
    const [propertyForm, setPropertyForm] = useState({
        name: '',
        direction: '',
        img: null,
        mapImg: null
    });
    const [mapImgPreview, setMapImgPreview] = useState(propertyForm.mapImg || '');
    const [imgPreview, setImgPreview] = useState(propertyForm.img || '');
    const [validationErrors, setValidationErrors] = useState({});

    
    const handleInputChange = (event, field) => {
        if (field === 'img' || field === 'mapImg') {
            if (event.target && event.target.files && event.target.files.length > 0) {
                const file = event.target.files[0];
                const imageUrl = URL.createObjectURL(file);
                setPropertyForm(prev => ({
                    ...prev,
                    [field]: file
                }));
                if (field === 'img') {
                    setImgPreview(imageUrl);
                } else if (field === 'mapImg') {
                    setMapImgPreview(imageUrl);
                }
            }
        } else {
            if (event.target) {
                const value = event.target.value;
                setPropertyForm(prev => ({
                    ...prev,
                    [field]: value
                }));
                if (validationErrors[field] && value.trim()) {
                    setValidationErrors(prev => ({
                        ...prev,
                        [field]: null
                    }));
                }
            }
        }
    };

    const validatePropertyDetails = () => {

        const errors = {};
        const { name, direction, img, mapImg } = propertyForm;
        if (!name) errors.name = t("dashboard.properties.dialog.swal.validate-property-details.name");
        if (!direction) errors.direction = t("dashboard.properties.dialog.swal.validate-property-details.direction");
        if (!img || typeof img === 'string' || !img.name) errors.img = t("dashboard.properties.dialog.swal.validate-property-details.img-url");
        if (!mapImg || typeof mapImg === 'string' || !mapImg.name) errors.mapImg = t("dashboard.properties.dialog.swal.validate-property-details.map-url");


        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveProperty = async () => {
        if (validatePropertyDetails()) {
            await postNewProperty(propertyForm, t);
            onClose();
            setPropertyForm({});
        }
    };
    console.log(propertyForm)

    const handleImageChange = (event, type) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            if (type === 'img') {
                setImgPreview(imageUrl);
                setPropertyForm(prev => ({ ...prev, img: file }));
            } else if (type === 'mapImg') {
                setMapImgPreview(imageUrl);
                setPropertyForm(prev => ({ ...prev, mapImg: file }));
            }
        }
    };



    return (
        <div>
            <div className="flex">
                <div className="p-inputgroup my-3 ml-3 flex flex-col">
                    <label htmlFor="name">{t("dashboard.properties.dialog.add-property.property-name")}</label>
                    <div className="p-inputgroup">
                        <span className="p-float-label">
                            <InputText
                                id="name"
                                value={propertyForm.name}
                                onChange={(e) => handleInputChange(e, 'name')}
                            />
                        </span>
                        {validationErrors.name && <small className="p-error">{validationErrors.name}</small>}
                    </div>
                </div>

                <div className="p-inputgroup my-3 ml-3 flex flex-col">
                    <label htmlFor="direction">{t("dashboard.properties.dialog.add-property.address")}</label>
                    <div className="p-inputgroup">
                        <span className="p-float-label">
                            <InputText
                                id="direction"
                                value={propertyForm.direction}
                                onChange={(e) => handleInputChange(e, 'direction')}
                            />
                        </span>
                        {validationErrors.direction && <small className="p-error">{validationErrors.direction}</small>}
                    </div>
                </div>
            </div>

            <div className="flex">
                <div className="p-inputgroup my-3 ml-3 flex flex-col">
                    <label htmlFor="img">{t("dashboard.properties.dialog.add-property.property-img")}</label>
                    <div className="file-upload-container">
                        <input
                            type="file"
                            id="img"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, 'img')}
                            className="file-input"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="img" className="file-input-label">{t("dashboard.properties.dialog.add-property.search-img")}</label>
                        {imgPreview && (
                            <div className="image-preview-container mt-3 flex flex-col items-center">
                                <img src={imgPreview} alt="Property Image Preview" className="image-preview" style={{ maxHeight: '300px', maxWidth: '100%', borderRadius: '10%' }} />
                                <span className="file-name mt-2">{propertyForm.img ? propertyForm.img.name : 'No file chosen'}</span>
                            </div>
                        )}
                        {validationErrors.img && <small className="p-error">{validationErrors.img}</small>}
                    </div>
                </div>

                <div className="p-inputgroup my-3 ml-3 flex flex-col">
                    <label htmlFor="mapImg">{t("dashboard.properties.dialog.add-property.property-map")}</label>
                    <div className="file-upload-container">
                        <input
                            type="file"
                            id="mapImg"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, 'mapImg')}
                            className="file-input"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="mapImg" className="file-input-label">{t("dashboard.properties.dialog.add-property.search-img")}</label>
                        {mapImgPreview && (
                            <div className="image-preview-container mt-3 flex flex-col items-center">
                                <img src={mapImgPreview} alt="Map Image Preview" className="image-preview" style={{ maxHeight: '300px', maxWidth: '100%', borderRadius: '10%' }} />
                                <span className="file-name mt-2">{propertyForm.mapImg ? propertyForm.mapImg.name : 'No file chosen'}</span>
                            </div>
                        )}
                        {validationErrors.mapImg && <small className="p-error">{validationErrors.mapImg}</small>}
                    </div>
                </div>
            </div>

            <div className="flex">
                <div className="w-full flex justify-around mt-5 ">
                    <Button
                        icon="pi pi-times"
                        severity="danger"
                        label={t("dashboard.properties.dialog.add-property.cancel")}
                        onClick={onClose}
                    />
                    <div className="w-3"></div>
                    <Button
                        icon="pi pi-check"
                        label={t("dashboard.properties.dialog.add-property.send")}
                        className="p-button-success"
                        onClick={() => {
                            handleSaveProperty();
                        }}
                    />
                </div>
            </div>
        </div >

    );
};