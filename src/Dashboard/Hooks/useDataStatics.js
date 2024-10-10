
export const UseDataStatics = (data,i18n) => {
  let incidentList = [];
  
    
  if(i18n.language === "en"){
    data.forEach((report) => {
    incidentList.push(report.caseType.incident);
       
    
    });
  
  }else{
  data.forEach((report) => {
  incidentList.push(report.caseType.translate);
      
      
      console.log(` entro al idioma  espaniol ${i18n.languages}` )
    });
    
  } 
  
  let unicosElementos = [];
  let almacenadorDeVecesRepetidas = [];
  let contador = 1;
  const arreglo = incidentList.sort();
  const totalReports = incidentList.length;
  for (let i = 0; i < arreglo.length; i++) {
    if (arreglo[i + 1] === arreglo[i]) {
      contador++;
    } else {
      unicosElementos.push(arreglo[i]);
      almacenadorDeVecesRepetidas.push(contador);
      contador = 1;
    }
  }

  let porcentajes = almacenadorDeVecesRepetidas.map(count => `${((count * 100) / totalReports).toFixed(0)}%`);

  return { unicosElementos, almacenadorDeVecesRepetidas, porcentajes };
};
