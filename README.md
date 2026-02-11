# AntiQuasar

A Tampermonkey userscript that automates [Antimatter Dimensions](https://ivark.github.io/).

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser
2. Click: [**Install AntiQuasar**](https://raw.githubusercontent.com/YOUR_USERNAME/antquasar/main/AntiQuasar.user.js)
3. Tampermonkey will prompt you to install — click Install

Tampermonkey will automatically update the script when new versions are pushed to this repo.

## Features

- **Automate Runs** — max all + dim boost + galaxy + crunch on a loop
- **Auto Crunch** — big crunch at infinity independently of other automation
- **Turbo Max All** — buys dimensions at 1ms intervals
- **Auto Sacrifice** — dimensional sacrifice at 100x (configurable)
- **Auto Dim Boost** — dimension boosts when affordable
- **Auto Galaxy** — antimatter galaxies when affordable
- **Auto Challenge** — full automation for all 12 Normal Challenges (see below)
- **Run Stats** — floating overlay showing AM, IP, current challenge, and IP/min from last 10 runs

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

## Updating

Version is bumped automatically on every release. Tampermonkey checks for updates periodically — you can also force a check via Tampermonkey → Installed Scripts → AntiQuasar → Check for updates.

## License

MIT
