import { Avatar } from "@material-ui/core";
import { BorderColor, BorderStyle } from "@mui/icons-material";
import { AvatarGroup } from "@mui/material";
import { FaClock } from "react-icons/fa";
import { getColor } from "../../components/Requests/RequestForm";
import { MdDelete } from "react-icons/md";
import { deleteRequest } from "../../helper/Requests/deleteRequest";

export const GridRequests = (setRefreshTable, userRole) => {
    let gridRequest = [
        {
            headerText: "ID",
            field: "id",
            textAlign: "Center",
            width: "80",
        },
        {
            headerText: "Client",
            field: "client",
            textAlign: "Center",
            width: "100",
        },
        {
            headerText: "Property",
            field: "property.name",
            textAlign: "Center",
            width: "120",
        },
        {
            headerText: "Requested",
            field: "requestDate",
            textAlign: "Center",
            width: "80",
        },
        {
            headerText: "Time",
            field: "requestTime",
            textAlign: "Center",
            width: "80",
        },
        {
            headerText: "State",
            field: "state",
            textAlign: "Center",
            width: "90",
            template: props => <GridRequestsState {...props} />,
            
        },
        {
            headerText: "Priority",
            field: "priority",
            textAlign: "Center",
            width: "80",
        },
        {
            headerText: "Assigned",
            textAlign: "Center",
            width: "80",
            template: props => <GridRequestsAssigned {...props} />,
            
        },
        {
            headerText: "Estipulated Hrs",
            field: "estipulatedTime",
            textAlign: "Center",
            width: "80",
        },
        {
            headerText: "Deadline",
            field: "deadline",
            textAlign: "Center",
            width: "95",
            template: props => <GridRequestsdead {...props} />,
        }
    ];

  // Condición para agregar la columna "Delete" solo si el usuario es Admin
  if (userRole === "Admin") {
    gridRequest.push({
      headerText: "Delete",
      width: "80",
      textAlign: "Center",
      template: props => <GridDeleteRequest {...props} setRefreshTable={setRefreshTable} />,
    });
  }

return gridRequest;
};

export const GridRequestsState = (props) => {
    const { state } = props; 
    const getChipColor = (state) => {
    switch(state) {
        case 'In Process':
            return '#1D7AFC';
            case 'Completed':
                return '#22A06B';
        case 'Not Started':
            return 'gray';
        default:
            return 'black';
    }
}
    const chipStyle = {
    padding: '5px 10px',
    borderRadius: '16px',
    border: `1.5px solid ${getChipColor(state)}`,  // Se añade el grosor del borde y el color
    backgroundColor: `${getChipColor(state)}1A`,
    color: getChipColor(state),
    };
    
    return (
        <span style={chipStyle}>{state}</span>
    );
}

export const GridRequestsAssigned = (props) => {
    const { responsible } = props; 
    let image = responsible?.image || "profiles/profile-defualt.png";
    
    let responsibleImage = `${process.env.REACT_APP_S3_BUCKET_URL}/${image}`|| '';

    return (
        <AvatarGroup max={3}>
        <Avatar src={responsibleImage} size="large" shape="circle" />
    </AvatarGroup>
    );
}

//Plantilla para borrar reportes
export const GridDeleteRequest = (props) => {

const{ id,  setRefreshTable} = props;

   const handleDelete = async (event) => {
     event.stopPropagation();
        const success = await deleteRequest(id);
        if (success) {
            setRefreshTable(prev => !prev)
        } 
    }; 

    return (
        <div onClick={(e)=>{handleDelete(e)}} className="z-50 flex justify-center m-0 p-0 text-red-700">
            <MdDelete className="text-lg cursor-pointer" />
        </div>
    );
};

export const GridRequestsdead = (props) => {
    const { deadline } = props; 
    let timeAvailable = deadline || "00:00";
    
    return (
        <div className="flex flex-col items-center ">
        <div
          className="p-2 rounded-lg flex flex-col justify-center items-center"
         /*  style={{ borderColor: getColor(timeAvailable) }} */ >
            <FaClock
              style={{ color: getColor(timeAvailable) }}
              className=""
            />
          <p
            className=""
            style={{ color: getColor(timeAvailable) }}
          >
            Time Remaining
          </p>
          <p
            className=""
            style={{ color: getColor(timeAvailable) }}>
            <span>{timeAvailable}</span>
          </p>
        </div>
      </div>
    );
}