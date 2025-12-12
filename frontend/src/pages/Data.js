import React, { useState, useContext, useEffect } from "react";
import * as XLSX from "xlsx";
import "./Amnex.css";
import { AuthContext } from "../context/AuthContext";
import Select from "react-select";

function Data() {
    const { user } = useContext(AuthContext);
    const [filteredFleets, setFilteredFleets] = useState([]);
    const [fleetData, setFleetData] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Form state - Updated with new fields
    const [formData, setFormData] = useState({
        validatorName: "",
        engineerName: "",
        depo: "",
        fleetNumber: "",
        imeiNumber: "",
        simId: "", // New field
        vinNumber: "", // New field
        newImeiNumber: "", // New field
        serviceType: "",
        projectName: "",
        // Check Status specific
        checkType: "",
        // Preventive specific
        preventiveSection: {},
        vehicleStatus: "",
        // Complaints specific
        reportStatus: "",
        // Updates specific
        objective: "",
        updateStatus: "",
        reasonForPending: "",
        // Common fields
        odometer: "",
        partFailure: [],
        partFailureImage: null,
        partReplaceImage: null,
        complaintCloseImage: null,
        problemDescription: "",
        actionTaken: "",
        requiredSpares: [],
        replaceSpares: [],
        remarks: "",
        diagnosticsFile: null,
        deviceInfoFile: null,
        updatesFile: null,
        preventiveFile: null,
        technicalSupport: "",
        tamperingHappened: "",
        tamperingImage: null,
        missingComponent: [],
        replacedComponent: [],
        validation: "",
    });

    // Engineer options (unchanged)
    const engineerOptions = [
        { value: "Adhikesavan", label: "Adhikesavan" },
        { value: "Adithiya", label: "Adithiya" },
        { value: "Adaikalraj", label: "Adaikalraj" },
        { value: "Ahamed Irfan", label: "Ahamed Irfan" },
        { value: "Ahino Alex", label: "Ahino Alex" },
        { value: "Ahs", label: "Ahs" },
        { value: "Alex Pandian", label: "Alex Pandian" },
        { value: "Alphino Alex", label: "Alphino Alex" },
        { value: "Anbarasu", label: "Anbarasu" },
        { value: "Aravindan", label: "Aravindan" },
        { value: "Arivazhagan", label: "Arivazhagan" },
        { value: "Arul Manikaraj", label: "Arul Manikaraj" },
        { value: "Avinesh", label: "Avinesh" },
        { value: "Bagavath", label: "Bagavath" },
        { value: "Bala", label: "Bala" },
        { value: "Balaji", label: "Balaji" },
        { value: "Balan", label: "Balan" },
        { value: "Bharathvaasan", label: "Bharathvaasan" },
        { value: "Chandra", label: "Chandra" },
        { value: "Deepak", label: "Deepak" },
        { value: "Devesh Shivmuni Jaybhaye", label: "Devesh Shivmuni Jaybhaye" },
        { value: "Dhanu Dh Basha", label: "Dhanu Dh Basha" },
        { value: "Dharman", label: "Dharman" },
        { value: "Dharani", label: "Dharani" },
        { value: "Dhurai Murugan", label: "Dhurai Murugan" },
        { value: "Dinesh", label: "Dinesh" },
        { value: "Dinesh Kumar", label: "Dinesh Kumar" },
        { value: "Dinesh S", label: "Dinesh S" },
        { value: "Durai Murugan", label: "Durai Murugan" },
        { value: "Gopi Chand", label: "Gopi Chand" },
        { value: "Guganeshwaran", label: "Guganeshwaran" },
        { value: "Gyanaranjan", label: "Gyanaranjan" },
        { value: "Harish", label: "Harish" },
        { value: "Hrushikesh Santosh Wathore", label: "Hrushikesh Santosh Wathore" },
        { value: "Imran", label: "Imran" },
        { value: "Jaba Durai", label: "Jaba Durai" },
        { value: "Jegan", label: "Jegan" },
        { value: "Jayaprakash", label: "Jayaprakash" },
        { value: "Kailash", label: "Kailash" },
        { value: "Kaif", label: "Kaif" },
        { value: "Kalyan Varikuti", label: "Kalyan Varikuti" },
        { value: "Kannan", label: "Kannan" },
        { value: "Karthick Nagarajan", label: "Karthick Nagarajan" },
        { value: "Kirubakaran", label: "Kirubakaran" },
        { value: "Krishna", label: "Krishna" },
        { value: "Lokesh", label: "Lokesh" },
        { value: "Madhan Kumar", label: "Madhan Kumar" },
        { value: "Maalik", label: "Maalik" },
        { value: "Manibharathi", label: "Manibharathi" },
        { value: "Manikandan", label: "Manikandan" },
        { value: "Manoj Guru", label: "Manoj Guru" },
        { value: "Manoj Kumar", label: "Manoj Kumar" },
        { value: "Manoj Kumar T", label: "Manoj Kumar T" },
        { value: "Mandaar Pankaj Mayekar", label: "Mandaar Pankaj Mayekar" },
        { value: "Muthu Kumar", label: "Muthu Kumar" },
        { value: "Muthukumaran", label: "Muthukumaran" },
        { value: "Muthusamy", label: "Muthusamy" },
        { value: "Nadhagopal", label: "Nadhagopal" },
        { value: "Naeem Khan", label: "Naeem Khan" },
        { value: "Narahari", label: "Narahari" },
        { value: "Naveen", label: "Naveen" },
        { value: "Naveen Kumar S", label: "Naveen Kumar S" },
        { value: "Nithin", label: "Nithin" },
        { value: "Pavan Kumar", label: "Pavan Kumar" },
        { value: "Pradeepan", label: "Pradeepan" },
        { value: "Prashant", label: "Prashant" },
        { value: "Praveen", label: "Praveen" },
        { value: "Ranjith", label: "Ranjith" },
        { value: "Ravaan", label: "Ravaan" },
        { value: "Ravichandran", label: "Ravichandran" },
        { value: "Renganathan", label: "Renganathan" },
        { value: "Roshan Karthick", label: "Roshan Karthick" },
        { value: "Rushikesh Khoje", label: "Rushikesh Khoje" },
        { value: "Sabarish", label: "Sabarish" },
        { value: "Sabarivasan S R", label: "Sabarivasan S R" },
        { value: "Sakthi Pradap", label: "Sakthi Pradap" },
        { value: "Sameer Vasudev Monde", label: "Sameer Vasudev Monde" },
        { value: "Santhosh", label: "Santhosh" },
        { value: "Saranya", label: "Saranya" },
        { value: "Saravanan", label: "Saravanan" },
        { value: "Saravanakumar", label: "Saravanakumar" },
        { value: "Sarvesh Mangesh Kotere", label: "Sarvesh Mangesh Kotere" },
        { value: "Sathiya Prakash", label: "Sathiya Prakash" },
        { value: "Siddesh", label: "Siddesh" },
        { value: "Sivaprakasan", label: "Sivaprakasan" },
        { value: "Surya", label: "Surya" },
        { value: "Suryaprakash Das", label: "Suryaprakash Das" },
        { value: "Thameem", label: "Thameem" },
        { value: "Thanush Kumaran", label: "Thanush Kumaran" },
        { value: "Thirumal", label: "Thirumal" },
        { value: "Varikutti Kalyan", label: "Varikutti Kalyan" },
        { value: "Vamsi", label: "Vamsi" },
        { value: "Vignesh Sasikumar", label: "Vignesh Sasikumar" },
        { value: "Vinoth", label: "Vinoth" },
        { value: "Yogesh", label: "Yogesh" },
        { value: "Yuvaraj", label: "Yuvaraj" },
    ];

    // Options for dropdowns (unchanged)
    const partFailureOptions = [
        { value: "NONE", label: "NONE" },
        { value: "12V POWER SUPPLY", label: "12V POWER SUPPLY" },
        { value: "AMPLIFIER MODULE", label: "AMPLIFIER MODULE" },
        { value: "BASEBOARD", label: "BASEBOARD" },
        { value: "CAN MODULE", label: "CAN MODULE" },
        { value: "FUSE 3AMS", label: "FUSE 3AMS" },
        { value: "MNVR 4 LAYER", label: "MNVR 4 LAYER" },
        { value: "MNVR 6 LAYER", label: "MNVR 6 LAYER" },
        { value: "MNVR CONVERTED", label: "MNVR CONVERTED" },
        { value: "MOTHERBOARD", label: "MOTHERBOARD" },
        { value: "MRS 8PIN CONNECTOR", label: "MRS 8PIN CONNECTOR" },
        { value: "POWER PICTAIL - BOX", label: "POWER PICTAIL - BOX" },
        { value: "QUECTEL CE/MODEM", label: "QUECTEL CE/MODEM" },
        { value: "SSD/HARD DISK", label: "SSD/HARD DISK" },
        { value: "TAMPER SWITCH", label: "TAMPER SWITCH" },
        { value: "MAIN CONNECTOR MALE", label: "MAIN CONNECTOR MALE" },
        { value: "MAIN CONNECTOR FEMALE", label: "MAIN CONNECTOR FEMALE" },
        { value: "UFL MALE AND FEMALE", label: "UFL MALE AND FEMALE" },
        { value: "RMC PIGTAILS", label: "RMC PIGTAILS" },
        { value: "10 PIN TO 10 PIN", label: "10 PIN TO 10 PIN" },
        { value: "3PIN TO 2 PIN", label: "3PIN TO 2 PIN" },
        { value: "VGA CABLE", label: "VGA CABLE" },
        { value: "6 PIN TO 4 TO 4 PIN", label: "6 PIN TO 4 TO 4 PIN" },
        { value: "SATA CABLE", label: "SATA CABLE" },
        { value: "SATA POWER CABLE", label: "SATA POWER CABLE" },
        { value: "SSD CLAMP", label: "SSD CLAMP" },
        { value: "SSD TRAY", label: "SSD TRAY" },
        { value: "SSD CAP", label: "SSD CAP" },
        { value: "INDICATOR LED", label: "INDICATOR LED" },
        { value: "LED PANEL", label: "LED PANEL" },
        { value: "FRONT 1ST CARD", label: "FRONT 1ST CARD" },
        { value: "FRONT 2ND CARD", label: "FRONT 2ND CARD" },
        { value: "FRONT 3RD CARD", label: "FRONT 3RD CARD" },
        { value: "FRONT SAMLL CARD", label: "FRONT SAMLL CARD" },
        { value: "FRONT CONTROL CARD", label: "FRONT CONTROL CARD" },
        { value: "SIDE 1ST CARD", label: "SIDE 1ST CARD" },
        { value: "2ND CARD", label: "2ND CARD" },
        { value: "3RD CARD", label: "3RD CARD" },
        { value: "SIDE CONTROL CARD", label: "SIDE CONTROL CARD" },
        { value: "REAR 1ST CARD", label: "REAR 1ST CARD" },
        { value: "2ND CARD", label: "2ND CARD" },
        { value: "3RD CARD", label: "3RD CARD" },
        { value: "REAR CONTROL CARD", label: "REAR CONTROL CARD" },
        { value: "1ST CARD", label: "1ST CARD" },
        { value: "2ND CARD", label: "2ND CARD" },
        { value: "INBUS COUNTROL CARD", label: "INBUS COUNTROL CARD" },
        { value: "5V POWER SUPPLY", label: "5V POWER SUPPLY" },
        { value: "FRC 10 PIN (2 ROW)", label: "FRC 10 PIN (2 ROW)" },
        { value: "4 PIN POWER PIGTAIL", label: "4 PIN POWER PIGTAIL" },
        { value: "2 PIN POWER PIGTAIIL", label: "2 PIN POWER PIGTAIIL" },
        { value: "16 PIN CONNECTOR", label: "16 PIN CONNECTOR" },
        { value: "LDR PIGTAIL", label: "LDR PIGTAIL" },
        { value: "LAN CABLE", label: "LAN CABLE" },
        { value: "PEOPLE COUNT CAM", label: "PEOPLE COUNT CAM" },
        { value: "POE SWICH", label: "POE SWICH" },
        { value: "CAMERA", label: "CAMERA" },
        { value: "CAMERA 166", label: "CAMERA 166" },
        { value: "CAMERA 167", label: "CAMERA 167" },
        { value: "CAMERA 168", label: "CAMERA 168" },
        { value: "POWER PICTAIL - CAM", label: "POWER PICTAIL - CAM" },
        { value: "REAR CAMERA", label: "REAR CAMERA" },
        { value: "SERVILANCE CAMERA SCAM", label: "SERVILANCE CAMERA SCAM" },
        { value: "BDC", label: "BDC" },
        { value: "MIC", label: "MIC" },
        { value: "ANTENNA", label: "ANTENNA" },
        { value: "SPEAKER", label: "SPEAKER" },
        { value: "BAFO", label: "BAFO" },
        { value: "OTG", label: "OTG" },
        { value: "USB EXTENDER MALE TO FEMALE(2.0)", label: "USB EXTENDER MALE TO FEMALE(2.0)" },
        { value: "TTL", label: "TTL" },
        { value: "ST LINK", label: "ST LINK" },
        { value: "RS 485", label: "RS 485" },
        { value: "PENDRIVE", label: "PENDRIVE" },
        { value: "SCREW DRIVER", label: "SCREW DRIVER" },
        { value: "CUTTER", label: "CUTTER" },
        { value: "KNIFE", label: "KNIFE" },
        { value: "INSULATION TAPE", label: "INSULATION TAPE" },
        { value: "MULTI-METER", label: "MULTI-METER" },
        { value: "USB TO 4PIN RMC", label: "USB TO 4PIN RMC" },
        { value: "USB TO SATA", label: "USB TO SATA" },
        { value: "LAN CABLE AND EXTENDER", label: "LAN CABLE AND EXTENDER" },
        { value: "3PIN TO 3PIN PICTAIL", label: "3PIN TO 3PIN PICTAIL" },
        { value: "10PIN TO 3PIN PICTAL", label: "10PIN TO 3PIN PICTAL" },
        { value: "CAN CABLE", label: "CAN CABLE" },
        { value: "TTL STOMING PICTILES", label: "TTL STOMING PICTILES" },
        { value: "USB EXTENDER", label: "USB EXTENDER" },
        { value: "INSOLATION TAPE", label: "INSOLATION TAPE" },
        { value: "NET DRIVE", label: "NET DRIVE" },
        { value: "NET DRIVE 5MM", label: "NET DRIVE 5MM" },
        { value: "NET DRIVE 5.5MM", label: "NET DRIVE 5.5MM" },
        { value: "NET DRIVE 7", label: "NET DRIVE 7" },
        { value: "NET DRIVE8", label: "NET DRIVE8" },
        { value: "NOSE PLAYER", label: "NOSE PLAYER" },
        { value: "RMC PICTAILS", label: "RMC PICTAILS" },
        { value: "SCREW DRIVER SMALL BIG", label: "SCREW DRIVER SMALL BIG" },
        { value: "SCROW DRIVE BIG", label: "SCROW DRIVE BIG" },
        { value: "SOLDERING", label: "SOLDERING" },
        { value: "SOLDRING WITH LEAD", label: "SOLDRING WITH LEAD" },
        { value: "SPANNER 14", label: "SPANNER 14" },
        { value: "SPANNER 13", label: "SPANNER 13" },
        { value: "SPANNER 7 AND 10", label: "SPANNER 7 AND 10" },
        { value: "ST LINK AND RJ485", label: "ST LINK AND RJ485" },
        { value: "TWEEZER", label: "TWEEZER" },
        { value: "UFL CONNECTOR", label: "UFL CONNECTOR" },
        { value: "USB TO 4PIN RMC & RMC TO USB CONNECTOR", label: "USB TO 4PIN RMC & RMC TO USB CONNECTOR" },
        { value: "LAN CRIMPING TOOL RJ45", label: "LAN CRIMPING TOOL RJ45" },
        { value: "LAN TESTER", label: "LAN TESTER" }
    ];

    const requiredSparesOptions = partFailureOptions;

    // Load Excel file when component mounts
    useEffect(() => {
        fetch("/MASTER_DATA_RAJ.xlsx")
            .then((res) => res.arrayBuffer())
            .then((data) => {
                const workbook = XLSX.read(data, { type: "array" });
                const sheet = workbook.Sheets["MASTER"];
                if (sheet) {
                    const jsonData = XLSX.utils.sheet_to_json(sheet);
                    setFleetData(jsonData);
                }
            })
            .catch((err) => console.error("Excel Load Error:", err));
    }, []);

    // Auto-set validator name from user context and persist it
    useEffect(() => {
        if (user?.username) {
            setFormData(prev => ({
                ...prev,
                validatorName: user.username
            }));
            localStorage.setItem('validatorName', user.username);
        }
    }, [user]);

    // Load validator name from localStorage on component mount (page refresh)
    useEffect(() => {
        const savedValidatorName = localStorage.getItem('validatorName');
        if (savedValidatorName && !formData.validatorName) {
            setFormData(prev => ({
                ...prev,
                validatorName: savedValidatorName
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle preventive section changes
    const handlePreventiveSection = (field, value) => {
        setFormData({
            ...formData,
            preventiveSection: { ...formData.preventiveSection, [field]: value },
        });
    };

    // Mark all preventive components as OKAY or NOT_OKAY
    const handleMarkAll = (status) => {
        const components = [
            "CAM STREAMING",
            "CAMERA DATE & TIME",
            "REAR CAM POPUP",
            "FDU",
            "SDU",
            "RDU",
            "IDU",
            "ALL LED ROUTE UPDATE",
            "MIC",
            "GPS",
            "GSM",
            "CAN",
            "M-ANN",
            "BDC COLOR",
            "BDC TOUCH",
            "USB DETECTING",
            "PLAYBACK",
            "LED PCB",
            "PREOPLE COUNT CAM COUNTING",
            "DATA PACKET",
            "FIRMWARE VERSION IN CURRENT UPDATE",
            "PIS IN CURRENT VERSION",
        ];

        const updatedSection = {};
        components.forEach((item) => {
            updatedSection[item] = status;
        });

        setFormData((prev) => ({
            ...prev,
            preventiveSection: updatedSection,
        }));
    };

    // Handle typing Fleet Number
    const handleFleetNumberChange = (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, fleetNumber: value }));

        if (value.length > 0) {
            const filtered = fleetData.filter((fleet) =>
                String(fleet["Fleet Number"] || "")
                    .toLowerCase()
                    .includes(value.toLowerCase())
            );
            setFilteredFleets(filtered);
            setShowDropdown(true);
        } else {
            setFilteredFleets([]);
            setShowDropdown(false);
        }
    };

    // Handle selecting a Fleet from dropdown
    const handleSelectFleet = (fleet) => {
        setFormData((prev) => ({
            ...prev,
            fleetNumber: fleet["Fleet Number"],
            depo: fleet["Depot"],
            imeiNumber: fleet["Device ID"] || fleet["IMEI"] || "",
        }));
        setFilteredFleets([]);
        setShowDropdown(false);
    };

    // Reset form - Updated with new fields
    const resetForm = () => {
        const currentValidator = formData.validatorName;
        setFormData({
            validatorName: currentValidator,
            engineerName: "",
            depo: "",
            fleetNumber: "",
            imeiNumber: "",
            simId: "", // Reset new field
            vinNumber: "", // Reset new field
            newImeiNumber: "", // Reset new field
            serviceType: "",
            projectName: "",
            // Check Status specific
            checkType: "",
            // Preventive specific
            preventiveSection: {},
            vehicleStatus: "",
            // Complaints specific
            reportStatus: "",
            // Updates specific
            objective: "",
            updateStatus: "",
            reasonForPending: "",
            // Common fields
            odometer: "",
            partFailure: [],
            partFailureImage: null,
            partReplaceImage: null,
            complaintCloseImage: null,
            problemDescription: "",
            actionTaken: "",
            requiredSpares: [],
            replaceSpares: [],
            remarks: "",
            diagnosticsFile: null,
            deviceInfoFile: null,
            updatesFile: null,
            preventiveFile: null,
            technicalSupport: "",
            tamperingHappened: "",
            tamperingImage: null,
            missingComponent: [],
            replacedComponent: [],
            validation: "",
        });
    };

    // Validate form based on service type
    const validateForm = () => {
        return true;
    };

    // Handle form submit - Updated with new fields
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        // Helper: Convert file to Base64
        const toBase64 = (file) =>
            new Promise((resolve, reject) => {
                if (!file) return resolve(null);
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const base64 = reader.result.split(",")[1];
                    resolve({ data: base64, mimeType: file.type, name: file.name });
                };
                reader.onerror = (error) => reject(error);
            });

        try {
            // Convert all files
            const preventiveFile = await toBase64(formData.preventiveFile);
            const partFailureImage = await toBase64(formData.partFailureImage);
            const partReplaceImage = await toBase64(formData.partReplaceImage);
            const complaintCloseImage = await toBase64(formData.complaintCloseImage);
            const diagnosticsFile = await toBase64(formData.diagnosticsFile);
            const deviceInfoFile = await toBase64(formData.deviceInfoFile);
            const updatesFile = await toBase64(formData.updatesFile);
            const tamperingImage = await toBase64(formData.tamperingImage);

            // Prepare payload with new fields
            const payload = {
                ...formData,
                preventiveFile,
                partFailureImage,
                partReplaceImage,
                complaintCloseImage,
                diagnosticsFile,
                deviceInfoFile,
                updatesFile,
                tamperingImage,
                partFailure: formData.partFailure || [],
                requiredSpares: formData.requiredSpares || [],
                replaceSpares: formData.replaceSpares || [],
                missingComponent: formData.missingComponent || [],
                replacedComponent: formData.replacedComponent || [],
                preventiveSection: formData.preventiveSection || {}
            };

            // Send to Google Apps Script
            const response = await fetch(
                "https://script.google.com/macros/s/AKfycbyl91Fol8_AgZWbquuhKnNfvtbbiVn5UiLfmqGjgDNxzrqPZ1L5xRZXr2zpfOEIYoplgg/exec",
                {
                    method: "POST",
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) throw new Error("Failed to submit form");

            const result = await response.json();
            alert("Form submitted successfully!");

            // Reset form
            resetForm();

        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Error: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Render common fields for Open status
    const renderOpenFields = () => (
        <>
            <div className="form-group">
                <label>Odometer:</label>
                <input
                    type="text"
                    name="odometer"
                    value={formData.odometer}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Part Failure:</label>
                <Select
                    isMulti
                    name="partFailure"
                    options={partFailureOptions}
                    value={partFailureOptions.filter((opt) =>
                        (formData.partFailure || []).includes(opt.value)
                    )}
                    onChange={(selected) =>
                        setFormData((prev) => ({
                            ...prev,
                            partFailure: selected ? selected.map((s) => s.value) : [],
                        }))
                    }
                    placeholder="Select failed parts"
                />
            </div>

            <div className="form-group">
                <label>Part Failure Image:</label>
                <input
                    type="file"
                    name="partFailureImage"
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Problem Description:</label>
                <textarea
                    name="problemDescription"
                    value={formData.problemDescription}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="form-group">
                <label>Action Taken:</label>
                <textarea
                    name="actionTaken"
                    value={formData.actionTaken}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="form-group">
                <label>Required Spares:</label>
                <Select
                    isMulti
                    name="requiredSpares"
                    options={requiredSparesOptions}
                    value={requiredSparesOptions.filter((opt) =>
                        (formData.requiredSpares || []).includes(opt.value)
                    )}
                    onChange={(selected) =>
                        setFormData((prev) => ({
                            ...prev,
                            requiredSpares: selected ? selected.map((s) => s.value) : [],
                        }))
                    }
                    placeholder="Select required spares"
                />
            </div>
        </>
    );

    // Render common fields for Close status (Preventive)
    const renderPreventiveCloseFields = () => (
        <>
            <div className="form-group">
                <label>Odometer:</label>
                <input
                    type="text"
                    name="odometer"
                    value={formData.odometer}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Part Failure:</label>
                <Select
                    isMulti
                    name="partFailure"
                    options={partFailureOptions}
                    value={partFailureOptions.filter((opt) =>
                        (formData.partFailure || []).includes(opt.value)
                    )}
                    onChange={(selected) =>
                        setFormData((prev) => ({
                            ...prev,
                            partFailure: selected ? selected.map((s) => s.value) : [],
                        }))
                    }
                    placeholder="Select failed parts"
                />
            </div>

            <div className="form-group">
                <label>Part Failure Image:</label>
                <input
                    type="file"
                    name="partFailureImage"
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Replace Spares:</label>
                <Select
                    isMulti
                    name="replaceSpares"
                    options={requiredSparesOptions}
                    value={requiredSparesOptions.filter((opt) =>
                        (formData.replaceSpares || []).includes(opt.value)
                    )}
                    onChange={(selected) =>
                        setFormData((prev) => ({
                            ...prev,
                            replaceSpares: selected ? selected.map((s) => s.value) : [],
                        }))
                    }
                    placeholder="Select replaced spares"
                />
            </div>

            <div className="form-group">
                <label>Problem Description:</label>
                <textarea
                    name="problemDescription"
                    value={formData.problemDescription}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="form-group">
                <label>Action Taken:</label>
                <textarea
                    name="actionTaken"
                    value={formData.actionTaken}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="form-group">
                <label>Required Spares:</label>
                <Select
                    isMulti
                    name="requiredSpares"
                    options={requiredSparesOptions}
                    value={requiredSparesOptions.filter((opt) =>
                        (formData.requiredSpares || []).includes(opt.value)
                    )}
                    onChange={(selected) =>
                        setFormData((prev) => ({
                            ...prev,
                            requiredSpares: selected ? selected.map((s) => s.value) : [],
                        }))
                    }
                    placeholder="Select required spares"
                />
            </div>
        </>
    );

    // Render common fields for Close status (Complaints)
    const renderComplaintsCloseFields = () => (
        <>
            <div className="form-group">
                <label>Odometer:</label>
                <input
                    type="text"
                    name="odometer"
                    value={formData.odometer}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Part Failure:</label>
                <Select
                    isMulti
                    name="partFailure"
                    options={partFailureOptions}
                    value={partFailureOptions.filter((opt) =>
                        (formData.partFailure || []).includes(opt.value)
                    )}
                    onChange={(selected) =>
                        setFormData((prev) => ({
                            ...prev,
                            partFailure: selected ? selected.map((s) => s.value) : [],
                        }))
                    }
                    placeholder="Select failed parts"
                />
            </div>

            <div className="form-group">
                <label>Part Failure Image:</label>
                <input
                    type="file"
                    name="partFailureImage"
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Part Replace Image:</label>
                <input
                    type="file"
                    name="partReplaceImage"
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Complaint Close Image:</label>
                <input
                    type="file"
                    name="complaintCloseImage"
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Replace Spares:</label>
                <Select
                    isMulti
                    name="replaceSpares"
                    options={requiredSparesOptions}
                    value={requiredSparesOptions.filter((opt) =>
                        (formData.replaceSpares || []).includes(opt.value)
                    )}
                    onChange={(selected) =>
                        setFormData((prev) => ({
                            ...prev,
                            replaceSpares: selected ? selected.map((s) => s.value) : [],
                        }))
                    }
                    placeholder="Select replaced spares"
                />
            </div>

            <div className="form-group">
                <label>Problem Description:</label>
                <textarea
                    name="problemDescription"
                    value={formData.problemDescription}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="form-group">
                <label>Action Taken:</label>
                <textarea
                    name="actionTaken"
                    value={formData.actionTaken}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="form-group">
                <label>Required Spares:</label>
                <Select
                    isMulti
                    name="requiredSpares"
                    options={requiredSparesOptions}
                    value={requiredSparesOptions.filter((opt) =>
                        (formData.requiredSpares || []).includes(opt.value)
                    )}
                    onChange={(selected) =>
                        setFormData((prev) => ({
                            ...prev,
                            requiredSpares: selected ? selected.map((s) => s.value) : [],
                        }))
                    }
                    placeholder="Select required spares"
                />
            </div>
        </>
    );

    // Render common fields for None status
    const renderNoneFields = () => (
        <div className="form-group">
            <label>Remarks:</label>
            <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
            ></textarea>
        </div>
    );

    // Render common technical and tampering fields
    const renderTechnicalAndTamperingFields = () => (
        <>
            <div className="form-group">
                <label>System Diagnostics:</label>
                <input
                    type="file"
                    name="diagnosticsFile"
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Device Information:</label>
                <input
                    type="file"
                    name="deviceInfoFile"
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Technical Support Required:</label>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            name="technicalSupport"
                            value="No"
                            checked={formData.technicalSupport === "No"}
                            onChange={handleChange}
                        />
                        No
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="technicalSupport"
                            value="Yes"
                            checked={formData.technicalSupport === "Yes"}
                            onChange={handleChange}
                        />
                        Yes
                    </label>
                </div>
            </div>

            <div className="form-group">
                <label>Tampering Happened:</label>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            name="tamperingHappened"
                            value="No"
                            checked={formData.tamperingHappened === "No"}
                            onChange={handleChange}
                        />
                        No
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="tamperingHappened"
                            value="Yes"
                            checked={formData.tamperingHappened === "Yes"}
                            onChange={handleChange}
                        />
                        Yes
                    </label>
                </div>
            </div>

            {formData.tamperingHappened === "Yes" && (
                <>
                    <div className="form-group">
                        <label>Tampering Image:</label>
                        <input
                            type="file"
                            name="tamperingImage"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Missing Component:</label>
                        <Select
                            isMulti
                            name="missingComponent"
                            options={partFailureOptions}
                            value={partFailureOptions.filter((opt) =>
                                (formData.missingComponent || []).includes(opt.value)
                            )}
                            onChange={(selected) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    missingComponent: selected ? selected.map((s) => s.value) : [],
                                }))
                            }
                            placeholder="Select missing components"
                        />
                    </div>

                    <div className="form-group">
                        <label>Replaced Component:</label>
                        <Select
                            isMulti
                            name="replacedComponent"
                            options={requiredSparesOptions}
                            value={requiredSparesOptions.filter((opt) =>
                                (formData.replacedComponent || []).includes(opt.value)
                            )}
                            onChange={(selected) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    replacedComponent: selected ? selected.map((s) => s.value) : [],
                                }))
                            }
                            placeholder="Select replaced components"
                        />
                    </div>
                </>
            )}

            <div className="form-group">
                <label>Validation:</label>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            name="validation"
                            value="Valid"
                            checked={formData.validation === "Valid"}
                            onChange={handleChange}
                        />
                        Valid
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="validation"
                            value="Invalid"
                            checked={formData.validation === "Invalid"}
                            onChange={handleChange}
                        />
                        Invalid
                    </label>
                </div>
            </div>
        </>
    );

    // Render preventive section
    const renderPreventiveSection = () => (
        <>
            <div className="form-group preventive-section">
                <h4 className="section-title">Preventive Section</h4>
                <div className="button-group">
                    <button type="button" onClick={() => handleMarkAll("OKAY")} className="btn btn-success btn-sm">
                        All OK
                    </button>
                    <button type="button" onClick={() => handleMarkAll("NOT_OKAY")} className="btn btn-danger btn-sm">
                        All Not OK
                    </button>
                </div>

                <div className="preventive-table-container">
                    <table className="preventive-table">
                        <thead>
                            <tr>
                                <th>Component</th>
                                <th>OKAY</th>
                                <th>NOT OKAY</th>
                                <th>NOT APPLICABLE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                "CAM STREAMING",
                                "CAMERA DATE & TIME",
                                "REAR CAM POPUP",
                                "FDU",
                                "SDU",
                                "RDU",
                                "IDU",
                                "ALL LED ROUTE UPDATE",
                                "MIC",
                                "GPS",
                                "GSM",
                                "CAN",
                                "M-ANN",
                                "BDC COLOR",
                                "BDC TOUCH",
                                "USB DETECTING",
                                "PLAYBACK",
                                "LED PCB",
                                "PREOPLE COUNT CAM COUNTING",
                                "DATA PACKET",
                                "FIRMWARE VERSION IN CURRENT UPDATE",
                                "PIS IN CURRENT VERSION",
                            ].map((item) => (
                                <tr key={item}>
                                    <td>{item}</td>
                                    <td>
                                        <input
                                            type="radio"
                                            name={item}
                                            value="OKAY"
                                            checked={formData.preventiveSection[item] === "OKAY"}
                                            onChange={(e) => handlePreventiveSection(item, e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="radio"
                                            name={item}
                                            value="NOT_OKAY"
                                            checked={formData.preventiveSection[item] === "NOT_OKAY"}
                                            onChange={(e) => handlePreventiveSection(item, e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="radio"
                                            name={item}
                                            value="NOT_APPLICABLE"
                                            checked={formData.preventiveSection[item] === "NOT_APPLICABLE"}
                                            onChange={(e) => handlePreventiveSection(item, e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="note">This question requires one response per row</p>
            </div>

            <div className="form-group">
                <label>Vehicle Status:</label>
                <select
                    name="vehicleStatus"
                    value={formData.vehicleStatus}
                    onChange={handleChange}
                >
                    <option value="">Select</option>
                    <option value="Open">Open</option>
                    <option value="Close">Close</option>
                    <option value="None">None</option>
                </select>
            </div>

            {formData.vehicleStatus === "Open" && (
                <>
                    {renderOpenFields()}
                    {renderNoneFields()}
                    {renderTechnicalAndTamperingFields()}
                </>
            )}

            {formData.vehicleStatus === "Close" && (
                <>
                    {renderPreventiveCloseFields()}
                    {renderNoneFields()}
                    {renderTechnicalAndTamperingFields()}
                </>
            )}

            {formData.vehicleStatus === "None" && (
                <>
                    {renderNoneFields()}
                    {renderTechnicalAndTamperingFields()}
                </>
            )}
        </>
    );

    // Render complaints section
    const renderComplaintsSection = () => (
        <>
            <div className="form-group">
                <label>Report Status:</label>
                <select
                    name="reportStatus"
                    value={formData.reportStatus}
                    onChange={handleChange}
                >
                    <option value="">Select</option>
                    <option value="Open">Open</option>
                    <option value="Close">Close</option>
                </select>
            </div>

            {formData.reportStatus === "Open" && (
                <>
                    {renderOpenFields()}
                    {renderNoneFields()}
                    {renderTechnicalAndTamperingFields()}
                </>
            )}

            {formData.reportStatus === "Close" && (
                <>
                    {renderComplaintsCloseFields()}
                    {renderNoneFields()}
                    {renderTechnicalAndTamperingFields()}
                </>
            )}
        </>
    );

    // Render updates section
    const renderUpdatesSection = () => (
        <>
            <div className="form-group">
                <label>Objectives:</label>
                <select
                    name="objective"
                    value={formData.objective}
                    onChange={handleChange}
                >
                    <option value="">Select</option>
                    <option value="XML">XML</option>
                    <option value="Firmware Update">Firmware Update</option>
                    <option value="SIM Installation">SIM Installation</option>
                    <option value="Software Update">Software Update</option>
                    <option value="PIS Update">PIS Update</option>
                </select>
            </div>

            <div className="form-group">
                <label>Updates Attachment:</label>
                <input
                    type="file"
                    name="updatesFile"
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Update Status:</label>
                <select
                    name="updateStatus"
                    value={formData.updateStatus}
                    onChange={handleChange}
                >
                    <option value="">Select</option>
                    <option value="Updated">Updated</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>

            {formData.updateStatus === "Pending" && (
                <div className="form-group">
                    <label>Reason for Pending:</label>
                    <textarea
                        name="reasonForPending"
                        value={formData.reasonForPending}
                        onChange={handleChange}
                    ></textarea>
                </div>
            )}

            {renderNoneFields()}
            {renderTechnicalAndTamperingFields()}
        </>
    );

    // Render check status section (simplified - only dropdown)
    const renderCheckStatusSection = () => (
        <>
            <div className="form-group">
                <label>Check Type:</label>
                <select
                    name="checkType"
                    value={formData.checkType}
                    onChange={handleChange}
                >
                    <option value="">Select Check Type</option>
                    <option value="Announcement Check">Announcement Check</option>
                    <option value="2-line Check">2-line Check</option>
                    <option value="10-line Check">10-line Check</option>
                </select>
            </div>

            {renderNoneFields()}
            {renderTechnicalAndTamperingFields()}
        </>
    );

    return (
        <div className="switch container mt-5">
            <h2>Data Service Form</h2>
            <form onSubmit={handleSubmit} className="form-container">

                <div className="form-group">
                    <label>Project Name:</label>
                    <select
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Select Project --</option>
                        <option value="Amnex">Amnex</option>
                        <option value="Low Floor">AL LowFloor</option>
                        <option value="Switch">Switch</option>
                        <option value="OGL">OGL</option>
                    </select>
                </div>

                {/* Validator Name */}
                <div className="form-group">
                    <label>Validator: <span className="required">*</span></label>
                    <input
                        type="text"
                        name="validatorName"
                        value={formData.validatorName}
                        onChange={handleChange}
                        disabled
                        required
                        placeholder="Loading username..."
                    />
                </div>

                {/* Engineer Name */}
                <div className="form-group">
                    <label>Engineer Name:</label>
                    <select
                        name="engineerName"
                        value={formData.engineerName}
                        onChange={handleChange}
                    >
                        <option value="">-- Select Engineer --</option>
                        {engineerOptions.map(engineer => (
                            <option key={engineer.value} value={engineer.value}>
                                {engineer.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Fleet Number */}
                <div className="form-group" style={{ position: 'relative' }}>
                    <label>Fleet Number:</label>
                    <input
                        type="text"
                        value={formData.fleetNumber}
                        onChange={handleFleetNumberChange}
                        placeholder="Type Fleet Number"
                    />
                    {filteredFleets.length > 0 && (
                        <ul className="dropdown" style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            zIndex: 1000,
                            margin: 0,
                            padding: 0,
                            listStyle: 'none'
                        }}>
                            {filteredFleets.map((fleet, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelectFleet(fleet)}
                                    style={{
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #eee'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                >
                                    {fleet["Fleet Number"]}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Depot */}
                <div className="form-group">
                    <label>Depot:</label>
                    <input
                        type="text"
                        name="depo"
                        value={formData.depo}
                        onChange={handleChange}
                        placeholder="Enter Depot Name"
                    />
                </div>

                {/* IMEI Number */}
                <div className="form-group">
                    <label>IMEI Number:</label>
                    <input
                        type="text"
                        name="imeiNumber"
                        value={formData.imeiNumber}
                        onChange={handleChange}
                        placeholder="Enter IMEI Number"
                    />
                </div>

                {/* SIM ID - Corrected with name attribute */}
                <div className="form-group">
                    <label>SIM ID:</label>
                    <input
                        type="text"
                        name="simId"
                        value={formData.simId}
                        onChange={handleChange}
                        placeholder="Enter SIM ID"
                    />
                </div>

                {/* VIN NUMBER - Corrected with name attribute */}
                <div className="form-group">
                    <label>VIN NUMBER:</label>
                    <input
                        type="text"
                        name="vinNumber"
                        value={formData.vinNumber}
                        onChange={handleChange}
                        placeholder="Enter VIN Number"
                    />
                </div>

                {/* NEW IMEI NUMBER - Corrected with name attribute */}
                <div className="form-group">
                    <label>NEW IMEI NUMBER:</label>
                    <input
                        type="text"
                        name="newImeiNumber"
                        value={formData.newImeiNumber}
                        onChange={handleChange}
                        placeholder="Enter New IMEI Number"
                    />
                </div>

                {/* Service Type */}
                <div className="form-group">
                    <label>Service Type:</label>
                    <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="Check Status">Check Status</option>
                        <option value="Preventive">Preventive</option>
                        <option value="Complaints">Complaints</option>
                        <option value="Updates">Updates</option>
                    </select>
                </div>

                {/* Render appropriate section based on service type */}
                {formData.serviceType === "Check Status" && renderCheckStatusSection()}
                {formData.serviceType === "Preventive" && renderPreventiveSection()}
                {formData.serviceType === "Complaints" && renderComplaintsSection()}
                {formData.serviceType === "Updates" && renderUpdatesSection()}

                {/* Submit and Reset Buttons */}
                <div className="form-actions">
                    <button type="submit" disabled={submitting} className="btn btn-primary">
                        {submitting ? "Saving..." : "Submit"}
                    </button>
                    {/* <button type="button" onClick={resetForm} className="btn btn-secondary">
                        Reset Form
                    </button> */}
                </div>
            </form>
        </div>
    );
}

export default Data;