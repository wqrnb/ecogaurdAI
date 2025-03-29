// ThingSpeak API Keys
const writeAPIKey = "C7V7BTERQUH8S15N"; // Your Write API Key
const readAPIKey = "89DTVC4PMF5V1I86";  // Your Read API Key
const channelID = "2847442";            // Your Channel ID

// chat box new
const deepseek = {
    apiKey: "sk-7bd07936bbe5402f991946dc3ab6d7b1", 
    baseURL: "https://api.deepseek.com",
    model: "deepseek-chat" 
  };
  const expertPrompt = `You are an electrical utility expert specializing in:
1. Electricity bill calculations and cost optimization
2. Electrical safety standards and hazard prevention
3. Payment procedures and tariff structures

Always respond in language input by user with these requirements:
- Use Markdown formatting with clear section headers
- Provide calculation formulas where applicable
- Cite relevant safety standards (e.g., NEC, IEC)
- Include step-by-step guides for complex queries
- Highlight cost-saving opportunities
- Mention regional variations where relevant`;
// Virtual Past Data for Demonstration
const pastData = [];
const now = new Date();
for (let i = 0; i < 30; i++) { // Simulate 30 days of data
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    for (let hour = 0; hour < 24; hour++) { // Simulate hourly data
        const usage = Math.random() * 10 + 5; // Random usage between 5 and 15 kWh
        pastData.push({
            timestamp: new Date(date.setHours(hour, 0, 0, 0)),
            usage: usage
        });
    }
}

// Timer for non-signed-in users
let timer;
const timeLimit = 5 * 60 * 1000; // 5 minutes in milliseconds

// Track if the user is signed in
let isSignedIn = false;
// 添加哈希函数
function simpleHash(str) {
    let hash = 5381; // 初始哈希值
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0; // 确保返回无符号整数
  }
// Function to Set Screen Size
function setScreenSize(size) {
    const wrapper = document.querySelector(".wrapper");

    if (size === "mobile") {
        wrapper.style.maxWidth = "480px"; // Adjust max width for mobile
        wrapper.style.margin = "0 auto"; // Center the content
    } else if (size === "computer") {
        wrapper.style.maxWidth = "100%"; // Full width for computer
        wrapper.style.margin = "0"; // Remove margin
    }

    document.querySelector(".screen-size-page").style.display = "none";
    if (isSignedIn) {
        document.querySelector(".home-page").style.display = "block";
        document.querySelector(".home-page").style.animation = "slideIn 0.5s ease";
    } else {
        document.querySelector(".starting-page").style.display = "block";
        document.querySelector(".starting-page").style.animation = "fadeIn 0.5s ease";
    }
}

// Function to Re-choose Screen Size
function rechooseScreenSize() {
    document.querySelector(".home-page").style.display = "none";
    document.querySelector(".screen-size-page").style.display = "block";
    document.querySelector(".screen-size-page").style.animation = "fadeIn 0.5s ease";
}

// Function to Show Sign In Page
function showSignIn() {
    document.querySelector(".starting-page").style.display = "none";
    document.querySelector(".sign-in-page").style.display = "block";
    document.querySelector(".sign-in-page").style.animation = "slideIn 0.5s ease";
}

// Function to Show Sign Up Page
function showSignUp() {
    document.querySelector(".starting-page").style.display = "none";
    document.querySelector(".sign-up-page").style.display = "block";
    document.querySelector(".sign-up-page").style.animation = "slideIn 0.5s ease";
}

// Function to Use Without Signing In
function useWithoutSignIn() {
    document.querySelector(".starting-page").style.display = "none";
    document.querySelector(".home-page").style.display = "block";
    document.querySelector(".home-page").style.animation = "slideIn 0.5s ease";

    // Start the timer
    timer = setTimeout(() => {
        alert("Please sign in or sign up for an account. Returning to the starting page.");
        backToStartingPage();
    }, timeLimit);
}

