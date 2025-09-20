const OverallAttendanceCard = ({ stats }) => ( 
<div className="overall-attendance-card">
    <div className="overall-stats">
        <div className="overall-percentage">{stats.percentage}%</div>
        <div className="overall-status" style={{ color: stats.statusColor }}>{stats.statusText}</div>
        </div>
        <ul className="stat-details">
            <li className="stat-detail-item">
                <span>Total Classes</span>
                <span>{stats.totalClasses}</span>
            </li>
            <li className="stat-detail-item">
                <span>Total Students</span>
                <span>{stats.totalStudents}</span>
            </li>
        </ul>
</div> 
);
export default OverallAttendanceCard;