import React, { useContext, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AiFillFilePdf, AiFillEdit, AiFillCheckCircle, AiFillNotification, AiFillWechat } from "react-icons/ai";
import { FiCreditCard, FiStar, FiShoppingCart, } from "react-icons/fi";
import { FaSpinner } from 'react-icons/fa';
import { BsCurrencyDollar, BsShield, BsChatLeft, } from "react-icons/bs";
import { HiOutlineEye, HiStatusOffline, HiStatusOnline, } from "react-icons/hi";
import { TiDeleteOutline, TiTick } from "react-icons/ti";
import { GiPoliceCar } from "react-icons/gi";
import { GrLocation } from "react-icons/gr";
import avatar2 from "./avatar2.jpg";
import avatar3 from "./avatar3.png";
import avatar4 from "./avatar4.jpg";
import product1 from "./product1.jpg";
import product2 from "./product2.jpg";
import product3 from "./product3.jpg";
import product4 from "./product4.jpg";
import product5 from "./product5.jpg";
import product6 from "./product6.jpg";
import product7 from "./product7.jpg";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { TbDeviceCctv } from "react-icons/tb";
import { MdDelete, MdOutlineAddCircleOutline } from "react-icons/md";
import { deleteCamera, deleteItem, deleteProperty, } from "../helper/delete";
import Swal from "sweetalert2";
import { SiDialogflow } from "react-icons/si";
import { postNewAgent } from "../helper/postNewAgent";
import { postIncident } from "../helper/postIncident";
import { toggleReportVerification } from "../helper/toggleReportVerification";
import exportPDF from "../helper/exportPdf";
import deleteReport from "../helper/Reports/dataTables/deleteReport";
import { t } from "i18next";
import { putAddPropertyUser } from "../helper/userProfile/properties/putAddPropertyUser";
import putDeletePropertyToUser from "../helper/userProfile/properties/putDeletePropertyToUser";
import { postCasesSoftDelete } from "../helper/postCasesSoftDelete";

export const useGlobalTranslation = () => {
  return useTranslation("global");
};

export const gridUserImage = ({ UserImage }) => {

  return (
    <div>
      <img
        className="rounded-xl w-20 h-20  md:ml-3"
        src={UserImage}
        alt="order-item"
      />
    </div>
  )
};

export const gridOrderImageAgent = ({ ImageUrl }) => {
  return (
    <div className="flex justify-center items-center h-full">

      <img src={ImageUrl || 'default-placeholder.png'}
        alt="No Agent"
        className="rounded-xl w-20 h-20 md:ml-3"
      />
    </div>
  );
};

export const gridOrderImage = ({ evidences }) => {
  const srcNoImage = `${process.env.REACT_APP_S3_BUCKET_URL}/Resources/NoImage.png`;


  const images = evidences.filter(evidence => evidence.type === "image");

  if (!images || images.length === 0 || !images[0]) {
    return (
      <div>
        <img
          className="rounded-xl w-20 h-20 md:ml-3"
          src={srcNoImage}
          alt="No evidence"
        />
      </div>
    );
  }

  const imgEvidence = `${process.env.REACT_APP_S3_BUCKET_URL}/${images[0].path}`;

  return (
    <div>
      <img
        className="rounded-xl w-20 h-20 md:ml-3"
        src={imgEvidence}
        alt="order-item"
        style={{ borderRadius: '10%' }}
      />
    </div>
  );
};


export const GridPropertyImage = ({ propertyImage }) => {
  const imageUrl = propertyImage ? `${process.env.REACT_APP_S3_BUCKET_URL}/${propertyImage}` : "default-placeholder.png";
  return (
    <div>
      <img
        className="rounded-xl w-20 h-20 md:ml-3"
        src={imageUrl}
        alt="Property Image"
      />
    </div>
  );
};

export const gridOrderProperties = (props) => {
  return (
    <a className="flex justify-center m-0 p-0 cursor-pointer">
      Detalles
    </a>
  );
};
/*export const gridOrderProperties = (props) => {

  if (props.lenght > 3) {
    return (
      <ol>
        {props?.map((i) => {
          (
            <li> {i.name}</li>
          )
        })}
      </ol>)

  } else {
    return (
      <li className="flex justify-center m-0 p-0 cursor-pointer">
        <SiDialogflow onClick={() => {


          let propertiesList = []
          console.log(props.user)
          console.log(props.user.properties)
          propertiesList = props.user.properties?.map(property => (`<li>${property.name}</li>`))
          console.log(propertiesList)
          Swal.fire({
            title: '<strong>Properties</strong>',
            icon: 'success',
            html:
              '<h1 class=""></h1>' +
              propertiesList

          })
        }}></SiDialogflow>
      </li>
    );

  }

};
*/

