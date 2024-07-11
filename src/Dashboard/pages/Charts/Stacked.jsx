import React from 'react';
import { useTranslation } from 'react-i18next';

import { ChartsHeader, Stacked as StackedChart } from '../../components';

const Stacked = () => (
<div className="mx-7 bg-white rounded-3xl overflow-auto">
      <ChartsHeader category="Stacked" title="Revenue Breakdown" />
      <StackedChart/>

  </div>
);

export default Stacked;