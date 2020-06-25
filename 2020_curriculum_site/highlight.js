////////////////////////////////////////////
// Time Based Highlighting, commented out until schedule is done
////////////////////////////////////////////

// console.log('%cHighlight script',  'font-weight: bold; font-size: 25px;color: #00FF00; ')
// let todaysDate = document.getElementById('dayDate').innerText;
// function getTimes() {
//     let timeArr =[];
//     let timeElements = document.getElementsByClassName('time');
//     for(let ele of timeElements){
//         timeArr.push(ele.innerText)
//     }
//     return timeArr;
// }

// const monthAsInt = mon => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(mon);

// function timeStrToDate(timeStr, dateStr){
//     const formattedDateStr = dateStr.replace(/(th|rd|st)/gi, '').trim();
//     let temp;
//     if(timeStr.toLowerCase().includes('pm')){
//         temp = timeStr.split(':');
//         temp[0] = (12 + parseInt(temp[0])).toString();
//         let dato = new Date();
//         let dateArr = formattedDateStr.split(' ');
//         dato.setMonth(monthAsInt(dateArr[0]));
//         dato.setDate(parseInt(dateArr[1]));
//         dato.setHours(temp[0]);
//         dato.setMinutes(temp[1].replace('PM',''));
//         dato.setSeconds(0);
//         dato.setFullYear(2020);
//         return dato;
//     } else {
//         let realDate = formattedDateStr + ', 2020 ';
//         let realTime = timeStr.replace(' AM', ':00');
//         let realDateString = realDate + realTime;
//         let dato2 = new Date(realDateString);
//         return dato2
//     }
// }

// let times = getTimes();
// let cTime = new Date();
// // 🚩console.log(times);
// function checkTimes(timesArr){
//     let currentBlock = timesArr.map(str => {
//         let timeInc = str.split('-');
//         let startTime = timeStrToDate(timeInc[0], todaysDate);
//         let endTime = timeStrToDate(timeInc[1], todaysDate);
//         //🚩 console.log(`${startTime}\n${endTime}`);
//         if(cTime < endTime && cTime > startTime){
//             return [startTime, endTime]
//         }
//     })
//     // 🚩console.log(currentBlock);
//     return currentBlock;
// }
// let result = checkTimes(times);
// let res = Array.from(new Set(result))
// // 🚩console.log(res);
// // 🚩console.log(result);
// if(res[0] !== undefined){
//     // 🚩console.log('Match Found');
// }

////////////////////////////////////////////
// Right nav expansion
////////////////////////////////////////////

let expander = document.getElementById("arrow");
let trigger = document.getElementById("arrowT");
const dimmed = document.getElementById("dim");

function rightNavExpansion() {
  const rNavbar = document.getElementById("rnav");
  const state = expander.dataset.state;
  if (state === "closed") {
    anime({
      targets: expander,
      translateX: -145,
      rotateY: 180,
      easing: "easeInOutExpo",
    });
    expander.dataset.state = `open`;
    rNavbar.style.width = `150px`;
    rNavbar.style.height = `${window.innerHeight}px`;
    rNavbar.style.visibility = `visible`;
    rNavbar.style.opacity = `1`;
    dimmed.style.opacity = `1`;
    dimmed.style.zIndex = 1003;
    expander.style.zIndex = 1004;
  } else {
    expander.dataset.state = `closed`;
    expander.style.zIndex = 1001;
    rNavbar.style.width = `0px`;
    rNavbar.style.visibility = `hidden`;
    rNavbar.style.opacity = `0`;
    dimmed.style.zIndex = -1000;
    anime({
      targets: dimmed,
      opacity: 0,
      delay: anime.stagger(100),
    });
    anime({
      targets: expander,
      translateX: 0,
      rotateY: 0,
      easing: "easeInOutExpo",
    });
  }
}

if(trigger){
  trigger.addEventListener("click", rightNavExpansion);
  dimmed.addEventListener("click", () => {
    const state = expander.dataset.state;
    const rNavbar = document.getElementById("rnav");

    if (state === "open") {
      expander.dataset.state = `closed`;
      expander.style.zIndex = 1001;
      rNavbar.style.width = `0px`;
      rNavbar.style.visibility = `hidden`;
      rNavbar.style.opacity = `0`;
      dimmed.style.zIndex = -1000;
      anime({
        targets: dimmed,
        opacity: 0,
        delay: anime.stagger(100),
      });
      anime({
        targets: expander,
        translateX: 0,
        rotateY: 0,
        easing: "easeInOutExpo",
      });
    }
  });
}

////////////////////////////////////////////
// Cookie Helper Functions 🍪
////////////////////////////////////////////

/**
 * checks if cookie exists
 * @param  {string}  cname name of cookie being checked
 * @return {boolean}       true or false, depending on whether or not cookie exists
 */
const cExist = cname => (gimmeACookie(cname) != "" ? true : false);

