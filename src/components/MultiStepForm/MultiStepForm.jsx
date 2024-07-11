import React, { useContext, useState, useCallback  } from "react";
import { Typography, TextField,Button, Stepper, Step,StepLabel,} from "@material-ui/core";
import "./MultiStepForm.css";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { makeStyles } from "@material-ui/core/styles";
import { AiFillCheckCircle } from "react-icons/ai";
import { useForm, Controller, useFormContext } from "react-hook-form";
import emailjs from "emailjs-com";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import { Link } from "react-router-dom";
import { FormContext, FormProvider } from "../../context/FormProvide";
import { motion } from "framer-motion";
import { Resend } from "resend";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import Swal from "sweetalert2";
import Input from '@material-ui/core/Input';
import ReCAPTCHA from "react-google-recaptcha";
import AddressAutocompleteMap from "../../Dashboard/components/Map/AddressAutocompleteMap";

// el Contexto para los Formularios viene de FormProvide.jsx


const TextAnimation = () => {
  const [t, i18n] = useTranslation("global");
  const text = t("plan.plan_section_finish.header_finish");
  return (
    <motion.div className="text">
      {text.split("").map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.div>
  );
};
const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: "20px",
    marginRight: theme.spacing(1),
    backgroundColor: "goldenrod",
    color: "white",
  },
  palette: {
    primary: {
      main: "red",
    },
  },
}));