export const GridNotification = (props) => {
  const { t } = useGlobalTranslation();
  const handleClick = () => {
    console.log(props)
  }
  
  return (
    <button className="flex justify-center m-0 p-0">
      <AiFillWechat onClick={handleClick} className="text-2xl text-[#2465d5] cursor-pointer"></AiFillWechat>
    </button>
  );
};

export const GridPdf = (props) => {
  const { t } = useGlobalTranslation();
  const handlePDFClick = async () => {
    if (!props.id) {
      console.log(props)
      Swal.fire(t("dashboard.reports.table.admin.no-pdf"));
    } else {
      console.log("Esto es la data del PDF:", props);
      try {
        await exportPDF(props);
      } catch (error) {
        console.error('Error al generar el PDF:', error);
        Swal.fire(t("Error"), t("dashboard.reports.table.admin.pdf-error"), "error");
      }
    }
  };

  return (
    <button onClick={handlePDFClick} className="flex justify-center m-0 p-0">
      <AiFillFilePdf className="text-lg text-red-600"></AiFillFilePdf>
    </button>
  );
};

export const GridDetails = (props) => {
  let id = props?.id;
  return (
    <Link
      className="flex justify-center m-0 p-0"
      to={`/dashboard/report-details/${id}`}
    >
      <HiOutlineEye className="text-lg "></HiOutlineEye>
    </Link>
  );
};

export const GridIsVerified = ({ verified }) => {
  if (verified) {
    return (
      <div className="flex justify-center m-0 p-0 text-lg text-green-600">
        <AiFillCheckCircle></AiFillCheckCircle>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center m-0 p-0 text-lg text-red-600">
        <TiDeleteOutline></TiDeleteOutline>
      </div>
    );
  }
};

// Plantilla para mostrar el estado del reporte y actualizar su estado
export const GridisVerifiedAndVerification = ({ id, verified: initialVerified }) => {
  const [t, i18n] = useTranslation("global");
  const [verified, setVerified] = useState(initialVerified);

  useEffect(() => {
    setVerified(initialVerified);
  }, [initialVerified]);

  const handleToggleVerification = async () => {
    if (verified) {
      const newVerifiedStatus = await toggleReportVerification(id, verified, t);
      setVerified(newVerifiedStatus);
    }
  };

  return (
    <div key={Math.random()} className="flex justify-center m-0 p-0 text-lg cursor-pointer" onClick={handleToggleVerification}>
      {verified ? (
        <AiFillCheckCircle className="text-green-600" />
      ) : (
        <TiDeleteOutline className="text-red-600" />
      )}
    </div>
  );
};


export const GridEditReportTemplate = (props) => {

  const { setReportForm } = useContext(UserContext);
  const navigate = useNavigate();

  const handleEditClick = () => {
    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      const [month, day, year] = dateStr.split('-');
      return new Date(year, month - 1, day);
    };

    const parseTime = (timeStr, dateStr) => {
      if (!timeStr || !dateStr) return null;
      const [hours, minutes] = timeStr.split(':');
      const [month, day, year] = dateStr.split('-');
      return new Date(year, month - 1, day, hours, minutes);
    };

    const formattedProps = {
      ...props,
      dateOfReport: parseDate(props.dateOfReport),
      timeOfReport: parseTime(props.timeOfReport, props.dateOfReport),
      incidentDate: parseDate(props.incidentDate),
      incidentStartTime: parseTime(props.incidentStartTime, props.incidentDate),
      incidentEndTime: parseTime(props.incidentEndTime, props.incidentDate)
    };
    console.log("GridEditReportTemplate props:", props);

    setReportForm(formattedProps);
    navigate('/dashboard/EditReport');
  };

  if (!props || !props.id) {
    return <div className="flex justify-center"><p>No hay datos</p></div>;
  }

  return (
    <div className="flex justify-center m-0 p-0 cursor-pointer" onClick={handleEditClick}>
      <AiFillEdit className="text-lg" />
    </div>
  );
};



const GridEditCamera = ({ camera, setSelectedCamera }) => {

  const showCameraToEdit = () => {
    setSelectedCamera(camera);
  };

  return (
    <div className="cursor-pointer flex justify-center m-0 p-0" onClick={showCameraToEdit}>
      <AiFillEdit className="text-lg" />
    </div>
  );
};

