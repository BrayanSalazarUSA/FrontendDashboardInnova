import Swal from 'sweetalert2';

export const postCasesSoftDelete = async (caseType, setreportSaved, reportSaved, t) => {
    let url = `${process.env.REACT_APP_SERVER_IP}/cases/${caseType.id}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...caseType,
                deleted: true, 
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to soft delete the case');
        }

        await response.json();
        setreportSaved(!reportSaved);

        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: t('dashboard.cases.table.delete.swal.case-removed'),
            showConfirmButton: false,
            timer: 3000
        });
    } catch (error) {
        Swal.fire(
            'Error!',
            t('dashboard.cases.table.delete.swal.error-deleting-case'),
            'error'
        );
    }
};