const First = ({ formPlan, setformPlan }) => {
  const [t, i18n] = useTranslation("global");
  const onCategoryChange = (e) => {
    let _selectedCategories = [...formPlan.selectedCategories];

    if (e.checked) _selectedCategories.push(e.value);
    else
      _selectedCategories = _selectedCategories.filter(
        (category) => category.key !== e.value.key
      );
    setformPlan({ ...formPlan, selectedCategories: _selectedCategories });
  };

  const categories = [
    { name: t("plan.categories.personal_security"), key: "1" },
    { name: t("plan.categories.decrease_property_crime"), key: "2" },
    { name: t("plan.categories.compliance_with_regulations"), key: "3" },
    { name: t("plan.categories.theft_prevention"), key: "4" },
    { name: t("plan.categories.protection_of_assets"), key: "5" },
    { name: t("plan.categories.remote-monitoring"), key: "6" },
    { name: t("plan.categories.other"), key: "7" },
  ];


  return (

    <>
      <div className="card flex flex-col justify-content-center mb-5">
        <div className="font-semibold mb-3">
          {t("plan.categories.title")}
        </div>
        <div className="flex flex-col gap-3">
          {categories.map((category) => {
            return (
              <div key={category.key} className="flex align-items-center">
                <Checkbox
                  inputId={category.key}
                  name="category"
                  value={category}
                  onChange={onCategoryChange}
                  checked={formPlan.selectedCategories.some(
                    (item) => item.key === category.key
                  )}
                />
                <label htmlFor={category.key} className="ml-2">
                  {category.name}
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <div className="">
        <div className="font-semibold mb-3">
          {t("plan.categories.tell_us")}
        </div>
        <InputTextarea
          placeholder={t("plan.categories.text_box")}
          value={formPlan.textArea}
          onChange={(e) =>
            setformPlan({ ...formPlan, textArea: e.target.value })
          }
          rows={4}
          cols={35}
        />
      </div>
    </>

  );

};

function getSteps(t) {

  return [
    t("plan.multiple_step_form.step_one"),
    t("plan.multiple_step_form.step_two"),
    t("plan.multiple_step_form.step_three"),
    t("plan.multiple_step_form.step_four"),
    t("plan.multiple_step_form.step_five")
  ];
}

const BasicForm = ({ formPlan, setformPlan }) => {
  const [t, i18n] = useTranslation("global");
  return (
    <>
      <TextField
        id="first-name"
        label={t("plan.personal_section.name_label")}
        variant="outlined"
        placeholder={t("plan.personal_section.name_placeholder")}
        fullWidth
        margin="normal"
        required
        value={formPlan.name}
        onChange={(e) => setformPlan({ ...formPlan, name: e.target.value })}
      />
      <TextField
        id="last-name"
        label={t("plan.personal_section.last_name_label")}
        variant="outlined"
        placeholder={t("plan.personal_section.last_name_placeholder")}
        fullWidth
        required
        margin="normal"
        value={formPlan.lastName}
        onChange={(e) => setformPlan({ ...formPlan, lastName: e.target.value })}
      />

      <TextField
        id="nick-name"
        label={t("plan.personal_section.country_placeholder")}
        variant="outlined"
        placeholder={t("plan.personal_section.country_placeholder")}
        fullWidth
        margin="normal"
        required
        value={formPlan.country}
        onChange={(e) => setformPlan({ ...formPlan, country: e.target.value })}
      />

      <div className="mb-4">
        <TextField
          id="nick-name"
          label={t("plan.personal_section.state_label")}
          variant="outlined"
          required
          placeholder={t("plan.personal_section.state_placeholder")}
          fullWidth
          margin="normal"
          value={formPlan.state}
          onChange={(e) => setformPlan({ ...formPlan, state: e.target.value })}
        />
        <TextField
          id="city"
          label={t("plan.personal_section.city-label")}
          variant="outlined"
          required
          placeholder={t("plan.personal_section.city-placeholder")}
          fullWidth
          margin="normal"
          value={formPlan.city}
          onChange={(e) => setformPlan({ ...formPlan, city: e.target.value })}
        />
      </div>
    </>
  );
};

const ContactForm = ({ formPlan, setformPlan }) => {
  const { t, i18n } = useTranslation("global");
  return (
    <>
      <label htmlFor="propertyType" className="font-bold block mb-2">
        {t("plan.contact_section.title")}
      </label>
      <TextField
        id="email"
        label={t("plan.contact_section.e_mail_label")}
        variant="outlined"
        placeholder={t("plan.contact_section.e_mail_placeholder")}
        fullWidth
        required
        margin="normal"
        value={formPlan.email}
        onChange={(e) => setformPlan({ ...formPlan, email: e.target.value })}
      />

      <TextField
        id="phone-number"
        label={t("plan.contact_section.phone_number_label")}
        variant="outlined"
        required
        placeholder={t("plan.contact_section.phone_number_placeholder")}
        fullWidth
        value={formPlan.phone}
        onChange={(e) => setformPlan({ ...formPlan, phone: e.target.value })}
      />

      <div className="mb-4">
        <TextField
          id="alternate-phone"
          label={t("plan.contact_section.alternate_phone_label")}
          variant="outlined"
          placeholder={t("plan.contact_section.alternate_phone_placeholder")}
          fullWidth
          margin="normal"
          value={formPlan.alternativePhone}
          onChange={(e) =>
            setformPlan({ ...formPlan, alternativePhone: e.target.value })
          }
        />
      </div>
    </>
  );
};

const PropertyForm = ({ formPlan, setformPlan }) => {
  const { t, i18n } = useTranslation("global");
  const properties = [
    { name: t("plan.property-section.property-type.property-type-list1"), code: "1" },
    { name: t("plan.property-section.property-type.property-type-list2"), code: "2" },
    { name: t("plan.property-section.property-type.property-type-list3"), code: "3" },
    { name: t("plan.property-section.property-type.property-type-list4"), code: "4" },
    { name: t("plan.property-section.property-type.property-type-list5"), code: "5" },
    { name: t("plan.property-section.property-type.property-type-list6"), code: "6" },
    { name: t("plan.property-section.property-type.property-type-list7"), code: "7" },
    { name: t("plan.property-section.property-type.property-type-list8"), code: "8" },
    { name: t("plan.property-section.property-type.property-type-list9"), code: "9" },
    { name: t("plan.property-section.property-type.property-type-list10"), code: "10" },
    { name: t("plan.property-section.property-type.property-type-list11"), code: "11" },
  ];

  const handlePropertyTypeChange = (e) => {
    setformPlan({ ...formPlan, propertyType: e.value });
    setformPlan(prevState => ({
      ...prevState,
      propertyDetail: '',
      businessType: '',
      constructionType: '',
    }));

    // Lógica para campos adicionales basada en la selección del tipo de propiedad
    if (e.value.code === "1") {} 
    else if (e.value.code === "4") {}
    else if (e.value.code === "7") {} 
  };

  const handleSelectAddress = (address) => {
    setformPlan({ ...formPlan, propertyAddress: address });
  };

  const [isAddressFieldFocused, setIsAddressFieldFocused] = useState(false);
  const handleAddressFieldFocus = () => {
    setIsAddressFieldFocused(true);
  };

  return (
    <>
      <div className="card flex flex-col justify-content-center mb-2">
        <label htmlFor="propertyType" className="font-bold block mb-2">
          {t("plan.property-section.property-type.property-header")}
        </label>
        <Dropdown
          id="propertyType"
          value={formPlan.propertyType}
          onChange={handlePropertyTypeChange}
          options={properties}
          optionLabel="name"
          placeholder={t("plan.property-section.property-type.property-placeholder")}
          className="w-full md:w-14rem"
        />
      </div>

      {/* Campos condicionales basados en la selección del tipo de propiedad */}
      {formPlan.propertyType?.code === "1" && (
        <>
          <div className="mb-4">
            <label htmlFor="propertyDetail" className="block mb-2">
              {t("plan.property-section.residential.property-detail-label")}
            </label>
            <Dropdown
              id="propertyDetail"
              value={formPlan.propertyDetail}
              onChange={(e) => setformPlan({ ...formPlan, propertyDetail: e.value })}
              options={[
                { label: t("plan.property-section.residential.Govermental"), value: 'Propiedad del gobierno' },
                { label: t("plan.property-section.residential.hud-property"), value: 'HUD' },
                { label: t("plan.property-section.residential.section-8"), value: 'Section-8' },
                { label: t("plan.property-section.residential.private-property"), value: 'Propiedad privada' }
              ]}
              optionLabel="label"
              placeholder={t("plan.property-section.residential.property-detail-placeholder")}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <TextField
              id="units"
              label={t("plan.property-section.residential.units-label")}
              variant="outlined"
              placeholder={t("plan.property-section.residential.units-placeholder")}
              fullWidth
              value={formPlan.units}
              onChange={(e) => {
                if (e.target.value >= 1) {
                  setformPlan({ ...formPlan, units: e.target.value });
                }
              }}
              margin="normal"
              type="number"
            />
          </div>
        </>
      )}
      
      {formPlan.propertyType?.code !== "4" && (
        <TextField
          id="propertyName"
          label={t("plan.property-section.property_name_label")}
          variant="outlined"
          placeholder={t("plan.property-section.property_name_placeholder")}
          fullWidth
          value={formPlan.propertyName}
          required
          onChange={(e) => setformPlan({ ...formPlan, propertyName: e.target.value })}
          margin="normal"
        />
      )}

      {formPlan.propertyType?.code === "4" && (
        <Dropdown
          id="constructionType"
          value={formPlan.constructionType}
          options={[
            { label: t("plan.property-section.construction.type.building"), value: 'building' },
            { label: t("plan.property-section.construction.type.home"), value: 'home' },
            { label: t("plan.property-section.construction.type.business"), value: 'business' },
            { label: t("plan.property-section.construction.type.other"), value: 'other' }
          ]}
          onChange={(e) => setformPlan({ ...formPlan, constructionType: e.value })}
          placeholder={t("plan.property-section.construction.construction-type-placeholder")}
          className="w-full"
        />
      )}

      {formPlan.propertyType?.code === "7" && (
        <>
          <div className="mb-4">
            <TextField
              id="businessType"
              label={t("plan.property-section.business.business-type-label")}
              variant="outlined"
              placeholder={t("plan.property-section.business.business-type-placeholder")}
              fullWidth
              value={formPlan.businessType}
              onChange={(e) => setformPlan({ ...formPlan, businessType: e.target.value })}
              margin="normal"
            />
          </div>
        </>
      )}

      <TextField
        id="propertySize"
        label={t("plan.property-section.property_size_label")}
        variant="outlined"
        placeholder={t("plan.property-section.property_size_placeholder")}
        fullWidth
        margin="normal"
        required
        value={formPlan.propertySize}
        onChange={(e) => setformPlan({ ...formPlan, propertySize: e.target.value })}
      />
      
      {/* Campo de texto para la dirección de la propiedad */}
 
      <TextField
        id="propertyAddress"
        label={t("plan.property-section.property_address_label")}
        variant="outlined"
        placeholder={t("plan.property-section.property_address_placeholder")}
        fullWidth
        margin="normal"
        required
        value={formPlan.propertyAddress}
        onFocus={handleAddressFieldFocus}
        onChange={(e) => setformPlan({ ...formPlan, propertyAddress: e.target.value })}
      />

      {/* Renderiza condicionalmente el componente del mapa */}
      {isAddressFieldFocused && (
        <div className="my-5">
          <label className="font-bold block mb-2">
            {t("plan.property-section.maps-title")}
          </label>
          <AddressAutocompleteMap onSelectAddress={handleSelectAddress} />
        </div>
      )}
     
    </>
  );
};

const PlanInformation = ({ formPlan, setformPlan }) => {
  const { t, i18n } = useTranslation("global");
  const cameraOptions = [
    { label: t("plan.plan_section.cameras-property.camera-type.camera-type-ip"), value: 'IP' },
    { label: t("plan.plan_section.cameras-property.camera-type.camera-type-analog"), value: 'Analog' }
  ];
  const InternetSharedOptions = [
    { label: t("plan.plan_section.property-internet.type-of-internet.shared"), value: 'Shared' },
    { label: t("plan.plan_section.property-internet.type-of-internet.dedicated"), value: 'Dedicated' }
  ];

  const internetSpeedOptions = [
    { label: t("plan.plan_section.property-internet.internet-speed.options.0-50mbps"), value: '0-50mbps' },
    { label: t("plan.plan_section.property-internet.internet-speed.options.50-100mbps"), value: '50-100mbps' },
    { label: t("plan.plan_section.property-internet.internet-speed.options.100-200mbps"), value: '100-200mbps' },
    { label: t("plan.plan_section.property-internet.internet-speed.options.200-500mbps"), value: '200-500mbps' },
    { label: t("plan.plan_section.property-internet.internet-speed.options.500-900mbps"), value: '500-900mbps' },
    { label: t("plan.plan_section.property-internet.internet-speed.options.more-1gb"), value: 'more-1gb' }
  ];

  const internetProviderOptions = [
    { label: t("plan.plan_section.property-internet.internet-provider.options.CenturyLink"), value: 'CenturyLink' },
    { label: t("plan.plan_section.property-internet.internet-provider.options.AT&T"), value: 'AT&T' },
    { label: t("plan.plan_section.property-internet.internet-provider.options.GoogleFiber"), value: 'GoogleFiber' },
    { label: t("plan.plan_section.property-internet.internet-provider.options.Verizon"), value: 'Verizon' },
    { label: t("plan.plan_section.property-internet.internet-provider.options.Xfinity"), value: 'Xfinity' },
    { label: t("plan.plan_section.property-internet.internet-provider.options.Spectrum"), value: 'Spectrum' },
    { label: t("plan.plan_section.property-internet.internet-provider.options.Cox"), value: 'Cox' },
    { label: t("plan.plan_section.property-internet.internet-provider.options.Optimum"), value: 'Optimum' },
    { label: t("plan.plan_section.property-internet.internet-provider.options.Tigo"), value: 'Tigo' },
    { label: t("plan.plan_section.property-internet.internet-provider.options.Movistar"), value: 'Movistar' },
    { label: t("plan.plan_section.property-internet.internet-provider.options.Claro"), value: 'Claro' },
    { label: t("plan.plan_section.property-internet.internet-provider.options.ETB"), value: 'ETB' },
    { label: t("plan.plan_section.property-internet.internet-provider.options.otros"), value: 'otros' }
  ];

  // Manejador para el cambio en el estado del Camaras
  const handleCamerasInstalledChange = (e) => {
    setformPlan({ ...formPlan, camerasInstalled: e.value });
  };

  // Manejador para el cambio en el estado del servicio de internet
  const handleInternetChange = (e) => {
    setformPlan({ ...formPlan, internet: e.value });
  };

  return (
    <>
      <div className=" flex  flex-col lg:flex-row gap-3 w-full">
        <div className=" flex flex-col">
          <label htmlFor="username">{t("plan.plan_section.number_cameras")}</label>
          <InputNumber
            inputStyle={{ width: "130px" }}
            className="w-2/3"
            id="username"
            aria-describedby="username-help"
            mode="decimal"
            required
            showButtons
            min={5}
            max={500}
            value={formPlan.numCameras}
            onValueChange={(e) => {
              const newValue = Math.max(e.value, 5);
              setformPlan({ ...formPlan, numCameras: newValue });
            }}
          />
        </div>

        <div className="w-5"> </div>

        <div className=" flex flex-col ">
          <label htmlFor="username">{t("plan.plan_section.hours_monitoring")}</label>
          <InputNumber
            inputStyle={{ width: "130px" }}
            className="w-2/3"
            id="username"
            aria-describedby="username-help"
            mode="decimal"
            value={formPlan.numHours}
            showButtons
            onValueChange={(e) =>
              setformPlan({ ...formPlan, numHours: e.value })
            }
            min={6}
            max={24}
          />

        </div>
      </div>

      <div className="my-5">
        <div>{t("plan.plan_section.cameras-property.cameras-in-property")}</div>
        <InputSwitch
          checked={formPlan.camerasInstalled}
          onChange={handleCamerasInstalledChange}
          id="cameras-installed"
          name="cameras-installed"
        />
      </div>

      {/* Condición para mostrar campos adicionales si camerasInstalled es true */}
      {formPlan.camerasInstalled && (
        <div className="flex flex-col lg:flex-row grid gap-4 grid-cols-2 w-full">
          {/* Campo para el número de cámaras ya instaladas */}
          <div className="flex flex-col">
            <label htmlFor="existing-cameras">{t("plan.plan_section.cameras-property.existing-cameras")}</label>
            <InputNumber
              inputStyle={{ width: "130px" }}
              className="w-2/3"
              id="existing-cameras"
              value={formPlan.existingCameras}
              onValueChange={(e) => setformPlan({ ...formPlan, existingCameras: e.value })}
              required
              min={1}
              max={500}
              showButtons
            />
          </div>

          {/* Dropdown para seleccionar IP o Análoga */}
          <div className="flex flex-col">
            <label htmlFor="camera-type">{t("plan.plan_section.cameras-property.camera-type.camera-type-tittle")}</label>
            <Dropdown
              value={formPlan.cameraType}
              options={cameraOptions}
              onChange={(e) => setformPlan({ ...formPlan, cameraType: e.value })}
              placeholder={t("plan.plan_section.cameras-property.camera-type.camera-type-tittle")}
            />
          </div>

          {/* Nuevo campo para la marca de las cámaras */}
          <div className="flex flex-col">
     
            <label htmlFor="camera-brand">{t("plan.plan_section.cameras-property.camera-brand.title")}</label>
            <InputText
              id="camera-brand"
              value={formPlan.cameraBrand}
              onChange={(e) => setformPlan({ ...formPlan, cameraBrand: e.target.value })}
              placeholder={t("plan.plan_section.cameras-property.camera-brand.placeholder")}
            />

            
          </div>

        </div>
      )}

      {/* Interruptor para servicio de internet */}
      <div className="my-5">
        <div>{t("plan.plan_section.property-internet.property-internet-tittle")}</div>
        <InputSwitch
          checked={formPlan.internet}
          onChange={handleInternetChange}
          id="internet-service"
          name="internet-service"
        />
      </div>

      {/* Condición para mostrar campos adicionales si internet es true */}
      {formPlan.internet && (
        <div className="flex flex-wrap w-full">
          {/* Contenedor para la primera fila de dropdowns */}
          <div className="flex flex-row w-full">
            {/* Campo para la velocidad del internet */}
            <div className="w-1/2 p-2">
              <label htmlFor="internet-speed">{t("plan.plan_section.property-internet.internet-speed.title")}</label>
              <Dropdown
                value={formPlan.internetSpeed}
                options={internetSpeedOptions}
                onChange={(e) => setformPlan({ ...formPlan, internetSpeed: e.value })}
                placeholder={t("plan.plan_section.property-internet.internet-speed.placeholder")}
                className="w-full"
              />
            </div>

            {/* Campo para la compañía de internet */}
            <div className="w-1/2 p-2">
              <label htmlFor="internet-provider">{t("plan.plan_section.property-internet.internet-provider.title")}</label>
              <Dropdown
                id="internet-provider"
                value={formPlan.internetProvider}
                options={internetProviderOptions}
                onChange={(e) => setformPlan({ ...formPlan, internetProvider: e.value })}
                placeholder={t("plan.plan_section.property-internet.internet-provider.placeholder")}
                className="w-full"
              />
            </div>
          </div>

          {/* Contenedor para la segunda fila de dropdowns */}
          <div className="flex flex-row w-full items-center">
            {/* Campo para la cantidad de ubicaciones */}
            <div className="w-1/2 p-2">
              <label htmlFor="locations-count">
                {t("plan.plan_section.property-internet.locations-count")}
              </label>
              <InputNumber
                id="locations-count"
                inputStyle={{ width: "100%" }}
                value={formPlan.locationsCount}
                onValueChange={(e) => setformPlan({ ...formPlan, locationsCount: e.value })}
                required
                min={1}
                showButtons
                className="w-full custom-height" // Clase CSS personalizada para la altura
              />
            </div>

            {/* Campo para determinar si el internet es compartido o dedicado */}
            <div className="w-1/2 p-2">
              <label htmlFor="internet-type">
                {t("plan.plan_section.property-internet.type-of-internet.title")}
              </label>
              <Dropdown
                value={formPlan.internetType}
                options={InternetSharedOptions}
                onChange={(e) => setformPlan({ ...formPlan, internetType: e.value })}
                placeholder={t("plan.plan_section.property-internet.type-of-internet.placeholder")}
                className="custom-margin" // Clase CSS personalizada para la altura
              />
            </div>
          </div>
        </div>
      )}
      <div className="my-5">
        <div>{t("plan.plan_section.control-acces")}</div>
        <InputSwitch
          checked={formPlan.ControlAcces}
          onChange={(e) => setformPlan({ ...formPlan, ControlAcces: e.value })}
          id="value"
          name="value"
        />
      </div>
    </>
  );
};

function GetStepContent(step) {
  const { formPlan, setformPlan } = useContext(FormContext);
  switch (step) {
    case 0:
      return <First formPlan={formPlan} setformPlan={setformPlan} />;
    case 1:
      return <PlanInformation formPlan={formPlan} setformPlan={setformPlan} />;

    case 2:
      return <BasicForm formPlan={formPlan} setformPlan={setformPlan} />;
    case 3:
      return <PropertyForm formPlan={formPlan} setformPlan={setformPlan} />;
    case 4:
      return <ContactForm formPlan={formPlan} setformPlan={setformPlan} />;
    default:
      return "unknown step";
  }
}

export const MultiStepForm = () => {
  const { t, i18n } = useTranslation("global");
  const serviceId = "service_l6maf0k";
  const templateId = "template_7pr1w3x";
  let apiKey = process.env.REACT_APP_EMAILJS_API_KEY;
  
  const sendEmail = () => {

    let formulario = document.createElement("form");
    let inputName = document.createElement("input");
    inputName.setAttribute("name", "name")
    inputName.setAttribute("value", formPlan.name)

    let inputLastName = document.createElement("input");
    inputLastName.setAttribute("name", "lastName")
    inputLastName.setAttribute("value", formPlan.lastName)
  
    let propertyName = document.createElement("input");
    propertyName.setAttribute("name", "propertyName")
    propertyName.setAttribute("value", formPlan.propertyName)

    let propertyType = document.createElement("input");
    propertyType.setAttribute("name", "propertyType")
    propertyType.setAttribute("value", formPlan.propertyType.name)

    let country = document.createElement("input");
    country.setAttribute("value", formPlan.country)
    country.setAttribute("name", "country")

    let state = document.createElement("input");
    state.setAttribute("name", "state")
    state.setAttribute("value", formPlan.state)

    let city = document.createElement("input");
    city.setAttribute("name", "city")
    city.setAttribute("value", formPlan.city)

    let propertyAddress = document.createElement("input");
    propertyAddress.setAttribute("name", "propertyAddress")
    propertyAddress.setAttribute("value", formPlan.propertyAddress)

    let propertySize = document.createElement("input");
    propertySize.setAttribute("name", "propertySize")
    propertySize.setAttribute("value", formPlan.propertySize)

    let propertyDetail = document.createElement("input");
    propertyDetail.setAttribute("name", "propertyDetail");
    propertyDetail.setAttribute("value", formPlan.propertyType?.code === "1" ? formPlan.propertyDetail : "N/A");

    let units = document.createElement("input");
    units.setAttribute("name", "units");
    units.setAttribute("value", formPlan.propertyType?.code === "1" ? formPlan.units : "N/A");

    let list = ""
    formPlan.selectedCategories?.forEach(element => {
      list += ` "${element.name}" `
    })

    let selectedCategories = document.createElement("input");
    selectedCategories.setAttribute("name", "selectedCategories")
    selectedCategories.setAttribute("value", list)

    let numHours = document.createElement("input");
    numHours.setAttribute("name", "numHours")
    numHours.setAttribute("value", formPlan.numHours)

    let numCameras = document.createElement("input");
    numCameras.setAttribute("name", "numCameras")
    numCameras.setAttribute("value", formPlan.numCameras)

    let existingCameras = document.createElement("input");
    existingCameras.setAttribute("name", "existingCameras");
    existingCameras.setAttribute("value", formPlan.camerasInstalled ? formPlan.existingCameras : "N/A");
  
    let cameraType = document.createElement("input");
    cameraType.setAttribute("name", "cameraType");
    cameraType.setAttribute("value", formPlan.camerasInstalled ? formPlan.cameraType : "N/A");
   
    let cameraBrand = document.createElement("input");
    cameraBrand.setAttribute("name", "cameraBrand");
    cameraBrand.setAttribute("value", formPlan.camerasInstalled ? formPlan.cameraBrand : "N/A");

    let internetSpeed = document.createElement("input");
    internetSpeed.setAttribute("name", "internetSpeed");
    internetSpeed.setAttribute("value", formPlan.internet ? formPlan.internetSpeed : "N/A");
   
    let internetType = document.createElement("input");
    internetType.setAttribute("name", "internetType");
    internetType.setAttribute("value", formPlan.internet ? formPlan.internetType : "N/A");
    
    let locationsCount = document.createElement("input");
    locationsCount.setAttribute("name", "locationsCount");
    locationsCount.setAttribute("value", formPlan.internet ? formPlan.locationsCount : "N/A");
    
    let internetProvider = document.createElement("input");
    internetProvider.setAttribute("name", "internetProvider");
    internetProvider.setAttribute("value", formPlan.internet ? formPlan.internetProvider : "N/A");
  
    let businessType = document.createElement("input");
    businessType.setAttribute("name", "businessType");
    businessType.setAttribute("value", formPlan.propertyType?.code === "7" ? formPlan.businessType : "N/A");

    let constructionType = document.createElement("input");
    constructionType.setAttribute("name", "constructionType");
    constructionType.setAttribute("value", formPlan.propertyType?.code === "4" ? formPlan.constructionType : "N/A");
      
    let ControlAcces = document.createElement("input")
    ControlAcces.setAttribute("name", "ControlAcces")
    ControlAcces.setAttribute("value", formPlan.ControlAcces)

    let email = document.createElement("input");
    email.setAttribute("name", "email")
    email.setAttribute("value", formPlan.email)

    let phone = document.createElement("input");
    phone.setAttribute("name", "phone")
    phone.setAttribute("value", formPlan.phone)

    let alternativePhone = document.createElement("input");
    alternativePhone.setAttribute("name", "alternativePhone")
    alternativePhone.setAttribute("value", formPlan.alternativePhone)
    
    let camerasInstalled = document.createElement("input");
    camerasInstalled.setAttribute("name", "camerasInstalled")
    camerasInstalled.setAttribute("value", formPlan.camerasInstalled ? "Si" : "No")

    let internet = document.createElement("input");
    internet.setAttribute("name", "internet")
    internet.setAttribute("value", formPlan.internet ? "Si" : "No")

    let textArea = document.createElement("input");
    textArea.setAttribute("name", "textArea")
    textArea.setAttribute("value", formPlan.textArea)

    formulario.appendChild(inputName);
    formulario.appendChild(inputLastName);
    formulario.appendChild(propertyName);
    formulario.appendChild(propertyType);
    formulario.appendChild(country);
    formulario.appendChild(state);
    formulario.appendChild(city);
    formulario.appendChild(propertyAddress);
    formulario.appendChild(propertySize);
    formulario.appendChild(propertyDetail);
    formulario.appendChild(constructionType);
    formulario.appendChild(numHours);
    formulario.appendChild(numCameras);
    formulario.appendChild(email);
    formulario.appendChild(phone);
    formulario.appendChild(alternativePhone);
    formulario.appendChild(camerasInstalled);
    formulario.appendChild(internet);
    formulario.appendChild(textArea);
    formulario.appendChild(selectedCategories);
    formulario.appendChild(existingCameras);
    formulario.appendChild(cameraType);
    formulario.appendChild(cameraBrand);
    formulario.appendChild(internetSpeed);
    formulario.appendChild(internetType);
    formulario.appendChild(locationsCount);
    formulario.appendChild(units);
    formulario.appendChild(businessType);
    formulario.appendChild(internetProvider);
    formulario.appendChild(ControlAcces);
    emailjs.sendForm(serviceId, templateId, formulario, apiKey)
      .then((res) => console.log("Good"))
      .catch((error) => console.log("Bad"));
  };

  const classes = useStyles();
  const methods = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      nickName: "",
      emailAddress: "",
      phoneNumber: "",
      alternatePhone: "",
      address1: "",
      address2: "",
      country: "",
      cardNumber: "",
      cardMonth: "",
      cardYear: "",
    },
  });
  const [activeStep, setActiveStep] = useState(0);
  const [skippedSteps, setSkippedSteps] = useState([]);

  const steps = getSteps(t);

  const isStepOptional = (step) => {
    return step === 1 || step === 2;
  };

  const isStepSkipped = (step) => {
    return skippedSteps.includes(step);
  };

  const handleNext = (data) => {
    const categorySelected = formPlan.selectedCategories.length > 0;
    if (!categorySelected) {
      Swal.fire("", t("plan.categories.oneAtLeast"), "info")
      return;
    }
    if (activeStep === 3) {
      if (formPlan.propertyType === "") {
        Swal.fire("", t("plan.property-section.empty_property_text"), "info")
        return;
      }
    }

    if (activeStep === steps.length - 1) {
      fetch("https://jsonplaceholder.typicode.com/comments")
        .then((data) => data.json())
        .then((res) => {
          setTimeout(() => {
            setActiveStep(activeStep + 1);
          }, 150);
        });
    } else {
      setTimeout(() => {
        setActiveStep(activeStep + 1);
        setSkippedSteps(
          skippedSteps.filter((skipItem) => skipItem !== activeStep)
        );
      }, 150);
    }
  };

  const handleBack = () => {
    setTimeout(() => {
      setActiveStep(activeStep - 1);
    }, 150);
  };

  const handleSkip = () => {
    if (!isStepSkipped(activeStep)) {
      setSkippedSteps([...skippedSteps, activeStep]);
    }
    setActiveStep(activeStep + 1);
  };
  
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const onCaptchaChange = (value) => {
    setCaptchaVerified(value ? true : false);
    
  };
  const handleFinishClick = () => {
    if (captchaVerified) {
      sendEmail();
    } else {
      alert(t("plan.form_button.recaptcha"));
    }
  };
  const { formPlan, setformPlan } = useContext(FormContext);
  return (
    <>
      {/* <div className="w-full h-screen bg-hero-magnolia bg-no-repeat bg-cover bg-center pt-12 "> */}
      <div className="w-full mx-auto  bg-white p-5 rounded-md">
        <div className="hidden sm:block">
          <Stepper alternativeLabel activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps = {};
              const stepProps = {};
              if (isStepOptional(index)) {
                labelProps.optional = (
                  <Typography
                    variant="caption"
                    align="center"
                    style={{ display: "block" }}
                  ></Typography>
                );
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step {...stepProps} key={index}>
                  <StepLabel {...labelProps}>{step}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </div>

        {activeStep === steps.length ? (
          <div className="flex flex-col items-center justify-center my-10">
            <div>
              <TextAnimation />
            </div>
            <div className="h-3"><br></br></div>
            <Typography align="center" className="flex  mt-8">
              <AiFillCheckCircle className="text-yellow-600 text-2xl h-12 w-12" />
              {t("plan.plan_section_finish.text_finish")}
            </Typography>
            <Link target="_top" to={"/"}>
              <Button className={classes.button}>{t("plan.form_button.back_home")}</Button>
            </Link>
          </div>
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleNext)}>
              {GetStepContent(activeStep)}

              {activeStep === steps.length - 1 && (
                // Componente ReCAPTCHA justo antes de los botones
                <ReCAPTCHA
                  sitekey="6LcxI1gpAAAAAEh-Qqt8Ix_FZiGntDZARU-TceYJ"
                  onChange={onCaptchaChange}
                />
              )}

              <div className="flex justify-between"> {/* Asegúrate de que los botones estén en un contenedor flex */}
                <Button
                  className={classes.button}
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  {t("plan.form_button.back")}
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button
                    className={classes.button}
                    variant="contained"
                    type="submit"
                    onClick={handleFinishClick}
                    disabled={!captchaVerified}
                  >
                    {t("plan.form_button.finish")}
                  </Button>
                ) : (
                  <Button
                    className={classes.button}
                    variant="contained"
                    type="submit"
                  >
                    {t("plan.form_button.next")}
                  </Button>
                )}
              </div>
            </form>
          </FormProvider>
        )}
      </div>
    </>
  );
};
