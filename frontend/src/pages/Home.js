import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { AuthContext } from '../context/AuthContext';
import tnlogo from '../assets/tn.png';

function Home() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        vehicleNumber: '',
        ownerNumber: '',
        alertDate: '',
        alertTime: '',
        calledByNumber: '', // Changed from array to string for radio button
        callStartTime: '',
        callEndTime: '',
        typeOfAlert: [],
        callerRemarks: '',
        acknowledgement: '',
        employeeName: '',
        otherNumber: '',
        otherAcknowledgement: '',
        overspeedAcknowledgement: '',
        otherEmployee: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [formCount, setFormCount] = useState(0);

    // Auto-set employee name from user context and persist it
    useEffect(() => {
        if (user?.username) {
            setFormData(prev => ({
                ...prev,
                employeeName: user.username
            }));
            localStorage.setItem('employeeName', user.username);
        }
    }, [user]);

    // Load employee name from localStorage on component mount (page refresh)
    useEffect(() => {
        const savedEmployeeName = localStorage.getItem('employeeName');
        if (savedEmployeeName && !formData.employeeName) {
            setFormData(prev => ({
                ...prev,
                employeeName: savedEmployeeName
            }));
        }
    }, []);

    useEffect(() => {
    const savedCount = localStorage.getItem('formCount');
    if (savedCount) {
        setFormCount(parseInt(savedCount));
    }
}, []);

