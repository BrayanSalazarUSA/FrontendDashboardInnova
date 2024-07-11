export const UseDataStatics = (data) => {
  let incidentList = [];
  data.forEach((report) => {
    if (report.caseType && report.caseType.incident) {
      incidentList.push(report.caseType.incident);
    }
  });

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
