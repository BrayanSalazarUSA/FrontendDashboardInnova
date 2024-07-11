import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatDate, formatTime } from '../postReport';
import logo from "../../../assets/images/Logos/innova-monitoring.png";

export const createHTMLStringToSend = (data) => {
    console.log(data)

    return ` 
    <div class="w-1000 mx-auto bg-gray-200 p-8 shadow-lg rounded-lg">
       <div class="mb-2 w-auto rounded-lg bg-white-banner bg-center bg-cover h-56 flex items-center justify-start" style="position: relative;">
    <img src="${logo}" alt="Company Logo" class="h-56">
    <div class="ml-28 flex flex-col justify-center items-center bg-[#000000ad] rounded">
        <h1 class="font-bold text-4xl text-center block py-3 px-4 text-[#B78607]">REPORT #${data.numerCase}</h1>
        <p class="text-[#B78607] text-xl pb-4">${data.property.name || ' '}</p>
    </div>
   
</div>

        <div class="mb-2">
        <div class="bg-[#B78607] mb-2 rounded-t-lg flex flex-row justify-center">
        <h2 class="bg-[#B78607] text-white p-3 pb-5 mb-2 rounded-t-lg w-2/3 pl-6">Property Information</h2>
        <h2 class="bg-[#B78607] text-white py-3 pb-5 mb-2 font-bold rounded-t-lg w-1/3">Report</h2>
        
        </div>    
           
            <div class="p-2 bg-gray-50 rounded-b-lg flex flex-row">
                
                <div  class="w-2/3 pr-2 pl-6">
                <p class="mb-2"><strong>Property Name:</strong> ${data.property.name || ' '}</p>
                <p class="mb-2"><strong>Address:</strong> ${data.property.direction || ' '} ${data.property.state || ' '} ${data.property.city || ' '} ${data.property.zipCode || ' '} </p>
                </div>

                <div  class="w-1/3 pr-2">
                <p class="mb-2"><strong>Date of Incident:</strong> ${formatDate(data.dateOfReport) || ' '}</p>
                <p class="mb-2"><strong>Report Time:</strong> ${formatTime(data.timeOfReport) || ' '} </p>
                </div>
            </div>
        </div>
        <div class="mb-2">
            <h2 class="bg-[#B78607] text-white p-3 pb-5 mb-2 rounded-t-lg">Incident Details</h2>
<div class="flex flex-wrap">
    <div class="w-full sm:w-1/2 p-2">
        <div class="bg-gray-50 mb-2 p-2 flex items-center rounded-lg">
            <div class="mr-2 flex items-center justify-center w-8 h-8 rounded-full bg-[#b7850720]">
                 <i class="fa-solid fa-triangle-exclamation pb-4" style="color: #B78607;"></i>
            </div>
            <div class="pb-4">
                <strong>Incident Type:</strong> ${data.caseType.incident || ' '} ${data.otherSeeReport || ' '}
            </div>
        </div>
          <div class="bg-gray-50 mb-2 p-2 flex items-center rounded-lg">
            <div class="mr-2 flex items-center justify-center w-8 h-8 rounded-full bg-[#b7850720]">
            <i class="fa-regular fa-clock pb-4" style="color: #B78607;"></i>
            </div>
            <div class="pb-4">
                <strong>Start Time of Incident:</strong> ${formatTime(data.incidentStartTime) || ' '}
            </div>
        </div> 
        <div class="bg-gray-100 mb-2 p-2 flex items-center rounded-lg">
            <div class="mr-2 flex items-center justify-center w-8 h-8 rounded-full bg-[#b7850720]">
                <i class="fa-solid fa-turn-up pb-4" style="color: #B78607;"></i>
            </div>
            <div class="pb-4">
                <strong>Level:</strong> ${data.level || ' '}
            </div>
        </div>
        
        
        <div class="bg-gray-100 mb-2 p-2 flex items-center rounded-lg">
            <div class="mr-2 flex items-center justify-center w-8 h-8 rounded-full bg-[#b7850720]">
               <i class="fa-solid fa-car-on pb-4" style="color: #B78607;"></i>
            </div>
            <div class="pb-4">
                <strong>Police First Responder Notified:</strong> ${data.policeFirstResponderNotified ? 'Yes' : 'No'}
            </div>
        </div>
          <div class="bg-gray-50 mb-2 p-2 flex items-center rounded-lg">
            <div class="mr-2 flex items-center justify-center w-8 h-8 rounded-full bg-[#b7850720]">
               <i class="fa-solid fa-car-on pb-4" style="color: #B78607;"></i>
            </div>
            <div class="pb-4">
                <strong>Police/First Responder on Scene:</strong> ${data.policeFirstResponderScene || ' '}
            </div>
        </div>
       <div class="bg-gray-50 mb-2 p-2 flex items-center rounded-lg">
            <div class="mr-2 flex items-center justify-center w-8 h-8 rounded-full bg-[#b7850720]">
                <i class="fa-solid fa-hashtag pb-4" style="color: #B78607;"></i>
            </div>
            <div class="pb-4">
                <strong>Police Case Number:</strong> ${data.policeNumerCase || ' '}
            </div>
        </div>
    </div>
    <div class="w-full sm:w-1/2 p-2">
          <div class="bg-gray-100 mb-2 p-2 flex items-center rounded-lg">
            <div class="mr-2 flex items-center justify-center w-8 h-8 rounded-full bg-[#b7850720]">
               <i class="fa-regular fa-calendar pb-4" style="color: #B78607;"></i>
            </div>
            <div class="pb-4">
                <strong>Date of Incident:</strong> ${formatDate(data.incidentDate)|| ' '}
            </div>
        </div>
          <div class="bg-gray-100 mb-2 p-2 flex items-center rounded-lg">
            <div class="mr-2 flex items-center justify-center w-8 h-8 rounded-full bg-[#b7850720]">
                  <i class="fa-regular fa-clock pb-4" style="color: #B78607;"></i>
            </div>
            <div class="pb-4">
                <strong>End Time of Incident:</strong> ${formatTime(data.incidentEndTime) || 'Continue'}
            </div>
        </div>
        
       <div class="bg-gray-50 mb-2 p-2 flex items-center rounded-lg">
            <div class="mr-2 flex items-center justify-center w-8 h-8 rounded-full bg-[#b7850720]">
                <i class="fa-solid fa-video pb-4" style="color: #B78607;"></i>
            </div>
            <div class="pb-4">
                <strong>Cameras Functioning:</strong> ${data.camerasFunctioning ? 'Yes' : 'No'}
            </div>
        </div>
        <div class="bg-gray-50 mb-2 p-2 flex items-center rounded-lg">
            <div class="mr-2 flex items-center justify-center w-8 h-8 rounded-full bg-[#b7850720]">
                <i class="fa-solid fa-video pb-4" style="color: #B78607;"></i>
            </div>
            <div class="pb-4">
                <strong>Observed via Cameras:</strong> ${data.observedViaCameras ? 'Yes' : 'No'}
            </div>
        </div>
          <div class="bg-gray-50 mb-2 p-2 flex items-center rounded-lg">
            <div class="mr-2 flex items-center justify-center w-8 h-8 rounded-full bg-[#b7850720]">
                <i class="fa-solid fa-person-military-pointing pb-4" style="color: #B78607;"></i>
            </div>
            <div class="pb-4">
                <strong>Security Guards on Scene:</strong> ${data.securityGuardsScene ? 'Yes' : 'No'}
            </div>
        </div>
        
      <div class="bg-gray-50 mb-2 p-2 flex items-center rounded-lg">
            <div class="mr-2 flex items-center justify-center w-8 h-8 rounded-full bg-[#b7850720]">
                <i class="fa-solid fa-person-military-pointing pb-4" style="color: #B78607;"></i>
            </div>
            <div class="pb-4">
                <strong>Security Guards Notified:</strong> ${data.securityGuardsNotified ? 'Yes' : 'No'}
            </div>
        </div>
    </div>
    </div>
    </div>
   
   <div class="mb-2">
    <h2 class="bg-[#B78607] text-white p-3 pb-5 mb-2 rounded-t-lg">Incident Description</h2>
    <div class="p-2 bg-gray-50 rounded-b-lg px-5 py-8 relative">
        <p>${data.reportDetails || ' '}</p>
        <div class="watermark absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center pointer-events-none">
            <img src="${logo}" alt="Watermark" class="opacity-20 h-full">
        </div>
    </div>
</div>

         <div class="mb-2">
            <div class="p-2 bg-gray-50 rounded-lg">
                <div class="mb-2 pb-4 border-b-1 flex flex-row text-[#B78607]"><p class="text-[#B78607] font-bold">Created by:</p> <p class="text-gray-800 ml-3">${data.createdBy.name || ' '}</p></div>
                <div class="mb-2 pb-2 border-b-1 flex flex-row text-[#B78607]"><p class="text-[#B78607] font-bold">Form of Notification to Client:</p> <p class="text-gray-800 ml-3">${data.formNotificationClient || ' '}</p></div>
                <div class="mb-2 pb-2 border-b-1 flex flex-row text-[#B78607]"><p class="text-[#B78607] font-bold">Emailed Report To:</p> <p class="text-gray-800 ml-3">${data.emailedReport || ' '}</p></div>
            </div>
        </div>
      
<footer class="bg-gray-50 text-gray-900 flex items-center h-36 overflow-hidden" style="position: relative;">
    <div class="flex items-center justify-between w-[900px] space-x-4 pl-5" style="position: relative; z-index: 1;">
    <div class="flex items-center">
    <img src="${logo}" alt="Company Logo" class="h-40">
 <div class="flex flex-col text-left">
            <p class="text-lg font-semibold pl-3" style="color: #B78607;">Innova Monitoring</p>
            <p class="text-sm pl-3 " style="border-left: 3px solid #B78607;">Reinventing Security</p>
        </div>
              
    </div>    
   
 <p class="text-sm italic text-[#B78607] ">Confidential</p>

    </div>
    <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 5px; background-color: #B78607;"></div>
</footer>

         </div>
        </div>
    </div>
    `;
};
export const exportPdfEvidences = async (data) => {
    const htmlString = createHTMLStringToSend(data);
    const htmlContent = document.createElement('div');
    htmlContent.style.width = "1000px";
    htmlContent.innerHTML = htmlString;
    document.body.appendChild(htmlContent);


    const canvas = await html2canvas(htmlContent, {
        scale: 2,
        width: htmlContent.offsetWidth,
        windowWidth: htmlContent.offsetWidth
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
    });


    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const scaleX = pdfWidth / imgWidth;
    const scaleY = pdfHeight / imgHeight;
    const scale = Math.min(scaleX, scaleY);

    pdf.addImage(imgData, 'PNG', scaleX, scaleY, imgWidth * scale, imgHeight * scale);
    document.body.removeChild(htmlContent);
    return pdf.output('blob');

}; 


