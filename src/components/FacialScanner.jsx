import React, { useState, useEffect, useRef } from 'react';
const FacialScanner = ({ classInfo, onClose, onSubmit }) => {
    const videoRef = useRef();
    const [roster, setRoster] = useState([]);
    const [loadingMessage, setLoadingMessage] = useState('Initializing...');
    const detectionInterval = useRef();

    useEffect(() => {
        let stream = null; 

        const setupScanner = async () => {
            try {
                if (!window.faceapi) {
                    setLoadingMessage('Loading AI library...');
                    await new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js";
                        script.onload = resolve;
                        script.onerror = reject;
                        document.body.appendChild(script);
                    });
                }
                
                setLoadingMessage('Loading AI models...');
                const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights';
                await Promise.all([
                    window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    window.faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                ]);

                setLoadingMessage('Starting camera...');
                stream = await navigator.mediaDevices.getUserMedia({ video: {} });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                setLoadingMessage('Analyzing student roster...');
                const labeledDescriptors = await Promise.all(
                    classInfo.studentList.map(async (student) => {
                        try {
                            const img = await window.faceapi.fetchImage(student.imgUrl);
                            const detection = await window.faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                            if (!detection) return null;
                            return new window.faceapi.LabeledFaceDescriptors(student.name, [detection.descriptor]);
                        } catch (e) { return null; }
                    })
                );

                const validDescriptors = labeledDescriptors.filter(d => d);
                if (validDescriptors.length === 0) {
                    setLoadingMessage('Could not analyze roster.');
                    return;
                }

                const faceMatcher = new window.faceapi.FaceMatcher(validDescriptors, 0.6);
                setLoadingMessage('Ready to scan!');

                detectionInterval.current = setInterval(async () => {
                    if (videoRef.current && videoRef.current.readyState >= 3) {
                        const detections = await window.faceapi.detectAllFaces(videoRef.current, new window.faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
                        detections.forEach(d => {
                            const bestMatch = faceMatcher.findBestMatch(d.descriptor);
                            if (bestMatch.label !== 'unknown') {
                                setRoster(prev => prev.map(s => s.name === bestMatch.label ? { ...s, status: 'present' } : s));
                            }
                        });
                    }
                }, 1000);

            } catch (err) {
                console.error("Setup failed:", err);
                if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                    setLoadingMessage('Camera permission denied.');
                } else {
                    setLoadingMessage('Failed to initialize scanner.');
                }
            }
        };
        
        setupScanner();

        return () => {
            clearInterval(detectionInterval.current);
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [classInfo]);

    useEffect(() => {
        setRoster(classInfo.studentList.map(s => ({ ...s, status: 'absent' })));
    }, [classInfo]);
    
    const handleManualToggle = (studentId) => {
        setRoster(roster.map(s => s.id === studentId ? { ...s, status: s.status === 'present' ? 'absent' : 'present' } : s));
    };

    const handleSubmit = () => {
        onSubmit(roster.filter(s => s.status === 'present'));
    };

    return (
        <div className="facial-scanner-overlay">
            <header className="scanner-header"><div className="scanner-title">Attendance: {classInfo.name}</div><button className="card-action-button" onClick={onClose}>Cancel</button></header>
            <main className="scanner-main">
                <div className="camera-view">
                    <video ref={videoRef} autoPlay muted playsInline />
                    {loadingMessage && 
                        <div className="camera-placeholder">
                            <div className="loading-spinner"></div>
                            <p className="camera-placeholder-text">{loadingMessage}</p>
                        </div>
                    }
                </div>
                <aside className="student-roster">
                    <div className="roster-grid">
                        {roster.map(student => (
                            <div key={student.id} className={`student-card ${student.status}`} onClick={() => handleManualToggle(student.id)}>
                                <div className="student-avatar" style={{backgroundImage: `url(${student.imgUrl})`}}></div>
                                <div className="student-name">{student.name}</div>
                            </div>
                        ))}
                    </div>
                </aside>
            </main>
            <footer className="scanner-actions"><button className="card-action-button submit-button" onClick={handleSubmit}>Submit Attendance</button></footer>
        </div>
    );
};
export default FacialScanner;