// Function to Sign Up
// Modified signUp function with English prompts
function signUp() {
    const newUserId = document.getElementById("newUserId").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();

    if (newUserId.length < 4) {
      alert("User ID must be at least 4 characters");
      return;
    }
  
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
  
    const users = JSON.parse(localStorage.getItem("users")) || {};
    
    if (users[newUserId]) {
      alert("User ID already exists");
      return;
    }

    users[newUserId] = {
      passwordHash: simpleHash(newPassword),
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful!");
    backToStartingPage();
}

// Modified signIn function with English prompts
function signIn() {
    const userId = document.getElementById("userId").value.trim();
    const password = document.getElementById("password").value.trim();
  
    const users = JSON.parse(localStorage.getItem("users")) || {};
    
    if (!users[userId]) {
      alert("User does not exist");
      return;
    }

    if (users[userId].passwordHash === simpleHash(password)) {
      alert("Login successful!");
      isSignedIn = true;
      
      document.querySelector(".sign-in-page").style.display = "none";
      document.querySelector(".home-page").style.display = "block";
      document.querySelector(".home-page").style.animation = "slideIn 0.5s ease";
      
    } else {
      alert("Incorrect password");
    }
}
  

  function initPages() {
    document.querySelector(".home-page").style.display = "none";
    document.querySelector(".sign-in-page").style.display = "none";
    document.querySelector(".sign-up-page").style.display = "none";
    document.querySelector(".starting-page").style.display = "none";
    document.querySelector(".screen-size-page").style.display = "block";
  }
  

  window.onload = initPages;

// Function to Return to Starting Page
function backToStartingPage() {
    document.querySelector(".home-page").style.display = "none";
    document.querySelector(".sign-in-page").style.display = "none";
    document.querySelector(".sign-up-page").style.display = "none";
    document.querySelector(".starting-page").style.display = "block";
    document.querySelector(".starting-page").style.animation = "fadeIn 0.5s ease";

    // Clear the timer
    clearTimeout(timer);
}

// Function to Show Sub-Buttons
function showSubButtons(buttonType) {
    // Hide all sub-buttons first
    document.querySelectorAll(".sub-buttons").forEach(subButton => {
        subButton.style.display = "none";
    });

    // Show the selected sub-buttons
    const subButtons = document.getElementById(`${buttonType}SubButtons`);
    if (subButtons) {
        subButtons.style.display = "flex";
    }
}

// Function to Calculate Dynamic Reference
function calculateDynamicReference(hour) {
    // Filter past data for the specific hour
    const hourData = pastData.filter(entry => entry.timestamp.getHours() === hour);

    // Calculate average usage for this hour
    const totalUsage = hourData.reduce((sum, entry) => sum + entry.usage, 0);
    const averageUsage = totalUsage / hourData.length;

    return averageUsage;
}

// Function to Calculate Dynamic Bill
function calculateDynamicBill() {
    const now = new Date();
    const currentHour = now.getHours();

    // Calculate dynamic reference for the current hour
    const dynamicReference = calculateDynamicReference(currentHour);

    // Base rate per kWh (adjust as needed)
    const baseRate = 0.15; // $0.15 per kWh

    // Calculate bill amount based on dynamic reference
    let billAmount = dynamicReference * baseRate;

    // Add a penalty for high usage during peak hours
    if (currentHour >= 8 && currentHour < 22) { // On-peak hours (8 AM to 10 PM)
        billAmount *= 1.2; // 20% higher during peak hours
    }

    return billAmount;
}

// Function to Show Payment Page
function showPaymentPage() {
    document.querySelector(".home-page").style.display = "none";
    document.querySelector(".payment-page").style.display = "block";
    document.querySelector(".payment-page").style.animation = "slideIn 0.5s ease";

    // Calculate and display the dynamic bill amount
    const billAmount = calculateDynamicBill();
    document.getElementById("billAmount").textContent = `$${billAmount.toFixed(2)}`;
}

// Function to Select Payment Method
function selectPaymentMethod(method) {
    const billAmount = calculateDynamicBill();
    alert(`You have selected ${method} to pay your bill of $${billAmount.toFixed(2)}.`);
    // Simulate payment processing
    setTimeout(() => {
        alert("Payment successful! Thank you for paying your electricity bill.");
        backToHomePage();
    }, 2000);
}

// Function to Return to Home Page
function backToHomePage() {
    document.querySelector(".payment-page").style.display = "none";
    document.querySelector(".home-page").style.display = "block";
    document.querySelector(".home-page").style.animation = "slideIn 0.5s ease";
}

// Function to Send Data
function sendData(field) {
    const dataInput = document.getElementById("dataInput").value;
    if (!dataInput) {
        alert("Please enter a number!");
        return;
    }

    const usage = parseFloat(dataInput);

    // Get current hour
    const now = new Date();
    const currentHour = now.getHours();

    // Calculate dynamic reference for the current hour
    const dynamicReference = calculateDynamicReference(currentHour);

    // Compare usage with dynamic reference
    if (usage > dynamicReference) {
        alert(`Warning: Your electricity usage (${usage} kWh) is higher than your usual usage at this time (${dynamicReference.toFixed(2)} kWh). Consider reducing consumption.`);
    } else if (usage < dynamicReference) {
        alert(`Good job! Your electricity usage (${usage} kWh) is lower than your usual usage at this time (${dynamicReference.toFixed(2)} kWh). Keep it up!`);
    }

    const url = `https://api.thingspeak.com/update?api_key=${writeAPIKey}&field${field}=${usage}`;

    fetch(url)
        .then(response => response.text())
        .then(data => {
            const output = document.getElementById("output");
            typewriterEffect(output, `Data sent to Field ${field}: ${usage} kWh\nResponse: ${data}`);
        })
        .catch(error => {
            const output = document.getElementById("output");
            typewriterEffect(output, `Error: ${error.message}`);
        });
}

// Function to Get Recent Data
function getRecentData(field) {
    const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${readAPIKey}&results=1`; // Retrieve only the most recent data point

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const output = document.getElementById("output");
            if (data.feeds && data.feeds.length > 0) {
                const feed = data.feeds[0];
                typewriterEffect(output, `Most Recent Data for Field ${field}:\n  Data: ${feed[`field${field}`]} kWh\n  Timestamp: ${feed.created_at}`);
            } else {
                typewriterEffect(output, "No data available.");
            }
        })
        .catch(error => {
            const output = document.getElementById("output");
            typewriterEffect(output, `Error: ${error.message}`);
        });
}

// Function to Get Analysis with Personalized Suggestions
function getAnalysis(field) {
    const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${readAPIKey}&results=60`; // Retrieve last 60 data points

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const output = document.getElementById("output");
            if (data.feeds && data.feeds.length > 0) {
                let resultString = `Analysis of Past Data for Field ${field}:\n`;
                let totalUsage = 0;

                // Calculate total usage
                data.feeds.forEach((feed) => {
                    const usage = parseFloat(feed[`field${field}`]);
                    totalUsage += usage;
                });

                // Calculate average usage
                const average = totalUsage / data.feeds.length;

                // Get current hour
                const now = new Date();
                const currentHour = now.getHours();

                // Calculate dynamic reference for the current hour
                const dynamicReference = calculateDynamicReference(currentHour);

                // Add analysis and suggestions
                resultString += `- Average usage: ${average.toFixed(2)} kWh\n`;
                resultString += `- Dynamic reference for ${currentHour}:00: ${dynamicReference.toFixed(2)} kWh\n\n`;

                // Analyze user habits
                const userHabits = analyzeUserHabits(data.feeds, field);

                // Add personalized suggestions
                resultString += `Personalized Suggestions:\n`;
                if (userHabits.peakHours.length > 0) {
                    resultString += `- You tend to use more electricity during these hours: ${userHabits.peakHours.join(", ")}.\n`;
                    resultString += `  - Consider shifting high-energy activities (e.g., laundry, dishwashing) to off-peak hours.\n`;
                }
                if (userHabits.highUsageDays.length > 0) {
                    resultString += `- Your electricity usage is higher on these days: ${userHabits.highUsageDays.join(", ")}.\n`;
                    resultString += `  - Plan energy-saving activities on these days, such as unplugging unused devices.\n`;
                }
                if (userHabits.lowUsageDays.length > 0) {
                    resultString += `- Great job! Your electricity usage is lower on these days: ${userHabits.lowUsageDays.join(", ")}.\n`;
                    resultString += `  - Continue practicing energy-saving habits on other days as well.\n`;
                }
                if (average > dynamicReference) {
                    resultString += `- Your electricity usage is higher than your usual usage at this time. Consider:\n`;
                    resultString += `  - Turning off unused appliances.\n`;
                    resultString += `  - Using energy-efficient devices.\n`;
                    resultString += `  - Reducing air conditioning usage.\n`;
                } else if (average < dynamicReference) {
                    resultString += `- Your electricity usage is lower than your usual usage at this time. Great job!\n`;
                    resultString += `  - Continue practicing energy-saving habits.\n`;
                } else {
                    resultString += `- Your electricity usage matches your usual usage at this time. Keep it up!\n`;
                }

                typewriterEffect(output, resultString);
            } else {
                typewriterEffect(output, "No data available.");
            }
        })
        .catch(error => {
            const output = document.getElementById("output");
            typewriterEffect(output, `Error: ${error.message}`);
        });
}

