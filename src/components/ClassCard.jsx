const ClassCard = ({ classInfo, onTakeAttendance }) => {
    const percentage = classInfo.attendance;
    const getStatusTag = () => {
        const status = percentage >= 85 ? 'High' : percentage >= 75 ? 'Medium' : 'Low';
        const colorClass = status === 'High' ? 'green' : status === 'Medium' ? 'yellow' : 'red';
        return <div className={`status-tag ${colorClass}`}>{status}</div>;
    };
    return (
        <div className="course-card" style={{ '--progress-width': `${percentage}%` }}>
            <div className="card-header"><div className="course-info"><div className="course-title">{classInfo.name}</div></div>{getStatusTag()}</div>
            <div className="attendance-percentage">{percentage}%</div>
            <div className="progress-bar-container"><div className="progress-bar"></div></div>
            <div className="card-footer">
                <div className="footer-item"><svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path></svg><span>{classInfo.students} Students</span></div>
                <button className="card-action-button" onClick={() => onTakeAttendance(classInfo)}>Take Daily Attendance</button>
            </div>
        </div>
    );
};
export default ClassCard;