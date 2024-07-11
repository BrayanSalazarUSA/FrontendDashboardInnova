export const UseDataStackedChart = (data) => {
  let months = [];

  data.forEach((report) => {
    if (report.dateIncident) {
      const month = report.dateIncident.split("-")[1];
      switch (month) {
        case '01': months.push("January"); break;
        case '02': months.push("February"); break;
        case '03': months.push("March"); break;
        case '04': months.push("April"); break;
        case '05': months.push("May"); break;
        case '06': months.push("June"); break;
        case '07': months.push("July"); break;
        case '08': months.push("August"); break;
        case '09': months.push("September"); break;
        case '10': months.push("October"); break;
        case '11': months.push("November"); break;
        case '12': months.push("December"); break;
        default: break;
      }
    }
  });

  let unicosElementos = [];
  let almacenadorDeVecesRepetidas = [];
  let contador = 1;
  months.sort();

  for (let i = 0; i < months.length; i++) {
    if (months[i + 1] === months[i]) {
      contador++;
    } else {
      unicosElementos.push(months[i]);
      almacenadorDeVecesRepetidas.push(contador);
      contador = 1;
    }
  }

  return { unicosElementos, almacenadorDeVecesRepetidas };
};
