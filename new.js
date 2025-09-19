// =================== BASE CONFIG ===================
const API_BASE_URL = "http://localhost:8080"; // backend running port

// =================== TAB FUNCTIONALITY ===================
function openTab(tabName, event) {
    const tabContents = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// =================== SECTION HANDLING ===================
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });

    document.getElementById(sectionId).style.display = 'block';
    window.scrollTo(0, 0);
}

// =================== MODALS ===================
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function openRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// =================== AUTHENTICATION ===================
async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.user.name);
            alert('Login successful!');
            closeModal('loginModal');
            updateUIAfterLogin(data.user.name);
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
    }
}

async function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();


        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.user.name);
            alert('Registration successful! You are now logged in.');
            closeModal('registerModal');
            updateUIAfterLogin(data.user.name);
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
    }
}

function updateUIAfterLogin(userName) {
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-name').textContent = userName;
    document.getElementById('greeting').style.display = 'block';
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    document.getElementById('auth-buttons').style.display = 'flex';
    document.getElementById('greeting').style.display = 'none';
    document.getElementById('results').style.display = 'none';
}

// Keep user logged in after refresh
window.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
        updateUIAfterLogin(userName);
    }
});

// =================== CITY DATA ===================
const cityData = {
    'andhra': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool'],
    'bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia'],
    'delhi': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'West Delhi'],
    'gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    'karnataka': ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru', 'Belagavi'],
    'kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Kollam', 'Thrissur'],
    'madhya': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain'],
    'maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer'],
    'tamil': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    'uttar': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj'],
    'west': ['Kolkata', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman']
};

