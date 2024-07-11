import { MdDelete } from "react-icons/md";
import { useTranslation } from "react-i18next";
import deleteReport from "../../helper/Reports/dataTables/deleteReport";

//Plantilla para borrar reportes
export const GridDeleteReport = ({ id, refreshReports }) => {
    const { t } = useTranslation("global");

    const handleDelete = async () => {
        const success = await deleteReport(id, t);
        if (success) {

            refreshReports();

        }
    };

    return (
        <div onClick={handleDelete} className="flex justify-center m-0 p-0 text-red-700">
            <MdDelete className="text-lg" />
        </div>
    );
};
