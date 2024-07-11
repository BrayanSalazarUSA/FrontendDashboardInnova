import React, { useEffect, useState, useRef } from 'react';
import "../../pages/css/Reports/NewReport.css";


const TypewriterTextNewReport = ({ text }) => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        setDisplayText(''); // Limpia el texto anterior
        let index = 0;
        const intervalId = setInterval(() => {
            setDisplayText((prev) => {
                if (index < text.length) {
                    const nextChar = text[index];
                    index += 1;
                    return prev + nextChar;
                } else {
                    clearInterval(intervalId);
                    return prev;
                }
            });
        }, 50); // Ajusta el tiempo de espera según tus necesidades

        return () => clearInterval(intervalId);
    }, [text]);

    return (
        <div className="typewriter-text-new-report">
            {displayText}
        </div>
    );
};

export default TypewriterTextNewReport;