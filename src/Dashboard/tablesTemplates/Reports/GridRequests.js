import { Avatar, Chip, IconButton } from "@material-ui/core";
import { BorderColor, BorderStyle } from "@mui/icons-material";
import { AvatarGroup } from "@mui/material";
import { FaClock } from "react-icons/fa";
import { getColor } from "../../components/Requests/RequestForm";
import { MdDelete } from "react-icons/md";
import { deleteRequest } from "../../helper/Requests/deleteRequest";

export const GridRequests = (setRefreshTable, userRole,t) => {
  let columns = [
    {
      field: "id",
      headerName: "ID",
      headerAlign: "center", // Centrar el headerName
      align: "center",
      minWidth: 50, // Usar minWidth en lugar de width
      flex: 0.5, // Definir flex para que se adapte
    },
    {
      
      field: "client",
      headerName: t("dashboard.request.table.client"),
      headerAlign: "center", // Centrar el headerName
      align: "center",
      width: 130,
      minWidth: 130,
      flex: 1, // A
    }, 
    {
      field: "property",
      headerName:t("dashboard.request.table.property"),
      headerAlign: "center", // Centrar el headerName
      align: "center",
      minWidth: 140,
      flex: 1,
      renderCell: (params) => <div>{params?.row?.property?.name}</div>,
    },
    {
      field: "requestDate",
      headerName: t("dashboard.request.table.request-date"),
      headerAlign: "center", // Centrar el headerName
      align: "center",
      minWidth: 120,
      flex: 0.8,
    },
    {
      field: "requestTime",
      headerName: t("dashboard.request.table.time"),
      headerAlign: "center", // Centrar el headerName
      align: "center",
      minWidth: 60,
      flex: 0.5,
    },
    {
      field: "state",
      headerName: t("dashboard.request.table.state"),
      headerAlign: "center", // Centrar el headerName
      align: "center",
      minWidth: 190,
      flex: 1.2,
      renderCell: (params) => <GridRequestsState state={params.value} />,
    },
    { field: "priority",
       headerName: t("dashboard.request.table.priority"),
        width: 80 },
    {
      field: "assigned",
      headerName: t("dashboard.request.table.assigned"),
      minWidth: 80,
      flex: 0.6,
      headerAlign: "center", // Centrar el headerName
      align: "center",
      renderCell: (params) => (
        <GridRequestsAssigned responsible={params.row.responsible} />
      ),
    },
    {
      field: "estipulatedTime",
      headerName: t("dashboard.request.table.est-hrs"),
      headerAlign: "center", // Centrar el headerName
      align: "center",
      minWidth: 80,
      flex: 0.6,
    },
    {
      field: "deadline",
      headerName: t("dashboard.request.table.deadline"),
      minWidth: 100,
      flex: 0.8,
      headerAlign: "center", // Centrar el headerName
      align: "center",
      renderCell: (params) => <GridRequestsdead deadline={params.value} />,
    },
  ];

  // Add the Delete column if the userRole is 'Admin'
  if (userRole === "Admin") {
    columns.push({
      field: "delete",
      headerName:t("dashboard.request.table.delete)"),
      width: 80,
      headerAlign: "center", // Centrar el headerName
      align: "center",
      renderCell: (params) => (
        <GridDeleteRequest
          id={params.row.id}
          setRefreshTable={setRefreshTable}
        />
      ),
    });
  }

  return columns;
};

// State template
const GridRequestsState = ({ state }) => {
  const getChipColor = (state) => {
    switch (state) {
      case "In Process":
        return "#1D7AFC";
      case "Completed":
        return "#22A06B";
      case "Not Started":
        return "gray";
      default:
        return "black";
    }
  };

  return (
    <Chip
      label={state}
      style={{
        backgroundColor: `${getChipColor(state)}1A`,
        color: getChipColor(state),
        border: `1.5px solid ${getChipColor(state)}`,
        padding: "2px 5px",
      }}
    />
  );
};

// Assigned avatars template
const GridRequestsAssigned = ({ responsible }) => {
  let responsibleImage = responsible?.image
    ? `${process.env.REACT_APP_S3_BUCKET_URL}/${responsible.image}`
    : "profiles/profile-default.png";

  return (
    <AvatarGroup max={3}>
      <Avatar src={responsibleImage} />
    </AvatarGroup>
  );
};

// Delete button template
const GridDeleteRequest = ({ id, setRefreshTable }) => {
  const handleDelete = async (event) => {
    event.stopPropagation();
    const success = await deleteRequest(id);
    if (success) {
      setRefreshTable((prev) => !prev);
    }
  };

  return (
    <IconButton onClick={handleDelete} color="error">
      <MdDelete />
    </IconButton>
  );
};

export const GridRequestsdead = (props) => {
  const { deadline } = props;
  let timeAvailable = deadline || "00:00";

  // Adjust font size, icon size, and padding for the grid cell
  return (
    <div
      className="flex flex-col items-center"
      style={{ width: "100%", height: "100%" }}
    >
      <div
        className="rounded-lg flex flex-row justify-center items-center"
        style={{ borderColor: getColor(timeAvailable) }}
      >
        <FaClock
          style={{ color: getColor(timeAvailable), fontSize: "16px" }} // Adjust icon size
          className=""
        />

        <p
          className="text-center ml-3 p-0"
          style={{
            color: getColor(timeAvailable),
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {" "}
          {/* Slightly larger font for the deadline */}
          {timeAvailable}
        </p>
      </div>
    </div>
  );
};
