import React, { useState, useEffect, useRef } from 'react';
import teacherData from '../data/mockData';
import Navbar from '../components/Navbar';
import OverallAttendanceCard from '../components/OverallAttendanceCard';
import ClassCard from '../components/ClassCard';
import FacialScanner from '../components/FacialScanner';
import '../pages/styles.css';
function TeacherDashboard() {
    const [stats, setStats] = useState({ percentage: 0, totalClasses: 0, totalStudents: 0, statusText: '', statusColor: '' });
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false); // State moved here

    useEffect(() => {
        const classes = teacherData.classes;
        const totalClasses = classes.length;
        if (totalClasses > 0) {
            const totalStudents = classes.reduce((sum, cls) => sum + cls.students, 0);
            const totalPercentage = classes.reduce((sum, cls) => sum + cls.attendance, 0);
            const averagePercentage = Math.round(totalPercentage / totalClasses);
            let attendanceInfo = { statusText: 'Needs Improvement', statusColor: 'var(--red)' };
            if (averagePercentage >= 85) { attendanceInfo = { statusText: 'Good', statusColor: 'var(--green)' }; } 
            else if (averagePercentage >= 75) { attendanceInfo = { statusText: 'Average', statusColor: 'var(--yellow)' }; }
            setStats({ percentage: averagePercentage, totalClasses: totalClasses, totalStudents: totalStudents, statusText: attendanceInfo.statusText, statusColor: attendanceInfo.statusColor });
        }
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const handleTakeAttendance = (classInfo) => {
        if (classInfo.studentList.length === 0) {
            alert("This class has no students in the roster.");
            return;
        }
        setSelectedClass(classInfo);
        setIsScannerOpen(true);
    };
    
    const handleCloseScanner = () => {
        setIsScannerOpen(false);
        setSelectedClass(null);
    };
    
    const handleAttendanceSubmit = (presentStudents) => {
        console.log(`Submitting attendance for ${selectedClass.name}:`, presentStudents);
        alert(`${presentStudents.length} students marked present for ${selectedClass.name}.`);
        handleCloseScanner();
    };

    return (
        <>
            {isScannerOpen && <FacialScanner classInfo={selectedClass} onClose={handleCloseScanner} onSubmit={handleAttendanceSubmit} />}
            <div className="dashboard-container">
                <Navbar userName={teacherData.name} onToggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                <main className="main-content">
                    <header className="page-header">
                        <h1>Welcome back, {teacherData.name}!</h1>
                        <p>Here's a summary of your daily attendance records.</p>
                    </header>
                    <OverallAttendanceCard stats={stats} />
                    <section className="courses-section">
                        <h2>Your Classes</h2>
                        <div className="courses-grid">
                            {teacherData.classes.map(classInfo => (
                                <ClassCard key={classInfo.id} classInfo={classInfo} onTakeAttendance={handleTakeAttendance} />
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}

export default TeacherDashboard;

