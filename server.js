const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// In-Memory Storage for Notices
let notices = [
    {
        id: 1,
        title: "Welcome to Avanthi Digital Notice Board",
        description: "All upcoming exam schedules and circulars will be published here.",
        date: new Date().toLocaleDateString()
    }
];

let auditLogs = []; // Stores student login/logout logs

// Admin Login Endpoint (Corrected Email: jdurgagovind7@gmail.com)
app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;
    if (email === "jdurgagovind7@gmail.com" && password === "292014") {
        return res.json({ success: true, message: "Admin Logged In Successfully" });
    }
    return res.status(401).json({ success: false, message: "Invalid Credentials" });
});

// Student Login & Audit Logging
app.post("/api/student/login", (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ success: false, message: "Name and Email are required" });
    }

    // Add Login Log
    auditLogs.push({
        name,
        email,
        action: "LOGIN",
        timestamp: new Date().toLocaleString()
    });

    res.json({ success: true, message: "Student Verified" });
});

// Student Logout Logging
app.post("/api/student/logout", (req, res) => {
    const { name, email } = req.body;

    auditLogs.push({
        name,
        email,
        action: "LOGOUT",
        timestamp: new Date().toLocaleString()
    });

    res.json({ success: true });
});

// Get All Notices
app.get("/api/notices", (req, res) => {
    res.json(notices);
});

// Add New Notice (Admin)
app.post("/api/notices", (req, res) => {
    const { title, description } = req.body;
    const newNotice = {
        id: notices.length + 1,
        title,
        description,
        date: new Date().toLocaleDateString()
    };
    notices.unshift(newNotice);
    res.json({ success: true, notice: newNotice });
});

// Get Audit Logs (Admin only)
app.get("/api/admin/audit-logs", (req, res) => {
    res.json(auditLogs);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
