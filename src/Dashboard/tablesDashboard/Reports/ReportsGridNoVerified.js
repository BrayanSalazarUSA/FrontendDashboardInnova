import { GridLevelReport } from "../../tablesTemplates/Reports/GridLevelReport";
import { GridPdf } from "../../tablesTemplates/Reports/GridPdf";
import { GridDetails } from "../../tablesTemplates/Reports/GridDetails";
import { GridIVoidedReport } from "../../tablesTemplates/Reports/GridIVoidedReport";
import { GridEditReportTemplate } from "../../tablesTemplates/Reports/GridEditReportTemplate";
import { GridDeleteReport } from "../../tablesTemplates/Reports/GridDeleteReport";



export const ReportsGridNoVerified = (t, refreshReports) => {
    return [
        {
            headerText: t("dashboard.reports.table.admin-no-verfied.property"),
            field: "property.name",
            textAlign: "Center",
            width: "190",
        },
        {
            field: "caseType.incident",
            headerText: t("dashboard.reports.table.admin-no-verfied.Case"),
            width: "120",
            editType: "dropdownedit",
            textAlign: "Center",
        },
        {
            field: "createdBy.name",
            headerText: t("dashboard.reports.table.admin-no-verfied.Agent"),
            width: "200",
            editType: "dropdownedit",
            textAlign: "Center",
        },
        {
            field: "level",
            headerText: t("dashboard.reports.table.admin-no-verfied.CaseLevel"),
            width: "90",
            format: "yMd",
            textAlign: "Center",
            template: props => <GridLevelReport {...props} refreshReports={refreshReports} />,
        },

        {
            field: "dateOfReport",
            headerText: t("dashboard.reports.table.admin-no-verfied.DateCase"),
            width: "130",
            textAlign: "Center",
        },

        {
            field: "numerCase",
            headerText: t("dashboard.reports.table.admin-no-verfied.IdCase"),
            width: "110",
            textAlign: "Center",
        },
        {
            field: "PDF",
            headerText: "Pdf",
            width: "80",
            textAlign: "Center",
            template: props => <GridPdf {...props} refreshReports={refreshReports} />,
        },
        {
            field: "Details",
            headerText: t("dashboard.reports.table.admin-no-verfied.CaseDetails"),
            width: "105",
            textAlign: "Center",
            template: props => < GridDetails {...props} refreshReports={refreshReports} />,
        },
        {
            field: "verified",
            headerText: t("dashboard.reports.table.admin-no-verfied.CaseVerified"),
            width: "120",
            textAlign: "Center",
            template: props => <GridIVoidedReport {...props} refreshReports={refreshReports} />,
        },

        {
            field: "Edit",
            headerText: t("dashboard.reports.table.admin-no-verfied.CaseEdit"),
            width: "80",
            textAlign: "Center",
            template: props => <GridEditReportTemplate {...props} refreshReports={refreshReports} />,
        },

        {
            field: "Delete",
            headerText: t("dashboard.reports.table.delete-report.delete"),
            width: "80",
            textAlign: "Center",
            template: props => <GridDeleteReport {...props} refreshReports={refreshReports} />,
        },
    ];
};