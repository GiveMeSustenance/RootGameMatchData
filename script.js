////////////////////////
/** Global variables **/
////////////////////////
const content = document.getElementById("content");

////////////////////////
/** Helper functions **/
////////////////////////
function isVagabond(seat) {
  return seat.faction && seat.faction.slice(0, 8) === "Vagabond";
}

function getVictoryDescript(detail) {
  if (detail.length < 9 && detail.slice(detail.length - 2) === "VP") {
    return detail;
  }
  if (detail.slice(0, 9) === "Dominance") {
    return "Dominance";
  }
  if (detail.slice(0, 9) === "Coalition") {
    return "Coalition";
  }
  return "Unknown";
}

function getFactionIconSrc(faction) {
  if (!faction) {
    return "assets/Unknown.webp";
  }
  if (faction.slice(0, 8) === "Vagabond") {
    return "assets/faction-icons/Vagabond.webp";
  }
  return "assets/faction-icons/" + faction + ".webp";
}

function getDeckIconSrc(deck) {
  if (!deck) {
    return "assets/Unknown.webp";
  }
  return "assets/decks/" + deck + ".webp";
}

/////////////////
/** Main code **/
/////////////////
fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((match) => {
      var dataDiv = document.createElement("div");
      var data__id = document.createElement("div");
      var data__factions = document.createElement("div");
      var data__map = document.createElement("div");
      var data__deck = document.createElement("div");
      var data__duration = document.createElement("div");
      var data__victory = document.createElement("div");

      /** ID **/ ///////////////////////////////////////////////////////////
      data__id.textContent = match.id;

      /** MAP **/ //////////////////////////////////////////////////////////
      data__map.textContent = match.setup.map;

      /** DURATION **/ /////////////////////////////////////////////////////
      if (match.durationMinutes === "Async") {
        data__duration.textContent = "Async";
      } else if (match.durationMinutes >= 60) {
        const durationHours = Math.floor(match.durationMinutes / 60);
        data__duration.textContent = `${durationHours}h ${match.durationMinutes % 60}m`;
      } else {
        data__duration.textContent = `${match.durationMinutes}m`;
      }

      /** FACTIONS **/ /////////////////////////////////////////////////////
      let seats = [match.seat1, match.seat2, match.seat3, match.seat4];
      let factions = seats.map((seat) => seat.faction);
      data__factions.innerHTML = factions
        .map(
          (faction) =>
            `<img src="${getFactionIconSrc(faction)}" alt="${faction}" class="data__faction-icon" />`,
        )
        .join("\n");

      data__deck.innerHTML = `<img src="${getDeckIconSrc(match.setup.deck)}" alt="${match.setup.deck}" class="data__deck-icon" />`;

      /** VICTORY **/ //////////////////////////////////////////////////////
      let victoryDescript = "Unknown";
      let victors = [];
      for (let seat of seats) {
        if (seat.victory) {
          victors.push(seat.faction);
          if (victoryDescript != "Coalition") {
            // Coalition takes precedence over other types
            victoryDescript = getVictoryDescript(seat.victoryDetail);
          }
        }
      }

      if (victors.length == 0) {
        data__victory.innerHTML = `<div class="data__victory__detail data__victory_cell"> Match In Progress </div>`;
      } else {
        data__victory.innerHTML =
          `<div class="data__victory__1st data__victory_cell"> 1st: </div>` +
          `<div class="data__victory__factions data__victory_cell">` +
          victors
            .map(
              (faction) =>
                `<img src="${getFactionIconSrc(faction)}" alt="${faction}" class="data__faction-icon" />`,
            )
            .join("\n") +
          `</div>` +
          `<div class="data__victory__detail data__victory_cell"> ${victoryDescript} </div>`;
      }

      ////////////////////////////////////////////////////////////////////
      content.appendChild(dataDiv);

      dataDiv.appendChild(data__id);
      dataDiv.appendChild(data__factions);
      dataDiv.appendChild(data__map);
      dataDiv.appendChild(data__duration);
      dataDiv.appendChild(data__deck);
      dataDiv.appendChild(data__victory);

      ////////////////////////////////////////////////////////////////////
      dataDiv.classList.add("data");
      data__id.classList.add("data__id", "data_cell");
      data__factions.classList.add("data__factions", "data_cell");
      data__map.classList.add("data__map", "data_cell");
      data__duration.classList.add("data__duration", "data_cell");
      data__deck.classList.add("data__deck", "data_cell");
      data__victory.classList.add("data__victory", "data_cell");
    });
  })
  .catch((error) => console.error("Error loading JSON:", error));
