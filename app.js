// app.js - interactive behavior for the Golf Connect prototype
(function () {
  "use strict";

  const storage = {
    get: function (key, fallback) {
      try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
      } catch (error) {
        return fallback;
      }
    },
    set: function (key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        return false;
      }
    },
    remove: function (key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        return false;
      }
    }
  };

  const defaultPrivacySettings = {
    profileVisible: true,
    shareName: true,
    shareLocation: true,
    shareSkill: true,
    shareAvailability: true
  };
  const storedPrivacySettings = storage.get("golfConnectPrivacySettings", {});
  let privacySettings = Object.keys(defaultPrivacySettings).reduce(function (settings, key) {
    settings[key] = storedPrivacySettings && typeof storedPrivacySettings[key] === "boolean"
      ? storedPrivacySettings[key]
      : defaultPrivacySettings[key];
    return settings;
  }, {});
  let customPlayers = storage.get("golfConnectProfiles", []);
  let rounds = storage.get("golfConnectRounds", [
    { id: 1, course: "Fairmont Fairway", date: "2026-05-10", score: 88, notes: "Great weather and a new personal best for nine holes." },
    { id: 2, course: "Riverbend Links", date: "2026-04-26", score: 96, notes: "Played a relaxed round with friends." }
  ]);
  let savedIds = storage.get("golfConnectSavedIds", []);
  let isPremium = storage.get("golfConnectPremium", false);
  let lessonBookings = storage.get("golfConnectLessonBookings", []);

  document.title = STARTUP.name;
  document.getElementById("brand-name").textContent = STARTUP.name;
  document.getElementById("tagline").textContent = STARTUP.tagline;
  document.getElementById("pitch").textContent = STARTUP.pitch;

  function showView() {
    const requested = (window.location.hash || "#home").slice(1);
    const views = Array.from(document.querySelectorAll("[data-view]"));
    const current = views.some(function (view) { return view.id === requested; }) ? requested : "home";

    views.forEach(function (view) {
      view.hidden = view.id !== current;
    });
    document.querySelectorAll("nav a").forEach(function (link) {
      const isCurrent = link.getAttribute("href") === "#" + current;
      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", showView);

  const allPlayers = function () {
    const visibleProfiles = privacySettings.profileVisible
      ? customPlayers.map(function (player) {
        return Object.assign({}, player, {
          name: privacySettings.shareName ? player.name : "Golf Connect golfer",
          initials: privacySettings.shareName ? player.initials : "GC",
          location: privacySettings.shareLocation ? player.location : "",
          skill: privacySettings.shareSkill ? player.skill : "",
          availability: privacySettings.shareAvailability ? player.availability : ""
        });
      })
      : [];
    return visibleProfiles.concat(LISTINGS);
  };

  const listingGrid = document.getElementById("listing-grid");
  const featuredGrid = document.getElementById("featured-player-grid");
  const searchBox = document.getElementById("search-box");
  const locationFilter = document.getElementById("location-filter");
  const skillFilter = document.getElementById("skill-filter");
  const availabilityFilter = document.getElementById("availability-filter");
  const interestFilter = document.getElementById("interest-filter");
  const emptyMessage = document.getElementById("empty-message");
  const playerCount = document.getElementById("player-count");
  const proGrid = document.getElementById("pro-grid");
  const proSearchBox = document.getElementById("pro-search-box");
  const proCount = document.getElementById("pro-count");
  const proEmptyMessage = document.getElementById("pro-empty-message");
  const lessonBookingList = document.getElementById("lesson-booking-list");
  const lessonDateInput = document.querySelector('#lesson-form input[name="date"]');
  let selectedPro = null;

  function makePlayerCard(player, compact) {
    const card = document.createElement("article");
    card.className = compact ? "player-card compact" : "player-card";

    const header = document.createElement("div");
    header.className = "player-header";

    const avatar = document.createElement("span");
    avatar.className = "avatar";
    avatar.textContent = player.initials || player.name.slice(0, 2).toUpperCase();

    const identity = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = player.name;
    identity.append(title);
    if (player.location) {
      const location = document.createElement("p");
      location.textContent = player.location;
      identity.append(location);
    }
    header.append(avatar, identity);

    const details = document.createElement("div");
    details.className = "player-details";
    [["Skill", player.skill], ["Available", player.availability]].forEach(function (item) {
      if (!item[1]) return;
      const detail = document.createElement("span");
      const label = document.createElement("b");
      label.textContent = item[0];
      detail.append(label, document.createTextNode(item[1]));
      details.appendChild(detail);
    });

    const description = document.createElement("p");
    description.className = "player-description";
    description.textContent = player.description || "Interested in golf and meeting compatible playing partners.";

    const interest = document.createElement("p");
    interest.className = "interest";
    interest.textContent = player.interests || "Social golf";

    const isSaved = savedIds.indexOf(player.id) !== -1;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button secondary";
    button.textContent = isSaved ? "Saved ✓" : "Save player";
    button.setAttribute("aria-pressed", isSaved ? "true" : "false");
    button.addEventListener("click", function () {
      toggleSaved(player.id);
    });

    card.append(header, details, description, interest, button);
    return card;
  }

  function toggleSaved(id) {
    const nextSavedIds = savedIds.indexOf(id) === -1
      ? savedIds.concat(id)
      : savedIds.filter(function (savedId) { return savedId !== id; });
    if (!storage.set("golfConnectSavedIds", nextSavedIds)) {
      playerCount.textContent = "Could not save this player in this browser. Check browser storage permissions and try again.";
      playerCount.setAttribute("role", "alert");
      return;
    }
    savedIds = nextSavedIds;
    playerCount.setAttribute("role", "status");
    renderPlayers();
  }

  function renderPlayers() {
    const query = searchBox.value.trim().toLowerCase();
    const matches = allPlayers().filter(function (player) {
      const matchesLocation = !locationFilter.value || player.location === locationFilter.value;
      const matchesSkill = !skillFilter.value || player.skill === skillFilter.value;
      const matchesAvailability = !availabilityFilter.value || player.availability === availabilityFilter.value;
      const matchesInterest = !interestFilter.value || !isPremium || (player.interests || "").toLowerCase().indexOf(interestFilter.value.toLowerCase()) !== -1;
      const searchable = (player.name + " " + player.location + " " + player.skill + " " + player.availability + " " + (player.interests || "") + " " + (player.course || "")).toLowerCase();
      return matchesLocation && matchesSkill && matchesAvailability && matchesInterest && searchable.indexOf(query) !== -1;
    });

    listingGrid.replaceChildren.apply(listingGrid, matches.map(function (player) {
      return makePlayerCard(player, false);
    }));
    emptyMessage.hidden = matches.length > 0;
    playerCount.setAttribute("role", "status");
    playerCount.textContent = matches.length + " golfer" + (matches.length === 1 ? "" : "s") + " found";
  }

  function populateLocations() {
    locationFilter.replaceChildren(locationFilter.options[0].cloneNode(true));
    const locations = Array.from(new Set(allPlayers().map(function (player) { return player.location; }))).sort();
    locations.forEach(function (location) {
      const option = document.createElement("option");
      option.textContent = location;
      option.value = location;
      locationFilter.appendChild(option);
    });
  }

  function renderFeatured() {
    const featured = LISTINGS.filter(function (player) { return player.location === "Antigonish"; }).slice(0, 3);
    featuredGrid.replaceChildren.apply(featuredGrid, featured.map(function (player) {
      return makePlayerCard(player, true);
    }));
  }

  function renderPros() {
    const query = proSearchBox.value.trim().toLowerCase();
    const matches = PROS.filter(function (pro) {
      const searchable = [pro.name, pro.location, pro.course, pro.specialty, pro.experience, pro.availability].join(" ").toLowerCase();
      return searchable.indexOf(query) !== -1;
    });

    const cards = matches.map(function (pro) {
      const card = document.createElement("article");
      card.className = "pro-card";

      const header = document.createElement("div");
      header.className = "player-header";
      const avatar = document.createElement("span");
      avatar.className = "avatar";
      avatar.textContent = pro.initials;
      const identity = document.createElement("div");
      const name = document.createElement("h2");
      name.textContent = pro.name;
      const course = document.createElement("p");
      course.textContent = pro.course + " · " + pro.location;
      identity.append(name, course);
      header.append(avatar, identity);

      const details = document.createElement("div");
      details.className = "pro-details";
      [
        ["Teaching", pro.experience],
        ["Lessons", pro.specialty],
        ["Availability", pro.availability],
        ["Rate", pro.rate]
      ].forEach(function (item) {
        const detail = document.createElement("p");
        const label = document.createElement("strong");
        label.textContent = item[0];
        const value = document.createElement("span");
        value.textContent = item[1];
        detail.append(label, value);
        details.appendChild(detail);
      });

      const button = document.createElement("button");
      button.type = "button";
      button.className = "button";
      button.textContent = "Book a lesson";
      button.addEventListener("click", function () {
        openLessonDialog(pro);
      });
      card.append(header, details, button);
      return card;
    });

    proGrid.replaceChildren.apply(proGrid, cards);
    proCount.textContent = matches.length + " pro" + (matches.length === 1 ? "" : "s") + " found";
    proEmptyMessage.hidden = matches.length > 0;
  }

  function renderLessonBookings() {
    if (lessonBookings.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "No demo lesson bookings yet.";
      lessonBookingList.replaceChildren(empty);
      return;
    }

    const cards = lessonBookings.slice().sort(function (a, b) {
      return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
    }).map(function (booking) {
      const card = document.createElement("article");
      card.className = "lesson-booking";
      const details = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = booking.lessonType + " with " + booking.proName;
      const meta = document.createElement("p");
      const date = new Date(booking.date + "T12:00:00");
      meta.textContent = booking.course + " · " + date.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" }) + " at " + booking.time;
      details.append(title, meta);
      if (booking.note) {
        const note = document.createElement("p");
        note.textContent = "Note: " + booking.note;
        details.appendChild(note);
      }
      const label = document.createElement("span");
      label.className = "demo-booking-label";
      label.textContent = "Demo booking";
      card.append(details, label);
      return card;
    });
    lessonBookingList.replaceChildren.apply(lessonBookingList, cards);
  }

  function openLessonDialog(pro) {
    selectedPro = pro;
    const error = document.getElementById("lesson-form-error");
    error.hidden = true;
    error.textContent = "";
    document.getElementById("lesson-pro-summary").textContent =
      pro.name + " · " + pro.course + ", " + pro.location + " · " + pro.rate;
    const today = new Date();
    lessonDateInput.min = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");
    document.getElementById("lesson-dialog").showModal();
  }

  proSearchBox.addEventListener("input", renderPros);
  document.getElementById("lesson-form").addEventListener("submit", function (event) {
    event.preventDefault();
    if (!selectedPro) {
      const error = document.getElementById("lesson-form-error");
      error.textContent = "Choose a pro before saving a demo booking.";
      error.hidden = false;
      return;
    }
    const data = new FormData(event.currentTarget);
    const booking = {
      id: Date.now(),
      proName: selectedPro.name,
      course: selectedPro.course,
      lessonType: data.get("lessonType"),
      date: data.get("date"),
      time: data.get("time"),
      note: data.get("note")
    };
    const nextBookings = lessonBookings.concat(booking);
    if (!storage.set("golfConnectLessonBookings", nextBookings)) {
      const error = document.getElementById("lesson-form-error");
      error.textContent = "Could not save this demo booking in this browser. Check browser storage permissions and try again.";
      error.hidden = false;
      return;
    }
    lessonBookings = nextBookings;
    renderLessonBookings();
    event.currentTarget.reset();
    selectedPro = null;
    closeDialogs();
  });

  [searchBox, locationFilter, skillFilter, availabilityFilter].forEach(function (control) {
    control.addEventListener(control.tagName === "INPUT" ? "input" : "change", renderPlayers);
  });
  interestFilter.addEventListener("change", function () {
    if (!isPremium && interestFilter.value) {
      interestFilter.value = "";
      window.location.hash = "#premium";
    } else {
      renderPlayers();
    }
  });

  function renderTournaments() {
    const list = document.getElementById("tournament-list");
    const elements = TOURNAMENTS.map(function (event) {
      const card = document.createElement("article");
      card.className = "tournament-card";

      const date = document.createElement("div");
      date.className = "tournament-date";
      const dateParts = event.date.split(" ");
      date.innerHTML = "<span>" + dateParts[0] + "</span><strong>" + dateParts[1] + "</strong>";

      const details = document.createElement("div");
      details.className = "tournament-details";
      const title = document.createElement("h2");
      title.textContent = event.name;
      const meta = document.createElement("p");
      meta.textContent = event.location + " · " + event.format + " · " + event.level;
      details.append(title, meta);

      const action = document.createElement("div");
      action.className = "tournament-action";
      const spots = document.createElement("span");
      spots.textContent = event.spots;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button secondary";
      button.textContent = "Interested";
      button.addEventListener("click", function () {
        button.textContent = "Interest saved ✓";
        button.disabled = true;
      });
      action.append(spots, button);

      card.append(date, details, action);
      return card;
    });
    list.replaceChildren.apply(list, elements);
  }

  function renderRounds() {
    const list = document.getElementById("round-list");
    document.getElementById("round-count").textContent = rounds.length;
    document.getElementById("course-count").textContent = new Set(rounds.map(function (round) { return round.course; })).size;
    const scores = rounds.map(function (round) { return Number(round.score); }).filter(function (score) { return !isNaN(score); });
    document.getElementById("best-score").textContent = scores.length ? Math.min.apply(null, scores) : "--";

    if (rounds.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "No rounds recorded yet.";
      list.replaceChildren(empty);
      return;
    }

    const cards = rounds.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).map(function (round) {
      const card = document.createElement("article");
      card.className = "round-card";
      const date = new Date(round.date + "T12:00:00");
      const details = document.createElement("div");
      const roundDate = document.createElement("span");
      roundDate.className = "round-date";
      roundDate.textContent = date.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
      const course = document.createElement("h2");
      course.textContent = round.course;
      const notes = document.createElement("p");
      notes.textContent = round.notes || "Golf round";
      details.append(roundDate, course, notes);
      const score = document.createElement("div");
      score.className = "score";
      const scoreValue = document.createElement("strong");
      scoreValue.textContent = round.score;
      const scoreLabel = document.createElement("span");
      scoreLabel.textContent = "score";
      score.append(scoreValue, scoreLabel);
      card.append(details, score);
      return card;
    });
    list.replaceChildren.apply(list, cards);
  }

  function renderPrivacySettings() {
    Object.keys(defaultPrivacySettings).forEach(function (key) {
      const inputId = key.replace(/[A-Z]/g, function (letter) {
        return "-" + letter.toLowerCase();
      });
      document.getElementById(inputId).checked = privacySettings[key];
    });
  }

  function savePrivacySettings() {
    const nextSettings = Object.keys(defaultPrivacySettings).reduce(function (settings, key) {
      const inputId = key.replace(/[A-Z]/g, function (letter) {
        return "-" + letter.toLowerCase();
      });
      settings[key] = document.getElementById(inputId).checked;
      return settings;
    }, {});

    const status = document.getElementById("privacy-status");
    if (!storage.set("golfConnectPrivacySettings", nextSettings)) {
      status.textContent = "Could not save your privacy settings in this browser. Check browser storage permissions and try again.";
      status.setAttribute("role", "alert");
      renderPrivacySettings();
      return;
    }

    privacySettings = nextSettings;
    status.textContent = "Privacy settings saved on this browser.";
    status.setAttribute("role", "status");
    locationFilter.value = "";
    populateLocations();
    renderPlayers();
  }

  function clearDemoData() {
    if (!window.confirm("Delete all Golf Connect demo data saved in this browser? This cannot be undone.")) return;

    const keys = [
      "golfConnectProfiles",
      "golfConnectRounds",
      "golfConnectSavedIds",
      "golfConnectPremium",
      "golfConnectLessonBookings",
      "golfConnectPrivacySettings"
    ];
    const removed = keys.map(function (key) { return storage.remove(key); }).every(Boolean);
    const status = document.getElementById("privacy-status");
    if (!removed) {
      status.textContent = "Could not delete all saved data. Check browser storage permissions, then try again or clear this site's data in your browser settings.";
      status.setAttribute("role", "alert");
      return;
    }

    customPlayers = [];
    rounds = [];
    savedIds = [];
    isPremium = false;
    lessonBookings = [];
    privacySettings = Object.assign({}, defaultPrivacySettings);
    searchBox.value = "";
    locationFilter.value = "";
    skillFilter.value = "";
    availabilityFilter.value = "";
    interestFilter.value = "";
    renderPrivacySettings();
    populateLocations();
    renderPlayers();
    renderFeatured();
    renderLessonBookings();
    renderRounds();
    updatePremiumUI();
    const premiumStatus = document.getElementById("premium-status");
    premiumStatus.textContent = "";
    premiumStatus.setAttribute("role", "status");
    status.textContent = "All Golf Connect demo data was deleted from this browser.";
    status.setAttribute("role", "status");
  }

  function closeDialogs() {
    document.querySelectorAll("dialog[open]").forEach(function (dialog) { dialog.close(); });
  }
  document.querySelectorAll("[data-close-dialog]").forEach(function (button) {
    button.addEventListener("click", closeDialogs);
  });

  document.getElementById("open-profile-button").addEventListener("click", function () {
    const error = document.getElementById("profile-form-error");
    error.hidden = true;
    error.textContent = "";
    document.getElementById("profile-dialog").showModal();
  });
  document.getElementById("open-round-button").addEventListener("click", function () {
    const error = document.getElementById("round-form-error");
    error.hidden = true;
    error.textContent = "";
    document.getElementById("round-dialog").showModal();
  });

  document.getElementById("profile-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const player = {
      id: "custom-" + Date.now(),
      name: data.get("name"),
      location: data.get("location"),
      skill: data.get("skill"),
      availability: data.get("availability"),
      interests: "Custom profile",
      course: "Course preference not set",
      description: "Ready to meet compatible golfers.",
      initials: String(data.get("name")).slice(0, 2).toUpperCase()
    };
    const nextPlayers = [player].concat(customPlayers);
    if (!storage.set("golfConnectProfiles", nextPlayers)) {
      const error = document.getElementById("profile-form-error");
      error.textContent = "Could not save your profile in this browser. Check browser storage permissions and try again.";
      error.hidden = false;
      return;
    }
    customPlayers = nextPlayers;
    populateLocations();
    renderPlayers();
    event.currentTarget.reset();
    closeDialogs();
  });

  document.getElementById("round-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const round = {
      id: Date.now(),
      course: data.get("course"),
      date: data.get("date"),
      score: Number(data.get("score")),
      notes: data.get("notes")
    };
    const nextRounds = [round].concat(rounds);
    if (!storage.set("golfConnectRounds", nextRounds)) {
      const error = document.getElementById("round-form-error");
      error.textContent = "Could not save this round in this browser. Check browser storage permissions and try again.";
      error.hidden = false;
      return;
    }
    rounds = nextRounds;
    renderRounds();
    event.currentTarget.reset();
    closeDialogs();
  });

  function updatePremiumUI() {
    const button = document.getElementById("premium-button");
    const nav = document.getElementById("premium-nav");
    if (isPremium) {
      button.textContent = "Premium active ✓";
      button.disabled = true;
      nav.textContent = "Premium ✓";
      document.getElementById("sponsored-ad").classList.add("hidden-ad");
    } else {
      button.textContent = "Start Premium";
      button.disabled = false;
      nav.textContent = "Premium";
      document.getElementById("sponsored-ad").classList.remove("hidden-ad");
    }
  }

  document.getElementById("premium-button").addEventListener("click", function () {
    const status = document.getElementById("premium-status");
    if (!storage.set("golfConnectPremium", true)) {
      status.textContent = "Could not save Premium on this browser. Check browser storage permissions and try again.";
      status.setAttribute("role", "alert");
      return;
    }
    isPremium = true;
    status.textContent = "Premium demo is active on this browser.";
    status.setAttribute("role", "status");
    updatePremiumUI();
  });

  Object.keys(defaultPrivacySettings).forEach(function (key) {
    const inputId = key.replace(/[A-Z]/g, function (letter) {
      return "-" + letter.toLowerCase();
    });
    document.getElementById(inputId).addEventListener("change", savePrivacySettings);
  });
  document.getElementById("clear-demo-data").addEventListener("click", clearDemoData);

  document.getElementById("ad-button").addEventListener("click", function (event) {
    event.currentTarget.textContent = "Offer saved ✓";
    event.currentTarget.disabled = true;
  });

  document.getElementById("promoted-button").addEventListener("click", function (event) {
    event.currentTarget.textContent = "More details sent ✓";
    event.currentTarget.disabled = true;
  });

  populateLocations();
  renderPlayers();
  renderPros();
  renderLessonBookings();
  renderFeatured();
  renderTournaments();
  renderRounds();
  updatePremiumUI();
  renderPrivacySettings();
  showView();
})();