const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {

        // Clear saved data
        localStorage.removeItem("employeeName");
        localStorage.removeItem("formCount");

        // Reset form count
        setFormCount(0);

        // Redirect to login page
        navigate("/login");
    }
};

    const calledByOptions = [
        '8925860271',
        '8925860272',
        '8925860273'
    ];

    const typeOfAlertOptions = [
        'Emergency Off',
        'Emergency On',
        'Impact',
        'Main Power Reconnect',
        'Main Power Removal',
        'Panic Button Wire-cut',
        'Tilt',
        'Over Speed'
    ];

    const handleAlertTypeChange = (e) => {
    const { value, checked } = e.target;

    setFormData(prev => {
        if (checked) {
            return {
                ...prev,
                typeOfAlert: [...prev.typeOfAlert, value]
            };
        } else {
            return {
                ...prev,
                typeOfAlert: prev.typeOfAlert.filter(alert => alert !== value)
            };
        }
    });
};

    const callerRemarksOptions = [
        'Owner Not Response Government',
        'Owner Not Response Private',
        'Owner Decline Government',
        'Owner Decline Private',
        'Children Press',
        'Passenger Press',
        'Auto Off Less Than 30 Minutes',
        'Self Testing',
        'Out Of Service Government',
        'Out Of Service Private',
        'Vehicle Under Maintenance',
        'Wrong Mobile Number',
        'Officer Number',
        'Salesperson Number',
        'Vehicle Sold New Owner Number Not Updated',
        'Data Not Received Properly',
        'Emergency Data Not Received Properly',
        'Forward To ERSS',
        'SOS Wire Cut or Power Cut',
        'Improper Fitting of VLTS Device',
        'Over Speed'
    ];

    const acknowledgementOptions = [
        'Accidental Press',
        'Device Fitment Issue',
        'Owner Not Response',
        'Wrong Owner Mobile Number',
        'Device Faulty',
        'Over Speed',
        'Other'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        // Validate called by number is selected
        if (!formData.calledByNumber) {
           setSubmitStatus({
    type: 'success',
    message: 'Form submitted successfully!'
});

const newCount = formCount + 1;
setFormCount(newCount);
localStorage.setItem('formCount', newCount);

// Refresh page after 1.5 seconds
setTimeout(() => {
    window.location.reload();
}, 1500);
        }

        // Prepare data for submission
        const submissionData = {
            ...formData,
            timestamp: new Date().toISOString(),
            formType: 'VLTS Control Room'
        };

        try {
            const response = await fetch(
                'https://script.google.com/macros/s/AKfycbx2nz8Lgt3zii5mYi5wCplouIZCUEJ4GayEOrzKDUKN__CJjaONj5Ld4tE5D1eTLhrQJQ/exec',
                {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submissionData)
                }
            );

            setSubmitStatus({
                type: 'success',
                message: 'Form submitted successfully!'
            });
            // ✅ Increase alert count
    const newCount = formCount + 1;
    setFormCount(newCount);
    localStorage.setItem('formCount', newCount);
            

            // Reset form but keep employee name
            setFormData(prev => ({
                vehicleNumber: '',
                ownerNumber: '',
                alertDate: '',
                alertTime: '',
                calledByNumber: '',
                callStartTime: '',
                callEndTime: '',
                typeOfAlert: [],
                callerRemarks: '',
                acknowledgement: '',
                employeeName: prev.employeeName,
                otherNumber: '',
                otherAcknowledgement: '',
                overspeedAcknowledgement: '',
                otherEmployee: ''
            }));

        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: 'Error submitting form. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="cdac-container">
            {/* Header with Tamil Nadu Government Style */}
            <div className="gov-header">
                <div className="gov-header-top">
                    <div className="gov-emblem">
                        <img src={tnlogo} alt="Tamil Nadu Emblem" />
                        <span>தமிழ்நாடு அரசு</span>
                    </div>
                    <h1 className="gov-title">VLTS கட்டுப்பாட்டு அறை</h1>
                    <div className="gov-title-english">VLTS Control Room</div>
                    <button className="logout-btn" onClick={handleLogout}>
        Logout
    </button>
                </div>
                <div className="gov-header-bottom">
                    <span>24x7 Emergency Response System</span>
                    <span className="emergency-number">Emergency: 8925860273</span>
                </div>
            </div>

            {/* Main Form Card */}
            <div className="form-card">
                <div className="form-card-header">
                    <h2>Alert Registration Form</h2>
                    <p>Please fill in the details of the alert/call received</p>
                </div>

                {/* Welcome Message with Employee Name */}
                <div className="welcome-message">
                    <span className="welcome-icon">👤</span>
                    <span className="welcome-text">Welcome, <strong>{formData.employeeName || 'Employee'}</strong></span>
                </div>
                <div className="form-count-box">
    📊 Total Alerts Submitted: <strong>{formCount}</strong>
</div>

                {submitStatus && (
                    <div className={`alert-message ${submitStatus.type}`}>
                        {submitStatus.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="cdac-form">
                    {/* Employee Name Display - Read Only */}
                    <div className="form-section employee-section">
                        <h3 className="section-title">Employee Information</h3>
                        <div className="employee-display">
                            <div className="employee-avatar">
                                {formData.employeeName ? formData.employeeName.charAt(0).toUpperCase() : 'E'}
                            </div>
                            <div className="employee-details">
                                <label>Logged in as:</label>
                                <input
                                    type="text"
                                    name="employeeName"
                                    value={formData.employeeName}
                                    readOnly
                                    disabled
                                    className="gov-input employee-input"
                                    placeholder="Loading employee name..."
                                />
                                <small className="field-note">Auto-filled from your login</small>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Details Section */}
                    <div className="form-section">
                        <h3 className="section-title">Vehicle Details</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Vehicle Number <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="vehicleNumber"
                                    value={formData.vehicleNumber}
                                    onChange={handleChange}
                                    placeholder="TN 01 AB 1234"
                                    required
                                    className="gov-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Owner Mobile Number <span className="required">*</span></label>
                                <input
                                    type="tel"
                                    name="ownerNumber"
                                    value={formData.ownerNumber}
                                    onChange={handleChange}
                                    placeholder="9876543210"
                                    pattern="[0-9]{10}"
                                    required
                                    className="gov-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Alert Timing Section */}
                    <div className="form-section">
                        <h3 className="section-title">Alert Timing</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Alert Date <span className="required">*</span></label>
                                <input
                                    type="date"
                                    name="alertDate"
                                    value={formData.alertDate}
                                    onChange={handleChange}
                                    required
                                    className="gov-input"
                                   max={new Date().toLocaleDateString('en-CA')}
                                />
                            </div>
                            <div className="form-group">
                                <label>Alert Time <span className="required">*</span></label>
                                <input
                                    type="time"
                                    name="alertTime"
                                    value={formData.alertTime}
                                    onChange={handleChange}
                                    required
                                    className="gov-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Call Details Section - Updated with Radio Buttons */}
                    <div className="form-section">
                        <h3 className="section-title">Call Details</h3>
                        
                        {/* Called By Number - Now as Radio Buttons */}
                        <div className="form-group">
                            <label>Called By Number <span className="required">*</span></label>
                            <div className="calledby-options">
                                {calledByOptions.map(number => (
                                    <label key={number} className="radio-option calledby-radio">
                                        <input
                                            type="radio"
                                            name="calledByNumber"
                                            value={number}
                                            checked={formData.calledByNumber === number}
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="number-badge">{number}</span>
                                    </label>
                                ))}
                            </div>
                            {!formData.calledByNumber && (
                                <small className="field-note">Please select a called by number</small>
                            )}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Call Start Time</label>
                                <input
                                    type="time"
                                    name="callStartTime"
                                    value={formData.callStartTime}
                                    onChange={handleChange}
                                    className="gov-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Call End Time</label>
                                <input
                                    type="time"
                                    name="callEndTime"
                                    value={formData.callEndTime}
                                    onChange={handleChange}
                                    className="gov-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Alert Type Section */}
<div className="form-section">
    <h3 className="section-title">Type of Alert</h3>
    <div className="alert-options">
        {typeOfAlertOptions.map(alert => (
            <label key={alert} className="checkbox-option alert-checkbox">
                <input
                    type="checkbox"   // ✅ Changed to checkbox
                    name="typeOfAlert"
                    value={alert}
                    checked={formData.typeOfAlert.includes(alert)}
                    onChange={handleAlertTypeChange}
                />
                <span className="alert-badge">{alert}</span>
            </label>
        ))}
    </div>

    {formData.typeOfAlert.length === 0 && (
        <small className="field-note">Please select at least one alert type</small>
    )}
</div>

                    {/* Caller Remarks */}
                    <div className="form-section">
                        <h3 className="section-title">Caller Remarks</h3>
                        <div className="form-group">
                            <select
                                name="callerRemarks"
                                value={formData.callerRemarks}
                                onChange={handleChange}
                                className="gov-select"
                                required
                            >
                                <option value="">Select Caller Remarks</option>
                                {callerRemarksOptions.map(remark => (
                                    <option key={remark} value={remark}>
                                        {remark}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Acknowledgement Section */}
                    <div className="form-section">
                        <h3 className="section-title">Acknowledgement</h3>
                        <div className="ack-options">
                            {acknowledgementOptions.map(ack => (
                                <label key={ack} className="radio-option ack-radio">
                                    <input
                                        type="radio"
                                        name="acknowledgement"
                                        value={ack}
                                        checked={formData.acknowledgement === ack}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className="ack-badge">{ack}</span>
                                </label>
                            ))}
                        </div>

                        {formData.acknowledgement === 'Over Speed' && (
                            <div className="form-group mt-3">
                                <label>Please specify over speed acknowledgement</label>
                                <input
                                    type="text"
                                    name="overspeedAcknowledgement"
                                    value={formData.overspeedAcknowledgement}
                                    onChange={handleChange}
                                    placeholder="Enter acknowledgement"
                                    className="gov-input"
                                />
                            </div>
                        )}

                        {formData.acknowledgement === 'Other' && (
                            <div className="form-group mt-3">
                                <label>Please specify other acknowledgement</label>
                                <input
                                    type="text"
                                    name="otherAcknowledgement"
                                    value={formData.otherAcknowledgement}
                                    onChange={handleChange}
                                    placeholder="Enter acknowledgement"
                                    className="gov-input"
                                />
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-reset"
                            onClick={() => {
                                if (window.confirm('Are you sure you want to reset the form?')) {
                                    setFormData(prev => ({
                                        vehicleNumber: '',
                                        ownerNumber: '',
                                        alertDate: '',
                                        alertTime: '',
                                        calledByNumber: '',
                                        callStartTime: '',
                                        callEndTime: '',
                                        typeOfAlert: '',
                                        callerRemarks: '',
                                        acknowledgement: '',
                                        employeeName: prev.employeeName,
                                        otherNumber: '',
                                        otherAcknowledgement: '',
                                        overspeedAcknowledgement: '',
                                        otherEmployee: ''
                                    }));
                                }
                            }}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Form'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <div className="gov-footer">
                <p>© 2026 Tamil Nadu Government - Transport Department</p>
                <p>For Technical Support: ccctn.sta@gmai.com | 89259 48087</p>
            </div>
        </div>
    );
}

export default Home;