let currentStudent = null;

// Multi-language Translation Dictionary
const translations = {
    en: {
        adminTitle: "Admin Portal Login",
        studentTitle: "Student Verification & Portal",
        verifyBtn: "Verify & Proceed",
        adminLoginBtn: "Login as Admin"
    },
    hi: {
        adminTitle: "एडमिन पोर्टल लॉगिन",
        studentTitle: "छात्र सत्यापन और पोर्टल",
        verifyBtn: "सत्यापित करें और आगे बढ़ें",
        adminLoginBtn: "एडमिन लॉगिन करें"
    }
};

function changeLanguage() {
    const lang = document.getElementById("langSelect").value;
    document.querySelectorAll("[data-en]").forEach(elem => {
        elem.innerText = elem.getAttribute(`data-${lang}`);
    });
}

function showSection(sectionId) {
    document.getElementById("adminSection").style.display = "none";
    document.getElementById("studentSection").style.display = "none";
    document.getElementById(sectionId).style.display = "block";
}

// Admin Login Logic
async function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.success) {
        document.getElementById("adminLoginForm").style.display = "none";
        document.getElementById("adminDashboard").style.display = "block";
        loadAuditLogs();
    } else {
        alert("Invalid Admin Credentials!");
    }
}

function adminLogout() {
    document.getElementById("adminLoginForm").style.display = "block";
    document.getElementById("adminDashboard").style.display = "none";
}

// Student Verification & Login Logic
async function verifyStudent(e) {
    e.preventDefault();
    const name = document.getElementById("studentName").value;
    const email = document.getElementById("studentEmail").value;

    const res = await fetch("/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
    });

    const data = await res.json();
    if (data.success) {
        currentStudent = { name, email };
        document.getElementById("studentAuthBox").style.display = "none";
        document.getElementById("studentFeed").style.display = "block";
        document.getElementById("displayName").innerText = name;
        
        // Setup WhatsApp link with custom pre-filled message
        const waMsg = encodeURIComponent(`Hello Avanthi Admin, I am student ${name} (${email}). I have a query regarding a notice.`);
        document.getElementById("whatsappLink").href = `https://wa.me/919876543210?text=${waMsg}`;
        
        fetchNotices();
    }
}

async function studentLogout() {
    if (currentStudent) {
        await fetch("/api/student/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentStudent)
        });
        currentStudent = null;
    }
    document.getElementById("studentAuthBox").style.display = "block";
    document.getElementById("studentFeed").style.display = "none";
}

// Fetch Notices for Student Dashboard
async function fetchNotices() {
    const res = await fetch("/api/notices");
    const notices = await res.json();
    const list = document.getElementById("noticesList");
    list.innerHTML = "";

    notices.forEach(notice => {
        list.innerHTML += `
            <div class="notice-item">
                <div class="notice-date">📅 Posted on: ${notice.date}</div>
                <h3 style="color:#d32f2f; margin: 5px 0;">${notice.title}</h3>
                <p>${notice.description}</p>
            </div>
        `;
    });
}

// Post Notice (Admin)
async function postNotice(e) {
    e.preventDefault();
    const title = document.getElementById("noticeTitle").value;
    const description = document.getElementById("noticeDesc").value;

    await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
    });

    alert("Notice Published Successfully!");
    document.getElementById("noticeForm").reset();
}

// Load Audit Logs for Admin
async function loadAuditLogs() {
    const res = await fetch("/api/admin/audit-logs");
    const logs = await res.json();
    const tbody = document.getElementById("auditLogsBody");
    tbody.innerHTML = "";

    logs.forEach(log => {
        tbody.innerHTML += `
            <tr>
                <td>${log.name}</td>
                <td>${log.email}</td>
                <td style="color: ${log.action === 'LOGIN' ? 'green' : 'red'}; font-weight:bold;">${log.action}</td>
                <td>${log.timestamp}</td>
            </tr>
        `;
    });
}
