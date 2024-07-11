import React from 'react';

const ViewedsTable = ({ vieweds, t}) => {
    return (
        <section className="container px-4 mx-auto">
            <div className="flex items-center gap-x-3 justify-end">
                <div className="max-w-xl my-14 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
                    <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-yellow-600 sm:text-4xl md:mx-auto">
                        <span className="relative inline-block">
                            <svg
                                viewBox="0 0 52 24"
                                fill="currentColor"
                                className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
                            >
                                <defs>
                                    <pattern
                                        id="pattern"
                                        x="0"
                                        y="0"
                                        width=".135"
                                        height=".30"
                                    >
                                        <circle cx="1" cy="1" r=".7" />
                                    </pattern>
                                </defs>
                                <rect
                                    fill="url(#pattern)"
                                    width="52"
                                    height="24"
                                />
                            </svg>
                            <span className="relative">
                                {t("dashboard.reports.case-details.viewed.title")}
                            </span>
                        </span>
                    </h2>
                </div>
            </div>
            <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="py-3.5 px-4 text-sm font-medium text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            {t("dashboard.reports.case-details.viewed.name")}
                                        </th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-medium text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            {t("dashboard.reports.case-details.viewed.date-of-view")}
                                        </th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-medium text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            {t("dashboard.reports.case-details.viewed.time-of-view")}                       
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                    {vieweds.map(viewed => (
                                        <tr key={viewed.id}>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img src="https://w7.pngwing.com/pngs/374/169/png-transparent-generic-pic-profile-user-account-avatar-human-male-man-person-vivid-vibrant-solid-fill-flat-style-icon.png" alt="profile" className="w-10 h-10 rounded-full mr-2" />
                                                    {viewed.user.name}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-emerald-500 whitespace-nowrap">
                                                {viewed.dateOfView}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-blue-500 whitespace-nowrap">
                                                {viewed.timeOfView}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ViewedsTable;