// Function to Analyze User Habits
function analyzeUserHabits(feeds, field) {
    const habits = {
        peakHours: [], // Hours with the highest usage
        highUsageDays: [], // Days with the highest usage
        lowUsageDays: [] // Days with the lowest usage
    };

    // Group data by hour and day
    const hourlyUsage = {};
    const dailyUsage = {};

    feeds.forEach(feed => {
        const timestamp = new Date(feed.created_at);
        const hour = timestamp.getHours();
        const day = timestamp.toLocaleDateString("en-US", { weekday: "long" });

        const usage = parseFloat(feed[`field${field}`]);

        // Track hourly usage
        if (!hourlyUsage[hour]) {
            hourlyUsage[hour] = { total: 0, count: 0 };
        }
        hourlyUsage[hour].total += usage;
        hourlyUsage[hour].count += 1;

        // Track daily usage
        if (!dailyUsage[day]) {
            dailyUsage[day] = { total: 0, count: 0 };
        }
        dailyUsage[day].total += usage;
        dailyUsage[day].count += 1;
    });

    // Calculate average usage per hour
    for (const hour in hourlyUsage) {
        hourlyUsage[hour].average = hourlyUsage[hour].total / hourlyUsage[hour].count;
    }

    // Calculate average usage per day
    for (const day in dailyUsage) {
        dailyUsage[day].average = dailyUsage[day].total / dailyUsage[day].count;
    }

    // Identify peak hours (top 3 hours with highest average usage)
    const sortedHours = Object.keys(hourlyUsage).sort((a, b) => hourlyUsage[b].average - hourlyUsage[a].average);
    habits.peakHours = sortedHours.slice(0, 3).map(hour => `${hour}:00`);

    // Identify high and low usage days
    const sortedDays = Object.keys(dailyUsage).sort((a, b) => dailyUsage[b].average - dailyUsage[a].average);
    habits.highUsageDays = sortedDays.slice(0, 2); // Top 2 days with highest usage
    habits.lowUsageDays = sortedDays.slice(-2); // Bottom 2 days with lowest usage

    return habits;
}

