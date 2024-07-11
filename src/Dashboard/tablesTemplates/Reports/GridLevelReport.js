export const GridLevelReport = (props) => {
    const { level, StatusBg, refreshReports } = props; 
    return (
        <div className="flex gap-2 justify-center items-center text-gray-700 capitalize">
            <p style={{ background: props.StatusBg }} className="rounded-full h-3 w-3" />
            <p>{level}</p>
        </div>
    );
};
