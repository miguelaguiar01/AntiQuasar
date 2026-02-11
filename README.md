# AntiQuasar

A Tampermonkey userscript that automates [Antimatter Dimensions](https://ivark.github.io/).

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser
2. Click: [**Install AntiQuasar**](https://raw.githubusercontent.com/miguelaguiar01/antiquasar/main/AntiQuasar.user.js)
3. Tampermonkey will prompt you to install — click Install

Tampermonkey will automatically update the script when new versions are pushed to this repo.

## Features

- **Automate Runs** — max all + dim boost + galaxy + crunch on a loop
- **Auto Crunch** — big crunch at infinity independently of other automation
  - **Break Infinity Mode** — automatically crunches at peak IP/min (when Current < Peak and tickspeed unaffordable)
- **Turbo Max All** — buys dimensions at 1ms intervals
- **Auto Sacrifice** — dimensional sacrifice at 100x (configurable)
- **Auto Dim Boost** — dimension boosts when affordable
- **Auto Galaxy** — antimatter galaxies when affordable (won't galaxy past 1e300 AM to preserve near-complete runs)
- **Auto Challenge** — full automation for all 12 Normal Challenges (see below)
- **Run Stats** — floating overlay showing:
  - Current AM, IP, and challenge
  - IP/min average from last 10 runs
  - Break Infinity: live Current vs Peak IP/min comparison

## Challenge Automation

Enable **Auto Challenge**, enter any Normal Challenge, and AntiQuasar handles it automatically.

| Challenge | Strategy                                                             |
| --------- | -------------------------------------------------------------------- |
| C2        | Waits until 3+ dims are simultaneously affordable                    |
| C3–C7     | Phase 1 (unlock all dims via boosts) → max all                       |
| C8        | Phase 1 → sacrifice at 2x, focus dim 8                               |
| C9        | Phase 1 → safe-buy (avoids cost collisions) + tickspeed interleaving |
| C10       | Phase 1 → max all, no tickspeed                                      |
| C11       | Phase 1 → max all + sacrifice                                        |
| C12       | Phase 1 → focus dims 1 & 2                                           |

All challenges automatically handle dim boosts, galaxies, and sacrifice throughout.

### Challenge 9 Details

C9 (Tickspeed Challenge) is the hardest to automate. AntiQuasar handles it with:

- **Phase 1**: Conservative dim buying to unlock all 8 dims without cost inflation
- **Phase 2**: Safe-buy logic that avoids cost collisions (never buys a dim whose next cost matches another dim's current cost)
- **Tickspeed interleaving**: Buys tickspeed when cheaper than the cheapest affordable dim
- **Fallback strategy**: If no safe buys available, tries dim 8 → dim 6

## Usage

1. Navigate to [Antimatter Dimensions](https://ivark.github.io/)
2. Click the **AntiQuasar** button in the bottom-right
3. Toggle features on/off as needed
4. Panel is draggable and resizable — position and size persist across sessions

## Updating

Version is bumped on every commit. Tampermonkey checks for updates periodically — you can also force a check via:

**Tampermonkey → Installed Scripts → AntiQuasar → Check for updates**

## Contributing

PRs welcome! The script is structured as:

- **Helpers** — `getPlayer()`, `canAfford()`, `getDimCurrentCost()`, etc.
- **Actions** — `doCrunch()`, `doDimBoost()`, `doGalaxy()`, `doMaxAll()`, etc.
- **Challenges** — `challengeC2()` through `challengeC12()` with phase-based logic
- **Automation loops** — `autoChallenge()`, `autoCrunch()`, `autoStandard()` run on intervals

## License
