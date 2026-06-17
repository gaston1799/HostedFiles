# Project Nozo Tampermonkey Script

This folder contains `PROJECT NOZO By gaston.user.js`, a very large Tampermonkey script intended to automate gameplay in **moomoo.io**.

## Features Observed

- Hooks into the game via WebSocket to send custom packets.
- Auto-aim and auto-attack logic (`frameTest` and various `auto*` flags).
- Automatic item placement, auto-buying and auto-respawn behaviour.
- Optional bot spawner (code references WebSocket bot connections).
- Extensive chat/lyrics system that can play music and send timed messages.
- Numerous configuration flags such as `autoOneFrame`, `autoPush`, `safeWalk`, etc.
- UI hooks and custom logging utilities.

The script currently spans over **32k lines** and mixes many different systems in one file.

## Suggested Improvements

1. **Modularise the Code**
   - Split the script into modules (e.g. networking, combat, macros, UI). This will make it easier to maintain and debug.
2. **Remove Unused Features**
   - Several bot functions are left in the code but disabled. Removing or isolating them will reduce size and confusion.
3. **Optimise Timers and Loops**
   - The script uses many intervals/timeouts which may hurt performance. Consolidate repeated checks or use event-driven logic where possible.
4. **Provide In-Game Configuration**
   - Expose toggles for features (auto-aim, auto-place, auto-join-main) so players can enable only what they need.
5. **Clean Up Logging and Debug Code**
   - There are large amounts of debug output and placeholder functions. Trim these to reduce overhead.
6. **Add Error Handling**
   - Network requests and WebSocket handling should be wrapped in try/catch blocks to avoid crashes.
7. **Document Keybinds and Features**
   - A concise list of hotkeys and options would help users understand how to operate the mod.

These changes should improve performance and clarity, making the bot easier to modify or extend for better gameplay.

## Rewritten Bot Progress

The new `moomooScript.user.js` starts a clean rewrite with modern ES6 modules.
Current features include:

- Basic math constants for geometric calculations.
- A `LyricsPlayer` utility that can play songs and post timed lyrics to chat.
- `GameSocket` wrapper which intercepts the game's WebSocket and logs all
  incoming and outgoing packets for debugging.

Future updates will gradually port additional functionality from the original
script while keeping the code modular and maintainable.