const GridEditProperty = ({ property, handleOpenEditPropertyDialog }) => {
  const handleEditClick = () => {
    if (property) {
      handleOpenEditPropertyDialog(property);
    }
  };

  return (
    <div onClick={handleEditClick} className="cursor-pointer flex justify-center m-0 p-0">
      <AiFillEdit className="text-lg" />
    </div>
  );
};


export const GridEdit = ({ incident, translate }) => {
  const {
    caseProvider,
    setCaseProvider,
    caseDialog,
    setCaseDialog,
    editCase,
    setEditCase,
  } = useContext(UserContext);

  return (
    <div
      onClick={() => {
        setCaseProvider({
          ...caseProvider,
          incident: incident,
          translate: translate
        });
        setCaseDialog(!caseDialog);
        setEditCase(true);
        console.log(incident);
        console.log(translate);

      }}
      className="flex justify-center m-0 p-0 cursor-pointer"
    >
      <AiFillEdit className="text-lg"></AiFillEdit>
    </div>
  );
};


export const GridAgentEdit = ({ agent }) => {
  const { agentProvider, setagentProvider, agentDialog, setAgentDialog } =
    useContext(UserContext);

  return (
    <div
      onClick={() => {
        setagentProvider(agent);
        console.log(agent);
        setAgentDialog(!agentDialog);
      }}
      className="flex justify-center m-0 p-0 cursor-pointer"
    >
      <AiFillEdit className="text-lg"></AiFillEdit>
    </div>
  );
};
export const GridPropertyEdit = ({ property }) => {
  const { propertyProvider, setPropertyProvider, agentDialog, setAgentDialog } =
    useContext(UserContext);

  return (
    <div
      onClick={() => {
        setPropertyProvider(property);

        setAgentDialog(!agentDialog);
      }}
      className="flex justify-center m-0 p-0 cursor-pointer"
    >
      <AiFillEdit className="text-lg"></AiFillEdit>
    </div>
  );
};


export const GridDelete = ({ id }) => {
  const url = `${process.env.REACT_APP_SERVER_IP}/users`;
  const navigate = useNavigate();
  const { flag, setFlag } = useContext(UserContext);
  const { t } = useTranslation("global");

  const deleteItemFunction = () => {
    Swal.fire({
      title: t("dashboard.users.delete.confirmTitle"),
      text: t("dashboard.users.delete.confirmText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: t("dashboard.users.delete.confirmButton"),
      cancelButtonColor: '#d33',
      cancelButtonText: t('dashboard.users.delete.cancel-button')
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem(url, id, flag, setFlag)
          .then(() => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: t('dashboard.users.delete.user-removed'),
              showConfirmButton: false,
              timer: 3000
            });
            setFlag(!flag);
          })
          .catch(error => {
            Swal.fire(
              t('Error!'),
              t('dashboard.users.delete.error-deleting-user'),
              'error'
            );
          });
      }
    });
  };


  return (
    <div
      onClick={() => {
        deleteItemFunction()
      }}
      className="flex justify-center m-0 p-0 text-red-700"
    >
      <MdDelete className="text-lg "></MdDelete>
    </div>
  );
};


export const GridDeleteReport = ({ id, setRefreshReports }) => {
  const { t } = useTranslation("global");

  const handleDelete = async () => {
    const success = await deleteReport(id, t);
    if (success) {

      setRefreshReports(prevState => !prevState)

    }
  };

  return (
    <div onClick={handleDelete} className="flex justify-center m-0 p-0 text-red-700">
      <MdDelete className="text-lg" />
    </div>
  );
};



export const GridDeleteAgents = ({ agent }) => {
  let url = `${process.env.REACT_APP_SERVER_IP}/agents`;
  const { navigate } = useNavigate();
  const { flag, setFlag } = useContext(UserContext);

  const deleteAgent = async () => {
    agent.deleted = true;
    console.log(agent)
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e6c200",
      cancelButtonColor: "gray",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        postNewAgent(agent).then(
        );
        setFlag(!flag)
      }
    });


  }
  return (
    <div
      onClick={() => {
        deleteAgent()
      }}
      className="flex justify-center m-0 p-0 text-red-700"
    >
      <MdDelete className="text-lg "></MdDelete>
    </div>
  );
};


