

export const UseDataPieLevels = (data, t) => {
  let levelList = [];

  data.forEach((report) => {
    levelList.push(report.level);
  });

  let unicosElementos = [];
  let almacenadorDeVecesRepetidas = [];
  let contador = 1;
  const arreglo = levelList.sort();
  const totalReports = levelList.length;
  for (let i = 0; i < arreglo.length; i++) {
    if (arreglo[i + 1] === arreglo[i]) {
      contador++;
    } else {
      unicosElementos.push(arreglo[i]);
      almacenadorDeVecesRepetidas.push(contador);
      contador = 1;
    }
  }

  let porcentajes = almacenadorDeVecesRepetidas.map((count, index) => {
    const levelText = t(`dashboard.charts.level-of-reports.report-level.${unicosElementos[index]}`);
    return `${levelText}: ${((count * 100) / totalReports).toFixed(0)}%`;
  });

  return { unicosElementos: unicosElementos.map(level => t(`dashboard.charts.level-of-reports.report-level.${level}`)), almacenadorDeVecesRepetidas, porcentajes };
};
