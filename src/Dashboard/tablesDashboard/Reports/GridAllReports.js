import { GridLevelReport } from "../../tablesTemplates/Reports/GridLevelReport";
import { GridPdf } from "../../tablesTemplates/Reports/GridPdf";
import { GridDetails } from "../../tablesTemplates/Reports/GridDetails";
import { GridIVoidedReport } from "../../tablesTemplates/Reports/GridIVoidedReport";
import { GridEditReportTemplate } from "../../tablesTemplates/Reports/GridEditReportTemplate";
import { GridDeleteReport } from "../../tablesTemplates/Reports/GridDeleteReport";
import { GridArchiveReport } from "../../tablesTemplates/GridArchiveReport";
import { GridNotification } from "../../data/dummy";
export const GridAllReports = (t, setRefreshReports, userRole) => {

  const columns = [

    {
      width: "50",
      textAlign: "Center",
      template: props => <GridNotification {...props}/>
    },
    {
      width: "50",
      textAlign: "Center",
      template: (props) => (
        <GridArchiveReport {...props} setRefreshReports={setRefreshReports} />
      ),
    },
    {
      headerText: t("dashboard.reports.table.admin-all-reports.property"),
      field: "property.name",
      textAlign: "Center",
      width: "165",
    },
    {
      field: "caseType.incident",
      headerText: t("dashboard.reports.table.admin-all-reports.Case"),
      width: "120",
      editType: "dropdownedit",
      textAlign: "Center",
    },
    {
      field: "createdBy.name",
      headerText: t("dashboard.reports.table.admin-all-reports.Agent"),
      width: "170",
      editType: "dropdownedit",
      textAlign: "Center",
    },
    {
      field: "level",
      headerText: t("dashboard.reports.table.admin.CaseLevel"),
      width: "90",
      format: "yMd",
      textAlign: "Center",
      template: (props) => <GridLevelReport {...props} />,
    },
    {
      field: "dateOfReport",
      headerText: t("dashboard.reports.table.admin-all-reports.DateCase"),
      width: "130",
      textAlign: "Center",
    },
    {
      field: "numerCase",
      headerText: t("dashboard.reports.table.admin-all-reports.IdCase"),
      width: "110",
      textAlign: "Center",
    },
    {
      field: "PDF",
      headerText: "PDF",
      width: "80",
      textAlign: "Center",
      template: (props) => <GridPdf {...props} />,
    },
    {
      field: "Details",
      headerText: t("dashboard.reports.table.admin-all-reports.CaseDetails"),
      width: "100",
      textAlign: "Center",
      template: (props) => <GridDetails {...props} />,
    },
    {
      field: "verified",
      headerText: t("dashboard.reports.table.admin-all-reports.CaseVerified"),
      width: "110",
      textAlign: "Center",
      template: (props) => <GridIVoidedReport {...props} />,
    },
    {
      field: "Edit",
      headerText: t("dashboard.reports.table.admin-all-reports.CaseEdit"),
      width: "80",
      textAlign: "Center",
      template: (props) => <GridEditReportTemplate {...props} />,
    },
  ];

  console.log('userRole')
  console.log(userRole)

  // Condición para agregar la columna "Delete" solo si el usuario es Admin
  if (userRole === "Admin") {
    columns.push({
      field: "Delete",
      headerText: t("dashboard.reports.table.delete-report.delete"),
      width: "80",
      textAlign: "Center",
      template: (props) => (
        <GridDeleteReport {...props} setRefreshReports={setRefreshReports} />
      ),
    });
  }

  
  return columns;
};