export const GridDeleteCase = (caseType) => {
 
  const { setreportSaved, reportSaved } = useContext(UserContext);
  const { t } = useTranslation("global");

  const confirmDeletion = () => {
    
    Swal.fire({
      title: t('dashboard.cases.table.delete.swal.confirmation'),
      text: t("dashboard.cases.table.delete.swal.delete-case"),
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: t('dashboard.cases.table.delete.swal.yes'),
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: t('dashboard.cases.table.delete.swal.no')
    }).then((result) => {
      if (result.isConfirmed) {
        postCasesSoftDelete(caseType, setreportSaved, reportSaved, t);
      }
    });
  };

  return (
    <div
      onClick={confirmDeletion}
      className="flex justify-center m-0 p-0 text-red-700 cursor-pointer"
    >
      <MdDelete className="text-lg" />
    </div>
  );
};

export const GridDeleteProperty = ({ property }) => {
  const url = `${process.env.REACT_APP_SERVER_IP}/properties/${property.id}`;
  const { setFlag } = useContext(UserContext);
  const [t, i18n] = useTranslation("global");
  const confirmDeletion = () => {
    Swal.fire({
      title: t('dashboard.properties.table.delete.swal.confirmation'),
      text: t("dashboard.properties.table.delete.swal.delete-property"),
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: t('dashboard.properties.table.delete.swal.yes'),
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: t('dashboard.properties.table.delete.swal.no')
    }).then((result) => {
      if (result.isConfirmed) {
       
        deleteProperty();
      }
    });
  };

  const deleteProperty = async () => {
    try {
      
      const response = await fetch(url, { method: 'DELETE' });
      if (response.ok) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: t('dashboard.properties.table.delete.swal.property-removed'),
          showConfirmButton: false,
          timer: 3000
        }).then(() => {
          setFlag(flag => !flag); // Solo actualiza el flag cuando el modal se cierra, minimizando re-renderizaciones
        });
      } else {
        throw new Error('Failed to delete the property');
      }
    } catch (error) {
      Swal.fire(
        'Error!',
        'Hubo un problema al eliminar la propiedad.',
        'error'
      );
    }
  };

  return (
    <div onClick={confirmDeletion} className="flex justify-center m-0 p-0 text-red-700">
      <MdDelete className="text-lg" />
    </div>
  );
};

export const GridDeleteCamera = ({ id }) => {
  let url = `${process.env.REACT_APP_SERVER_IP}/cameras`;
  const { cameraSaved, setCameraSaved } = useContext(UserContext);
  const [t, i18n] = useTranslation("global");

  const deleteCameraFunction = () => {

    Swal.fire({
      title: t("dashboard.cameras.table.delete.confirm-title"),
      text: t("dashboard.cameras.table.delete.confirm-text"),
      icon: "warning",
      confirmButtonColor: "#e6c200",
      confirmButtonText: t("dashboard.cameras.table.delete.yes"),
      showCancelButton: true,
      cancelButtonColor: "gray",
      cancelButtonText: t("dashboard.cameras.table.delete.no"),
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCamera(url, id, cameraSaved, setCameraSaved, t).then(

        );
      }
    });
  }
  return (
    <div
      onClick={() => {
        deleteCameraFunction()
      }}
      className="flex justify-center m-0 p-0 text-red-700 cursor-pointer"
    >
      <MdDelete className="text-lg "></MdDelete>
    </div>
  );
};

export const GridLiveView = ({ camera }) => {
  // console.log(LiveView);
  const { cameraContext, setCameraContext } = useContext(UserContext);

  return (
    <Link
      className="flex justify-center m-0 p-0"
      onClick={() => {
        setCameraContext(camera);
      }}
      to={`/dashboard/camera/live-view`}
    >
      <HiOutlineEye className="text-lg"></HiOutlineEye>
    </Link>
  );
};

export const gridOrderStatus = (props) => (
  <button
    type="button"
    style={{ background: props.StatusBg }}
    className="text-white py-1 px-2 capitalize rounded-2xl text-md"
  >
    {props.status}
  </button>
);

export const kanbanGrid = [
  { headerText: "To Do", keyField: "Open", allowToggle: true },

  { headerText: "In Progress", keyField: "InProgress", allowToggle: true },

  {
    headerText: "Testing",
    keyField: "Testing",
    allowToggle: true,
    isExpanded: false,
  },

  { headerText: "Done", keyField: "Close", allowToggle: true },
];


