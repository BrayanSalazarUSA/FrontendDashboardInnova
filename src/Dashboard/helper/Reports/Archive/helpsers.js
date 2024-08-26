
export const createFolderName = (property, company,caseType, otherSeeReport, level, numerCase) => {
  
    // Normalizar el nombre de la propiedad para reemplazar los espacios con guiones
    const propertyNormalized = property.name.replace(/\s+/g, "-");

    // Normalizar el nombre del equipo para reemplazar los espacios con guiones
    const companyNormalized = company.replace(/\s+/g, "-");

    // Verifica si el tipo de caso es 'Other See Report' y el ID es 10
    let incidentName;
    if (caseType.id === 10 && caseType.incident === "Other See Report") {
      // Verifica si otherSeeReport no es null o undefined antes de aplicar replace
      if (otherSeeReport) {
        // Reemplaza comas u otros caracteres especiales por guiones y quita espacios adicionales
        incidentName = otherSeeReport.replace(/[,]/g, "-").trim();
      } else {
        // Manejo de caso donde otherSeeReport es null o undefined
        incidentName = ""; // O cualquier otro valor por defecto que prefieras
      }
    } else {
      incidentName = caseType.incident;
    }
    
    // Construir el nombre de la carpeta
    return `report/${companyNormalized}_${propertyNormalized}_Level-${level}_#${numerCase}-${incidentName}.zip`;
}