/**
 * deletes cookie with given name
 * @param  {string} cname name of cookie to be eaten
 * @return {void}         returns nothing
 */
function eatCookie(cname) {
  document.cookie = cname + "=; Max-Age=-99999999;";
}

/**
 * function to set/create a cookie given required values
 * @param {string}  cname  name of cookie to be set/created
 * @param {string}  cvalue value of newly set/created cookie
 * @param {integer} exdays days until cookie expires
 */
function bakeCookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * function that returns the value of an existing cookie
 * @param  {string} cname name of cookie being retrieved
 * @return {string}       value of cookie being retrieved, if cookie does not exist returns empty string;
 */
function gimmeACookie(cname) {
  const name = cname + "=";
  const cookE = document.cookie;
  const ca = cookE.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

////////////////////////////////////////////
// Schedule swapping
////////////////////////////////////////////
const oneDay = 1000 * 60 * 60 * 24;
const today = new Date();
const endD = new Date(today.getFullYear(), 7, 14);
const diff = Math.ceil((endD.getTime() - today.getTime()) / oneDay);
const switcher = document.getElementsByTagName("button")[0];
const switcherTextEle = document.getElementById("button-text");
const morningActs = [...document.querySelectorAll(`[data-version="mo"]`)];
const afternoonActs = [...document.querySelectorAll(`[data-version="af"]`)];
const cooldownText = document.getElementById('cooldown-text');

anime({
  targets: switcher,
  translateY: [-50, 0],
  delay: 1000,
  easing: "easeOutBounce",
});

/*
  Check if cookie exists first, if so use that for creating default schedule
  Else morning is defualt.

  Set cookie on click of the button. Maybe have a cooldown for clicking the button.
*/

function getState(ele) {
  if (ele.getAttribute("data-isVis") === "yes") {
    return true;
  } else {
    return false;
  }
}

function cooldown(){
  anime({
    targets: '',
    duration: 1000,
    update: function(anim) {
      cooldownText.innerText = ((100 - anim.progress)/100).toFixed(2) + 's';
    },
    begin: function(anim) {
      switcher.disabled = true;
    },
    complete: function(anim) {
      switcher.disabled = false;
      cooldownText.innerText = '';
    }
  });
}

function schedSwapper() {
  // If the morning acts are visible, hide them, and swap attributes
  if (getState(morningActs[0])) {
    // Making morning acts invisible
    morningActs.forEach(ele => {
      ele.style.display = "none";
      ele.setAttribute("data-isVis", "no");
    });
    // Making afternoon acts visible
    afternoonActs.forEach(ele => {
      ele.style.display = "grid";
      ele.setAttribute("data-isVis", "yes");
    });

    // Switching button text to reflect current schedule
    switcherTextEle.innerText = "Afternoon Schedule";
    bakeCookie("defaultSched", "afternoon", diff);
  }
  // If the morning acts aren't visible then make them visible
  else {
    // Making morning acts invisible
    morningActs.forEach(ele => {
      ele.style.display = "grid";
      ele.setAttribute("data-isVis", "yes");
    });
    // Making afternoon acts visible
    afternoonActs.forEach(ele => {
      ele.style.display = "none";
      ele.setAttribute("data-isVis", "no");
    });

    // Switching button text to reflect current schedule
    switcherTextEle.innerText = "Morning Schedule";
    bakeCookie("defaultSched", "morning", diff);
  }
  cooldown();
}

// Default schedule is the morning
if(switcher){
  if (cExist("defaultSched")) {
  if (gimmeACookie("defaultSched") === "afternoon") {
    afternoonActs.forEach(ele => {
      ele.style.display = "grid";
      ele.setAttribute("data-isVis", "yes");
    });
    morningActs.forEach(ele => {
      ele.style.display = "none";
      ele.setAttribute("data-isVis", "no");
    });
    switcherTextEle.innerText = "Afternoon Schedule";
  }
  } else {
    afternoonActs.forEach(ele => {
      ele.style.display = "none";
      ele.setAttribute("data-isVis", "no");
    });
    morningActs.forEach(ele => {
      ele.setAttribute("data-isVis", "yes");
    });
    switcherTextEle.innerText = "Morning Schedule";
  }

  switcher.addEventListener("click", schedSwapper);
}



const searchbar = document.getElementById('sBar');
if(searchbar){
  const allActs = document.getElementsByClassName('activity');
  for(let a of allActs){a.style.gridTemplateColumns = "2fr 0px 1fr 2fr";}
  searchbar.addEventListener('input', (e) => {
    let searchTerm  = new RegExp(`${searchbar.value}`, 'gi');
      for(let activity of allActs){
        let actName = activity.childNodes[0].firstChild.innerText;
        activity.style.gridTemplateColumns = `2fr 0px 2fr 3fr`;//2fr 0px 1fr 2fr;
        if(!searchTerm.test(actName)){
          activity.style.display = 'none';
        }
        if(searchTerm.test(actName)){
          activity.style.display = 'grid';
        }
      }
  });
}