const gridCameraimage = (props) => {
  const imageURL = `${process.env.REACT_APP_S3_BUCKET_URL}/${props.image}`;
  return (
    <div className="flex items-center gap-2">

      <img
        className="rounded-sm w-full h-full object-cover"
        src={imageURL}
        alt="employee"
        style={{ borderRadius: '10%' }}
      />

    </div>
  );
};



const customerGridImage = (props) => (
  <div className="image flex gap-4">
    <img
      className="rounded-full w-10 h-10"
      src={props.CustomerImage}
      alt="employee"
    />
    <div>
      <p>{props.CustomerName}</p>
      <p>{props.CustomerEmail}</p>
    </div>
  </div>
);

const customerGridStatus = (props) => (
  <div className="flex gap-2 justify-center items-center text-gray-700 capitalize">
    <p
      style={{ background: props.StatusBg }}
      className="rounded-full h-3 w-3"
    />
    <p>{props.level}</p>
  </div>
);




export const cameraGrid = (t) => {
  return [
    {
      headerText: t("dashboard.cameras.table.img"),
      width: "115",
      template: gridCameraimage,
      textAlign: "Center",
    },

    {
      headerText: t("dashboard.cameras.table.name"),
      width: "190",
      field: "name",
      textAlign: "Center"
    },
    {
      headerText: t("dashboard.cameras.table.status"),
      width: "110",
      textAlign: "Center",
      template: gridOrderStatus,
    },
    {
      headerText: t("dashboard.cameras.table.brand"),
      field: "brand",
      width: "100",
      textAlign: "Center"
    },
    {
      field: "LiveView",
      headerText: t("dashboard.cameras.table.details"),
      width: "100",
      textAlign: "Center",
      template: props => < GridLiveView camera={props} />
    },
    {
      field: "type",
      headerText: t("dashboard.cameras.table.type"),
      width: "90",
      textAlign: "Center"
    },
  ]
}

export const cameraGridAdmin = (t, setSelectedCamera, onClose) => {
  return [
    {
      headerText: t("dashboard.cameras.table.img"),
      width: "115",
      template: gridCameraimage,
      textAlign: "Center",
    },

    {
      headerText: t("dashboard.cameras.table.name"),
      width: "190",
      field: "name",
      textAlign: "Center"
    },
    {
      headerText: t("dashboard.cameras.table.status"),
      width: "110",
      textAlign: "Center",
      template: gridOrderStatus,
    },
    {
      headerText: t("dashboard.cameras.table.brand"),
      field: "brand",
      width: "100",
      textAlign: "Center"
    },
    {
      field: "type",
      headerText: t("dashboard.cameras.table.type"),
      width: "90",
      textAlign: "Center"
    },

    {
      field: "LiveView",
      headerText: t("dashboard.cameras.table.details"),
      width: "100",
      textAlign: "Center",
      template: props => < GridLiveView camera={props}/>
    },
    {
      field: "camera",
      headerText: t("dashboard.cameras.table.edit"),
      width: "100",
      textAlign: "Center",
      template: props => <GridEditCamera camera={props} setSelectedCamera={setSelectedCamera} />,
    },
    {
      field: "id",
      headerText: t("dashboard.cameras.table.delete.delete"),
      width: "90",
      textAlign: "Center",
      template: GridDeleteCamera,
    },
  ]
}





export const chatData = [
  {
    image: avatar2,
    message: "Freedom Park Apartments",
    desc: "Congratulate him",
    time: "9:08 AM",
  },
  {
    image: avatar3,
    message: "Aswan Apartments",
    desc: "Cordoba Courts",
    time: "11:56 AM",
  },
  {
    image: avatar4,
    message: "Glorieta Gardens",
    desc: "Check your earnings",
    time: "4:39 AM",
  },

];



const useUserProfileData = () => {
  const [t, i18n] = useTranslation("global");

  const userProfileData = [
    {
      icon: <BsCurrencyDollar />,
      title: t("Contact.contact"),
      desc: t("userProfile.accountSettings"),
      iconColor: "#03C9D7",
      iconBg: "#E5FAFB",
    },
  ];

  return userProfileData;
};
export default useUserProfileData;


// plantilla para los roles de la tabla de usuarios

const roleTemplate = (rowData, t) => {
  return (
    <span>{t(`dashboard.users.table.roles.${rowData.Rol}`)}</span>
  );
};

/*
export const GridUserEdit = ({ user }) => {
  const { userProvider, setUserProvider, userDialog, setUserDialog } =
    useContext(UserContext);

  return (
    <div
      onClick={() => {
        setUserProvider(user);

        setUserDialog(!userDialog);
      }}
      className="flex justify-center m-0 p-0 cursor-pointer"
    >
      <AiFillEdit className="text-lg"></AiFillEdit>
    </div>
  );
};
*/

