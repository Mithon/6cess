var body = document.querySelector("body");
var explore = document.querySelector(".discover-button");
var main = document.querySelector("main");
var topIcon = document.querySelector(".top-icon");

var tabs = [document.getElementById("tab1"), document.getElementById("tab2"),document.getElementById("tab3")];

explore.addEventListener("click", toggleMain);
topIcon.addEventListener("click", toggleMain);

for (let tab in tabs) {
    tabs[tab].addEventListener("click", () => {
        for (let otherTab of tabs)
            classie.remove(otherTab, "active-tab");
        classie.add(tabs[tab], "active-tab");
        makeTransition(tab);
    });
}

function makeTransition(tab) {
    console.log(`transitioning to ${tab}`);
}

function toggleMain() {
    classie.toggle(main, "hide-main");
    classie.toggle(body, "no-scroll");
}