// Function to Get Chart
function getChart(field) {
    const chartContainer = document.querySelector(".chart-container");
    const chartIframe = document.getElementById("chartIframe");

    // Set the iframe source and display it
    chartIframe.src = `https://thingspeak.com/channels/${channelID}/charts/${field}?api_key=${readAPIKey}&bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15`;
    chartContainer.style.display = "block";
    setTimeout(() => {
        chartContainer.classList.add("show");
        chartIframe.classList.add("show");
    }, 10);
}
function showPage(pageClass) {
    document.querySelectorAll('.screen-size-page, .starting-page, .sign-in-page, .sign-up-page, .home-page, .payment-page, .chat-page').forEach(page => {
      page.style.display = 'none';
    });
    
    const targetPage = document.querySelector(`.${pageClass}`);
    if(targetPage) {
      targetPage.style.display = 'block';
      targetPage.style.animation = 'slideIn 0.5s ease';
    }
  }
function toggleChatBox() {
    showPage('chat-page');
    setTimeout(() => {
      document.getElementById("userQuestion").focus();
    }, 100);
  }
  
  function closeChat() {
    showPage('home-page');
  }
  
//chat box new
function handleChatInputKey(event) {
    if (event.key === 'Enter') {
        submitQuestion();
    }
}
async function submitQuestion() {
    const userInput = document.getElementById("userQuestion");
    const question = userInput.value.trim();
    
    if (!question) return;

    // Add user message
    addMessage(question, "user");
    userInput.value = "";

    try {
        // Show loading status
        const loadingMsg = addMessage("Analyzing your query...", "bot", true);
        
        // API call with electrical engineering context
        const response = await fetch(`${deepseek.baseURL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${deepseek.apiKey}`
            },
            body: JSON.stringify({
                model: deepseek.model,
                messages: [
                    {
                        role: "system",
                        content: expertPrompt
                    },
                    {
                        role: "user",
                        content: question
                    }
                ],
                temperature: 0.2,  // Lower temperature for technical accuracy
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || response.statusText);
        }

        const data = await response.json();
        
        // Process technical response
        if (data.choices?.length > 0) {
            const technicalResponse = data.choices[0].message.content;
            // Add safety notice for critical queries
            const safetyNotice = shouldAddSafetyNotice(question) 
                ? "\n\n**Safety Note:** Always consult a certified electrician for physical installations"
                : "";
                
            addMessage(technicalResponse + safetyNotice, "bot");
        }

    } catch (error) {
        console.error("API Error:", error);
        addMessage(`Request failed: ${error.message}`, "bot");
    }
}
function shouldAddSafetyNotice(question) {
    const safetyKeywords = [
        'install', 'wiring', 'circuit', 'voltage', 
        'maintenance', 'hazard', 'fault'
    ];
    return safetyKeywords.some(kw => 
        question.toLowerCase().includes(kw)
    );
}
function addMessage(content, role, isLoading = false) {
    const chatMessages = document.getElementById("chatMessages");
    const messageDiv = document.createElement("div");
    
    messageDiv.className = `chat-message ${role}${isLoading ? " loading" : ""}`;
    messageDiv.innerHTML = isLoading ? 
      `<div class="loading-indicator">${content} <span class="dot1">.</span><span class="dot2">.</span><span class="dot3">.</span></div>` : 
      marked.parse(content); // 使用marked解析Markdown
  
    chatMessages.appendChild(messageDiv);
    return messageDiv;
  }
// Typewriter Effect Function
function typewriterEffect(element, text, speed = 50) {
    element.classList.add("show");
    element.value = ""; // Clear the text area
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            element.value += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
        }
    }, speed);
}
// 主题切换逻辑 dark mode
let isDarkMode = false;

function toggleTheme() {
  const html = document.documentElement;
  const icon = document.querySelector('#themeToggle i');
  
  isDarkMode = !isDarkMode;
  
  if (isDarkMode) {
    html.setAttribute('data-theme', 'dark');
    icon.className = 'fas fa-moon';
    localStorage.setItem('theme', 'dark');
  } else {
    html.removeAttribute('data-theme');
    icon.className = 'fas fa-sun';
    localStorage.removeItem('theme');
  }
}

// 初始化检测
function checkTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.querySelector('#themeToggle i').className = 'fas fa-moon';
    isDarkMode = true;
  }
}

// 事件绑定
document.getElementById('themeToggle').addEventListener('click', toggleTheme);
window.addEventListener('load', checkTheme);