const PropertiesTemplate = ({ user }) => {

  const [t, i18n] = useTranslation("global");
  const { userProvider, setUserProvider } = useContext(UserContext);
  const handlerClick = () => {
    console.log(user);
    setUserProvider(user);  // Actualiza el contexto con los datos del usuario
    navigate("/dashboard/UserDetails");
  };
  const navigate = useNavigate();
  return (
    <a onClick={() => handlerClick()} className="flex justify-center m-0 p-0 cursor-pointer">
      {t("dashboard.users.table.details")}
    </a>
  );
};

export const userGrid = (t) => {
  return [
    {
      headerText: t("dashboard.users.table.image"),
      template: gridUserImage,
      textAlign: "Center",
      width: "120",
    },
    {
      field: "Name",
      headerText: t("dashboard.users.table.name"),
      width: "170",
      editType: "dropdownedit",
      textAlign: "Center",
    },
    {
      field: "Email",
      headerText: t("dashboard.users.table.email"),
      width: "180",
      editType: "dropdownedit",
      textAlign: "Center",
    },
    {
      field: "Rol",
      headerText: t("dashboard.users.table.rol"),
      width: "100",
      textAlign: "Center",
      template: rowData => roleTemplate(rowData, t),
      editType: "dropdownedit"
    },
    {
      field: "Properties",
      headerText: t("dashboard.users.table.properties"),
      width: "200",
      textAlign: "Center",
      template: PropertiesTemplate,
      //template: gridOrderProperties,
    },
    {
      headerText: t("dashboard.users.table.delete"),
      template: GridDelete,
      textAlign: "Center",
      width: "80",
      field: "id",
    },
  ];
};

export const RemovePropertyToUser = ({ propertyId, userId, fetchProperties, activeView }) => {
  const { t } = useTranslation("global");

  const handleClick = async () => {
    const result = await putDeletePropertyToUser(userId, propertyId, t);
    if (result.success) {
      fetchProperties();
    }
  };


  return (
    <div onClick={handleClick} className="flex justify-center m-0 p-0 text-red-700 cursor-pointer">
      <MdDelete className="text-lg" />
    </div>
  );
};



export const ImgPropertyUsersProfile = (rowData) => {
  const imageURL = `${process.env.REACT_APP_S3_BUCKET_URL}/${rowData.img}`;
  return <img src={imageURL} alt="Property" style={{ width: "100px", height: "auto" }} />;
};

export const propertiesUserGrid = (t, userId, setUserData) => {
  return [

    {
      headerText: t("dashboard.user-details.properties.table.image"),
      template: ImgPropertyUsersProfile,
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.user-details.properties.table.name"),
      field: "name",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.user-details.properties.table.address"),
      field: "direction",
      width: "160",
      editType: "dropdownedit",
      textAlign: "Center",
    },
  ];
};

export const propertiesUserGridAdmin = (t, userId, fetchProperties, activeView) => {
  return [
    {
      headerText: t("dashboard.user-details.properties.table.image"),
      template: ImgPropertyUsersProfile,
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.user-details.properties.table.name"),
      field: "name",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.user-details.properties.table.address"),
      field: "direction",
      width: "160",
      editType: "dropdownedit",
      textAlign: "Center",
    },

    {
      headerText: t("dashboard.user-details.properties.table.remove"),
      template: (props) => <RemovePropertyToUser propertyId={props.id} userId={userId} fetchProperties={fetchProperties} activeView={activeView} />,
      width: "100",
      textAlign: "Center",
    },
  ];
};

export const AddPropertyIconTemplate = ({ data, userId, t, fetchProperties }) => {
  const handleClick = async () => {
    const propertyInfo = {
      id: data.id,
      name: data.name,
      direction: data.direction,
      img: data.img,
      mapImg: data.mapImg
    };

    const result = await putAddPropertyUser(userId, [propertyInfo], t);
    if (result.success) {
      fetchProperties();
    }
  };
  return (
    <div onClick={handleClick} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1.5em', color: '#007ad9' }}>
      <MdOutlineAddCircleOutline />
    </div>
  );
};

