// ==UserScript==
// @name         AntiQuasar
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Automates Antimatter Dimensions including all 12 Normal Challenges
// @updateURL    https://raw.githubusercontent.com/miguelaguiar01/antiquasar/main/AntiQuasar.user.js
// @downloadURL  https://raw.githubusercontent.com/miguelaguiar01/antiquasar/main/AntiQuasar.user.js
// @license      MIT
// @match        https://ivark.github.io/
// @match        https://ivark.github.io/AntimatterDimensions/
// @match        *://antimatter-dimensions.github.io/*
// @grant        GM_getValue
// @grant        GM_setValue
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// ==/UserScript==

(function () {
  "use strict";

  var VERSION = "2.3";

  function waitForGame(callback) {
    var interval = setInterval(function () {
      if (
        document.querySelector(".o-tab-btn") &&
        document.querySelector(".l-old-ui__page")
      ) {
        clearInterval(interval);
        callback();
      }
    }, 500);
  }

  waitForGame(init);

  function init() {
    // ─── INJECT STYLES ────────────────────────────────────────────────────

    $('<style id="aq-styles">')
      .text(
        `
            #antiquasar-btn {
                position: fixed;
                right: 10px;
                bottom: 10px;
                z-index: 10000;
                background: #0d0d1a;
                color: #aaddff;
                border: 1px solid #aaddff55;
                padding: 5px 12px;
                font-size: 12px;
                cursor: pointer;
                border-radius: 4px;
                font-family: monospace;
                letter-spacing: 1px;
                user-select: none;
            }
            #antiquasar-btn:hover { background: #1a1a2e; border-color: #aaddff; }

            #antiquasar-panel {
                display: none;
                position: fixed;
                bottom: 42px;
                right: 10px;
                z-index: 10000;
                background: #0a0a18ee;
                color: #aaddff;
                border: 1px solid #aaddff33;
                border-radius: 6px;
                width: 220px;
                min-width: 160px;
                min-height: 180px;
                font-family: monospace;
                backdrop-filter: blur(6px);
                box-shadow: 0 4px 24px #000a;
                overflow: hidden;
                resize: both;
            }
            #aq-titlebar {
                background: #aaddff0d;
                border-bottom: 1px solid #aaddff22;
                padding: 7px 10px;
                cursor: move;
                display: flex;
                align-items: center;
                justify-content: space-between;
                user-select: none;
            }
            #aq-titlebar span {
                font-size: 11px;
                letter-spacing: 2px;
                text-transform: uppercase;
                color: #ffffff88;
            }
            #aq-titlebar-btns { display: flex; gap: 6px; }
            .aq-titlebar-btn {
                background: none;
                border: 1px solid #aaddff33;
                color: #aaddff88;
                border-radius: 3px;
                width: 18px; height: 18px;
                font-size: 10px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                font-family: monospace;
                line-height: 1;
            }
            .aq-titlebar-btn:hover { border-color: #aaddff; color: #aaddff; background: #aaddff11; }
            #aq-body {
                padding: 8px;
                overflow-y: auto;
                max-height: calc(100% - 36px);
            }
            .aq-section-label {
                font-size: 9px;
                color: #aaddff44;
                letter-spacing: 2px;
                text-transform: uppercase;
                margin: 8px 0 3px 2px;
            }
            .aq-btn {
                display: block;
                width: 100%;
                margin: 3px 0;
                padding: 5px 8px;
                background: #ffffff06;
                color: #aaddffaa;
                border: 1px solid #aaddff1a;
                border-radius: 3px;
                cursor: pointer;
                font-family: monospace;
                font-size: 11px;
                text-align: left;
                transition: background 0.1s, border-color 0.1s, color 0.1s;
                box-sizing: border-box;
            }
            .aq-btn:hover { background: #aaddff0d; color: #aaddff; border-color: #aaddff44; }
            .aq-btn.on { border-color: #44ffaa66; color: #44ffaa; background: #44ffaa0d; }
            .aq-btn.on:hover { border-color: #44ffaaaa; background: #44ffaa1a; }
            #aq-challenge-status {
                display: none;
                margin-top: 6px;
                padding: 5px 8px;
                font-size: 10px;
                color: #ffdd88;
                border: 1px solid #ffdd8844;
                border-radius: 3px;
                background: #ffdd8808;
                line-height: 1.6;
            }
            #aq-resize-hint {
                font-size: 9px;
                color: #aaddff22;
                text-align: right;
                padding: 2px 5px 3px 0;
                pointer-events: none;
                user-select: none;
            }
            #aq-stats-floater {
                display: none;
                position: fixed;
                top: 80px;
                left: 10px;
                z-index: 10000;
                background: #0a0a18ee;
                color: #aaddff;
                border: 1px solid #aaddff33;
                padding: 6px 10px;
                font-size: 11px;
                font-family: monospace;
                border-radius: 4px;
                cursor: move;
                line-height: 1.7;
                backdrop-filter: blur(4px);
                box-shadow: 0 2px 12px #0008;
                min-width: 140px;
                width: max-content;
                height: auto;
                user-select: none;
            }
        `,
      )
      .appendTo("head");

    // ─── INJECT HTML ──────────────────────────────────────────────────────

    $("body").append('<button id="antiquasar-btn">AntiQuasar</button>');
    $("body").append(`
            <div id="antiquasar-panel">
                <div id="aq-titlebar">
                    <span>AntiQuasar v${VERSION}</span>
                    <div id="aq-titlebar-btns">
                        <button class="aq-titlebar-btn" id="aq-minimize" title="Minimise">─</button>
                        <button class="aq-titlebar-btn" id="aq-close" title="Close">✕</button>
                    </div>
                </div>
                <div id="aq-body">
                    <div class="aq-section-label">General</div>
                    <button class="aq-btn" id="aq-AutoStandard">Automate Runs: OFF</button>
                    <button class="aq-btn" id="aq-AutoCrunch">Auto Crunch: OFF</button>
                    <button class="aq-btn" id="aq-TurboMaxAll">Turbo Max All: OFF</button>
                    <button class="aq-btn" id="aq-AutoSacrifice">Auto Sacrifice: OFF</button>
                    <button class="aq-btn" id="aq-AutoDimBoost">Auto Dim Boost: OFF</button>
                    <button class="aq-btn" id="aq-AutoGalaxy">Auto Galaxy: OFF</button>
                    <div class="aq-section-label">Challenges</div>
                    <button class="aq-btn" id="aq-AutoChallenge">Auto Challenge: OFF</button>
                    <div id="aq-challenge-status"></div>
                    <div class="aq-section-label">Display</div>
                    <button class="aq-btn" id="aq-StatsFloater">Run Stats: OFF</button>
                </div>
                <div id="aq-resize-hint">⇲ drag to resize</div>
            </div>
        `);
    $("body").append('<div id="aq-stats-floater">No stats yet.</div>');

    // ─── SETTINGS ─────────────────────────────────────────────────────────

    var settings = {
      AutoStandard: GM_getValue("AutoStandard", "0"),
      AutoCrunch: GM_getValue("AutoCrunch", "1"),
      TurboMaxAll: GM_getValue("TurboMaxAll", "0"),
      AutoSacrifice: GM_getValue("AutoSacrifice", "0"),
      AutoDimBoost: GM_getValue("AutoDimBoost", "0"),
      AutoGalaxy: GM_getValue("AutoGalaxy", "0"),
      AutoChallenge: GM_getValue("AutoChallenge", "0"),
      StatsFloater: GM_getValue("StatsFloater", "0"),
    };

    // Restore saved position/size
    var panel = document.getElementById("antiquasar-panel");
    var savedLeft = GM_getValue("panelLeft", null);
    var savedTop = GM_getValue("panelTop", null);
    if (savedLeft && savedTop) {
      panel.style.right = "";
      panel.style.bottom = "";
      panel.style.left = savedLeft;
      panel.style.top = savedTop;
    }
    var savedW = GM_getValue("panelW", null);
    var savedH = GM_getValue("panelH", null);
    if (savedW) panel.style.width = savedW;
    if (savedH) panel.style.height = savedH;

    function applyButtonStates() {
      $.each(settings, function (key, val) {
        var btn = $("#aq-" + key);
        var label = btn.text().split(":")[0].trim();
        btn.text(label + ": " + (val === "1" ? "ON" : "OFF"));
        val === "1" ? btn.addClass("on") : btn.removeClass("on");
      });
      $("#aq-stats-floater").css(
        "display",
        settings.StatsFloater === "1" ? "block" : "none",
      );
    }
    applyButtonStates();

    // ─── PANEL CONTROLS ───────────────────────────────────────────────────

    var minimized = false;

    $("#antiquasar-btn").click(function () {
      var p = $("#antiquasar-panel");
      if (p.is(":visible") && !minimized) {
        p.hide();
      } else {
        p.show();
        minimized = false;
        $("#aq-body, #aq-resize-hint").show();
      }
    });
    $("#aq-close").click(function () {
      $("#antiquasar-panel").hide();
    });
    $("#aq-minimize").click(function () {
      minimized = !minimized;
      minimized
        ? $("#aq-body, #aq-resize-hint").hide()
        : $("#aq-body, #aq-resize-hint").show();
    });

    $.each(Object.keys(settings), function (_, key) {
      $("#aq-" + key).click(function () {
        settings[key] = settings[key] === "1" ? "0" : "1";
        GM_setValue(key, settings[key]);
        applyButtonStates();
      });
    });

    // ─── DRAG (panel titlebar) ────────────────────────────────────────────

    (function () {
      var el = document.getElementById("antiquasar-panel");
      var hndl = document.getElementById("aq-titlebar");
      hndl.addEventListener("mousedown", function (e) {
        if (e.target.classList.contains("aq-titlebar-btn")) return;
        e.preventDefault();
        var rect = el.getBoundingClientRect();
        var startL = rect.left,
          startT = rect.top;
        var ox = e.clientX,
          oy = e.clientY;
        el.style.bottom = "";
        el.style.right = "";
        el.style.left = startL + "px";
        el.style.top = startT + "px";
        function onMove(e) {
          var newL = Math.max(
            0,
            Math.min(
              window.innerWidth - el.offsetWidth,
              startL + e.clientX - ox,
            ),
          );
          var newT = Math.max(
            0,
            Math.min(
              window.innerHeight - el.offsetHeight,
              startT + e.clientY - oy,
            ),
          );
          el.style.left = newL + "px";
          el.style.top = newT + "px";
        }
        function onUp() {
          GM_setValue("panelLeft", el.style.left);
          GM_setValue("panelTop", el.style.top);
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
        }
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });
    })();

    // ─── SAVE SIZE ────────────────────────────────────────────────────────

    (function () {
      var el = document.getElementById("antiquasar-panel");
      var lastW = el.offsetWidth,
        lastH = el.offsetHeight;
      setInterval(function () {
        if (el.offsetWidth !== lastW || el.offsetHeight !== lastH) {
          lastW = el.offsetWidth;
          lastH = el.offsetHeight;
          GM_setValue("panelW", el.offsetWidth + "px");
          GM_setValue("panelH", el.offsetHeight + "px");
        }
      }, 300);
    })();

    // ─── DRAG (stats floater) ─────────────────────────────────────────────

    (function () {
      var el = document.getElementById("aq-stats-floater");
      el.addEventListener("mousedown", function (e) {
        e.preventDefault();
        var rect = el.getBoundingClientRect();
        el.style.bottom = "";
        el.style.right = "";
        el.style.left = rect.left + "px";
        el.style.top = rect.top + "px";
        var startL = rect.left,
          startT = rect.top;
        var ox = e.clientX,
          oy = e.clientY;
        function onMove(e) {
          var newL = Math.max(
            0,
            Math.min(
              window.innerWidth - el.offsetWidth,
              startL + e.clientX - ox,
            ),
          );
          var newT = Math.max(
            0,
            Math.min(
              window.innerHeight - el.offsetHeight,
              startT + e.clientY - oy,
            ),
          );
          el.style.left = newL + "px";
          el.style.top = newT + "px";
        }
        function onUp() {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
        }
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });
    })();

    // ─── HELPERS ──────────────────────────────────────────────────────────

    function clickBtn(selector) {
      var el = document.querySelector(selector);
      if (
        el &&
        !el.classList.contains("o-primary-btn--disabled") &&
        !el.disabled
      ) {
        el.click();
        return true;
      }
      return false;
    }

    function getPlayer() {
      return typeof player !== "undefined" ? player : null;
    }

    function currentChallenge() {
      var p = getPlayer();
      return p ? p.challenge.normal.current : 0;
    }

    function setChallengeStatus(msg) {
      var el = document.getElementById("aq-challenge-status");
      if (!el) return;
      if (msg) {
        el.style.display = "block";
        el.innerHTML = msg;
      } else {
        el.style.display = "none";
        el.innerHTML = "";
      }
    }

    // Base costs and cost multipliers per purchase of 10, for each dim tier (0-indexed)
    var DIM_BASE_COSTS = [10, 100, 1e4, 1e6, 1e9, 1e13, 1e18, 1e24];
    var DIM_COST_MULTS = [1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15];

    function getDimCurrentCost(tier) {
      var p = getPlayer();
      if (!p) return Infinity;
      var dim = p.dimensions.antimatter[tier];
      var sets = Math.floor(dim.bought / 10);
      return (
        DIM_BASE_COSTS[tier] *
        Math.pow(DIM_COST_MULTS[tier], sets + dim.costBumps)
      );
    }

    function getDimNextCost(tier) {
      var p = getPlayer();
      if (!p) return Infinity;
      var dim = p.dimensions.antimatter[tier];
      var sets = Math.floor(dim.bought / 10);
      return (
        DIM_BASE_COSTS[tier] *
        Math.pow(DIM_COST_MULTS[tier], sets + 1 + dim.costBumps)
      );
    }

    function canAfford(cost) {
      var p = getPlayer();
      if (!p || !p.antimatter || !p.antimatter.gte) return false;
      return p.antimatter.gte(cost);
    }

    function buyDimTen(tier) {
      // tier is 1-indexed
      var rows = document.querySelectorAll(
        ".c-antimatter-dim-row.l-dimension-single-row",
      );
      if (!rows || rows.length < tier) return false;
      var btn = rows[tier - 1].querySelector(".o-primary-btn--buy-10-ad");
      if (btn && !btn.classList.contains("o-primary-btn--disabled")) {
        btn.click();
        return true;
      }
      return false;
    }

    function buyDimSingle(tier) {
      var rows = document.querySelectorAll(
        ".c-antimatter-dim-row.l-dimension-single-row",
      );
      if (!rows || rows.length < tier) return false;
      var btn = rows[tier - 1].querySelector(".o-primary-btn--buy-single-ad");
      if (btn && !btn.classList.contains("o-primary-btn--disabled")) {
        btn.click();
        return true;
      }
      return false;
    }

    // Smartly buys the dim needed for the next boost requirement.
    // Uses Until 10 normally, but adds single buys when close to the threshold
    // so we don't stall waiting for a full set of 10.
    // e.g. if we need 11 of dim 7 and have 10, Until 10 won't fire but a single buy will.
    function buyDimTowardBoost() {
      var label = document.querySelector(".l-dim-row__prestige-text");
      if (!label) return;
      var text = label.textContent.trim();
      var match = text.match(/requires (\d+) (\w+) Dimension/);
      if (!match) return;
      var required = parseInt(match[1]);
      var tierNames = {
        First: 1,
        Second: 2,
        Third: 3,
        Fourth: 4,
        Fifth: 5,
        Sixth: 6,
        Seventh: 7,
        Eighth: 8,
      };
      var tier = tierNames[match[2]];
      if (!tier) return;
      var p = getPlayer();
      if (!p) return;
      var amount = p.dimensions.antimatter[tier - 1].amount;
      if (!amount || !amount.toNumber) return;
      var current = amount.toNumber();
      var needed = required - current;
      if (needed <= 0) return; // already have enough

      // First: make sure all lower dims are being bought so production flows up
      // to the required dim tier. Buy from dim 1 upward.
      for (var i = 1; i < tier; i++) {
        buyDimTen(i);
      }

      // Then focus on the required dim itself
      // Always try Until 10 (buys toward next multiple of 10)
      buyDimTen(tier);
      // If we're within 9 of the requirement, also buy singles to bridge the gap
      // This handles cases like needing 11 when at 10 — Until 10 won't fire
      // because we're already at a multiple of 10, but a single gets us to 11
      if (needed <= 9) {
        buyDimSingle(tier);
      }
    }

    function doSacrifice() {
      var btn = document.querySelector(".o-primary-btn--sacrifice");
      if (btn && !btn.classList.contains("o-primary-btn--disabled")) {
        btn.click();
        return true;
      }
      return false;
    }

    function getSacMultiplier() {
      var btn = document.querySelector(".o-primary-btn--sacrifice");
      if (!btn) return 1;
      var match = btn.textContent.match(/×([\d.e+]+)/);
      return match ? parseFloat(match[1]) : 1;
    }

    function doCrunch() {
      return clickBtn(".o-big-crunch-btn");
    }

    function doDimBoost() {
      var el = document.querySelector(".o-primary-btn--dimboost");
      if (el && !el.disabled) {
        el.click();
        return true;
      }
      return false;
    }
    function doGalaxy() {
      return clickBtn(".o-primary-btn--galaxy");
    }
    function doMaxAll() {
      return clickBtn(".o-primary-btn--buy-max");
    }

    // Parses the galaxy requirement from the prestige label, e.g:
    // "Antimatter Galaxies (1): requires 131 Eighth Dimensions"
    // Returns true if we own enough dim 8 AND antimatter is not too close to infinity.
    function canAffordGalaxy() {
      // Don't galaxy if we're close to infinity — don't waste a near-complete run
      var p = getPlayer();
      if (!p) return false;
      if (p.antimatter && p.antimatter.gte && p.antimatter.gte("1e300"))
        return false;

      // Find the galaxy label
      var labels = document.querySelectorAll(".l-dim-row__prestige-text");
      var galaxyLabel = null;
      for (var i = 0; i < labels.length; i++) {
        if (labels[i].textContent.indexOf("Galaxies") !== -1) {
          galaxyLabel = labels[i];
          break;
        }
      }
      if (!galaxyLabel) return false;

      var match = galaxyLabel.textContent
        .trim()
        .match(/requires (\d+) Eighth Dimension/);
      if (!match) return false;
      var required = parseInt(match[1]);

      // Check dim 8 amount
      var dim8 = p.dimensions.antimatter[7];
      if (!dim8 || !dim8.amount || !dim8.amount.gte) return false;
      return dim8.amount.gte(required);
    }

    var c2BuyCount = 0;

    function challengeC2() {
      // Only buy when 3+ dimensions are simultaneously affordable
      // C2 restricts to dims 1-4 (no boosts available), so only check those
      var unlocked = getUnlockedDimCount(); // will be 4 in C2
      var affordable = 0;
      for (var i = 0; i < unlocked; i++) {
        if (canAfford(getDimCurrentCost(i))) affordable++;
      }
      // Also boost whenever possible — C2 still needs boosts to progress
      if (canAffordGalaxy()) doGalaxy();
      if (canAffordDimBoost()) doDimBoost();
      if (affordable >= 3) {
        doMaxAll();
        c2BuyCount = 0;
      } else {
        c2BuyCount++;
        if (c2BuyCount > 2000) {
          doMaxAll();
          c2BuyCount = 0;
        } // timeout fallback after 20s
      }
      doCrunch();
      setChallengeStatus(
        "C2 — Autobuy 2nd Dim<br>Affordable: " + affordable + "/" + unlocked,
      );
    }

    function challengeC3() {
      // C3 caps at dim 3 by design, no boosts needed
      doMaxAll();
      if (canAffordGalaxy()) doGalaxy();
      if (canAffordDimBoost()) doDimBoost();
      doCrunch();
      setChallengeStatus("C3 — Autobuy 3rd Dim");
    }

    function challengeC4() {
      // C4 caps at dim 4 by design, no boosts needed
      doMaxAll();
      if (canAffordGalaxy()) doGalaxy();
      if (canAffordDimBoost()) doDimBoost();
      doCrunch();
      setChallengeStatus("C4 — Autobuy 4th Dim");
    }

    function challengeC5() {
      if (phaseOneBoost("C5 — Autobuy 5th Dim")) return;
      doMaxAll();
      if (canAffordGalaxy()) doGalaxy();
      if (canAffordDimBoost()) doDimBoost();
      doCrunch();
      setChallengeStatus("C5 — Autobuy 5th Dim");
    }

    function challengeC6() {
      if (phaseOneBoost("C6 — Autobuy 6th Dim")) return;
      doMaxAll();
      if (canAffordGalaxy()) doGalaxy();
      if (canAffordDimBoost()) doDimBoost();
      doCrunch();
      setChallengeStatus("C6 — Autobuy 6th Dim");
    }

    function challengeC7() {
      if (phaseOneBoost("C7 — Autobuy 7th Dim")) return;
      doMaxAll();
      if (canAffordGalaxy()) doGalaxy();
      if (canAffordDimBoost()) doDimBoost();
      doCrunch();
      setChallengeStatus("C7 — Autobuy 7th Dim");
    }

    function challengeC8() {
      // Phase 1: get all 4 boosts to unlock dim 8
      if (phaseOneBoost("C8 — Autobuy 8th Dim")) return;
      // Phase 2: sac-heavy strategy focused on dim 8
      // Always boost and galaxy when possible — free multipliers
      if (canAffordGalaxy()) doGalaxy();
      if (canAffordDimBoost()) doDimBoost();
      var sac = getSacMultiplier();
      if (sac >= 2) doSacrifice();
      buyDimTen(8);
      buyDimSingle(8);
      doMaxAll();
      doDimBoost();
      doCrunch();
      var p = getPlayer();
      var totalSac =
        p && p.chall8TotalSacrifice ? p.chall8TotalSacrifice.toFixed(1) : "?";
      setChallengeStatus(
        "C8 — Autobuy 8th Dim<br>Sac at: 2x (now: " +
          sac.toFixed(1) +
          "x)<br>Total sac bonus: " +
          totalSac,
      );
    }

    function challengeC10() {
      if (phaseOneBoost("C10 — No Tickspeed")) return;
      doMaxAll();
      if (canAffordGalaxy()) doGalaxy();
      if (canAffordDimBoost()) doDimBoost();
      doCrunch();
      setChallengeStatus("C10 — No Tickspeed");
    }

    function challengeC11() {
      if (phaseOneBoost("C11 — 1st Dim Only")) return;
      doMaxAll();
      if (canAffordGalaxy()) doGalaxy();
      if (canAffordDimBoost()) doDimBoost();
      var sac = getSacMultiplier();
      if (sac >= 2) doSacrifice();
      doCrunch();
      setChallengeStatus("C11 — 1st Dim Only<br>Sac: " + sac.toFixed(1) + "x");
    }

    function challengeC12() {
      // Dims 1 & 2 produce antimatter directly
      if (phaseOneBoost("C12 — Dims 1 & 2 Only")) return;
      buyDimTen(1);
      buyDimTen(2);
      doMaxAll();
      if (canAffordGalaxy()) doGalaxy();
      if (canAffordDimBoost()) doDimBoost();
      doCrunch();
      setChallengeStatus("C12 — Dims 1 & 2 Only");
    }

    function getUnlockedDimCount() {
      var p = getPlayer();
      if (!p) return 4;
      var boosts = p.dimensionBoosts || 0;
      return Math.min(8, 4 + boosts);
    }

    // Parses the dimboost requirement label in the DOM, e.g:
    // "Dimension Boost (3): requires 11 Seventh Dimensions"
    // Returns true if we currently own enough of that dimension to boost.
    // This automatically handles the 20->11 infinity upgrade.
    function canAffordDimBoost() {
      var label = document.querySelector(".l-dim-row__prestige-text");
      if (!label) return false;
      var text = label.textContent.trim();
      var match = text.match(/requires (\d+) (\w+) Dimension/);
      if (!match) return false;
      var requiredCount = parseInt(match[1]);
      var tierNames = {
        First: 0,
        Second: 1,
        Third: 2,
        Fourth: 3,
        Fifth: 4,
        Sixth: 5,
        Seventh: 6,
        Eighth: 7,
      };
      var tierIndex = tierNames[match[2]];
      if (tierIndex === undefined) return false;
      var p = getPlayer();
      if (!p) return false;
      var amount = p.dimensions.antimatter[tierIndex].amount;
      return amount && amount.gte ? amount.gte(requiredCount) : false;
    }

    // ── SHARED PHASE 1: unlock all 8 dims via boosts ────────────────────
    // Returns true if still in phase 1 (not all dims unlocked yet).
    // Caller should return immediately when this returns true.
    // challengeName is used for the status display.
    function phaseOneBoost(challengeName) {
      var unlockedDims = getUnlockedDimCount();
      if (unlockedDims >= 8) return false; // phase 1 done

      // Read requirement from DOM
      var boostLabel = document.querySelector(".l-dim-row__prestige-text");
      var boostText = boostLabel ? boostLabel.textContent.trim() : "";
      var boostMatch = boostText.match(/requires (\d+) (\w+) Dimension/);
      var tierNames = {
        First: 0,
        Second: 1,
        Third: 2,
        Fourth: 3,
        Fifth: 4,
        Sixth: 5,
        Seventh: 6,
        Eighth: 7,
      };
      var progressStr = "";

      if (boostMatch) {
        var required = parseInt(boostMatch[1]);
        var ti = tierNames[boostMatch[2]];
        var p = getPlayer();
        if (p && ti !== undefined) {
          var have = p.dimensions.antimatter[ti].amount.toNumber();
          progressStr =
            "<br>Need D" +
            (ti + 1) +
            ": " +
            Math.floor(have) +
            " / " +
            required;

          // Buy all dims from 1 up to the required tier to build production
          for (var i = 1; i <= ti + 1; i++) {
            buyDimTen(i);
            buyDimSingle(i); // bridge any gap below a multiple of 10
          }
        }
      }

      // Boost and galaxy whenever available during phase 1
      if (canAffordGalaxy()) doGalaxy();
      if (canAffordDimBoost()) doDimBoost();
      doCrunch();

      setChallengeStatus(
        challengeName +
          "<br>Phase 1: unlocking dims<br>Unlocked: " +
          unlockedDims +
          "/8" +
          progressStr,
      );
      return true; // still in phase 1
    }

    function challengeC9() {
      var p = getPlayer();
      if (!p) return;

      // Phase 1: get all 4 boosts so all 8 dims are available
      // C9-specific phase 1: be conservative — only buy the required dim and
      // its immediate parent to avoid inflating costs before phase 2 begins
      var unlockedDims = getUnlockedDimCount();
      if (unlockedDims < 8) {
        var boostLabel = document.querySelector(".l-dim-row__prestige-text");
        var boostText = boostLabel ? boostLabel.textContent.trim() : "";
        var boostMatch = boostText.match(/requires (\d+) (\w+) Dimension/);
        var tierNames = {
          First: 0,
          Second: 1,
          Third: 2,
          Fourth: 3,
          Fifth: 4,
          Sixth: 5,
          Seventh: 6,
          Eighth: 7,
        };
        var progressStr = "";
        if (boostMatch) {
          var required = parseInt(boostMatch[1]);
          var ti = tierNames[boostMatch[2]]; // 0-indexed
          if (p && ti !== undefined) {
            var have = p.dimensions.antimatter[ti].amount.toNumber();
            progressStr =
              "<br>Need D" +
              (ti + 1) +
              ": " +
              Math.floor(have) +
              " / " +
              required;

            // Buy exactly one set of each dim in the production chain,
            // lowest first so production flows upward to the required dim.
            // buyDimSingle on each so we don't overspend — just keep the
            // chain alive without jacking costs.
            for (var i = 1; i <= ti + 1; i++) {
              // Only buy if we have less than the required amount for this tier
              // (for lower dims, just keep at least 1 active)
              var dimAmount = p.dimensions.antimatter[i - 1].amount.toNumber();
              if (i < ti + 1) {
                // Lower dims: buy singles to keep production chain alive
                if (dimAmount < 10) buyDimSingle(i);
                else buyDimTen(i); // bulk once we have some
              } else {
                // Required dim: buy toward the threshold using Until 10 + single
                buyDimTen(i);
                if (have < required) buyDimSingle(i);
              }
            }
          }
        }
        if (canAffordGalaxy()) doGalaxy();
        if (canAffordDimBoost()) doDimBoost();

        // Buy tickspeed in phase 1 if it's cheaper than the required dim's current cost
        // — it boosts all production so it helps the chain reach the required dim faster
        var tsBtn1 = document.querySelector(".tickspeed-btn");
        if (
          tsBtn1 &&
          !tsBtn1.classList.contains("o-primary-btn--disabled") &&
          !tsBtn1.disabled
        ) {
          var ts1Text = tsBtn1.textContent.trim();
          var ts1Match = ts1Text.match(/Cost:\s*([\d.e+]+)/);
          if (ts1Match && boostMatch && ti !== undefined) {
            var ts1Cost = parseFloat(ts1Match[1]);
            var reqDimCost = getDimCurrentCost(ti); // cost of required dim
            if (ts1Cost <= reqDimCost && canAfford(ts1Cost)) tsBtn1.click();
          }
        }

        doCrunch();
        setChallengeStatus(
          "C9 — Tickspeed Challenge<br>Phase 1: unlocking dims<br>Unlocked: " +
            unlockedDims +
            "/8" +
            progressStr,
        );
        return;
      }

      // Phase 2: all 8 dims unlocked — run the safe-buy logic
      // Always boost and galaxy when possible — free multipliers
      if (canAffordGalaxy()) doGalaxy();
      if (canAffordDimBoost()) doDimBoost();

      var costs = [];
      var nextCosts = [];
      for (var i = 0; i < 8; i++) {
        costs[i] = getDimCurrentCost(i);
        nextCosts[i] = getDimNextCost(i);
      }

      // A dim is safe if its next cost doesn't collide with any other dim's current cost
      var safe = [];
      for (var i = 0; i < 8; i++) {
        safe[i] = true;
        for (var j = 0; j < 8; j++) {
          if (
            i !== j &&
            Math.abs(Math.log10(nextCosts[i]) - Math.log10(costs[j])) < 0.05
          ) {
            safe[i] = false;
            break;
          }
        }
      }

      // Buy the cheapest safe dim we can afford
      var bestTier = -1,
        bestCost = Infinity;
      for (var i = 0; i < 8; i++) {
        if (safe[i] && canAfford(costs[i]) && costs[i] < bestCost) {
          bestCost = costs[i];
          bestTier = i;
        }
      }

      if (bestTier >= 0) {
        buyDimTen(bestTier + 1);
      } else {
        // No safe buy — try dim 8 or 6 as fallback
        if (!buyDimTen(8)) buyDimTen(6);
      }

      // Emergency buy: if antimatter is 1e13x a dim's cost, buy regardless of safety
      if (p.antimatter && p.antimatter.gte) {
        for (var i = 0; i < 8; i++) {
          if (p.antimatter.gte(costs[i] * 1e13)) buyDimTen(i + 1);
        }
      }

      // Buy tickspeed when it's cheaper than the cheapest affordable dim,
      // or when no dims are affordable at all.
      // Parse cost from button text: "Tickspeed Cost: 1e6"
      var tsBtn = document.querySelector(".tickspeed-btn");
      if (
        tsBtn &&
        !tsBtn.classList.contains("o-primary-btn--disabled") &&
        !tsBtn.disabled
      ) {
        var tsText = tsBtn.textContent.trim();
        var tsMatch = tsText.match(/Cost:\s*([\d.e+]+)/);
        if (tsMatch) {
          var tsCost = parseFloat(tsMatch[1]);
          // Find cheapest dim cost we can currently afford
          var cheapestAffordable = Infinity;
          for (var i = 0; i < 8; i++) {
            if (canAfford(costs[i]) && costs[i] < cheapestAffordable) {
              cheapestAffordable = costs[i];
            }
          }
          // Buy tickspeed if: no dims affordable, OR tickspeed is cheaper than cheapest dim
          if (cheapestAffordable === Infinity || tsCost <= cheapestAffordable) {
            if (canAfford(tsCost)) tsBtn.click();
          }
        }
      }

      // Sacrifice is unrestricted in C9 — always take it at 2x+
      var sac = getSacMultiplier();
      if (sac >= 2) doSacrifice();

      doCrunch();
      var safeCount = safe.filter(Boolean).length;
      var tsDisplay = "";
      var tsBtnD = document.querySelector(".tickspeed-btn");
      if (tsBtnD) {
        var tsTxt = tsBtnD.textContent.trim().replace("Tickspeed ", "");
        tsDisplay = "<br>TS " + tsTxt;
      }
      setChallengeStatus(
        "C9 — Tickspeed Challenge<br>Phase 2: safe-buy<br>Safe dims: " +
          safeCount +
          "/8<br>" +
          (bestTier >= 0
            ? "Buying: dim " + (bestTier + 1)
            : "Fallback: dim 8 or 6") +
          "<br>Sac: " +
          sac.toFixed(1) +
          "x" +
          tsDisplay,
      );
    }

    // ─── CHALLENGE ROUTER ─────────────────────────────────────────────────

    function autoChallenge() {
      if (settings.AutoChallenge !== "1") {
        setChallengeStatus(null);
        return;
      }
      var c = currentChallenge();
      if (c === 0) {
        setChallengeStatus("No active challenge<br>Enter one to begin");
        return;
      }

      switch (c) {
        case 2:
          challengeC2();
          break;
        case 3:
          challengeC3();
          break;
        case 4:
          challengeC4();
          break;
        case 5:
          challengeC5();
          break;
        case 6:
          challengeC6();
          break;
        case 7:
          challengeC7();
          break;
        case 8:
          challengeC8();
          break;
        case 9:
          challengeC9();
          break;
        case 10:
          challengeC10();
          break;
        case 11:
          challengeC11();
          break;
        case 12:
          challengeC12();
          break;
        default:
          doMaxAll();
          doDimBoost();
          doCrunch();
          setChallengeStatus("C" + c + " — generic auto");
      }
    }

    // ─── GENERAL AUTOMATION ───────────────────────────────────────────────

    function autoStandard() {
      if (settings.AutoStandard !== "1") return;
      // Yield to challenge automation when inside a challenge
      if (settings.AutoChallenge === "1" && currentChallenge() !== 0) return;
      doMaxAll();
      if (settings.AutoDimBoost === "1") doDimBoost();
      if (settings.AutoGalaxy === "1") doGalaxy();
    }

    // Auto Crunch runs independently — does not require Auto Standard to be on
    function autoCrunch() {
      if (settings.AutoCrunch !== "1") return;
      // Challenge automation handles crunch inside challenges
      if (settings.AutoChallenge === "1" && currentChallenge() !== 0) return;
      doCrunch();
    }

    function turboMaxAll() {
      if (settings.TurboMaxAll !== "1") return;
      if (settings.AutoChallenge === "1" && currentChallenge() !== 0) return;
      doMaxAll();
    }

    function autoSacrifice() {
      if (settings.AutoSacrifice !== "1") return;
      if (settings.AutoChallenge === "1" && currentChallenge() !== 0) return;
      if (getSacMultiplier() >= 100) doSacrifice();
    }

    // ─── STATS FLOATER ────────────────────────────────────────────────────

    function updateStats() {
      if (settings.StatsFloater !== "1") return;
      var antimatter = document.querySelector(".c-game-header__antimatter");
      var ip = document.querySelector(".c-game-header__ip-amount");
      var p = getPlayer();
      var html = "";
      if (antimatter) html += "⚛ AM: " + antimatter.textContent.trim() + "<br>";
      if (ip) html += "∞ IP: " + ip.textContent.trim() + "<br>";
      if (p && p.challenge.normal.current > 0)
        html += "⚔ C" + p.challenge.normal.current + " active<br>";

      // IP/min from last 10 runs
      // recentInfinities entries: [time_ms, realTime_ms, ip, ...]
      if (p && p.records && p.records.recentInfinities) {
        var runs = p.records.recentInfinities;
        var totalIp = 0;
        var totalMs = 0;
        var count = 0;
        for (var i = 0; i < runs.length; i++) {
          var runMs = runs[i][0];
          var runIp = parseFloat(runs[i][2]);
          if (runMs > 0 && runIp > 0) {
            totalMs += runMs;
            totalIp += runIp;
            count++;
          }
        }
        if (count > 0 && totalMs > 0) {
          var ipPerMin = totalIp / (totalMs / 1000 / 60);
          // Format as mantissa + exponent like the game: e.g. 3.45e5
          var exp = Math.floor(Math.log10(ipPerMin));
          var mantissa = (ipPerMin / Math.pow(10, exp)).toFixed(2);
          var ipStr = mantissa + "e" + exp;
          html +=
            "📈 IP/min: " +
            ipStr +
            ' <span style="color:#aaddff55;font-size:9px;">(' +
            count +
            " runs)</span><br>";
        }
      }

      if (html) document.getElementById("aq-stats-floater").innerHTML = html;
    }

    function setTitle() {
      var c = currentChallenge();
      var suffix = c > 0 ? " [C" + c + "]" : "";
      document.title =
        "Antimatter Dimensions — AntiQuasar v" + VERSION + suffix;
    }

    // ─── START INTERVALS ──────────────────────────────────────────────────

    setInterval(autoChallenge, 10);
    setInterval(autoStandard, 10);
    setInterval(autoCrunch, 10);
    setInterval(turboMaxAll, 1);
    setInterval(autoSacrifice, 200);
    setInterval(updateStats, 500);
    setInterval(setTitle, 1000);
  }
})();
