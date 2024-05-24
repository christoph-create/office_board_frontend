var serverIP = "localhost"

// score board
function myFunction(popupID) {
    var popup = document.getElementById(popupID);
    if (popup.checkVisibility) {
        popup.classList.toggle("show");
    }
    else {
        popup.classList.toggle("hide");
    }
}

function updateScore(score, index) {
    var scoreCounter = document.getElementById("scoreCounter" + scoreBoard[index].ID)
    switch (score) {
        case 1:
            // +1
            scoreBoard[index].OnePoint++;

            break;
        case 2:
            // +0.5
            scoreBoard[index].HalfPoint++;
            break;
    }
    scoreBoard[index].Total++;
    scoreCounter.innerText = scoreBoard[index].OnePoint + "/" + scoreBoard[index].HalfPoint + "/" + scoreBoard[index].Total;
    updateScoreBckend(scoreBoard[index])
}

function Score(id, name, onePoint, halfPoint, total) {
    this.ID = id;
    this.Name = name;
    this.OnePoint = onePoint;
    this.HalfPoint = halfPoint;
    this.Total = total;
}

var scoreBoard = [
    //    new Score("1", "Peter", 2, 1, 3),
    //    new Score("2", "Golo", 2, 1, 11),
    //    new Score("3", "Michi G", 2, 1, 9),
    //    new Score("4", "Silvio", 0, 0, 5),
    //    new Score("5", "Christoph", 1, 2, 17),
]

async function initScoreBoard() {
    const response = await fetch(`http://${serverIP}:8123/score/load`)
    this.scoreBoard = await response.json()

    var list = document.getElementById("score-board");
    for (i = 0; i < scoreBoard.length; i++) {
        let element = document.createElement("div")
        element.className = "score-board-element"
        element.innerHTML = `
            <div class="score-board-name">${this.scoreBoard[i].Name}</div>
            <div class="score-board-score" onclick="myFunction('popup${this.scoreBoard[i].ID}')">
                <p id="scoreCounter${this.scoreBoard[i].ID}">${this.scoreBoard[i].OnePoint}/${this.scoreBoard[i].HalfPoint}/${this.scoreBoard[i].Total}</p>
                <span class="score-board-popup" id="popup${this.scoreBoard[i].ID}">
                    <button class="score-board-button" onclick="updateScore(1, ${i})">+1 Punkt</button>
                    <button class="score-board-button" onclick="updateScore(2, ${i})">+0.5 Punkte</button>
                    <button class="score-board-button" onclick="updateScore(0, ${i})">i suck</button>
                </span>
        `;

        list.appendChild(element)
    }
}

initScoreBoard();

async function updateScoreBckend(score) {
    const response = await fetch(`http://${serverIP}:8123/score/update`, {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        body: JSON.stringify(score),
    })
}

// mensa
let currentDate = new Date()

async function load(url, id) {
    const response = await fetch(url);
    const menu = await response.json()
    let list = document.getElementById(id);
    for (i = 0; i < menu.length; i++) {
        let listElement = document.createElement("div");
        listElement.className = "list-element";

        let name = document.createElement("div");
        name.className = "list-element-name"
        name.innerText = menu[i].name;

        let icon = document.createElement("img")
        if (menu[i].notes.includes("vegetarisch")) {
            icon.src = "vegie.png";
        }
        if (menu[i].notes.includes("vegan")) {
            icon.src = "vegan.png";
        }

        let price = document.createElement("div")
        price.className = "list-element-name"
        price.innerText = menu[i].prices.students.toFixed(2) + " EUR"

        list.appendChild(listElement);
        listElement.appendChild(name)
        listElement.appendChild(icon)
        listElement.appendChild(price)
    }
}

function switchLeft() {
    currentDate.setDate(currentDate.getDate() - 1); // Decrement the date by one day
    updateDishes();
}

function switchToday() {
    currentDate = new Date()
    updateDishes();
}

function switchRight() {
    currentDate.setDate(currentDate.getDate() + 1); // Increment the date by one day
    updateDishes();
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function initializeDishes() {
    let mainList = document.getElementById("main");
    mainList.replaceChildren()
    let li = document.createElement("li");
    li.innerText = "Hauptgerichte";
    li.className = "list-header";
    mainList.appendChild(li);

    let sideList = document.getElementById("side");
    sideList.replaceChildren()
    li = document.createElement("li");
    li.innerText = "Beilagen";
    li.className = "list-header";
    sideList.appendChild(li);
}

function updateDishes() {
    initializeDishes()
    const mainUrl = `http://${serverIP}:8123/mensa/main?date=${formatDate(currentDate)}`;
    const sideUrl = `http://${serverIP}:8123/mensa/side?date=${formatDate(currentDate)}`;
    load(mainUrl, "main")
    load(sideUrl, "side")

    // Update the date display
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').innerText = currentDate.toLocaleDateString(undefined, options);
}

updateDishes()

// git timer
let secondsElement = document.getElementById('seconds');
let seconds = 0;
let timerInterval;

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        secondsElement.textContent = seconds;
    }, 1000);
}

function resetTimer() {
    resetTimeBackend();
    clearInterval(timerInterval);
    seconds = 0;
    secondsElement.textContent = seconds;
    startTimer();
}

async function resetTimeBackend() {
    const response = await fetch(`http://${serverIP}:8123/accident/reset`, {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
    })
}

async function getTimeBackend() {
    const response = await fetch(`http://${serverIP}:8123/accident/load`)
    const data = await response.json()
    seconds = data.Seconds;

    // Start the timer when the script runs
    startTimer();
}

getTimeBackend();

// clock
function showTime() {
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    var time = h + ":" + m + ":" + s + " ";
    document.getElementById("MyClockDisplay").innerText = time;
    document.getElementById("MyClockDisplay").textContent = time;

    setTimeout(showTime, 1000);

}

showTime();

// rvv
async function loadRvv(url, id) {
    const response = await fetch(url);
    const departures = await response.json()
    let list = document.getElementById(id);

    list.innerHTML = ''; // Clear previous content before updating

    let stopH = document.createElement("div");
    stopH.innerText = "TechCampus/OTH \u2192 HBF";
    stopH.className = "list-header";
    list.appendChild(stopH);

    for (i = 0; i < departures.length; i++) {
        let directionElement = document.createElement("div");
        directionElement.className = "list-element-rvv"

        let time = document.createElement("div")
        time.className = "rvv-time"
        time.innerText = departures[i].time

        let timePlus = document.createElement("div")
        timePlus.className = "rvv-time-plus"

        if (departures[i].timePlus != "0" && departures[i].timePlus != "") {
            timePlus.innerText = "+" + departures[i].timePlus
        }

        let name = document.createElement("div");
        name.className = "list-element-name";
        name.innerText = departures[i].number + " " + departures[i].direction;

        list.appendChild(directionElement);
        directionElement.appendChild(time);
        directionElement.appendChild(timePlus);
        directionElement.appendChild(name);
    }
}

function updateContent() {
    loadRvv(`http://${serverIP}:8123/rvv/techcampus`, "techcampus");
}

// Initial content load
updateContent();

// Update content every 1 minutes (60000 milliseconds)
setInterval(updateContent, 60000);

// reload
function reloadPageAtMidnight() {
    var now = new Date();
    var tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    var timeUntilMidnight = tomorrow - now;

    setTimeout(function () {
        window.location.reload();
    }, timeUntilMidnight);
}

// Call the function to reload the page at midnight
reloadPageAtMidnight();