export const assignproperties = (t, userId, fetchProperties) => {


  return [
    {
      headerText: t("dashboard.user-details.properties.table.image"),
      template: ImgPropertyUsersProfile,
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.user-details.properties.table.name"),
      field: "name",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.user-details.properties.table.address"),
      field: "direction",
      width: "160",
      editType: "dropdownedit",
      textAlign: "Center",
    },
    {
      headerText: t("dashboard.user-details.properties.table.add-property"),
      template: (props) => <AddPropertyIconTemplate data={props} userId={userId} t={t} fetchProperties={fetchProperties} />,
      width: "100",
      textAlign: "Center",
    },
  ];
};

export const userGridAdmin = [
  {
    headerText: "Image",
    template: gridOrderImage,
    textAlign: "Center",
    width: "120",
  },
  {
    headerText: "Name",
    width: "170",
    editType: "dropdownedit",
    textAlign: "Center",
  },
  {
    headerText: "Email",
    width: "180",
    editType: "dropdownedit",
    textAlign: "Center",
  },
  {
    headerText: "Rol",
    width: "100",
    editType: "dropdownedit",
    textAlign: "Center",
  },
  {
    headerText: "Properties",
    width: "200",
    textAlign: "Center",
    template: gridOrderProperties,
  },

  {
    headerText: "Delete",
    template: GridDelete,
    textAlign: "Center",
    width: "80",
    field: "id",
  },
];

export const ordersCases = [
  {
    headerText: "Case ID",
    field: "id",
    textAlign: "Center",
    width: "20",
  },
  {
    headerText: "Case Type",
    field: "incident",
    textAlign: "Center",
    width: "150",
  },
];

export const ordersCasesAdmin = (t) => {
  return [
    {
      headerText: t("dashboard.cases.table.case-type-en"),
      field: "incident",
      textAlign: "Center",
      width: "150",
    },
    {
      headerText: t("dashboard.cases.table.case-type-es"),
      field: "translate",
      textAlign: "Center",
      width: "150",
    },
    {
      headerText: t("dashboard.cases.table.edit"),
      template: GridEdit,
      textAlign: "Center",
      width: "30",
      field: "caseType",
    },
    {
      headerText: t("dashboard.cases.table.delete.delete"),
      template: GridDeleteCase,
      textAlign: "Center",
      width: "30",
      field: "caseType",
    },
  ];
};



export const orderAgentsAdmin = (t) => {
  return [
    {
      headerText: t("dashboard.reports.table.admin.CaseImage"),
      template: gridOrderImageAgent,
      field: "ImageUrl",
      textAlign: "Center",
      width: "120",
    },
  
    {
      headerText: t("dashboard.agents.table.name"),
      field: "Name",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.agents.table.email"),
      field: "Email",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.agents.table.reports"),
      field: "numOfReportsUser",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: "Collaborations",
      field: "numOfCollaborations",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.agents.table.delete"),
      template: GridDelete,
      textAlign: "Center",
      width: "80",
      field: "id",
    },
  ];
};


export const propertyGrid = (t) => {
  return [
    {
      headerText: t("dashboard.properties.table.image"),
      template: GridPropertyImage,
      textAlign: "Center",
      field: "img",
      width: "120",
    },
    {
      headerText: t("dashboard.properties.table.name"),
      field: "Name",
      textAlign: "Center",
      width: "140",
    },
    {
      headerText: t("dashboard.properties.table.address"),
      field: "Direction",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.properties.table.cameras"),
      field: "Cameras",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.properties.table.reports"),
      field: "Reports",
      textAlign: "Center",
      width: "120",
    },

  ];
};

export const propertyGridAdmin = (t, handleOpenEditPropertyDialog) => {

  return [
    {
      headerText: t("dashboard.properties.table.image"),
      template: props => props && <GridPropertyImage propertyImage={props.img} />,
      textAlign: "Center",
      field: "img",
      width: "120",
    },
    {
      headerText: t("dashboard.properties.table.name"),
      field: "name",
      textAlign: "Center",
      width: "140",
    },
    {
      headerText: t("dashboard.properties.table.address"),
      field: "direction",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.properties.table.cameras"),
      field: "numOfCamerasTotal",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.properties.table.reports"),
      field: "numOfReportsTotal",
      textAlign: "Center",
      width: "120",
    },
    {
      field: "property",
      headerText: t("dashboard.cameras.table.edit"),
      width: "100",
      textAlign: "Center",
      template: props => <GridEditProperty property={props} handleOpenEditPropertyDialog={handleOpenEditPropertyDialog} />
    }, 
    

    {
      headerText: t("dashboard.cameras.table.delete.delete"),
      textAlign: "Center",
      template: props => <GridDeleteProperty property={props} />,
      width: "85",
      field: "id",
    },

  ]

};


