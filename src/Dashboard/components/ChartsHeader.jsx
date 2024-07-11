
import React from 'react';

const ChartsHeader = ({ category, title, translate }) => (
  <div className=" mb-2 pl-3">
    <div>
      <p className="text-lg text-gray-400">{translate('dashboard.charts.report-charts')}</p>
      <p className="text-3xl font-extrabold tracking-tight dark:text-gray-200 text-slate-900">{translate(category)}</p>

    </div>
    <p className="text-center dark:text-gray-200 text-xl mb-2 mt-3">{title}</p>
  </div>
);

export default ChartsHeader;