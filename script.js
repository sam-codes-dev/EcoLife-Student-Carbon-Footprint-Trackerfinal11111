/* =================== Dark/Light Toggle =================== */
const themeToggle = document.getElementById("themeToggle");
themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

/* =================== Floating AI Chatbox =================== */
const chatIcon = document.getElementById("aiChatIcon");
const chatBox = document.getElementById("aiChatBox");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");
const closeChat = document.getElementById("closeChat");

chatIcon?.addEventListener("click", () => chatBox.classList.toggle("hidden"));
closeChat?.addEventListener("click", () => chatBox.classList.add("hidden"));

const offlineResponses = {
    help: "Commands: daily, score, weekly, money, tips, reviews, contact",
    money: "Enter transport, AC, food to calculate CO2 and money saved.",
    score: "Shows your weekly eco score trend.",
    weekly: "View 7-day CO2 trend.",
    carbon: "Calculate your carbon footprint.",
};

chatSend?.addEventListener("click", handleMessage);
chatInput?.addEventListener("keypress", (e) => { if(e.key === "Enter") handleMessage(); });

async function handleMessage() {
    const msg = chatInput.value.trim();
    if (!msg) return;
    appendMessage("user", msg);
    chatInput.value = "";

    if (navigator.onLine) {
        appendMessage("bot", "EcoBot 🤖 is typing...");
        try {
            const res = await fetch("https://your-backend-url.com/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer a038ad5b86c7dcc1c10d86c98245e11b"
                },
                body: JSON.stringify({ message: msg })
            });
            const data = await res.json();
            appendMessage("bot", data.reply);
        } catch (err) {
            console.error(err);
            appendMessage("bot", "Oops! AI API error.");
        }
    } else {
        const key = msg.toLowerCase();
        appendMessage("bot", offlineResponses[key] || "I didn't understand. Type 'help'.");
    }
}

function appendMessage(sender, msg) {
    const div = document.createElement("div");
    div.textContent = sender === "user" ? "You: " + msg : "EcoBot 🤖: " + msg;
    div.style.margin = "5px 0";
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* =================== Money Calculator =================== */
const calcMoneyBtn = document.getElementById("calcMoneyBtn");
if (calcMoneyBtn) {
    calcMoneyBtn.addEventListener("click", () => {
        const transport = +document.getElementById("moneyTransport").value || 0;
        const ac = +document.getElementById("moneyAC").value || 0;
        const food = +document.getElementById("moneyFood").value || 0;

        const moneySaved = transport * 0.1 + ac * 0.5 + food * 2;
        document.getElementById("moneyResult").textContent = "Money Saved: $" + moneySaved.toFixed(2);

        // Draw chart
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(() => {
            const data = google.visualization.arrayToDataTable([
                ['Category', 'Money Saved'],
                ['Transport', transport*0.1],
                ['AC', ac*0.5],
                ['Food', food*2]
            ]);
            const options = { title: 'Money Saved Breakdown' };
            const chart = new google.visualization.PieChart(document.getElementById('moneyChart'));
            chart.draw(data, options);
        });
    });
}

/* =================== Eco Score Calculator =================== */
const calcScoreBtn = document.getElementById("calcScoreBtn");
if (calcScoreBtn) {
    calcScoreBtn.addEventListener("click", () => {
        const transport = +document.getElementById("scoreTransport").value || 0;
        const food = +document.getElementById("scoreFood").value || 0;
        const elec = +document.getElementById("scoreElec").value || 0;

        const total = transport + food + elec;
        const score = Math.max(0, 100 - total); // Eco Score

        document.getElementById("scoreResult").textContent = "Your Eco Score: " + score + "/100";

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(() => {
            const data = google.visualization.arrayToDataTable([
                ['Category', 'CO2 Contribution'],
                ['Transport', transport],
                ['Food', food],
                ['Electricity', elec]
            ]);
            const options = { title: 'CO2 Contribution' };
            const chart = new google.visualization.PieChart(document.getElementById('scoreChart'));
            chart.draw(data, options);
        });
    });
}

/* =================== Carbon Calculator =================== */
const calcCarbonBtn = document.getElementById("calcCarbonBtn");
if (calcCarbonBtn) {
    calcCarbonBtn.addEventListener("click", () => {
        const car = +document.getElementById("carbonCar").value || 0;
        const elec = +document.getElementById("carbonElec").value || 0;
        const waste = +document.getElementById("carbonWaste").value || 0;

        const totalCO2 = car*0.21 + elec*0.5 + waste*0.1; // Example formula
        document.getElementById("carbonResult").textContent = "Total CO2: " + totalCO2.toFixed(2) + " kg";

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(() => {
            const data = google.visualization.arrayToDataTable([
                ['Source', 'CO2 (kg)'],
                ['Car', car*0.21],
                ['Electricity', elec*0.5],
                ['Waste', waste*0.1]
            ]);
            const options = { title: 'CO2 Emissions' };
            const chart = new google.visualization.PieChart(document.getElementById('carbonChart'));
            chart.draw(data, options);
        });
    });
}

/* =================== Weekly Trend Calculator =================== */
const calcWeekBtn = document.getElementById("calcWeekBtn");
if (calcWeekBtn) {
    calcWeekBtn.addEventListener("click", () => {
        const mon = +document.getElementById("weekMon").value || 0;
        const tue = +document.getElementById("weekTue").value || 0;
        const wed = +document.getElementById("weekWed").value || 0;
        const thu = +document.getElementById("weekThu").value || 0;
        const fri = +document.getElementById("weekFri").value || 0;
        const sat = +document.getElementById("weekSat").value || 0;
        const sun = +document.getElementById("weekSun").value || 0;

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(() => {
            const data = google.visualization.arrayToDataTable([
                ['Day', 'CO2 (kg)'],
                ['Mon', mon],
                ['Tue', tue],
                ['Wed', wed],
                ['Thu', thu],
                ['Fri', fri],
                ['Sat', sat],
                ['Sun', sun]
            ]);
            const options = { title: 'Weekly CO2 Trend' };
            const chart = new google.visualization.LineChart(document.getElementById('weekChart'));
            chart.draw(data, options);
        });
    });
}
