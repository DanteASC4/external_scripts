(() =>{
  console.log(`Client Scripts successfully loaded.`);

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
  // Schedule swapping
  ////////////////////////////////////////////


  //* Time difference Calculation, confirmed correct
  const oneDay = 1000 * 60 * 60 * 24; // One day in milliseconds
  const today = new Date(); // Today as a Date obj
  const endD = new Date(today.getFullYear(), 7, 14); // Desired Expiration Day as Date obj
  const diff = Math.ceil((endD.getTime() - today.getTime()) / oneDay); // Difference in days from now until desired exp date
  //Diff used in cookie expiration

  // Cookie Name
  const cookieName = "defaultSched";


  const switcher = document.getElementsByTagName("button")[0]; // Button that switches schedule
  const switcherTextEle = document.getElementById("button-text"); // Button text

  // Morning activities
  const morningActs = [...document.querySelectorAll(`[data-version="mo"]`)];
  // Afternoon activities
  const afternoonActs = [...document.querySelectorAll(`[data-version="af"]`)];

  // Cooldown text
  const cooldownText = document.getElementById('cooldown-text');

  // Bounce in effect for button so users see it
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

  //* Helper function to check whether the morning or afternoon schedule items are visible
  function getState(ele) {
    if (ele.getAttribute("data-isVis") === "yes") {
      return true;
    } else {
      return false;
    }
  }

  //* Cooldown function to prevent spam-clicking the button
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

  //* Main schedule swapping function
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
    }
    // Putting button on cooldown since it was clicked
    cooldown();
  }

  // Default schedule is the morning
  if(switcher){
    afternoonActs.forEach(ele => {
      ele.style.display = "none";
      ele.setAttribute("data-isVis", "no");
    });
    morningActs.forEach(ele => {
      ele.setAttribute("data-isVis", "yes");
    });
    switcherTextEle.innerText = "Morning Schedule";
    switcher.addEventListener("click", schedSwapper);
  }


  ////////////////////////////////////////////
  // Simple search functionality for appendix
  ////////////////////////////////////////////


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


})();