/* export const reportsGrid = (t) => {

  return [
    {
      headerText: t("dashboard.reports.table.client.CaseImage"),
      template: gridOrderImage,
      textAlign: "Center",
      width: "120",
    },

    {
      field: "caseType.incident",
      headerText: "Case",
      width: "200",
      editType: "dropdownedit",
      textAlign: "Center",
    },

    {
      field: "level",
      headerText: "Level",
      width: "130",
      format: "yMd",
      textAlign: "Center",
      template: customerGridStatus,
    },

    {
      field: "dateOfReport",
      headerText: "Date Incident",
      width: "130",
      textAlign: "Center",
    },

    {
      field: "timeOfReport",
      headerText: "Time",
      width: "100",
      editType: "dropdownedit",
      textAlign: "Center",
    },

    {
      field: "numerCase",
      headerText: "Report ID",
      width: "110",
      textAlign: "Center",
    },

    {
      field: "PDF",
      headerText: "PDF",
      width: "80",
      textAlign: "Center",
      template: GridPdf,
    },

    {
      field: "Details",
      headerText: t("dashboard.reports.table.admin.CaseDetails"),
      width: "105",
      textAlign: "Center",
      template: GridDetails,
    },

  ];

};
 */
export const reportsGridProperty = (t, setRefreshReports, userRole) => {
  let gridPropertyReports = [
  
    {
      headerText: t("dashboard.reports.table.admin.CaseImage"),
      template: gridOrderImage,
      textAlign: "Center",
      width: "120",
    },
   
    {
      field: "caseType.incident",
      headerText: t("dashboard.reports.table.admin.Case"),
      width: "190",
      editType: "dropdownedit",
      textAlign: "Center",
    },
    {
      field: "createdBy.name",
      headerText: t("dashboard.reports.table.admin.Agent"),
      width: "170",
      editType: "dropdownedit",
      textAlign: "Center",
    },
    {
      field: "level",
      headerText: t("dashboard.reports.table.admin.CaseLevel"),
      width: "100",
      format: "yMd",
      textAlign: "Center",
      template: customerGridStatus,
    },

    {
      field: "dateOfReport",
      headerText: t("dashboard.reports.table.admin.DateCase"),
      width: "130",
      textAlign: "Center",
    },

    {
      field: "numerCase",
      headerText: t("dashboard.reports.table.admin.IdCase"),
      width: "110",
      textAlign: "Center",
    },

    {
      field: "PDF",
      headerText: "Pdf",
      width: "80",
      textAlign: "Center",
      template: GridPdf,
    },
    {
      field: "Details",
      headerText: t("dashboard.reports.table.admin.CaseDetails"),
      width: "105",
      textAlign: "Center",
      template: GridDetails,
    },
    {
      field: "verified",
      headerText: t("dashboard.reports.table.admin.CaseVerified"),
      width: "95",
      textAlign: "Center",
      template: GridisVerifiedAndVerification,
    }

  /* ,
    {
      field: "Delete",
      headerText: t("dashboard.reports.table.delete-report.delete"),
      width: "80",
      textAlign: "Center",
      template: props => <GridDeleteReport {...props} setRefreshReports={setRefreshReports} />,
    }, */
  ];

  console.log(userRole)

if(userRole !== "Client"){
  gridPropertyReports.push({
      field: "Edit",
      headerText: t("dashboard.reports.table.admin.CaseEdit"),
      width: "80",
      textAlign: "Center",
      template: GridEditReportTemplate,
  })

 
}

  // Condición para agregar la columna "Delete" solo si el usuario es Admin
  if (userRole === "Admin") {
    gridPropertyReports.push({
      field: "Delete",
      headerText: t("dashboard.reports.table.delete-report.delete"),
      width: "80",
      textAlign: "Center",
      template: (props) => (
        <GridDeleteReport {...props} setRefreshReports={setRefreshReports} />
      ),
    });
  }
  
  return gridPropertyReports;
};




export const contextMenuItems = [
  "AutoFit",
  "AutoFitAll",
  "SortAscending",
  "SortDescending",
  "Copy",
  "Edit",
  "Delete",
  "Save",
  "Cancel",
  "PdfExport",
  "ExcelExport",
  "CsvExport",
  "FirstPage",
  "PrevPage",
  "LastPage",
  "NextPage",
];
