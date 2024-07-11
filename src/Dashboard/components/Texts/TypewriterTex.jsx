import '../../pages/css/Outlet/Outlet.css'


const TypewriterText = ({ text }) => {
    const calculatedWidth = `${text.length}ch`; 

    return (
        <div className="typewriter-text" style={{ width: 'auto', maxWidth: calculatedWidth }}>
            {text}
        </div>
    );
};

export default TypewriterText;