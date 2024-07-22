import { Avatar } from "@material-ui/core";
import { BorderColor, BorderStyle } from "@mui/icons-material";
import { AvatarGroup } from "@mui/material";

export const GridRequests = () => {
    return [
        {
            headerText: "ID",
            field: "identification",
            textAlign: "Center",
            width: "50",
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
            headerText: "Estipulated",
            field: "estipulatedTime",
            textAlign: "Center",
            width: "90",
        },
        {
            headerText: "Deadline",
            field: "deadline",
            textAlign: "Center",
            width: "85",
        },
        
    ];
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
    let responsibleImage = `${process.env.REACT_APP_S3_BUCKET_URL}/${responsible.image}`|| '';

    return (
        <AvatarGroup max={3}>
        <Avatar src={responsibleImage} size="large" shape="circle" />
    </AvatarGroup>
    );
}