function updateCities() {
    const stateSelect = document.getElementById('state');
    const citySelect = document.getElementById('city');
    const selectedState = stateSelect.value;

    citySelect.innerHTML = '<option value="">Select your city</option>';

    if (selectedState && cityData[selectedState]) {
        cityData[selectedState].forEach(city => {
            const option = document.createElement('option');
            option.value = city.toLowerCase();
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

// =================== PURPOSE ===================
let selectedPurpose = '';

function selectPurpose(purpose, event) {
    selectedPurpose = purpose;

    // Reset styles for all
    document.querySelectorAll('.purpose-option').forEach(el => el.classList.remove('selected'));

    // Highlight the clicked option
    event.currentTarget.classList.add('selected');

    // Hide both conditional fields first
    document.getElementById('domestic-fields').style.display = "none";
    document.getElementById('recharge-fields').style.display = "none";

    // Show the right one
    if (purpose === 'domestic') {
        document.getElementById('domestic-fields').style.display = "block";
    } else if (purpose === 'recharge') {
        document.getElementById('recharge-fields').style.display = "block";
    }
}

// =================== CALCULATOR ===================
async function generateReport() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to use the rainwater calculator.');
        return;
    }

    const userName = localStorage.getItem('userName') || 'N/A';
    const payload = {
        state: document.getElementById('state').value,
        city: document.getElementById('city').value,
        roofType: document.getElementById('roof-type').value,
        roofArea: document.getElementById('roof-area').value,
        familySize: document.getElementById('family-size')?.value,
        purpose: selectedPurpose,
        name: userName
    };

    try {
        const res = await fetch(`${API_BASE_URL}/api/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log(data);

        const report = data;

        // Populate User Details
        document.getElementById('report-name').textContent = report.name;
        document.getElementById('report-location').textContent = `${report.city}, ${report.state}`;
        document.getElementById('report-rainfall').textContent = report.averageAnnualRainfall;
        document.getElementById('report-roof').textContent = report.roofType;
        document.getElementById('report-purpose').textContent = report.purpose;

        // Potential
        document.getElementById('report-potential').textContent = `${report.potentialLiters} Liters`;
        document.getElementById('report-potential-text').textContent =
            `Based on your roof area and local rainfall, you can harvest approx. ${report.potentialLiters} liters annually.`;

        // Recommended System
        document.getElementById('report-system').textContent = `Recommended system: ${report.recommendedSystem}`;

        // Cost Estimation
        document.getElementById('report-cost').textContent = `₹${report.estimatedCost.min} - ₹${report.estimatedCost.max}`;
        const materialsEl = document.getElementById('report-materials');
        materialsEl.innerHTML = '';
        report.materials.forEach(mat => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${mat.name}</span> <span>${mat.cost}</span>`;
            materialsEl.appendChild(li);
        });

        // Savings
        document.getElementById('report-savings').textContent = report.savings;
        document.getElementById('report-savings-text').textContent = report.savingsText;

        // Implementation Steps
        const stepsEl = document.getElementById('report-steps');
        stepsEl.innerHTML = '';
        report.steps.forEach((step, i) => {
            const div = document.createElement('div');
            div.classList.add('step');
            div.innerHTML = `<div class="step-number">${i + 1}</div><p>${step}</p>`;
            stepsEl.appendChild(div);
        });

        // Show results
        document.getElementById('calculate').style.display = 'none';
        document.getElementById('results').style.display = 'block';
        window.scrollTo(0, 0);

    } catch (err) {
        console.error(err);
        alert('Something went wrong while generating the report.');
    }
}

// =================== PDF DOWNLOAD ===================
// =================== PDF DOWNLOAD ===================
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
        title: 'Rainwater Harvesting Assessment Report',
        subject: 'Comprehensive rainwater harvesting system analysis and recommendations',
        author: 'JalSankalp',
        keywords: 'rainwater, harvesting, conservation, sustainability, water management',
        creator: 'JalSankalp Water Conservation Services'
    });
    
    // Add header with logo and title
    doc.setFillColor(14, 76, 146); // Primary blue color
    doc.rect(0, 0, 220, 25, 'F');
    
    // Add logo (water drop)
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('💧', 10, 16);
    doc.text('JalSankalp', 22, 16);
    
    doc.setFontSize(20);
    doc.text('RAINWATER HARVESTING REPORT', 105, 16, { align: 'center' });
    
    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 180, 22, { align: 'right' });
    
    let y = 35;
    
    // Add report details section
    doc.setFontSize(14);
    doc.setTextColor(14, 76, 146);
    doc.text('PROJECT DETAILS', 14, y);
    y += 8;
    
    // Draw separator line
    doc.setDrawColor(14, 76, 146);
    doc.line(14, y, 80, y);
    y += 5;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    const name = document.getElementById('report-name').textContent;
    const location = document.getElementById('report-location').textContent;
    const rainfall = document.getElementById('report-rainfall').textContent;
    const roof = document.getElementById('report-roof').textContent;
    const purpose = document.getElementById('report-purpose').textContent;
    
    doc.text(`Client Name: ${name}`, 14, y);
    y += 7;
    doc.text(`Location: ${location}`, 14, y);
    y += 7;
    doc.text(`Average Annual Rainfall: ${rainfall} mm`, 14, y);
    y += 7;
    doc.text(`Roof Type: ${roof}`, 14, y);
    y += 7;
    doc.text(`Primary Purpose: ${purpose}`, 14, y);
    y += 15;
    
    // Add water potential section
    doc.setFontSize(14);
    doc.setTextColor(14, 76, 146);
    doc.text('WATER HARVESTING POTENTIAL', 14, y);
    y += 8;
    
    // Draw separator line
    doc.line(14, y, 105, y);
    y += 5;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    const potential = document.getElementById('report-potential').textContent;
    const potentialText = document.getElementById('report-potential-text').textContent;
    
    doc.text(`Annual Harvest Potential: ${potential}`, 14, y);
    y += 7;
    doc.text(potentialText, 14, y, { maxWidth: 180 });
    y += 15;
    
    // Add system recommendation
    doc.setFontSize(14);
    doc.setTextColor(14, 76, 146);
    doc.text('RECOMMENDED SYSTEM', 14, y);
    y += 8;
    
    // Draw separator line
    doc.line(14, y, 75, y);
    y += 5;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    const system = document.getElementById('report-system').textContent;
    doc.text(system, 14, y, { maxWidth: 180 });
    y += 15;
    
    // Add cost estimation section
    doc.setFontSize(14);
    doc.setTextColor(14, 76, 146);
    doc.text('COST ESTIMATION', 14, y);
    y += 8;
    
    // Draw separator line
    doc.line(14, y, 60, y);
    y += 5;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    const cost = document.getElementById('report-cost').textContent;
    doc.text(`Estimated Installation Cost: ${cost}`, 14, y);
    y += 7;
    doc.text('All prices in Indian Rupees (₹)', 14, y);
    y += 10;
    
    // Add materials table
    doc.setFontSize(12);
    doc.setTextColor(14, 76, 146);
    doc.text('Materials Required:', 14, y);
    y += 8;
    
    const materialsEl = document.getElementById('report-materials').children;
    const materialsData = [];
    
    for (let i = 0; i < materialsEl.length; i++) {
        const text = materialsEl[i].textContent;
        const parts = text.split(/(\d)/);
        if (parts.length > 1) {
            materialsData.push([parts[0].trim(), parts[1]]);
        } else {
            materialsData.push([text, '']);
        }
    }
    
    doc.autoTable({
        startY: y,
        head: [['Material', 'Cost (₹)']],
        body: materialsData,
        theme: 'grid',
        headStyles: {
            fillColor: [14, 76, 146],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 10,
            cellPadding: 3,
            lineColor: [14, 76, 146],
            lineWidth: 0.1
        },
        margin: { left: 14 },
        tableWidth: 180
    });
    
    y = doc.lastAutoTable.finalY + 10;
    
    // Add savings section
    doc.setFontSize(14);
    doc.setTextColor(14, 76, 146);
    doc.text('EXPECTED SAVINGS', 14, y);
    y += 8;
    
    // Draw separator line
    doc.line(14, y, 65, y);
    y += 5;
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    const savings = document.getElementById('report-savings').textContent;
    const savingsText = document.getElementById('report-savings-text').textContent;
    
    // Add background for savings section
    doc.setFillColor(225, 240, 250);
    doc.roundedRect(14, y, 180, 25, 3, 3, 'F');
    doc.setDrawColor(14, 76, 146);
    doc.roundedRect(14, y, 180, 25, 3, 3);
    
    doc.text(savings, 20, y + 8);
    doc.text(savingsText, 20, y + 16);
    y += 35;
    
    // Check if we need a new page
    if (y > 240) {
        doc.addPage();
        y = 20;
    }
    
    // Add implementation steps
    doc.setFontSize(14);
    doc.setTextColor(14, 76, 146);
    doc.text('IMPLEMENTATION STEPS', 14, y);
    y += 8;
    
    // Draw separator line
    doc.line(14, y, 75, y);
    y += 10;
    
    const stepsEl = document.getElementById('report-steps').children;
    
    for (let i = 0; i < stepsEl.length; i++) {
        // Check if we need a new page
        if (y > 250) {
            doc.addPage();
            y = 20;
        }
        
        // Step number with circle
        doc.setFillColor(14, 76, 146);
        doc.circle(20, y - 3, 3, 'F');
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        const stepText = stepsEl[i].querySelector('p').textContent;
        doc.text(stepText, 30, y, { maxWidth: 160 });
        y += 10;
    }
    
    y += 10;
    
    // Add disclaimer
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Note: This is an estimated calculation. Actual costs may vary based on local material prices, labor rates, and specific site conditions.', 14, y, { maxWidth: 180 });
    y += 10;
    doc.text('For a detailed assessment, please consult with a rainwater harvesting professional.', 14, y, { maxWidth: 180 });
    
    // Add footer with page numbers on all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
        doc.text('© 2025 JalSankalp - Water Conservation Services | www.jalsankalp.com', 105, 290, { align: 'center' });
    }
    
    // Save the PDF
    const userName = document.getElementById('report-name').textContent.replace(/\s+/g, '_');
    const fileName = `JalSankalp_Rainwater_Report_${userName}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
}
// =================== MODAL CLOSE ===================
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');

    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target === registerModal) {
        registerModal.style.display = 'none';
    }
}

// =================== PAGE INIT ===================
window.onload = function() {
    const calcForm = document.getElementById('calculation-form');
    const results = document.getElementById('results');

    if (calcForm) calcForm.style.display = 'block';
    if (results) results.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', function() {
    showSection('home'); // show home on load
});