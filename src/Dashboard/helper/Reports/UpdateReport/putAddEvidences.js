import Swal from 'sweetalert2';

export const putAddEvidences = async (reportId, localEvidences, t, userId) => {
    console.log("Se está ejecutando la funcion de subir videoS")
    const formData = new FormData();

            // Si la evidencia está encriptada, cambia el nombre, de lo contrario, usa el nombre original
            let evidenceName = localEvidences.isEncrypted
              ? `encrypted_${localEvidences.name}`
              : localEvidences.name;
        
            // Añade la evidencia al formData con el nombre correspondiente
            formData.append("evidences", localEvidences.file, evidenceName);

   /*  Swal.fire({
      icon: "info",
      title: `Subiendo video:`,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    }); */
    try {
        const response = await fetch(`${ process.env.REACT_APP_SERVER_IP}/reports/${reportId}/asignar-evidencia`, {
            method: 'PUT',
            body: formData,
            headers: {
                userid: userId,
              },
        });

        if (response.ok) {
            const result = await response.json(); 
            Swal.fire({
                icon: 'success',
                title: `Video ${localEvidences.name} Uploaded`,
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            return result; 
        } else {
            const errorResponse = await response.text(); 
            console.error('Response error:', errorResponse); 
            throw new Error('No fue posible cargar las evidencias correctamente.');
        }
    } catch (error) {
        console.error('Error al enviar las evidencias:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al cargar las evidencias',
            text: error.toString(),
        });
    }
}
