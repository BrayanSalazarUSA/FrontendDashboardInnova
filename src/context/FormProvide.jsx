  import { createContext, useState } from "react";

  export const FormContext = createContext(); 

  export const FormProvider = ({children}) => {

        const [formPlan, setformPlan] = useState({
          selectedCategories: [],
          textArea: "",
          numCameras: 5,
          existingCameras: 5, 
          cameraType: '', 
          cameraBrand: "",
          numHours: 6,
          camerasInstalled: false,
          internet: false,
          internetSpeed: 'internetSpeed', 
          internetProvider: '',
          internetType: '',  
          locationsCount: 1, 
          ControlAcces: false, 
          name: "",
          lastName: "",
          country: "",
          state: "",
          city: "",
          propertyType: "",
          propertyDetail: '',
          units: '1',
          businessType: '',
          constructionType: '',
          propertyName: "",
          propertyAddress: "",
          propertySize: "",
          email: "",
          phone: "",
          alternativePhone: "",
        })

        return (
          <FormContext.Provider value={{formPlan, setformPlan}}>
              {children}
          </FormContext.Provider>
        )

      }