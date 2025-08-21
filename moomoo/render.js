playerglobalAlpha=.5
// reneer sample to be fixed

 // =================== NEO STYLE THEME (Phase 1: Grid) ===================
                function UEH2_STYLE() {
                    return {
                        id: "ueh2",
                        tracker: {
                            draw1: { enabled: true,  fill: "#00FFFF", alpha: 1,  radius: 5 },
                            draw2: { enabled: true,  stroke: "#ffff00", alpha: 1, width: 2 },
                            draw3: { enabled: true,  fill: "#FF0000",  alpha: 0.35 },
                            draw4: { enabled: true,  stroke: "#00FFFF", alpha: 1, width: 2 }, // “for players” ring
                        },
                        tracer: {
                            enabled: (tmpObj, player) => !tmpObj.isTeam(player),
                            alpha: 0.45,
                            // can be number or fn(d)
                            minDist: (d) => d / 2,
                            maxClamp: 220,
                            factor: 0.5,
                        },

                        background: {
                            snow:   { fill: "#ffffff" },
                            grass:  { fill: "#b6db66" },
                            desert: { fill: "#dbc666" },
                            vignette: { enabled: false },
                            death: { enabled: true, glyph: "x", font: "100px Hammersmith One", color: "#fc5553", alpha: 1 },
                        },
                        // Background grid when visualType != 'ueh1'
                        grid: {
                            enabled: (visualType) => visualType !== "ueh1",
                            lineWidth: 4,
                            color: "#000",
                            alpha: 0.06,
                            dash: [],
                            stepDefault: 120,
                            stepWasd: 60,
                            snapPositiveOnly: true,
                        },

                        // Nameplate above player
                        name: {
                            show: (tmpObj, player, cfg) =>
                            tmpObj.skinIndex != 10 || tmpObj === player || (tmpObj.team && tmpObj.team === player.team),
                            fontFamily: "Hammersmith One",
                            size: (tmpObj) => tmpObj.nameScale || 30,
                            textColor: "#fff",
                            strokeColor: () => darkOutlineColor,
                            strokeWidth: (tmpObj) => (tmpObj.nameScale ? 11 : 8),
                            yPad: (cfg) => cfg.nameY,
                            crown: { sprite: "crown", size: (cfg) => cfg.crownIconScale, pad: (cfg) => cfg.crownPad },
                            skull:  { sprite: "skull",  size: (cfg) => cfg.crownIconScale, pad: (cfg) => cfg.crownPad },
                            crosshair: {
                                enabled: (tmpObj, player, enemy, useWasd) =>
                                tmpObj.isPlayer && instaC.wait && near === tmpObj && enemy.length && !useWasd,
                                sprites: () => crossHairSprites, // [normal, backupNoBull]
                                scale: (tmpObj) => tmpObj.scale * 2.2,
                            },
                        },

                        // Health bar below player name
                        health: {
                            holderFill: () => darkOutlineColor,
                            barGood: "#8ecc51",   // self/teammate
                            barBad:  "#cc5151",   // enemy
                            width: (cfg) => cfg.healthBarWidth,
                            pad:   (cfg) => cfg.healthBarPad,
                            height: 17,
                            corner: 8,
                        },

                        // Reload bars (legacy rectangles)
                        reloads: {
                            // primary/secondary under health bar (only if remaining > 0)
                            color: "#99ff99",
                            height: 17,
                            pad: (cfg) => cfg.healthBarPad,
                            corner: 7,

                            // turret for local player only
                            turretHolder: () => darkOutlineColor,
                            turretColor:  "#cc5151",
                        },

                        // Aim reticle (local player)
                        aim: {
                            showDot: true,
                            dotColor: "#fff",
                            dotAlpha: 0.75,
                            dotRadius: 5,
                        },

                        // Under-text debug rows
                        underText: {
                            // For ueh2 we keep enemy [primary, secondary, threat]; player only when ueh1 in your old code
                            showForPlayer: false,
                            showForOthers: true,
                            font: "20px Hammersmith One",
                            textColor: "#fff",
                            strokeColor: () => darkOutlineColor,
                            strokeWidth: 8,
                            yOffset: (cfg) => cfg.nameY + 27, // ~== 13.5 * 2 in your code
                        },

                        // Shame counter above head
                        shame: {
                            enabled: () => configs.names,
                            font: "30px Hammersmith One",
                            textColor: "#fff",
                            strokeColor: () => darkOutlineColor,
                            strokeWidth: 8,
                            yPad: (cfg) => cfg.nameY,
                            offsetCompute: "matchLegacy", // keep your tmpX calc logic
                        },

                        // Auto one-frame ping circle
                        pingCircle: {
                            enabled: () => configs.autoOneFrame || window.autoOneFrameToggled,
                            stroke: "#000",
                            alpha: 0.10,
                            lineWidth: 2,
                            radius: (ping) => (ping > 140) ? 230 : (ping > 110) ? 210 : (ping > 85) ? 190 : 170,
                        },

                        // Enemy tracer ghost
                        tracer: {
                            enabled: (tmpObj, player) => !tmpObj.isTeam(player),
                            alphaScale: (dist, cfg, screenH) =>
                            Math.min(1, (dist * 100) / (cfg.maxScreenHeight / 2) / (screenH / 2)),
                            distMin: (d) => d / 2,
                            distMax: (d) => d + 100,
                            lineAlphaFactor: 0.5,
                        },

                        // Prediction line (straight red)
                        predict: {
                            enabled: () => true,
                            lineWidth: 3,
                            stroke: "#cc5151",
                            alpha: 1,
                            // fields x2/y2, x3/y3... are read by your existing switch
                        },
                        water: {
                            enabled: true,
                            // slightly fancier neo vibe: softer base, brighter wave, a bit transparent
                            base:   { fill: "#E9D59A", alpha: 0.95 },             // warm sand undertone
                            wave:   { fill: "#5AC8FA", alpha: 0.85 },             // blue neon water
                            waveMaxRadius: 280,                                   // a touch more swell
                            padding: (cfg) => Math.max(0, (cfg.riverPadding|0) - 6),
                            composite: "lighter",                                 // nice glow blend
                        },
                    };
                }

                // (if you already made NEO_STYLE, keep it; otherwise stub it)
                // ======================== NEO STYLE ========================
                function NEO_STYLE() {
                    return {
                        id: "neo",
                        neonBiome: {
                            gridStep: 120,           // 60 when WASD, we override at runtime via useWasd
                            width: 1.5,
                            alpha: 0.22,
                            dash: [6,4],
                            glow: 10,
                            shadow: "rgba(0,0,0,0.65)",
                            colors: {
                                snow:   "#7EE5FF",
                                grass:  "#63FFA7",
                                desert: "#FFD27F",
                                seamSG: "#7EE5FF",
                                seamGD: "#FFD27F"
                            }
                        },

                        background: {
                            type: "gradient", // "solid" | "gradient" | "image" | "night"
                            solid: "rgba(0,0,0,0.35)",
                            gradient: {
                                stops: [
                                    { offset: 0,   color: "#0b0033" }, // top sky
                                    { offset: 0.5, color: "#190055" },
                                    { offset: 1,   color: "#000" }     // ground
                                ]
                            },
                            image: null, // or provide an Image() if u want a texture bg
                            nightOverlay: "rgba(0, 0, 70, 0.35)"
                        },
                        water: {
                            enabled: true,
                            base:   { fill: "#dbc666", alpha: 1 },    // sandbar/riverbed tint (first pass)
                            wave:   { fill: "#91b2db", alpha: 1 },    // water overlay (animated pass)
                            // how far the animated pass expands at max
                            waveMaxRadius: 250,                       // matches your (waterMult - 1) * 250
                            // padding that flows into renderWaterBodies()
                            padding: (cfg) => cfg.riverPadding,
                            // optional: composite mode (keep default if unsure)
                            composite: null,                          // e.g. "lighter"
                        },
                        tracer: {
                            enabled: (tmpObj, player) => !tmpObj.isTeam?.(player),
                            draw: neoTracerDraw,          // 👈 use the fancy Neo beam
                            alpha: 0.85,
                            minDist: 60,                  // can be number or fn(d)
                            maxClamp: 240,
                            factor: 0.55,
                            beamWidth: 3,
                            beamLo: "rgba(120,220,255,0.65)",
                            beamHi: "rgba(20,216,107,0.95)",
                            glow: 12,
                            shadowColor: "rgba(20,216,107,0.9)",
                            arrowSize: 11,
                            tipColor: "#14D86B",
                            pulse: { r0: 5, r1: 4, alpha: 0.35, color: "rgba(20,216,107,0.8)" },
                            ghost: { alpha: 0.30 },
                        },
                        background: {
                            snow:   { fill: { type: "linear", y0: 0, y1: 320, stops: [[0,"#f7fbff"], [1,"#e6f4ff"]] } },
                            grass:  { fill: { type: "linear", y0: 0, y1: 720, stops: [[0,"#b8f5d0"], [1,"#6ed39e"]] } },
                            desert: { fill: { type: "linear", y0: 0, y1: 720, stops: [[0,"#f6e6a9"], [1,"#e0c56b"]] } },
                            vignette: { enabled: true, alpha: 0.16 },
                            death: { enabled: true, glyph: "✖", font: "700 84px Inter, sans-serif", color: "#ff5470", alpha: 0.9 },
                        },
                        biome: {
                            grass: "#b6db66",
                            desert: "#dbc666",
                            snow: "#ffffff",
                        },
                        markers: {
                            deathColor: "#fc5553",
                            deathFont: "100px Hammersmith One",
                            deathSymbol: "x",
                        },
                        // Grid (you can disable for cleaner look)
                        grid: {
                            enabled: (visualType) => visualType === "neo",
                            lineWidth: 4,
                            color: "#000",
                            alpha: 0.06,
                            dash: [],
                            stepDefault: 120,
                            stepWasd: 60,
                            snapPositiveOnly: true,
                        },

                        // Nameplate: neo keeps names from configs.names; we let core code handle names already
                        name: {
                            show: (tmpObj, player, cfg) =>
                            tmpObj.skinIndex != 10 || tmpObj === player || (tmpObj.team && tmpObj.team === player.team),
                            // neo typically relies on chips instead of under-text,
                            // but keep name strokes to match your global flag
                            fontFamily: "Hammersmith One",
                            size: (tmpObj) => tmpObj.nameScale || 30,
                            textColor: "#fff",
                            strokeColor: () => darkOutlineColor,
                            strokeWidth: (tmpObj) => (tmpObj.nameScale ? 11 : 8),
                            yPad: (cfg) => cfg.nameY,
                            // icons same as ueh2
                            crown: { sprite: "crown", size: (cfg) => cfg.crownIconScale, pad: (cfg) => cfg.crownPad },
                            skull:  { sprite: "skull",  size: (cfg) => cfg.crownIconScale, pad: (cfg) => cfg.crownPad },
                            crosshair: {
                                enabled: (tmpObj, player, enemy, useWasd) =>
                                tmpObj.isPlayer && instaC.wait && near === tmpObj && enemy.length && !useWasd,
                                sprites: () => crossHairSprites,
                                scale: (tmpObj) => tmpObj.scale * 2.2,
                            },
                        },

                        // Health bar: keep your holder + bar, but you can set alpha lower if you want
                        health: {
                            holderFill: () => darkOutlineColor,
                            barGood: "#8ecc51",
                            barBad:  "#cc5151",
                            width: (cfg) => cfg.healthBarWidth,
                            pad:   (cfg) => cfg.healthBarPad,
                            height: 17,
                            corner: 8,
                            alpha: 1.0,
                        },

                        // Reload arcs (neo)
                        arcs: {
                            enabled: true,
                            // Primary / Secondary inner ring; Turret outer ring
                            baseR: (tmpObj) => tmpObj.scale + 14,
                            primary: {
                                sweep: Math.PI * 0.8,
                                lo: "#63FFA7",
                                hi: "#14D86B",
                                width: 6,
                                glow: 10,
                            },
                            secondary: {
                                sweep: Math.PI * 0.8,
                                lo: "#95C0FF",
                                hi: "#3E8BFF",
                                width: 6,
                                glow: 10,
                            },
                            turret: {
                                sweep: Math.PI * 0.55,
                                lo: "#FF8A8A",
                                hi: "#FF5252",
                                width: 6,
                                glow: 10,
                                radiusOffset: 8,
                            },
                            railAlpha: 0.2, // faint full-sweep rail behind arcs
                        },

                        // Aim reticle dot (glow) for local player
                        aim: {
                            glowColor: "rgba(120,220,255,0.75)",
                            glowBlur: 12,
                            radius: 4,
                        },

                        // Chips (compact info badges)
                        chips: {
                            enabled: true,
                            font: "600 14px Inter, system-ui, sans-serif",
                            colorText: "#E6F1FF",
                            fill: "rgba(18,22,28,0.9)",
                            stroke: "rgba(255,255,255,0.10)",
                            strokeWidth: 1,
                            r: 7,
                            padX: 8, padY: 4,
                            // placement:
                            yOffset: (tmpObj, cfg) => tmpObj.scale + 28 + cfg.nameY,
                            // content:
                            playerText: (pl) => `[${pl.oldSkinIndex},${pl.skinIndex}]`,
                            enemyText:  (obj) => {
                                const threat = (typeof obj.damageThreat === "number") ? obj.damageThreat.toFixed(2) : "?";
                                return `[${obj.primaryIndex ?? "?"},${obj.secondaryIndex ?? 0},${threat}]`;
                            },
                        },

                        // Shame chip above head
                        shame: {
                            enabled: () => configs.names,
                            fill: "rgba(255, 230, 0, 0.9)",
                            text: "#1A1A1A",
                            font: "700 16px Inter, system-ui, sans-serif",
                            r: 7,
                            padX: 6,
                            wPad: 12,
                            h: 20,
                            yAboveHead: (tmpObj, cfg) => tmpObj.scale + cfg.nameY + 26,
                        },

                        // Prediction: dashed hot pink
                        predict: {
                            enabled: true,
                            stroke: "#FF5A7D",
                            width: 3,
                            dash: [8,6],
                            alpha: 0.9,
                        },

                        // Tracer ghost (minimal) — neo draws a softer version
                        tracer: {
                            enabled: (tmpObj, player) => !tmpObj.isTeam?.(player),
                            alpha: 0.45,
                            minDist: 60,
                            maxClamp: 220,
                            factor: 0.5, // dist * factor
                        },

                        // Ping circle (super light; optional)
                        pingCircle: {
                            enabled: () => configs?.autoOneFrame || window.autoOneFrameToggled,
                            stroke: "#000",
                            alpha: 0.08,
                            lineWidth: 2,
                            radius: (ping) => (ping > 140) ? 230 : (ping > 110) ? 210 : (ping > 85) ? 190 : 170,
                        },
                        tracker: {
                            // lil neon vibes
                            draw1: { enabled: true,  fill: "#6BE8FF", alpha: 0.95, radius: 6, glow: 10 },
                            draw2: { enabled: true,  stroke: "#F8F05C", alpha: 0.9,  width: 2, dash: [6,4], glow: 8 },
                            draw3: { enabled: true,  fill: "#FF5A7D",  alpha: 0.28, glow: 12 },
                            draw4: { enabled: true,  stroke: "#6BE8FF", alpha: 1,    width: 2, glow: 12 },
                        },
                    };
                }
                // ======================== NEON STYLE ========================
                function NEON_STYLE() {
                    return {
                        id: "neon",
                        // bg is a vertical neon gradient; also supports night overlay
                        background: {
                            type: "gradient",
                            gradient: {
                                stops: [
                                    { offset: 0.00, color: "#0b0033" },
                                    { offset: 0.50, color: "#220055" },
                                    { offset: 1.00, color: "#000012" }
                                ]
                            },
                            nightOverlay: "rgba(0, 0, 70, 0.35)"
                        },

                        // water (slightly more saturated than neo)
                        water: {
                            enabled: true,
                            base: { fill: "#d9c374", alpha: 0.95 },
                            wave: { fill: "#57c8ff", alpha: 0.9 },
                            waveMaxRadius: 280,
                            padding: (cfg) => cfg.riverPadding,
                            composite: "lighter",
                        },

                        // grid
                        grid: {
                            enabled: (visualType) => visualType === "neon",
                            lineWidth: 2.5,
                            color: "#7affff",
                            alpha: 0.08,
                            dash: [10, 6],
                            stepDefault: 120,
                            stepWasd: 60,
                            snapPositiveOnly: true,
                        },

                        // nameplates
                        name: {
                            show: (o, player) => o.skinIndex != 10 || o === player || (o.team && o.team === player.team),
                            fontFamily: "Hammersmith One",
                            size: (o) => o.nameScale || 28,
                            textColor: "#E7FBFF",
                            strokeColor: () => "rgba(0,0,0,0.85)",
                            strokeWidth: (o) => (o.nameScale ? 10 : 7),
                            yPad: (cfg) => cfg.nameY,
                            crown: { sprite: "crown", size: (cfg) => cfg.crownIconScale, pad: (cfg) => cfg.crownPad },
                            skull:  { sprite: "skull",  size: (cfg) => cfg.crownIconScale, pad: (cfg) => cfg.crownPad },
                            crosshair: {
                                enabled: (o, player, enemy, useWasd) => o.isPlayer && instaC.wait && near === o && enemy.length && !useWasd,
                                sprites: () => crossHairSprites,
                                scale: (o) => o.scale * 2.1,
                            },
                        },

                        // health
                        health: {
                            holderFill: () => "rgba(0,0,0,0.85)",
                            barGood: "#14D86B",
                            barBad:  "#FF5A7D",
                            width: (cfg) => cfg.healthBarWidth,
                            pad:   (cfg) => cfg.healthBarPad,
                            height: 16,
                            corner: 7,
                        },

                        // reload arcs (neon glow)
                        arcs: {
                            enabled: true,
                            baseR: (o) => o.scale + 14,
                            railAlpha: 0.24,
                            primary:  { sweep: Math.PI * 0.8,  lo: "#7BFFC6", hi: "#14D86B", width: 6, glow: 12 },
                            secondary:{ sweep: Math.PI * 0.8,  lo: "#B3CCFF", hi: "#3E8BFF", width: 6, glow: 12 },
                            turret:   { sweep: Math.PI * 0.55, lo: "#FF9AA3", hi: "#FF5A7D", width: 6, glow: 12, radiusOffset: 8 },
                        },

                        // aim dot
                        aim: { glowColor: "rgba(120,220,255,0.8)", glowBlur: 14, radius: 4 },

                        // chips
                        chips: {
                            enabled: true,
                            font: "600 14px Inter, system-ui, sans-serif",
                            colorText: "#E6F7FF",
                            fill: "rgba(10,14,18,0.92)",
                            stroke: "rgba(120,220,255,0.25)",
                            strokeWidth: 1,
                            r: 7, padX: 8, padY: 4,
                            yOffset: (o, cfg) => o.scale + 28 + cfg.nameY,
                            playerText: (pl) => `[${pl.oldSkinIndex},${pl.skinIndex}]`,
                            enemyText:  (o) => `[${o.primaryIndex ?? "?"},${o.secondaryIndex ?? 0},${(typeof o.damageThreat==="number"?o.damageThreat.toFixed(2):"?")}]`,
                        },

                        shame: {
                            enabled: () => configs.names,
                            fill: "rgba(255,238,0,0.92)",
                            text: "#111",
                            font: "700 16px Inter, system-ui, sans-serif",
                            r: 7, wPad: 12, h: 20,
                            yAboveHead: (o, cfg) => o.scale + cfg.nameY + 26,
                        },

                        // prediction
                        predict: { enabled: true, stroke: "#FF5A7D", width: 3, dash: [8,6], alpha: 0.9 },

                        // tracer (re-uses the fancy neo beam if you wired neoTracerDraw)
                        tracer: {
                            enabled: (o, player) => !o.isTeam?.(player),
                            draw: neoTracerDraw,    // if available; else your fallback renderer will ignore
                            alpha: 0.9,
                            minDist: (d) => 60,
                            maxClamp: 240,
                            factor: 0.55,
                            beamWidth: 3,
                            beamLo: "rgba(120,220,255,0.65)",
                            beamHi: "#14D86B",
                            glow: 12,
                            shadowColor: "rgba(20,216,107,0.9)",
                            arrowSize: 11,
                            tipColor: "#14D86B",
                            pulse: { r0: 5, r1: 4, alpha: 0.35, color: "rgba(20,216,107,0.8)" },
                            ghost: { alpha: 0.28 },
                        },

                        // ping circle
                        pingCircle: {
                            enabled: () => configs?.autoOneFrame || window.autoOneFrameToggled,
                            stroke: "#000",
                            alpha: 0.08,
                            lineWidth: 2,
                            radius: (ping) => (ping > 140) ? 230 : (ping > 110) ? 210 : (ping > 85) ? 190 : 170,
                        },

                        // trackers
                        tracker: {
                            draw1: { enabled: true,  fill: "#6BE8FF", alpha: 0.95, radius: 6, glow: 10 },
                            draw2: { enabled: true,  stroke: "#F8F05C", alpha: 0.9, width: 2, dash: [6,4], glow: 8 },
                            draw3: { enabled: true,  fill: "#FF5A7D", alpha: 0.28, glow: 12 },
                            draw4: { enabled: true,  stroke: "#6BE8FF", alpha: 1, width: 2, glow: 12 },
                        },
                    };
                }

                // ======================== DARK STYLE ========================
                function DARK_STYLE() {
                    return {
                        id: "dark",
                        background: {
                            type: "gradient",
                            gradient: {
                                stops: [
                                    { offset: 0.00, color: "#0A0A0A" },
                                    { offset: 0.60, color: "#0F1115" },
                                    { offset: 1.00, color: "#141821" }
                                ]
                            },
                            nightOverlay: "rgba(0,0,0,0.2)",
                        },
                        biomeOutlines: {
                            enabled: true,
                            width: 2,
                            color: "#FFFFFF",         // fallback stroke
                            alpha: 0.15,              // subtle by default
                            dash: [8, 6],             // dashed line helps legibility
                            shadowBlur: 6,
                            shadowColor: "rgba(0,0,0,0.7)",
                            // optional per-biome colors to increase contrast:
                            colors: {
                                snowGrass: "#B3E5FF",   // boundary between snow & grass
                                grassDesert: "#FFD27F"  // boundary between grass & desert
                            }
                        },
                        water: {
                            outline: {
                                enabled: true,
                                width: 2,
                                color: "#FFFFFF",
                                alpha: 0.35,
                                dash: [6, 4],
                                shadowBlur: 8,
                                shadowColor: "rgba(0,0,0,0.9)"
                            },
                            enabled: true,
                            base: { fill: "#20252E", alpha: 0.9 },
                            wave: { fill: "#2F3B54", alpha: 0.85 },
                            waveMaxRadius: 230,
                            padding: (cfg) => cfg.riverPadding,
                            composite: null,
                        },

                        grid: {
                            enabled: (visualType) => visualType === "dark",
                            lineWidth: 1.5,
                            color: "#FFFFFF",
                            alpha: 0.06,
                            dash: [4, 10],
                            stepDefault: 140,
                            stepWasd: 70,
                            snapPositiveOnly: true,
                        },

                        name: {
                            show: (o, player) => o.skinIndex != 10 || o === player || (o.team && o.team === player.team),
                            fontFamily: "Hammersmith One",
                            size: (o) => o.nameScale || 28,
                            textColor: "#EAEAEA",
                            strokeColor: () => "rgba(0,0,0,0.9)",
                            strokeWidth: (o) => (o.nameScale ? 10 : 7),
                            yPad: (cfg) => cfg.nameY,
                            crown: { sprite: "crown", size: (cfg) => cfg.crownIconScale, pad: (cfg) => cfg.crownPad },
                            skull:  { sprite: "skull",  size: (cfg) => cfg.crownIconScale, pad: (cfg) => cfg.crownPad },
                            crosshair: {
                                enabled: (o, player, enemy, useWasd) => o.isPlayer && instaC.wait && near === o && enemy.length && !useWasd,
                                sprites: () => crossHairSprites,
                                scale: (o) => o.scale * 2.0,
                            },
                        },

                        health: {
                            holderFill: () => "rgba(255,255,255,0.08)",
                            barGood: "#79D07E",
                            barBad:  "#E86A6A",
                            width: (cfg) => cfg.healthBarWidth,
                            pad:   (cfg) => cfg.healthBarPad,
                            height: 16,
                            corner: 6,
                        },

                        // prefer rectangles over arcs for the dark theme (minimal)
                        reloads: {
                            color: "#B2E3B7",
                            height: 15,
                            pad: (cfg) => cfg.healthBarPad,
                            corner: 6,
                            turretHolder: () => "rgba(255,255,255,0.08)",
                            turretColor:  "#E86A6A",
                        },

                        aim: { showDot: true, dotColor: "#FFF", dotAlpha: 0.65, dotRadius: 4 },

                        chips: {
                            enabled: true,
                            font: "600 13px Inter, system-ui, sans-serif",
                            colorText: "#EAEFF7",
                            fill: "rgba(20,22,28,0.85)",
                            stroke: "rgba(255,255,255,0.06)",
                            strokeWidth: 1,
                            r: 6, padX: 7, padY: 3,
                            yOffset: (o, cfg) => o.scale + 26 + cfg.nameY,
                            playerText: (pl) => `[${pl.oldSkinIndex},${pl.skinIndex}]`,
                            enemyText:  (o) => `[${o.primaryIndex ?? "?"},${o.secondaryIndex ?? 0},${(typeof o.damageThreat==="number"?o.damageThreat.toFixed(2):"?")}]`,
                        },

                        shame: {
                            enabled: () => configs.names,
                            fill: "rgba(250, 220, 110, 0.9)",
                            text: "#111",
                            font: "700 15px Inter, system-ui, sans-serif",
                            r: 6, wPad: 12, h: 19,
                            yAboveHead: (o, cfg) => o.scale + cfg.nameY + 24,
                        },

                        predict: { enabled: true, stroke: "#E86A6A", width: 2.5, dash: [6,6], alpha: 0.85 },

                        tracer: {
                            enabled: (o, player) => !o.isTeam?.(player),
                            alpha: 0.4,
                            minDist: (d) => 55,
                            maxClamp: 210,
                            factor: 0.5,
                        },

                        pingCircle: {
                            enabled: () => configs?.autoOneFrame || window.autoOneFrameToggled,
                            stroke: "#FFF",
                            alpha: 0.06,
                            lineWidth: 2,
                            radius: (ping) => (ping > 140) ? 230 : (ping > 110) ? 210 : (ping > 85) ? 190 : 170,
                        },

                        tracker: {
                            draw1: { enabled: true,  fill: "#8BE0FF", alpha: 0.9, radius: 5 },
                            draw2: { enabled: true,  stroke: "#E6D05B", alpha: 0.85, width: 2 },
                            draw3: { enabled: true,  fill: "#E86A6A", alpha: 0.25 },
                            draw4: { enabled: true,  stroke: "#8BE0FF", alpha: 1, width: 2 },
                        },
                    };
                }

                // ======================== VAPOR (Freestyle) ========================
                function VAPOR_STYLE() {
                    return {
                        id: "vapor",
                        background: {
                            type: "gradient",
                            gradient: {
                                stops: [
                                    { offset: 0.00, color: "#ff7bc8" },
                                    { offset: 0.45, color: "#7a7bff" },
                                    { offset: 1.00, color: "#1b1b2c" }
                                ]
                            },
                            nightOverlay: "rgba(20,0,50,0.25)"
                        },

                        water: {
                            enabled: true,
                            base: { fill: "#f2c2ff", alpha: 0.85 },
                            wave: { fill: "#7bd0ff", alpha: 0.9 },
                            waveMaxRadius: 300,
                            padding: (cfg) => cfg.riverPadding,
                            composite: "lighter",
                        },

                        grid: {
                            enabled: (visualType) => visualType === "vapor",
                            lineWidth: 2,
                            color: "#ffffff",
                            alpha: 0.12,
                            dash: [14, 10],
                            stepDefault: 110,
                            stepWasd: 55,
                            snapPositiveOnly: true,
                        },

                        name: {
                            show: (o, player) => o.skinIndex != 10 || o === player || (o.team && o.team === player.team),
                            fontFamily: "Hammersmith One",
                            size: (o) => o.nameScale || 30,
                            textColor: "#fff",
                            strokeColor: () => "rgba(0,0,0,0.85)",
                            strokeWidth: (o) => (o.nameScale ? 11 : 8),
                            yPad: (cfg) => cfg.nameY,
                            crown: { sprite: "crown", size: (cfg) => cfg.crownIconScale, pad: (cfg) => cfg.crownPad },
                            skull:  { sprite: "skull",  size: (cfg) => cfg.crownIconScale, pad: (cfg) => cfg.crownPad },
                            crosshair: {
                                enabled: (o, player, enemy, useWasd) => o.isPlayer && instaC.wait && near === o && enemy.length && !useWasd,
                                sprites: () => crossHairSprites,
                                scale: (o) => o.scale * 2.25,
                            },
                        },

                        health: {
                            holderFill: () => "rgba(255,255,255,0.2)",
                            barGood: "#6cffc4",
                            barBad:  "#ff8ab3",
                            width: (cfg) => cfg.healthBarWidth,
                            pad:   (cfg) => cfg.healthBarPad,
                            height: 17,
                            corner: 9,
                        },

                        arcs: {
                            enabled: true,
                            baseR: (o) => o.scale + 16,
                            railAlpha: 0.25,
                            primary:  { sweep: Math.PI * 0.9,  lo: "#ffbdf0", hi: "#ff7bc8", width: 6, glow: 12 },
                            secondary:{ sweep: Math.PI * 0.9,  lo: "#a8caff", hi: "#7a7bff", width: 6, glow: 12 },
                            turret:   { sweep: Math.PI * 0.5,  lo: "#ffd199", hi: "#ff9e57", width: 6, glow: 12, radiusOffset: 10 },
                        },

                        aim: { glowColor: "rgba(255,180,240,0.85)", glowBlur: 14, radius: 4 },

                        chips: {
                            enabled: true,
                            font: "700 13px Inter, system-ui, sans-serif",
                            colorText: "#fff",
                            fill: "rgba(35,18,48,0.85)",
                            stroke: "rgba(255,255,255,0.12)",
                            strokeWidth: 1,
                            r: 7, padX: 8, padY: 4,
                            yOffset: (o, cfg) => o.scale + 30 + cfg.nameY,
                            playerText: (pl) => `[${pl.oldSkinIndex},${pl.skinIndex}]`,
                            enemyText:  (o) => `[${o.primaryIndex ?? "?"},${o.secondaryIndex ?? 0},${(typeof o.damageThreat==="number"?o.damageThreat.toFixed(2):"?")}]`,
                        },

                        shame: {
                            enabled: () => configs.names,
                            fill: "rgba(255, 230, 0, 0.95)",
                            text: "#1A1A1A",
                            font: "700 16px Inter, system-ui, sans-serif",
                            r: 7, wPad: 12, h: 20,
                            yAboveHead: (o, cfg) => o.scale + cfg.nameY + 28,
                        },

                        predict: { enabled: true, stroke: "#ff7bc8", width: 3, dash: [10,7], alpha: 0.95 },

                        tracer: {
                            enabled: (o, player) => !o.isTeam?.(player),
                            draw: neoTracerDraw,
                            alpha: 0.95,
                            minDist: (d) => 60,
                            maxClamp: 240,
                            factor: 0.55,
                            beamWidth: 3,
                            beamLo: "#ff7bc8",
                            beamHi: "#7a7bff",
                            glow: 12,
                            shadowColor: "rgba(255,122,200,0.9)",
                            arrowSize: 11,
                            tipColor: "#ff9ae2",
                            pulse: { r0: 5, r1: 4, alpha: 0.35, color: "rgba(255,122,200,0.8)" },
                            ghost: { alpha: 0.30 },
                        },

                        pingCircle: {
                            enabled: () => configs?.autoOneFrame || window.autoOneFrameToggled,
                            stroke: "#000",
                            alpha: 0.06,
                            lineWidth: 2,
                            radius: (ping) => (ping > 140) ? 230 : (ping > 110) ? 210 : (ping > 85) ? 190 : 170,
                        },

                        tracker: {
                            draw1: { enabled: true,  fill: "#ff9ae2", alpha: 0.95, radius: 6, glow: 12 },
                            draw2: { enabled: true,  stroke: "#ffd199", alpha: 0.9,  width: 2, dash: [6,4], glow: 10 },
                            draw3: { enabled: true,  fill: "#7a7bff",  alpha: 0.28, glow: 12 },
                            draw4: { enabled: true,  stroke: "#7bd0ff", alpha: 1,    width: 2, glow: 12 },
                        },
                    };
                }

                // ======================== registry ========================
                const STYLE_REGISTRY = {
                    ueh2: UEH2_STYLE(),
                    neo:  NEO_STYLE(),
                    neon: NEON_STYLE(),   // NEW
                    dark: DARK_STYLE(),   // NEW
                    vapor: VAPOR_STYLE(), // NEW (freestyle)
                    default: UEH2_STYLE(),
                };

/**
 * Draw a smoothed semicircle showing weapon reach.
 *
 * @param {CanvasRenderingContext2D} ctx  – your 2-D context
 * @param {Object} player                 – player object with x2, y2, dir, weapons
 * @param {Number} xo, yo                 – world→screen scroll offsets
 * @param {Number} delta                  – 0 – 1; how fast to catch up (0.15 = smooth)
 */
                function drawHitRangeSmooth(ctx, player, xo = 0, yo = 0, delta = 0.15) {
                    /* 1️⃣ pick current weapon & radius */
                    const wid   = player.weaponIndex
                    const winfo = _things.items.weapons.find(e => e.id === wid);
                    if (!winfo) return;

                    const R_now   = winfo.range;
                    const ang_now = player.dir;

                    /* 2️⃣ ease old → new */
                    hitVis.r   += (R_now   - hitVis.r)   * delta;
                    hitVis.ang += (ang_now - hitVis.ang) * delta;

                    /* 3️⃣ draw */
                    const colour = wid === 8 ? "rgba(0,255,0,.35)" : "rgba(255,0,0,.35)";
                    ctx.save();
                    ctx.translate(player.x - xo, player.y - yo);
                    ctx.rotate(hitVis.ang);
                    ctx.beginPath();
                    ctx.arc(0, 0, hitVis.r, -Math.PI / 2, Math.PI / 2);   // semi
                    ctx.lineWidth   = 3;
                    ctx.strokeStyle = colour;
                    ctx.stroke();
                    ctx.restore();
                }
                function drawPathVis(ctx, _things, xOffset = 0, yOffset = 0) {
                    if (!(_things?.pathVis?.grid && _things?.pathVis?.plan)) return;

                    const { grid, plan, portals, start, end } = _things.pathVis;
                    const H = grid.length, W = grid[0].length;
                    const cell = plan.cell;
                    const ox = plan.x1 - xOffset;
                    const oy = plan.y1 - yOffset;

                    // -------- theme (tweak freely) --------
                    const THEME = {
                        aabbStroke: "rgba(255,255,255,0.7)",
                        aabbShadow: "rgba(0,0,0,0.35)",
                        gridLine: "rgba(255,255,255,0.06)",
                        walkable: "rgba(0, 200, 120, 0.08)",
                        blockedBase: "rgba(255, 80, 80, 0.28)",
                        blockedEdge: "rgba(255, 140, 140, 0.35)",
                        startCore: "#00e5ff",
                        endCore: "#ffea00",
                        portalStrokeFrom: "rgba(0,180,255,0.95)",
                        portalStrokeTo:   "rgba(0,255,180,0.95)"
                    };

                    // tiny helpers
                    const snap = v => Math.round(v) + 0.5; // crisp 1px lines
                    function roundRectPath(x, y, w, h, r = 10) {
                        const p = new Path2D();
                        const rr = Math.min(r, w * 0.5, h * 0.5);
                        p.moveTo(x + rr, y);
                        p.arcTo(x + w, y, x + w, y + h, rr);
                        p.arcTo(x + w, y + h, x, y + h, rr);
                        p.arcTo(x, y + h, x, y, rr);
                        p.arcTo(x, y, x + w, y, rr);
                        p.closePath();
                        return p;
                    }
                    function radialGlow(x, y, innerColor, outerAlpha = 0.06, r = 18) {
                        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
                        g.addColorStop(0, innerColor);
                        g.addColorStop(1, `rgba(255,255,255,${outerAlpha})`);
                        return g;
                    }
                    function lerpColor(a, b, t) {
                        // a,b are rgba strings like "rgba(r,g,b,a)"; quick parse for gradients
                        const pa = a.match(/[\d.]+/g).map(Number);
                        const pb = b.match(/[\d.]+/g).map(Number);
                        const pc = pa.map((v,i)=> v + (pb[i]-v)*t);
                        return `rgba(${pc[0]|0},${pc[1]|0},${pc[2]|0},${pc[3]})`;
                    }
                    function arrowhead(x2, y2, x1, y1, size = 8) {
                        const ang = Math.atan2(y2 - y1, x2 - x1);
                        const hx = x2 - Math.cos(ang) * size;
                        const hy = y2 - Math.sin(ang) * size;
                        ctx.beginPath();
                        ctx.moveTo(x2, y2);
                        ctx.lineTo(hx + 4 * Math.cos(ang + Math.PI / 2), hy + 4 * Math.sin(ang + Math.PI / 2));
                        ctx.moveTo(x2, y2);
                        ctx.lineTo(hx - 4 * Math.cos(ang + Math.PI / 2), hy - 4 * Math.sin(ang + Math.PI / 2));
                        ctx.stroke();
                    }

                    ctx.save();

                    // -------- AABB (rounded + dashed + soft shadow) --------
                    const aabb = roundRectPath(ox, oy, plan.scale, plan.scale, 12);
                    ctx.setLineDash([8, 5]);
                    ctx.lineDashOffset = 0;
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = THEME.aabbStroke;
                    ctx.shadowColor = THEME.aabbShadow;
                    ctx.shadowBlur = 8;
                    ctx.stroke(aabb);
                    ctx.setLineDash([]);
                    ctx.shadowBlur = 0;

                    // -------- cells (walkable/blocked with subtle depth) --------
                    // Note: keep fill operations light; avoid per-cell gradients for perf.
                    if(_things.Rall){
                        for (let cy = 0; cy < H; cy++) {
                            for (let cx = 0; cx < W; cx++) {
                                const wx = ox + cx * cell;
                                const wy = oy + cy * cell;
                                const v = grid[cy][cx];

                                if (v === 0) {
                                    ctx.fillStyle = THEME.walkable;
                                } else {
                                    // faux depth: a slightly darker edge toward bottom-right
                                    ctx.fillStyle = THEME.blockedBase;
                                    ctx.fillRect(wx, wy, cell, cell);
                                    ctx.fillStyle = THEME.blockedEdge;
                                    ctx.fillRect(wx + cell * 0.6, wy + cell * 0.6, cell * 0.4, cell * 0.4);
                                    continue;
                                }
                                ctx.fillRect(wx, wy, cell, cell);
                            }
                        }

                        // -------- subtle grid lines (optional but pretty) --------
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = THEME.gridLine;
                        ctx.beginPath();
                        for (let x = 0; x <= W; x++) {
                            const sx = snap(ox + x * cell);
                            ctx.moveTo(sx, oy);
                            ctx.lineTo(sx, oy + H * cell);
                        }
                        for (let y = 0; y <= H; y++) {
                            const sy = snap(oy + y * cell);
                            ctx.moveTo(ox, sy);
                            ctx.lineTo(ox + W * cell, sy);
                        }
                        ctx.stroke();
                    }

                    // -------- start / end glows + cores --------
                    if (start) {
                        const sx = plan.x1 + (start.sx + 0.5) * cell - xOffset;
                        const sy = plan.y1 + (start.sy + 0.5) * cell - yOffset;
                        ctx.fillStyle = radialGlow(sx, sy, THEME.startCore, 0.12, 22);
                        ctx.beginPath(); ctx.arc(sx, sy, 22, 0, Math.PI * 2); ctx.fill();
                        ctx.fillStyle = THEME.startCore;
                        ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2); ctx.fill();
                    }
                    if (end) {
                        const ex = plan.x1 + (end.ex + 0.5) * cell - xOffset;
                        const ey = plan.y1 + (end.ey + 0.5) * cell - yOffset;
                        ctx.fillStyle = radialGlow(ex, ey, THEME.endCore, 0.12, 22);
                        ctx.beginPath(); ctx.arc(ex, ey, 22, 0, Math.PI * 2); ctx.fill();
                        ctx.fillStyle = THEME.endCore;
                        ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fill();
                    }

                    // -------- portals (gradient strokes + arrowheads) --------
                    if (portals?.length) {
                        ctx.lineWidth = 2;
                        portals.forEach(p => {
                            const fx = plan.x1 + (p.from.x + 0.5) * cell - xOffset;
                            const fy = plan.y1 + (p.from.y + 0.5) * cell - yOffset;
                            const tx = plan.x1 + (p.to.x   + 0.5) * cell - xOffset;
                            const ty = plan.y1 + (p.to.y   + 0.5) * cell - yOffset;

                            const grad = ctx.createLinearGradient(fx, fy, tx, ty);
                            grad.addColorStop(0, THEME.portalStrokeFrom);
                            grad.addColorStop(1, THEME.portalStrokeTo);

                            ctx.strokeStyle = grad;
                            ctx.beginPath();
                            ctx.moveTo(fx, fy);
                            ctx.lineTo(tx, ty);
                            ctx.stroke();

                            // entry/exit dots
                            ctx.fillStyle = THEME.portalStrokeFrom;
                            ctx.beginPath(); ctx.arc(fx, fy, 3, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = THEME.portalStrokeTo;
                            ctx.beginPath(); ctx.arc(tx, ty, 3, 0, Math.PI * 2); ctx.fill();

                            // arrowhead at destination
                            ctx.strokeStyle = grad;
                            arrowhead(tx, ty, fx, fy, 9);
                        });
                    }

                    ctx.restore();
                }
                // -------------------- NEO STYLE HELPERS --------------------
                const NeoStyle = {
                    colors: {
                        bg:        "rgba(10,12,16,0.8)",
                        chip:      "rgba(18,22,28,0.9)",
                        stroke:    "rgba(255,255,255,0.10)",
                        text:      "#E6F1FF",
                        glow:      "rgba(120,220,255,0.75)",
                        primaryLo: "#63FFA7",
                        primaryHi: "#14D86B",
                        secondLo:  "#95C0FF",
                        secondHi:  "#3E8BFF",
                        turretLo:  "#FF8A8A",
                        turretHi:  "#FF5252",
                        predict:   "#FF5A7D",
                        shameBG:   "rgba(255, 230, 0, 0.9)",
                        shameTxt:  "#1A1A1A",
                    },
                    radius: 7,
                };

                function neoRoundRectPath(ctx, x, y, w, h, r) {
                    r = Math.min(r, w * 0.5, h * 0.5);
                    ctx.beginPath();
                    ctx.moveTo(x + r, y);
                    ctx.arcTo(x + w, y,     x + w, y + h, r);
                    ctx.arcTo(x + w, y + h, x,     y + h, r);
                    ctx.arcTo(x,     y + h, x,     y,     r);
                    ctx.arcTo(x,     y,     x + w, y,     r);
                    ctx.closePath();
                }

                function neoChip(ctx, x, y, text, padX = 8, padY = 4) {
                    ctx.save();
                    ctx.font = "600 14px Inter, system-ui, sans-serif";
                    const w = ctx.measureText(text).width + padX * 2;
                    const h = 20 + (padY - 4) * 2;
                    neoRoundRectPath(ctx, x - w/2, y - h/2, w, h, NeoStyle.radius);
                    ctx.fillStyle = NeoStyle.colors.chip;
                    ctx.strokeStyle = NeoStyle.colors.stroke;
                    ctx.lineWidth = 1;
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = NeoStyle.colors.text;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(text, x, y);
                    ctx.restore();
                }

                function neoGlowDot(ctx, x, y, r = 5) {
                    ctx.save();
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = NeoStyle.colors.glow;
                    ctx.fillStyle = NeoStyle.colors.glow;
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }

                function neoArcReload(ctx, cx, cy, baseR, frac, sweep, gradientLo, gradientHi) {
                    // frac in [0,1], sweep in radians; draws an arc with gradient + glow
                    if (!Number.isFinite(frac)) frac = 0;
                    frac = Math.max(0, Math.min(1, frac));

                    const start = -Math.PI / 2 - sweep/2;
                    const end   = start + sweep * frac;

                    ctx.save();
                    // track stroke
                    ctx.lineWidth = 6;
                    const grad = ctx.createLinearGradient(cx - baseR, cy, cx + baseR, cy);
                    grad.addColorStop(0, gradientLo);
                    grad.addColorStop(1, gradientHi);
                    ctx.strokeStyle = grad;

                    // soft glow
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = gradientHi;

                    ctx.beginPath();
                    ctx.arc(cx, cy, baseR, start, end, false);
                    ctx.stroke();

                    // faint rail
                    ctx.shadowBlur = 0;
                    ctx.globalAlpha = 0.2;
                    ctx.strokeStyle = "rgba(255,255,255,0.3)";
                    ctx.beginPath();
                    ctx.arc(cx, cy, baseR, start, start + sweep, false);
                    ctx.stroke();
                    ctx.restore();
                }

                function neoDashedPredict(ctx, x1, y1, x2, y2, color = NeoStyle.colors.predict) {
                    ctx.save();
                    ctx.globalAlpha = 0.9;
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 3;
                    ctx.setLineDash([8, 6]);
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                    ctx.restore();
                }
                function renderBackgroundStyled(ctx, style, opts) {
                    const {
                        config,
                        xOffset = 0,
                        yOffset = 0,
                        maxScreenWidth: W,
                        maxScreenHeight: H,
                        player,
                        lastDeath,
                    } = opts;

                    // If no style (ueh1), keep legacy colors
                    const BG = style?.background ?? {
                        // defaults (legacy-ish)
                        snow:   { fill: "#fff" },
                        grass:  { fill: "#b6db66" },
                        desert: { fill: "#dbc666" }, // only shows when view past bottom
                        vignette: { enabled: false },
                        death: {
                            enabled: true,
                            glyph: "x",
                            font: "100px Hammersmith One",
                            color: "#fc5553",
                            alpha: 1,
                        },
                    };

                    // ---- figure which biome pieces are on screen (same logic you had) ----
                    const snowTopScreenY = config.snowBiomeTop - yOffset;                // snow ⇧
                    const grassBottomScreenY = (config.mapScale - yOffset);              // bottom edge of map

                    // helpers
                    const fillRect = (styleFill, x, y, w, h) => {
                        if (!styleFill) return;
                        if (typeof styleFill === "string") {
                            ctx.fillStyle = styleFill;
                        } else if (styleFill?.type === "linear") {
                            const g = ctx.createLinearGradient(styleFill.x0 ?? 0, styleFill.y0 ?? 0, styleFill.x1 ?? 0, styleFill.y1 ?? H);
                            (styleFill.stops || [[0, "#000"], [1, "#fff"]]).forEach(([t, c]) => g.addColorStop(t, c));
                            ctx.fillStyle = g;
                        } else if (styleFill?.type === "radial") {
                            const g = ctx.createRadialGradient(styleFill.cx ?? W/2, styleFill.cy ?? H/2, styleFill.r0 ?? 0, styleFill.cx ?? W/2, styleFill.cy ?? H/2, styleFill.r1 ?? Math.max(W,H));
                            (styleFill.stops || [[0, "#000"], [1, "#fff"]]).forEach(([t, c]) => g.addColorStop(t, c));
                            ctx.fillStyle = g;
                        } else {
                            ctx.fillStyle = "#000";
                        }
                        ctx.fillRect(x, y, w, h);
                    };

                    // ---- 4 cases (mirroring your original) ----
                    if (snowTopScreenY <= 0 && (config.mapScale - config.snowBiomeTop - yOffset) >= H) {
                        // entirely grass
                        fillRect(BG.grass?.fill, 0, 0, W, H);
                    } else if ((config.mapScale - config.snowBiomeTop - yOffset) <= 0) {
                        // entirely desert (past bottom edge)
                        fillRect(BG.desert?.fill, 0, 0, W, H);
                    } else if (snowTopScreenY >= H) {
                        // entirely snow
                        fillRect(BG.snow?.fill, 0, 0, W, H);
                    } else if (snowTopScreenY >= 0) {
                        // split snow (top segment) + grass (bottom segment)
                        fillRect(BG.snow?.fill, 0, 0, W, snowTopScreenY);
                        fillRect(BG.grass?.fill, 0, snowTopScreenY, W, H - snowTopScreenY);
                    } else {
                        // split grass (up to map bottom) + desert below
                        const grassHeight = Math.max(0, Math.min(H, grassBottomScreenY));
                        fillRect(BG.grass?.fill, 0, 0, W, grassHeight);
                        if (grassBottomScreenY < H) {
                            fillRect(BG.desert?.fill, 0, grassHeight, W, H - grassHeight);
                        }
                    }

                    // ---- optional vignette/overlay ----
                    if (BG.vignette?.enabled) {
                        ctx.save();
                        ctx.globalAlpha = BG.vignette.alpha ?? 0.18;
                        fillRect(
                            BG.vignette.fill || { type: "radial", cx: W/2, cy: H/2, r0: Math.max(W,H) * 0.25, r1: Math.max(W,H), stops: [[0, "rgba(0,0,0,0)"], [1, "rgba(0,0,0,1)"]] },
                            0, 0, W, H
                        );
                        ctx.restore();
                    }

                    // ---- death marker (styled) ----
                    if (player && lastDeath && BG.death?.enabled) {
                        ctx.save();
                        ctx.globalAlpha = BG.death.alpha ?? 1;
                        ctx.fillStyle = BG.death.color ?? "#fc5553";
                        ctx.font = BG.death.font ?? "100px Hammersmith One";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        const glyph = BG.death.glyph ?? "x";
                        ctx.fillText(glyph, lastDeath.x - (xOffset || 0), lastDeath.y - (yOffset || 0));
                        ctx.restore();
                    }
                }

                // -------------------- NEO STYLE RENDERER --------------------
                function renderPlayerStyled(tmpObj, ctx, style, opts = {}) {
                    if (!style) return; // ueh1 legacy path handles itself elsewhere

                    const {
                        xOffset = 0, yOffset = 0, config, items, player,
                        screenHeight, predictType = "pre0", enemyCount = 0, useWasd = false
                    } = opts;

                    const cx = tmpObj.x - xOffset;
                    const cy = tmpObj.y - yOffset;

                    // ---------- helpers driven by style ----------
                    const clamp01 = (v)=> Math.max(0, Math.min(1, v ?? 0));
                    const getVal = (v, ...args) => (typeof v === "function" ? v(...args) : v);

                    const drawGlowDot = (x, y, st=style.aim) => {
                        if (!st) return;
                        ctx.save();
                        if (st.glowBlur) { ctx.shadowBlur = st.glowBlur; ctx.shadowColor = st.glowColor || "#fff"; }
                        ctx.fillStyle = st.glowColor || "#fff";
                        ctx.beginPath(); ctx.arc(x, y, st.radius ?? 4, 0, Math.PI*2); ctx.fill();
                        ctx.restore();
                    };

                    const drawChip = (x, y, text, st=style.chips) => {
                        if (!st?.enabled) return;
                        ctx.save();
                        ctx.font = st.font || "600 14px Inter, system-ui, sans-serif";
                        const padX = st.padX ?? 8, padY = st.padY ?? 4, r = st.r ?? 7;
                        const w = ctx.measureText(text).width + padX * 2;
                        const h = 20 + (padY - 4) * 2;
                        roundRectPath(ctx, x - w/2, y - h/2, w, h, r);
                        ctx.fillStyle = st.fill || "rgba(18,22,28,0.9)";
                        ctx.strokeStyle = st.stroke || "rgba(255,255,255,0.10)";
                        ctx.lineWidth = st.strokeWidth ?? 1;
                        ctx.fill(); ctx.stroke();
                        ctx.fillStyle = st.colorText || "#E6F1FF";
                        ctx.textAlign = "center"; ctx.textBaseline = "middle";
                        ctx.fillText(text, x, y);
                        ctx.restore();
                    };

                    const drawArcReload = (frac, radius, sweep, stColors, width=6, glow=8) => {
                        const f = clamp01(frac);
                        const start = -Math.PI/2 - sweep/2;
                        const end   = start + sweep * f;

                        ctx.save();
                        ctx.lineWidth = width;
                        const grad = ctx.createLinearGradient(cx-radius, cy, cx+radius, cy);
                        grad.addColorStop(0, stColors.lo); grad.addColorStop(1, stColors.hi);
                        ctx.strokeStyle = grad;
                        if (glow) { ctx.shadowBlur = glow; ctx.shadowColor = stColors.hi; }
                        ctx.beginPath(); ctx.arc(cx, cy, radius, start, end, false); ctx.stroke();

                        // faint rail
                        ctx.shadowBlur = 0; ctx.globalAlpha = style.arcs?.railAlpha ?? 0.2;
                        ctx.strokeStyle = "rgba(255,255,255,0.3)";
                        ctx.beginPath(); ctx.arc(cx, cy, radius, start, start + sweep, false); ctx.stroke();
                        ctx.restore();
                    };

                    const drawDashedPredict = (x2, y2, st=style.predict) => {
                        if (!st?.enabled) return;
                        ctx.save();
                        ctx.globalAlpha = st.alpha ?? 1;
                        ctx.strokeStyle = st.stroke || "#cc5151";
                        ctx.lineWidth = st.width ?? 3;
                        if (st.dash) ctx.setLineDash(st.dash);
                        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x2, y2); ctx.stroke();
                        ctx.setLineDash([]); ctx.restore();
                    };

                    function roundRectPath(c, x, y, w, h, r=8) {
                        r = Math.min(r, w*0.5, h*0.5);
                        c.beginPath();
                        c.moveTo(x+r, y);
                        c.arcTo(x+w, y, x+w, y+h, r);
                        c.arcTo(x+w, y+h, x, y+h, r);
                        c.arcTo(x, y+h, x, y, r);
                        c.arcTo(x, y, x+w, y, r);
                        c.closePath();
                    }

                    // ---------- NAME (shared across styles if configs.names) ----------
                    const Sname = style.name;
                    if (Sname && configs.names && Sname.show?.(tmpObj, player, config)) {
                        const nameText = (tmpObj.team && showTeams ? `[${(tmpObj.team && isBadText(tmpObj.team) ? "noname" : tmpObj.team)}] ` : "")
                        + ((isBadText(tmpObj.name) ? "Badunknown" : tmpObj.name) || "")
                        + (tmpObj.isPlayer ? ` {${tmpObj.sid}}` : "");

                        ctx.save();
                        ctx.font = `${Sname.size?.(tmpObj) ?? 30}px ${Sname.fontFamily || "Hammersmith One"}`;
                        ctx.fillStyle = Sname.textColor || "#fff";
                        ctx.textBaseline = "middle"; ctx.textAlign = "center";
                        ctx.lineWidth = Sname.strokeWidth?.(tmpObj) ?? 8; ctx.lineJoin = "round";
                        const yName = (tmpObj.y - yOffset - tmpObj.scale) - (Sname.yPad?.(config) ?? 0);
                        ctx.strokeStyle = Sname.strokeColor?.() || "#000";
                        ctx.strokeText(nameText, tmpObj.x - xOffset, yName);
                        ctx.fillText(nameText,  tmpObj.x - xOffset, yName);

                        // icons (crown/skull)
                        const m = ctx.measureText(nameText).width;
                        if (tmpObj.isLeader && iconSprites[Sname.crown?.sprite]?.isLoaded) {
                            const s = Sname.crown.size?.(config) ?? 30, pad = Sname.crown.pad?.(config) ?? 10;
                            const ix = tmpObj.x - xOffset - (s/2) - (m/2) - pad;
                            ctx.drawImage(iconSprites[Sname.crown.sprite], ix, yName - (s/2) - 5, s, s);
                        }
                        if (tmpObj.iconIndex === 1 && iconSprites[Sname.skull?.sprite]?.isLoaded) {
                            const s = Sname.skull.size?.(config) ?? 30, pad = Sname.skull.pad?.(config) ?? 10;
                            const ix = tmpObj.x - xOffset - (s/2) + (m/2) + pad;
                            ctx.drawImage(iconSprites[Sname.skull.sprite], ix, yName - (s/2) - 5, s, s);
                        }
                        // crosshair for local player
                        if (Sname.crosshair?.enabled?.(tmpObj, player, enemyCount, useWasd)) {
                            const arr = Sname.crosshair.sprites?.() || crossHairSprites;
                            const spr = tmpObj.backupNobull ? arr[1] : arr[0];
                            if (spr?.isLoaded) {
                                const s = Sname.crosshair.scale?.(tmpObj) ?? (tmpObj.scale * 2.2);
                                ctx.drawImage(spr, tmpObj.x - xOffset - s/2, tmpObj.y - yOffset - s/2, s, s);
                            }
                        }
                        ctx.restore();
                    }

                    // ---------- HEALTH ----------
                    if (tmpObj.health > 0 && style.health) {
                        const H = style.health;
                        const hbW = H.width?.(config) ?? 100;
                        const pad = H.pad?.(config) ?? 4;
                        const barH= H.height ?? 17;
                        const r   = H.corner ?? 8;
                        const yBar= (tmpObj.y - yOffset + tmpObj.scale) + (config.nameY || 0);

                        // holder
                        ctx.fillStyle = H.holderFill?.() || "#000";
                        roundRectPath(ctx,
                                      tmpObj.x - xOffset - hbW - pad,
                                      yBar,
                                      (hbW*2) + (pad*2),
                                      barH, r
                                     );
                        ctx.fill();

                        // value
                        const frac = clamp01(tmpObj.health / tmpObj.maxHealth);
                        ctx.fillStyle = (tmpObj===player || (tmpObj.team && tmpObj.team===player.team)) ? (H.barGood || "#8ecc51") : (H.barBad || "#cc5151");
                        roundRectPath(ctx,
                                      tmpObj.x - xOffset - hbW,
                                      yBar + pad,
                                      (hbW*2) * frac,
                                      barH - pad*2,
                                      Math.max(0, r-1)
                                     );
                        ctx.fill();
                    }

                    // ---------- STYLE-SPECIFIC OVERLAY ----------
                    ctx.save();
                    ctx.globalAlpha = 1;

                    // A) NEO arcs / UEH2 reload rects
                    if (style.arcs?.enabled) {
                        const priIdx = tmpObj.primaryIndex, secIdx = tmpObj.secondaryIndex;
                        const pri = (priIdx == null || !items?.weapons?.[priIdx]) ? 1
                        : clamp01((items.weapons[priIdx].speed - tmpObj.reloads[priIdx]) / items.weapons[priIdx].speed);
                        const sec = (secIdx == null || !items?.weapons?.[secIdx]) ? 1
                        : clamp01((items.weapons[secIdx].speed - tmpObj.reloads[secIdx]) / items.weapons[secIdx].speed);
                        const tur = clamp01(tmpObj.reloads?.turret);

                        const R0 = (style.arcs.baseR?.(tmpObj) ?? (tmpObj.scale + 14));
                        // primary
                        drawArcReload(pri, R0, style.arcs.primary.sweep, {lo: style.arcs.primary.lo, hi: style.arcs.primary.hi}, style.arcs.primary.width, style.arcs.primary.glow);
                        // secondary
                        drawArcReload(sec, R0, style.arcs.secondary.sweep, {lo: style.arcs.secondary.lo, hi: style.arcs.secondary.hi}, style.arcs.secondary.width, style.arcs.secondary.glow);
                        // turret (outer)
                        drawArcReload(tur, R0 + (style.arcs.turret.radiusOffset ?? 8), style.arcs.turret.sweep, {lo: style.arcs.turret.lo, hi: style.arcs.turret.hi}, style.arcs.turret.width, style.arcs.turret.glow);
                    } else if (style.reloads) {
                        // UEH2 legacy rectangles (only when timers > 0)
                        const R = style.reloads;
                        const hbW = style.health?.width?.(config) ?? 100;
                        const pad = style.health?.pad?.(config) ?? 4;
                        const barH= R.height ?? 17;
                        const r   = R.corner ?? 7;
                        const yBar= (tmpObj.y - yOffset + tmpObj.scale) + (config.nameY || 0);

                        ctx.fillStyle = R.color || "#99ff99";
                        // primary
                        if (tmpObj.primaryIndex != null && tmpObj.reloads[tmpObj.primaryIndex] > 0) {
                            const fracP = clamp01(tmpObj.reloads[tmpObj.primaryIndex] / items.weapons[tmpObj.primaryIndex].speed);
                            roundRectPath(ctx,
                                          tmpObj.x - xOffset - hbW,
                                          yBar + pad,
                                          hbW * fracP,
                                          barH - pad*2, r
                                         );
                            ctx.fill();
                        }
                        // secondary
                        if (tmpObj.secondaryIndex != null && tmpObj.reloads[tmpObj.secondaryIndex] > 0) {
                            const speedS = items.weapons[tmpObj.secondaryIndex].speed;
                            const filled = clamp01(tmpObj.reloads[tmpObj.secondaryIndex] / speedS);
                            const leftX  = tmpObj.x - xOffset + (hbW * ((speedS - tmpObj.reloads[tmpObj.secondaryIndex]) / speedS));
                            roundRectPath(ctx,
                                          leftX,
                                          yBar + pad,
                                          hbW * filled,
                                          barH - pad*2, r
                                         );
                            ctx.fill();
                        }

                        // turret (local only)
                        if (tmpObj === player && tmpObj.reloads?.turret != null) {
                            ctx.fillStyle = R.turretHolder?.() || "#000";
                            roundRectPath(ctx,
                                          tmpObj.x - xOffset - hbW - pad,
                                          yBar + 13, (hbW*2) + (pad*2), 17, 8
                                         ); ctx.fill();

                            ctx.fillStyle = R.turretColor || "#cc5151";
                            roundRectPath(ctx,
                                          tmpObj.x - xOffset - hbW,
                                          yBar + 13 + pad,
                                          (hbW*2) * clamp01(tmpObj.reloads.turret),
                                          17 - pad*2, 7
                                         ); ctx.fill();
                        }
                    }

                    // B) Aim reticle (local)
                    if (tmpObj === player && tmpObj.dir != null && items?.weapons?.[player.weapons[0]] && style.aim) {
                        const r = items.weapons[player.weapons[0]].range;
                        drawGlowDot(tmpObj.x + Math.cos(tmpObj.dir) * r - xOffset,
                                    tmpObj.y + Math.sin(tmpObj.dir) * r - yOffset,
                                    style.aim);
                    }

                    // C) Chips (player/enemy)
                    if (style.chips?.enabled) {
                        if (tmpObj === player) {
                            const text = style.chips.playerText?.(player) ?? `[${player.oldSkinIndex},${player.skinIndex}]`;
                            drawChip(cx, cy + (style.chips.yOffset?.(tmpObj, config) ?? (tmpObj.scale+28)), text, style.chips);
                        } else {
                            const text = style.chips.enemyText?.(tmpObj) ?? `[${tmpObj.primaryIndex ?? "?"},${tmpObj.secondaryIndex ?? 0},${(tmpObj.damageThreat??0).toFixed?.(2) || "?"}]`;
                            drawChip(cx, cy + (style.chips.yOffset?.(tmpObj, config) ?? (tmpObj.scale+28)), text, style.chips);
                        }
                    }

                    // D) Shame badge
                    if (style.shame?.enabled?.()) {
                        const val = (tmpObj.skinIndex === 45 && tmpObj.shameTimer > 0) ? tmpObj.shameTimer : tmpObj.shameCount;
                        if (val != null && !isNaN(val)) {
                            const fill = style.shame.fill || "rgba(255,230,0,0.9)";
                            const textC= style.shame.text || "#1A1A1A";
                            const font = style.shame.font || "700 16px Inter, system-ui, sans-serif";
                            const h    = style.shame.h ?? 20;
                            const wPad = style.shame.wPad ?? 12;
                            const r    = style.shame.r ?? 7;
                            const yTop = cy - (tmpObj.scale + (style.shame.yAboveHead?.(tmpObj, config) ?? 26));

                            ctx.save();
                            ctx.font = font;
                            const s = String(val);
                            const w = ctx.measureText(s).width + wPad;
                            roundRectPath(ctx, cx - w/2, yTop - h/2, w, h, r);
                            ctx.fillStyle = fill; ctx.fill();
                            ctx.fillStyle = textC; ctx.textAlign="center"; ctx.textBaseline="middle";
                            ctx.fillText(s, cx, yTop);
                            ctx.restore();
                        }
                    }

                    ctx.restore();

                    // E) Ping circle (optional)
                    if (style.pingCircle?.enabled?.()) {
                        const ping = window.unsafeWindow?.pingTime ?? 100;
                        ctx.save();
                        ctx.globalAlpha = style.pingCircle.alpha ?? 0.08;
                        ctx.strokeStyle = style.pingCircle.stroke || "#000";
                        ctx.lineWidth = style.pingCircle.lineWidth ?? 2;
                        ctx.beginPath();
                        ctx.arc(player.x - xOffset, player.y - yOffset, style.pingCircle.radius?.(ping) ?? 170, 0, Math.PI*2);
                        ctx.stroke();
                        ctx.restore();
                    }


                    // F) Tracer ghost / beam
                    if (style.tracer?.enabled?.(tmpObj, player)) {
                        if (typeof style.tracer.draw === "function") {
                            style.tracer.draw(ctx, tmpObj, player, { xOffset, yOffset }, style.tracer);
                        } else {
                            // fallback (old logic)
                            const d = UTILS.getDistance(player.x, player.y, tmpObj.x, tmpObj.y);
                            const angle = UTILS.getDirect(tmpObj, player, 0, 0);
                            const getVal = (v, ...args) => (typeof v === "function" ? v(...args) : v);
                            const minD     = getVal(style.tracer.minDist ?? style.tracer.distMin ?? 60, d);
                            const maxClamp = getVal(style.tracer.maxClamp ?? 220, d);
                            const factor   = style.tracer.factor ?? 0.5;
                            const raw  = d * factor;
                            const dist = Math.min(maxClamp, Math.max(minD, raw));
                            const tx = (player.x - xOffset) + dist * Math.cos(angle);
                            const ty = (player.y - yOffset) + dist * Math.sin(angle);
                            ctx.save();
                            ctx.globalAlpha = style.tracer.alpha ?? 0.45;
                            ctx.translate(tx, ty);
                            ctx.rotate((tmpObj.dir || 0) + (tmpObj.dirPlus || 0));
                            renderPlayer(tmpObj, ctx);
                            ctx.restore();
                        }
                    }

                    // G) Prediction
                    const predEnabled = typeof style.predict?.enabled === "function"
                    ? style.predict.enabled()
                    : !!style.predict?.enabled;

                    if (predEnabled) {
                        if (predictType === "pre2" && tmpObj.x2 != null && tmpObj.y2 != null) drawDashedPredict(tmpObj.x2 - xOffset, tmpObj.y2 - yOffset, style.predict);
                        if (predictType === "pre3" && tmpObj.x3 != null && tmpObj.y3 != null) drawDashedPredict(tmpObj.x3 - xOffset, tmpObj.y3 - yOffset, style.predict);
                        if (predictType === "pre4" && tmpObj.x4 != null && tmpObj.y4 != null) drawDashedPredict(tmpObj.x4 - xOffset, tmpObj.y4 - yOffset, style.predict);
                        if (predictType === "pre5" && tmpObj.x5 != null && tmpObj.y5 != null) drawDashedPredict(tmpObj.x5 - xOffset, tmpObj.y5 - yOffset, style.predict);
                    }

                }

                function getActiveStyle() {
                    const vt = getEl("visualType")?.value || "default";
                    if (vt === "ueh1") return null;          // no style (legacy branch draws its own)
                    return STYLE_REGISTRY[vt] || STYLE_REGISTRY.ueh2;
                }
                function drawArrowhead(ctx, x2, y2, x1, y1, size = 10, lineWidth = 2) {
                    const ang = Math.atan2(y2 - y1, x2 - x1);
                    const hx = x2 - Math.cos(ang) * size;
                    const hy = y2 - Math.sin(ang) * size;
                    ctx.lineWidth = lineWidth;
                    ctx.beginPath();
                    ctx.moveTo(x2, y2);
                    ctx.lineTo(hx + (size * 0.45) * Math.cos(ang + Math.PI / 2),
                               hy + (size * 0.45) * Math.sin(ang + Math.PI / 2));
                    ctx.moveTo(x2, y2);
                    ctx.lineTo(hx - (size * 0.45) * Math.cos(ang + Math.PI / 2),
                               hy - (size * 0.45) * Math.sin(ang + Math.PI / 2));
                    ctx.stroke();
                }
                function neoTracerDraw(ctx, tmpObj, player, opts, st) {
                    const { xOffset = 0, yOffset = 0 } = opts || {};
                    const d = UTILS.getDistance(player.x, player.y, tmpObj.x, tmpObj.y);
                    const angle = UTILS.getDirect(tmpObj, player, 0, 0);

                    const getVal = (v, ...args) => (typeof v === "function" ? v(...args) : v);
                    const minD     = getVal(st.minDist ?? 60, d);
                    const maxClamp = getVal(st.maxClamp ?? 240, d);
                    const factor   = st.factor ?? 0.55;

                    const raw  = d * factor;
                    const dist = Math.min(maxClamp, Math.max(minD, raw));

                    const sx = player.x - xOffset;
                    const sy = player.y - yOffset;
                    const ex = sx + dist * Math.cos(angle);
                    const ey = sy + dist * Math.sin(angle);

                    const grad = ctx.createLinearGradient(sx, sy, ex, ey);
                    grad.addColorStop(0.00, st.beamLo || "rgba(120,220,255,0.00)");
                    grad.addColorStop(0.15, st.beamLo || "rgba(120,220,255,0.65)");
                    grad.addColorStop(0.85, st.beamHi || "rgba(20,216,107,0.95)");
                    grad.addColorStop(1.00, st.beamHi || "rgba(20,216,107,0.00)");

                    ctx.save();
                    ctx.globalAlpha = st.alpha ?? 0.85;
                    ctx.strokeStyle = grad;
                    ctx.lineWidth   = st.beamWidth ?? 3;
                    if (st.glow) { ctx.shadowBlur = st.glow; ctx.shadowColor = st.shadowColor || (st.beamHi || "#14D86B"); }

                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    ctx.lineTo(ex, ey);
                    ctx.stroke();

                    ctx.shadowBlur = 0;
                    ctx.strokeStyle = st.tipColor || (st.beamHi || "#14D86B");
                    drawArrowhead(ctx, ex, ey, sx, sy, st.arrowSize ?? 11, (st.beamWidth ?? 3));

                    if (st.pulse) {
                        const t = (performance.now() % 1000) / 1000;
                        const r = (st.pulse.r0 ?? 6) + (st.pulse.r1 ?? 4) * Math.sin(t * Math.PI * 2);
                        ctx.globalAlpha = (st.pulse.alpha ?? 0.35);
                        ctx.beginPath();
                        ctx.arc(ex, ey, r, 0, Math.PI * 2);
                        ctx.strokeStyle = st.pulse.color || (st.beamHi || "#14D86B");
                        ctx.lineWidth = 1.5;
                        ctx.stroke();
                    }
                    ctx.restore();

                    if (st.ghost) {
                        const drawEntity = getEntityRenderer(tmpObj);
                        ctx.save();
                        ctx.globalAlpha = st.ghost.alpha ?? 0.30;
                        ctx.translate(ex, ey);
                        ctx.rotate((tmpObj.dir || 0) + (tmpObj.dirPlus || 0));
                        drawEntity(tmpObj, ctx);   // ✅ correct renderer per entity
                        ctx.restore();
                    }
                }
                function renderStyleGrid(ctx, style, {camX, camY, maxScreenWidth, maxScreenHeight, useWasd, visualType}){
                    if (!style?.grid) return;
                    const G = style.grid;
                    if (!G.enabled(visualType)) return;

                    const step = useWasd ? G.stepWasd : G.stepDefault;

                    ctx.save();
                    ctx.lineWidth = G.lineWidth;
                    ctx.strokeStyle = G.color;
                    ctx.globalAlpha = G.alpha;
                    ctx.setLineDash(G.dash);
                    ctx.beginPath();

                    // verticals
                    for (let x = -camX; x < maxScreenWidth; x += step) {
                        if (!G.snapPositiveOnly || x > 0) {
                            ctx.moveTo(x, 0);
                            ctx.lineTo(x, maxScreenHeight);
                        }
                    }
                    // horizontals
                    for (let y = -camY; y < maxScreenHeight; y += step) {
                        if (!G.snapPositiveOnly || y > 0) {
                            ctx.moveTo(0, y);
                            ctx.lineTo(maxScreenWidth, y);
                        }
                    }

                    ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.restore();
                }
                function renderBiomeNeonLayers(ctx, opts) {
                    const {
                        xOffset, yOffset, maxScreenWidth, maxScreenHeight,
                        snowTop, desertTop, useWasd, style
                    } = opts;

                    const S = style?.neonBiome ?? {};
                    // defaults if style doesn’t specify
                    const CFG = {
                        gridStep: useWasd ? 60 : 120,
                        width: 1.5,
                        alpha: 0.20,
                        dash: [6, 4],
                        glow: 8,
                        shadow: "rgba(0,0,0,0.6)",
                        colors: {
                            snow:   "#7EE5FF",
                            grass:  "#63FFA7",
                            desert: "#FFD27F",
                            seamSG: "#7EE5FF",   // snow↔grass seam
                            seamGD: "#FFD27F"    // grass↔desert seam
                        },
                        ...(S || {})
                    };

                    // biome rects on screen
                    const R_SNOW   = (snowTop > 0)                    ? { x:0, y:0,                    w:maxScreenWidth, h:Math.min(snowTop, maxScreenHeight) } : null;
                    const R_GRASS1 = (snowTop > 0 && desertTop > snowTop) ? { x:0, y:snowTop,               w:maxScreenWidth, h:Math.min(desertTop - snowTop, maxScreenHeight - snowTop) } : null;
                    const R_GRASS2 = (snowTop <= 0 && desertTop >= 0) ? { x:0, y:0,                    w:maxScreenWidth, h:Math.min(desertTop, maxScreenHeight) } : null;
                    const R_GRASS  = R_GRASS1 || R_GRASS2 || (snowTop <= 0 && desertTop >= maxScreenHeight ? {x:0,y:0,w:maxScreenWidth,h:maxScreenHeight} : null);
                    const R_DESERT = (desertTop >= 0 && desertTop < maxScreenHeight) ? { x:0, y:desertTop, w:maxScreenWidth, h:maxScreenHeight - desertTop } : null;

                    // draw a clipped grid inside a rect
                    function drawClippedGrid(rect, color) {
                        if (!rect) return;
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(rect.x, rect.y, rect.w, rect.h);
                        ctx.clip();

                        // neon-ish line styling
                        ctx.globalAlpha = CFG.alpha;
                        ctx.lineWidth   = CFG.width;
                        ctx.setLineDash(CFG.dash);
                        ctx.shadowBlur  = CFG.glow;
                        ctx.shadowColor = CFG.shadow;
                        ctx.strokeStyle = color;

                        // verticals
                        ctx.beginPath();
                        // use 0.5 alignment for crispness
                        for (let x = Math.floor(-xOffset / CFG.gridStep) * CFG.gridStep - xOffset; x < maxScreenWidth; x += CFG.gridStep) {
                            const xx = Math.round(x) + 0.5;
                            if (xx >= rect.x && xx <= rect.x + rect.w) {
                                ctx.moveTo(xx, rect.y);
                                ctx.lineTo(xx, rect.y + rect.h);
                            }
                        }
                        // horizontals
                        for (let y = Math.floor(-yOffset / CFG.gridStep) * CFG.gridStep - yOffset; y < maxScreenHeight; y += CFG.gridStep) {
                            const yy = Math.round(y) + 0.5;
                            if (yy >= rect.y && yy <= rect.y + rect.h) {
                                ctx.moveTo(rect.x, yy);
                                ctx.lineTo(rect.x + rect.w, yy);
                            }
                        }
                        ctx.stroke();
                        ctx.restore();
                    }

                    // seams (snow/grass at y=snowTop, grass/desert at y=desertTop)
                    function drawSeam(y, color) {
                        if (y < 0 || y > maxScreenHeight) return;
                        ctx.save();
                        ctx.globalAlpha = Math.max(CFG.alpha + 0.1, 0.25);
                        ctx.lineWidth   = Math.max(CFG.width + 0.5, 2);
                        ctx.setLineDash([10, 6]);
                        ctx.shadowBlur  = CFG.glow + 4;
                        ctx.shadowColor = CFG.shadow;
                        ctx.strokeStyle = color;
                        const yy = Math.round(y) + 0.5;
                        ctx.beginPath();
                        ctx.moveTo(0, yy);
                        ctx.lineTo(maxScreenWidth, yy);
                        ctx.stroke();
                        ctx.restore();
                    }

                    // per-biome grids
                    drawClippedGrid(R_SNOW,   CFG.colors.snow);
                    drawClippedGrid(R_GRASS,  CFG.colors.grass);
                    drawClippedGrid(R_DESERT, CFG.colors.desert);

                    // seam outlines
                    if (snowTop > 0 && snowTop < maxScreenHeight)   drawSeam(snowTop,  CFG.colors.seamSG);
                    if (desertTop > 0 && desertTop < maxScreenHeight) drawSeam(desertTop, CFG.colors.seamGD);
                }

                function renderStyledWater(ctx, style, state, opts) {
                    if (!style?.water?.enabled) return;
                    const S = style.water;
                    const { xOffset=0, yOffset=0, config, delta=16, firstSetup=false } = opts || {};

                    // drive the oscillation like your original
                    const waveSpeed = config.waveSpeed ?? 1;
                    const waveMax   = config.waveMax   ?? 2;

                    state.waterMult = state.waterMult ?? 1;
                    state.waterPlus = state.waterPlus ?? 1;

                    if (!firstSetup) {
                        state.waterMult += state.waterPlus * waveSpeed * delta;
                        if (state.waterMult >= waveMax) {
                            state.waterMult = waveMax;
                            state.waterPlus = -1;
                        } else if (state.waterMult <= 1) {
                            state.waterMult = 1;
                            state.waterPlus = 1;
                        }
                    }

                    const pad = (typeof S.padding === "function") ? S.padding(config) : (S.padding ?? 0);
                    const waveRadius = (state.waterMult - 1) * (S.waveMaxRadius ?? 250);

                    ctx.save();

                    // pass 1: base fill
                    if (S.base) {
                        ctx.globalAlpha = S.base.alpha ?? 1;
                        ctx.fillStyle   = S.base.fill  ?? "#dbc666";
                        renderWaterBodies(xOffset, yOffset, ctx, pad);
                    }

                    // pass 2: animated wave overlay
                    if (S.wave) {
                        if (S.composite) ctx.globalCompositeOperation = S.composite;
                        ctx.globalAlpha = S.wave.alpha ?? 1;
                        ctx.fillStyle   = S.wave.fill  ?? "#91b2db";
                        renderWaterBodies(xOffset, yOffset, ctx, waveRadius);
                    }

                    ctx.restore();
                }
                function renderTrackers(ctx, style, tracker, { xOffset=0, yOffset=0 } = {}, near) {
                    const S = style?.tracker || {};
                    if (!tracker) return;

                    // draw4 — ring around nearest player
                    if (tracker.draw4?.active && S.draw4?.enabled && near) {
                        ctx.save();
                        ctx.globalAlpha = S.draw4.alpha ?? 1;
                        ctx.strokeStyle = S.draw4.stroke || "#00FFFF";
                        ctx.lineWidth   = S.draw4.width  ?? 2;
                        if (S.draw4.glow) { ctx.shadowBlur = S.draw4.glow; ctx.shadowColor = ctx.strokeStyle; }
                        if (S.draw4.dash) ctx.setLineDash(S.draw4.dash);
                        ctx.beginPath();
                        ctx.arc(near.x2 - xOffset, near.y2 - yOffset, near.scale, 0, 2*Math.PI);
                        ctx.stroke();
                        ctx.setLineDash([]);
                        ctx.restore();
                    }

                    // draw3 — filled circle
                    if (tracker.draw3?.active && S.draw3?.enabled) {
                        const obj = {
                            x: tracker.draw3.x - xOffset,
                            y: tracker.draw3.y - yOffset,
                            r: tracker.draw3.scale,
                        };
                        ctx.save();
                        ctx.globalAlpha = S.draw3.alpha ?? 0.35;
                        ctx.fillStyle   = S.draw3.fill  || "#FF0000";
                        if (S.draw3.glow) { ctx.shadowBlur = S.draw3.glow; ctx.shadowColor = ctx.fillStyle; }
                        ctx.beginPath();
                        ctx.arc(obj.x, obj.y, obj.r, 0, 2*Math.PI);
                        ctx.fill();
                        ctx.restore();
                    }

                    // draw2 — outline circle
                    if (tracker.draw2?.active && S.draw2?.enabled) {
                        const obj = {
                            x: tracker.draw2.x - xOffset,
                            y: tracker.draw2.y - yOffset,
                            r: tracker.draw2.scale,
                        };
                        ctx.save();
                        ctx.globalAlpha = S.draw2.alpha ?? 1;
                        ctx.strokeStyle = S.draw2.stroke || "#ffff00";
                        ctx.lineWidth   = S.draw2.width  ?? 2;
                        if (S.draw2.glow) { ctx.shadowBlur = S.draw2.glow; ctx.shadowColor = ctx.strokeStyle; }
                        if (S.draw2.dash) ctx.setLineDash(S.draw2.dash);
                        ctx.beginPath();
                        ctx.arc(obj.x, obj.y, obj.r, 0, 2*Math.PI);
                        ctx.stroke();
                        ctx.setLineDash([]);
                        ctx.restore();
                    }

                    // draw1 — tiny dot
                    if (tracker.draw1?.active && S.draw1?.enabled) {
                        const obj = {
                            x: tracker.draw1.x - xOffset,
                            y: tracker.draw1.y - yOffset,
                            r: S.draw1.radius ?? 5,
                        };
                        ctx.save();
                        ctx.globalAlpha = S.draw1.alpha ?? 1;
                        ctx.fillStyle   = S.draw1.fill  || "#00FFFF";
                        if (S.draw1.glow) { ctx.shadowBlur = S.draw1.glow; ctx.shadowColor = ctx.fillStyle; }
                        ctx.beginPath();
                        ctx.arc(obj.x, obj.y, obj.r, 0, 2*Math.PI);
                        ctx.fill();
                        ctx.restore();
                    }
                }
                function renderBackground(ctx, style, { width, height, isNight }) {
                    const bg = style?.background;
                    if (!bg) return;

                    ctx.save();
                    ctx.globalAlpha = 1;

                    if (bg.type === "solid") {
                        ctx.fillStyle = bg.solid;
                        ctx.fillRect(0, 0, width, height);
                    } else if (bg.type === "gradient") {
                        const grad = ctx.createLinearGradient(0, 0, 0, height);
                        bg.gradient.stops.forEach(stop => grad.addColorStop(stop.offset, stop.color));
                        ctx.fillStyle = grad;
                        ctx.fillRect(0, 0, width, height);
                    } else if (bg.type === "image" && bg.image) {
                        ctx.drawImage(bg.image, 0, 0, width, height);
                    }

                    // optional night overlay
                    if (isNight && bg.nightOverlay) {
                        ctx.fillStyle = bg.nightOverlay;
                        ctx.fillRect(0, 0, width, height);
                    }

                    ctx.restore();
                }

                function getEntityRenderer(tmpObj) {
                    if (tmpObj && tmpObj.isPlayer && typeof renderPlayer === "function") {
                        return renderPlayer;
                    }
                    if (typeof renderAI === "function") return renderAI;
                    return function(){ /* noop */ };
                }

                function updateGame() {
                    updateDebugPanel()
                    const visualType = getEl("visualType").value || "default";
                    const style = getActiveStyle();

                    if (config.resetRender) {
                        mainContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
                        mainContext.beginPath();
                    }
                    if (player) {
                        if(config.smoothCamera&&!autoGo){
                            let damping = 0.0325;
                            camX += (player.x - camX) * damping;
                            camY += (player.y - camY) * damping;
                        }else{
                            camX = player.x;
                            camY = player.y;
                        }
                    } else {
                        camX = config.mapScale / 2;
                        camY = config.mapScale / 2;
                    }
                    // INTERPOLATE PLAYERS AND AI:
                    let lastTime = now - (1000 / config.serverUpdateRate);
                    let tmpDiff;
                    for (let i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i] || ais[i - players.length];
                        if (tmpObj && tmpObj.visible) {
                            if (tmpObj.forcePos || !config.smoothEntities || autoGo) {
                                tmpObj.x = tmpObj.x2;
                                tmpObj.y = tmpObj.y2;
                                tmpObj.dir = tmpObj.d2;
                            } else {
                                let total = tmpObj.t2 - tmpObj.t1;
                                let fraction = lastTime - tmpObj.t1;
                                let ratio = (fraction / total);
                                let rate = 170;
                                tmpObj.dt += delta;
                                let tmpRate = Math.min(1.7, tmpObj.dt / rate);
                                tmpDiff = (tmpObj.x2 - tmpObj.x1);
                                tmpObj.x = tmpObj.x1 + (tmpDiff * tmpRate);
                                tmpDiff = (tmpObj.y2 - tmpObj.y1);
                                tmpObj.y = tmpObj.y1 + (tmpDiff * tmpRate);
                                if (config.anotherVisual) {
                                    tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
                                } else {
                                    tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
                                }
                            }
                        }
                    }
                    // RENDER CORDS:
                    let xOffset = camX - (maxScreenWidth / 2);
                    let yOffset = camY - (maxScreenHeight / 2);
                    if (disableRender) {
                        return;
                    }
                    // RENDER BACKGROUND (your code)
                    const snowTop   = config.snowBiomeTop - yOffset;
                    const desertTop = config.mapScale - config.snowBiomeTop - yOffset;

                    if (snowTop <= 0 && desertTop >= maxScreenHeight) {
                        mainContext.fillStyle = style.biome?.grass ?? "#b6db66";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (desertTop <= 0) {
                        mainContext.fillStyle = style.biome?.desert ?? "#dbc666";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (snowTop >= maxScreenHeight) {
                        mainContext.fillStyle = style.biome?.snow ?? "#fff";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (snowTop >= 0) {
                        // snow + grass
                        mainContext.fillStyle = style.biome?.snow ?? "#fff";
                        mainContext.fillRect(0, 0, maxScreenWidth, snowTop);
                        mainContext.fillStyle = style.biome?.grass ?? "#b6db66";
                        mainContext.fillRect(0, snowTop, maxScreenWidth, maxScreenHeight - snowTop);
                    } else {
                        // grass + desert
                        mainContext.fillStyle = style.biome?.grass ?? "#b6db66";
                        mainContext.fillRect(0, 0, maxScreenWidth, desertTop);
                        mainContext.fillStyle = style.biome?.desert ?? "#dbc666";
                        mainContext.fillRect(0, desertTop, maxScreenWidth, maxScreenHeight - desertTop);
                    }

                    // ✨ add neon grids + seams on top of the fills
                    renderBiomeNeonLayers(mainContext, {
                        xOffset, yOffset, maxScreenWidth, maxScreenHeight,
                        snowTop, desertTop, useWasd,
                        style
                    });
                    // RENDER WATER AREAS:
                    if (!firstSetup) {
                        waterMult += waterPlus * config.waveSpeed * delta;
                        if (waterMult >= config.waveMax) { waterMult = config.waveMax; waterPlus = -1; }
                        else if (waterMult <= 1) { waterMult = 1; waterPlus = 1; }

                        mainContext.globalAlpha = 1;

                        // base (sand/bed)
                        const W = (style.water || {});
                        const baseFill = (W.base && W.base.fill) || "#dbc666";
                        const baseAlpha= (W.base && W.base.alpha != null) ? W.base.alpha : 1;
                        if (W.composite) mainContext.save(), mainContext.globalCompositeOperation = W.composite;

                        mainContext.save();
                        mainContext.globalAlpha = baseAlpha;
                        mainContext.fillStyle = baseFill;
                        renderWaterBodies(xOffset, yOffset, mainContext, (W.padding ? W.padding(config) : config.riverPadding), style);
                        mainContext.restore();

                        // animated wave overlay
                        const waveFill  = (W.wave && W.wave.fill) || "#91b2db";
                        const waveAlpha = (W.wave && W.wave.alpha != null) ? W.wave.alpha : 1;
                        const swell     = (waterMult - 1) * (W.waveMaxRadius ?? 250);

                        mainContext.save();
                        mainContext.globalAlpha = waveAlpha;
                        mainContext.fillStyle = waveFill;
                        renderWaterBodies(xOffset, yOffset, mainContext, swell, style);
                        mainContext.restore();

                        if (W.composite) mainContext.restore();
                    }
                    if (style) {
                        renderBackground(mainContext, style, {
                            width: maxScreenWidth,
                            height: maxScreenHeight,
                            isNight
                        });
                        renderStyleGrid(mainContext, style, {
                            camX, camY, maxScreenWidth, maxScreenHeight, useWasd, visualType
                        });
                    }
                    if (player && lastDeath) {
                        mainContext.globalAlpha = 1;
                        mainContext.fillStyle = style.markers?.deathColor ?? "#fc5553";
                        mainContext.font = style.markers?.deathFont ?? "100px Hammersmith One";
                        mainContext.textBaseline = "middle";
                        mainContext.textAlign = "center";
                        mainContext.fillText(style.markers?.deathSymbol ?? "x", lastDeath.x - xOffset, lastDeath.y - yOffset);
                    }
                    // RENDER DEAD PLAYERS:
                    mainContext.globalAlpha = 1;
                    mainContext.strokeStyle = outlineColor;
                    renderDeadPlayers(xOffset, yOffset);

                    // RENDER BOTTOM LAYER:
                    mainContext.globalAlpha = 1;
                    mainContext.strokeStyle = outlineColor;
                    renderGameObjects(-1, xOffset, yOffset);

                    // RENDER PROJECTILES:
                    mainContext.globalAlpha = 1;
                    mainContext.lineWidth = outlineWidth;
                    renderProjectiles(0, xOffset, yOffset);

                    // RENDER PLAYERS:
                    instaRingTime += delta / 1000;
                    renderPlayers(xOffset, yOffset, 0);

                    // RENDER AI:
                    mainContext.globalAlpha = 1;
                    for (let i = 0; i < ais.length; ++i) {
                        tmpObj = ais[i];
                        if (tmpObj.active && tmpObj.visible) {
                            tmpObj.animate(delta);
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            mainContext.rotate(tmpObj.dir + tmpObj.dirPlus - (Math.PI / 2));
                            renderAI(tmpObj, mainContext);
                            mainContext.restore();
                        }
                    }

                    // RENDER GAME OBJECTS (LAYERED):
                    renderGameObjects(0, xOffset, yOffset);
                    renderProjectiles(1, xOffset, yOffset);
                    renderGameObjects(1, xOffset, yOffset);
                    renderPlayers(xOffset, yOffset, 1);
                    renderGameObjects(2, xOffset, yOffset);
                    renderGameObjects(3, xOffset, yOffset);

                    // MAP BOUNDARIES:
                    mainContext.fillStyle = "#000";
                    mainContext.globalAlpha = 0.09;
                    if (xOffset <= 0) {
                        mainContext.fillRect(0, 0, -xOffset, maxScreenHeight);
                    } if (config.mapScale - xOffset <= maxScreenWidth) {
                        let tmpY = Math.max(0, -yOffset);
                        mainContext.fillRect(config.mapScale - xOffset, tmpY, maxScreenWidth - (config.mapScale - xOffset), maxScreenHeight - tmpY);
                    } if (yOffset <= 0) {
                        mainContext.fillRect(-xOffset, 0, maxScreenWidth + xOffset, -yOffset);
                    } if (config.mapScale - yOffset <= maxScreenHeight) {
                        let tmpX = Math.max(0, -xOffset);
                        let tmpMin = 0;
                        if (config.mapScale - xOffset <= maxScreenWidth)
                            tmpMin = maxScreenWidth - (config.mapScale - xOffset);
                        mainContext.fillRect(tmpX, config.mapScale - yOffset,
                                             (maxScreenWidth - tmpX) - tmpMin, maxScreenHeight - (config.mapScale - yOffset));
                    }
                    /*
                    if (tracker.draw4.active) {//for players
                        mainContext.globalAlpha = 1;
                        let obj = {
                            x: tracker.draw4.x - xOffset,
                            y: tracker.draw4.y - yOffset,
                            scale: tracker.draw4.scale,
                        };
                        mainContext.strokeStyle = "#00FFFF";
                        mainContext.beginPath();
                        mainContext.arc(near.x2, near.y2, near.scale, 0, 2 * Math.PI);
                        mainContext.stroke();
                    }

                    if (tracker.draw3.active) {//fill
                        mainContext.globalAlpha = 0.35;
                        let obj = {
                            x: tracker.draw3.x - xOffset,
                            y: tracker.draw3.y - yOffset,
                            scale: tracker.draw3.scale,
                        };
                        mainContext.strokeStyle = "#FF0000";
                        mainContext.fillStyle = "#FF0000";
                        mainContext.beginPath();
                        mainContext.arc(obj.x, obj.y, obj.scale, 0, 2 * Math.PI);
                        mainContext.fill();
                    }
                    if (tracker.draw2.active) {//outline
                        mainContext.globalAlpha = 1;
                        let obj = {
                            x: tracker.draw2.x - xOffset,
                            y: tracker.draw2.y - yOffset,
                            scale: tracker.draw2.scale,
                        };
                        mainContext.strokeStyle = "#ffff00";
                        mainContext.beginPath();
                        mainContext.arc(obj.x, obj.y, obj.scale, 0, 2 * Math.PI);
                        mainContext.stroke();
                    }
                    if (tracker.draw1.active) {
                        mainContext.globalAlpha = 1;
                        let obj = {
                            x: tracker.draw1.x - xOffset,
                            y: tracker.draw1.y - yOffset,
                            scale: 5
                        };
                        mainContext.fillStyle = "#00FFFF";
                        mainContext.beginPath();
                        mainContext.arc(obj.x, obj.y, obj.scale, 0, 2 * Math.PI);
                        mainContext.fill();
                    }*/
                    renderTrackers(mainContext, style, tracker, { xOffset, yOffset }, near);


                    // RENDER DAY/NIGHT TIME:
                    /*mainContext.globalAlpha = 1;
                    mainContext.fillStyle = "rgba(0, 0, 70, 0.35)";
                    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);*/


                    // RENDER PLAYER AND AI UI:
                    mainContext.strokeStyle = darkOutlineColor;
                    mainContext.globalAlpha = 1;
                    for (let i = 0; i < players.length + ais.length; ++i) {
                        const tmpObj = players[i] || ais[i - players.length];
                        if (!tmpObj || !tmpObj.visible) continue;

                        // ueh1 keeps your old, super-specific drawing path
                        if (!style /* ueh1 */ || !tmpObj.isPlayer) {
                            // ✅ keep your original ueh1 branch here (unchanged)
                            // (name/health/reloads/predict/tracer code you already had)
                            // ...
                            continue;
                        }

                        // style-driven render (ueh2, neo, etc.)
                        renderPlayerStyled(tmpObj, mainContext, style, {
                            xOffset,
                            yOffset,
                            config,
                            items,
                            player,
                            screenHeight,
                            predictType: getEl("predictType")?.value,
                            enemyCount: enemy.length,
                            useWasd,
                        });
                    }
                    if (player) {
                        const ctx = mainContext;
                        const xo  = xOffset || 0;
                        const yo  = yOffset || 0;
                        const _sx = (x) => x - (xOffset || 0);
                        const _sy = (y) => y - (yOffset || 0);

                        mainContext.globalAlpha = 1;
                        //render autopush line
                        if (my.autoPush) {
                            mainContext.lineWidth = 4.5;
                            mainContext.strokeStyle = "#fff";
                            mainContext.beginPath();
                            //  mainContext.moveTo(player.x - xOffset, player.y - yOffset);
                            mainContext.lineTo(my.pushLine.x2 - xOffset, my.pushLine.y2 - yOffset);
                            mainContext.lineTo(my.pushLine.x - xOffset, my.pushLine.y - yOffset);
                            mainContext.stroke();
                        }
                        drawHitRangeSmooth(mainContext, _things.player, xOffset, yOffset, 0.15);

                        drawPathVis(ctx,_things,xo,yo)
                        try{_things.pushPos=null;drawPushGuideWithArc(ctx,xo,yo)}catch(err){console.warn(err)}

                        if(_things.pushPos){
                            ctx.beginPath();
                            ctx.strokeStyle = "#00ff00";
                            ctx.lineWidth   = 2;
                            ctx.moveTo(player.x2 - xo, player.y2 - yo);
                            ctx.lineTo(_things.pushPos.x - xo, _things.pushPos.y - yo);
                        }

                        if (_things.sim.danger){
                            const { hit, obj } = _things.sim.danger;
                            // hit point
                            ctx.beginPath();
                            ctx.arc(hit.x - xOffset, hit.y - yOffset, 5, 0, Math.PI*2);
                            ctx.fillStyle = "#ff004c";
                            ctx.fill();

                            // hazard circle
                            ctx.setLineDash([6,4]);
                            ctx.beginPath();
                            ctx.arc(obj.x - xOffset, obj.y - yOffset, obj.scale ?? 18, 0, Math.PI*2);
                            ctx.strokeStyle = "#ff0000";
                            ctx.stroke();
                            ctx.setLineDash([]);
                        }

                        //————— ENEMY RANGE + LEAD (render-only) —————
                        // uses cached _things.enemyRange and _things.lead; NO heavy work here
                        if (_things.enemy && _things.enemy.enemy) {
                            var en = _things.enemy.enemy;

                            // 1) Enemy range ring (cached radius)
                            if (_things.enemyRange != null) {
                                var ex = en.x - xo;
                                var ey = en.y - yo;
                                ctx.beginPath();
                                ctx.strokeStyle = "#00ff00";
                                ctx.lineWidth   = 2;
                                ctx.arc(ex, ey, _things.enemyRange, 0, Math.PI * 2);
                                ctx.stroke();
                            }

                            // 2) Lead point + line (cached point)
                            if (_things.lead) {
                                var lx = _things.lead.x - xo;
                                var ly = _things.lead.y - yo;

                                ctx.beginPath();
                                ctx.fillStyle = "#ff0000";
                                ctx.arc(lx, ly, 5, 0, Math.PI * 2);
                                ctx.fill();

                                var px = player.x - xo;
                                var py = player.y - yo;
                                ctx.beginPath();
                                ctx.strokeStyle = "#ff0000";
                                ctx.lineWidth   = 1;
                                ctx.moveTo(px, py);
                                ctx.lineTo(lx, ly);
                                ctx.stroke();
                            }
                        }

                        if (_things.enemyKBI) {
                            const sp = _things.enemyKBI;
                            const sx = sp.x - xo;
                            const sy = sp.y - yo;

                            ctx.beginPath();
                            ctx.strokeStyle = "#a539d4";
                            ctx.lineWidth   = 4;
                            ctx.arc(sx, sy, sp.scale, 0, Math.PI * 2);
                            ctx.stroke();
                        }
                        bestEsc=null;
                        // —— Enemy/Spike dodge geometry (render-only) ——
                        if (_things.enemy && _things.enemy.enemy && _things.enemyKBI && _things.dodgePlan && player) {
                            var sp = _things.enemyKBI;
                            var en = _things.enemy.enemy;
                            var pl = player;

                            // screen coords
                            var px = pl.x2 - xo, py = pl.y2 - yo;
                            var ex = en.x  - xo, ey = en.y  - yo;
                            var sx = sp.x  - xo, sy = sp.y  - yo;

                            // cached geometry
                            var plR   = _things.dodgePlan.plR;
                            var angEn = _things.dodgePlan.angEn;
                            var angSp = _things.dodgePlan.angSp;

                            // — player circle
                            ctx.beginPath();
                            ctx.strokeStyle = "#ffff00";
                            ctx.lineWidth   = 2;
                            ctx.arc(px, py, plR, 0, Math.PI * 2);
                            ctx.stroke();

                            // — radii to enemy & spike
                            ctx.beginPath();
                            ctx.moveTo(px, py); ctx.lineTo(ex, ey);
                            ctx.moveTo(px, py); ctx.lineTo(sx, sy);
                            ctx.strokeStyle = "#ffffff";
                            ctx.lineWidth   = 1;
                            ctx.stroke();

                            // — “pie” arc between angEn and angSp (angles are relative to center px,py)
                            ctx.beginPath();
                            ctx.strokeStyle = "rgba(255,255,255,0.7)";
                            ctx.lineWidth   = 3;
                            ctx.arc(px, py, plR - 10, angEn, angSp, false);
                            ctx.stroke();

                            // — spokes (draw best solid green, others dashed white)
                            var i = 0;
                            for (i = 0; i < _things.dodgePlan.spokes.length; i++) {
                                var spk = _things.dodgePlan.spokes[i];
                                var ex2 = spk.x - xo, ey2 = spk.y - yo;

                                ctx.beginPath();
                                ctx.moveTo(px, py);
                                ctx.lineTo(ex2, ey2);

                                if (spk.best) {
                                    ctx.setLineDash([]);
                                    ctx.strokeStyle = "#00ff00";
                                } else {
                                    ctx.setLineDash([5,5]);
                                    ctx.strokeStyle = "rgba(255,255,255,0.8)";
                                }
                                ctx.lineWidth = 2;
                                ctx.stroke();
                            }
                            ctx.setLineDash([]);

                            // publish best escape for controllers, if you use it
                            if (_things.dodgePlan.bestEsc != null) {
                                _things.moveNOW = _things.dodgePlan.bestEsc;
                            }

                            if (petals.length && getEl("funni").checked) {

                                player.spinDir += 2.5 / 60;
                                let maxRad = 0;
                                if (clicks.left) {
                                    maxRad = 100;
                                } else if (clicks.right) {
                                    maxRad = 15;
                                } else {
                                    maxRad = 40;
                                }
                                maxRad += player.scale;

                                petals.forEach((petal, i) => {
                                    if (petal.active) {
                                        let petalRad = (Math.PI * (i / (petals.length / 2)));
                                        let pl = {
                                            x: player.x + (maxRad * Math.cos(player.spinDir + petalRad)),
                                            y: player.y + (maxRad * Math.sin(player.spinDir + petalRad))
                                        };
                                        let angle = UTILS.getDirect(pl, petal, 0, 0);
                                        let dist = UTILS.getDist(pl, petal, 0, 0);
                                        petal.x += (dist / 7) * Math.cos(angle);
                                        petal.y += (dist / 7) * Math.sin(angle);

                                        players.filter((tmp) => tmp.visible && tmp != player).forEach((tmp) => {
                                            let angle = UTILS.getDirect(petal, tmp, 0, 0);
                                            let dist = UTILS.getDist(petal, tmp, 0, 0);
                                            let sc = petal.scale + tmp.scale;
                                            if (dist <= sc) {
                                                let tD = dist - sc;
                                                let diff = -tD;
                                                petal.x += diff * Math.cos(angle);
                                                petal.y += diff * Math.sin(angle);
                                                petal.health -= 10;
                                                petal.damaged += 125;
                                                if (petal.health <= 0) {
                                                    petal.active = false;
                                                }
                                            }
                                        });

                                    } else {
                                        petal.time += delta;

                                        if (petal.alive) {
                                            petal.alpha -= delta / 200;
                                            petal.visScale += delta / (petal.scale * 2);
                                            if (petal.alpha <= 0) {
                                                petal.alpha = 0;
                                                petal.alive = false;
                                            }
                                        }

                                        if (petal.time >= petal.timer) {
                                            petal.time = 0;
                                            petal.active = true;
                                            petal.alive = true;
                                            petal.x = player.x;
                                            petal.y = player.y;
                                            petal.health = petal.maxHealth;
                                            petal.damaged = 0;
                                            petal.alpha = 1;
                                            petal.visScale = petal.scale;
                                        }
                                    }

                                    if (petal.alive) {

                                        let cD = function(r, g, b, dmg) {
                                            return "rgb(" + `${Math.min(255, r + Math.floor(dmg))}, ${Math.max(0, g - Math.floor(dmg))}, ${Math.max(0, b - Math.floor(dmg))}` + ")";
                                        }

                                        mainContext.globalAlpha = petal.alpha;
                                        mainContext.lineWidth = 3;
                                        mainContext.fillStyle = cD(255, 255, 255, petal.damaged);
                                        mainContext.strokeStyle = cD(200, 200, 200, petal.damaged);
                                        mainContext.beginPath();
                                        mainContext.arc(petal.x - xOffset, petal.y - yOffset, petal.visScale, 0, Math.PI * 2);
                                        mainContext.fill();
                                        mainContext.stroke();

                                        petal.damaged = Math.max(0, petal.damaged - (delta / 2));

                                    }

                                });
                            }
                        }
                        // ---------- Danger sims, paths, insta-HUD (RENDER) ----------
                        if (_things.enemy && _things.enemy.enemy) {
                            // A) quick warning (first block behavior)
                            if (_things.sim.quick) {
                                var lbl = _things.sim.quick.label || '';
                                ctx.fillText("DANGER! - " + lbl, player.x - (xOffset || 0), player.y - (yOffset || 0) + 30);

                                if (_things.sim.quick.hit && _things.sim.quick.hit.x != null && _things.sim.quick.hit.y != null) {
                                    ctx.save();
                                    ctx.beginPath();
                                    ctx.arc(_things.sim.quick.hit.x - (xOffset || 0), _things.sim.quick.hit.y - (yOffset || 0), 24, 0, Math.PI * 2);
                                    ctx.strokeStyle = "#ff004c";
                                    ctx.lineWidth = 4;
                                    ctx.stroke();

                                    ctx.font = "bold 16px Arial";
                                    ctx.fillStyle = "#ff004c";
                                    ctx.fillText("💀", _things.sim.quick.hit.x - (xOffset || 0) - 12, _things.sim.quick.hit.y - (yOffset || 0) + 6);
                                    ctx.restore();
                                }
                                // optional: preserve moveNOW from dodge plan if set on tick
                            } else {
                                _things.moveNOW = null;
                            }

                            // B) full lethal display (second block behavior)
                            if (_things.sim.full) {
                                var F = _things.sim.full;
                                ctx.fillText("DANGER! - " + (F.label || ''), player.x - (xOffset || 0), player.y - (yOffset || 0) + 30);

                                // hit circle
                                ctx.save();
                                ctx.beginPath();
                                ctx.arc(F.hitPos.x - (xOffset || 0), F.hitPos.y - (yOffset || 0), 24, 0, Math.PI * 2);
                                ctx.strokeStyle = "#ff004c";
                                ctx.lineWidth = 4;
                                ctx.stroke();

                                // lethal object ring
                                if (F.lethalObj) {
                                    ctx.beginPath();
                                    ctx.arc(F.lethalObj.x - (xOffset || 0), F.lethalObj.y - (yOffset || 0), F.lethalObj.scale || 18, 0, Math.PI * 2);
                                    ctx.strokeStyle = "#ff0000";
                                    ctx.setLineDash([6, 4]);
                                    ctx.stroke();
                                    ctx.setLineDash([]);
                                }

                                // KB indicators
                                if (F.KBIndc) {
                                    var indc = F.KBIndc;
                                    var keys = ["x0","y0","x1","y1","instax","instay","turretx","turrety"];
                                    var k, X, Y;
                                    for (k = 0; k < keys.length; k += 2) {
                                        X = keys[k]; Y = keys[k + 1];
                                        if (indc[X] !== undefined && !isNaN(indc[X]) && indc[Y] !== undefined && !isNaN(indc[Y])) {
                                            ctx.beginPath();
                                            ctx.arc(indc[X] - (xOffset || 0), indc[Y] - (yOffset || 0), 24, 0, Math.PI * 2);
                                            ctx.strokeStyle = "#f00";
                                            ctx.stroke();
                                        }
                                    }
                                }

                                ctx.restore();
                                ctx.font = "bold 16px Arial";
                                ctx.fillStyle = "#ff004c";
                                ctx.fillText("💀", F.hitPos.x - (xOffset || 0) - 12, F.hitPos.y - (yOffset || 0) + 6);

                                // keep best escape if tick computed it
                                if (_things.dodgePlan && _things.dodgePlan.bestEsc != null) _things.moveNOW = _things.dodgePlan.bestEsc;
                            }
                        }

                        // C) path from cached world points
                        if (_things.cachedPath && _things.cachedPath.length && player) {
                            ctx.beginPath();
                            ctx.lineWidth   = player.scale;
                            ctx.strokeStyle = "rgba(0,255,0,0.7)";
                            ctx.moveTo(player.x2 - xOffset, player.y2 - yOffset);

                            if (_things.cachedPath.length === 1) {
                                var p = _things.cachedPath[0];
                                ctx.lineTo(p.x - xOffset, p.y - yOffset);
                            } else {
                                var ctrl = _things.cachedPath[0];
                                var tgt  = _things.cachedPath[_things.cachedPath.length - 1];
                                ctx.quadraticCurveTo(ctrl.x - xOffset, ctrl.y - yOffset, tgt.x - xOffset, tgt.y - yOffset);
                            }
                            ctx.stroke();
                        }

                        // D) pathVisual (already prepped elsewhere under _things.pathVisual)
                        if (_things.pathVisual && _things.enemy && _things.enemy.enemy) {
                            var v = _things.pathVisual;
                            var enPv = _things.enemy.enemy;
                            var diff = v.endAngle - v.a0;

                            ctx.beginPath();
                            ctx.lineWidth   = 2;
                            ctx.strokeStyle = "rgba(0,255,0,0.7)";
                            ctx.moveTo(v.p0.x - xOffset, v.p0.y - yOffset);
                            ctx.lineTo(v.p1.x - xOffset, v.p1.y - yOffset);
                            ctx.arc(enPv.x - xOffset, enPv.y - yOffset, v.arcR, v.a0, v.endAngle, (diff < 0));
                            ctx.lineTo(v.p2.x - xOffset, v.p2.y - yOffset);
                            ctx.stroke();
                        }

                        // E) wander path (cached)
                        if (_things.cachedWander && _things.cachedWander.length > 1) {
                            ctx.save();
                            ctx.lineWidth = 4.5;
                            ctx.strokeStyle = "#ff004c";
                            ctx.beginPath();
                            var wi, n, sx, sy;
                            for (wi = 0; wi < _things.cachedWander.length; wi++) {
                                n = _things.cachedWander[wi];
                                sx = n.x - xOffset; sy = n.y - yOffset;
                                if (wi === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
                            }
                            ctx.stroke();
                            ctx.restore();

                            if (_things.wander && _things.wander.target) {
                                var tx = _things.wander.target.x - xOffset;
                                var ty = _things.wander.target.y - yOffset;
                                ctx.beginPath();
                                ctx.fillStyle = "#ff004c";
                                ctx.arc(tx, ty, 4, 0, Math.PI * 2);
                                ctx.fill();
                            }
                        }

                        // F) Insta-keys HUD render (uses cached metrics)
                        (function () {
                            var trap = (_things.nearTrap || _things.trap);
                            if (!trap || !player || !_things.instaHUD) return;

                            // optional stand-here ring (if you have _things.instaSpot/_instaRender elsewhere)
                            if (_things.instaSpot) {
                                var drawPos = (_things._instaRender || _things.instaSpot);
                                var sx = drawPos.x - (xOffset || 0);
                                var sy = drawPos.y - (yOffset || 0);
                                ctx.beginPath();
                                ctx.lineWidth = 3;
                                ctx.strokeStyle = "#8B4513";
                                ctx.arc(sx, sy, player.scale, 0, Math.PI * 2);
                                ctx.stroke();

                                if (_things.enemy && _things.enemy.enemy) {
                                    ctx.beginPath();
                                    ctx.lineWidth = 1.25;
                                    ctx.strokeStyle = "rgba(255,255,255,0.7)";
                                    ctx.moveTo(sx, sy);
                                    ctx.lineTo(_things.enemy.enemy.x - (xOffset || 0), _things.enemy.enemy.y - (yOffset || 0));
                                    ctx.stroke();
                                }
                            }

                            var H = _things.instaHUD;
                            var gapTxt = (H.gap == null) ? "gap: ?" : (H.gap >= 0 ? ("gap: " + H.gap.toFixed(1)) : ("overlap: " + Math.abs(H.gap).toFixed(1)));
                            var mk = function (b) { return b === null ? "?" : (b ? "✓" : "✗"); };
                            var seq = (H.plan ? (H.plan.can ? H.plan.sequence : "—") : "—");
                            var sw  = (H.plan ? (H.plan.can ? H.plan.secondarySwings : "—") : "—");
                            var ok  = (H.plan && H.plan.can && H.plan.overkill != null) ? H.plan.overkill.toFixed(1) : "—";

                            var lines = [
                                "dist " + gapTxt,
                                "reach  S:" + mk(H.reachS) + (H.widS!=null? "(#"+H.widS+")" : "") + "   P:" + mk(H.reachP) + (H.widP!=null? "(#"+H.widP+")" : ""),
                                "plan   " + seq + "  (Sx" + sw + ")  ok:" + ok
                            ];
                            if (H.reachS === false) lines.push("⚠ hammer out of range");
                            if (H.reachP === false) lines.push("⚠ primary out of range");

                            // draw card above trap
                            var bx = trap.x - (xOffset || 0);
                            var by = trap.y - (yOffset || 0) - (H.trapR + 28);
                            ctx.save();
                            ctx.font = "12px monospace";
                            var padX = 8, padY = 6, lineH = 14, i;
                            var w = 0;
                            for (i = 0; i < lines.length; i++) w = Math.max(w, ctx.measureText(lines[i]).width);
                            w += padX * 2;
                            var h = lines.length * lineH + padY * 2;
                            var x = bx - w / 2;
                            var y = by - h;

                            // local rounded rect path helper (render-only)
                            function roundRectPath(x0, y0, w0, h0, r) {
                                var p = new Path2D();
                                var rr = Math.min(r, w0 * 0.5, h0 * 0.5);
                                p.moveTo(x0 + rr, y0);
                                p.arcTo(x0 + w0, y0, x0 + w0, y0 + h0, rr);
                                p.arcTo(x0 + w0, y0 + h0, x0, y0 + h0, rr);
                                p.arcTo(x0, y0 + h0, x0, y0, rr);
                                p.arcTo(x0, y0, x0 + w0, y0, rr);
                                p.closePath();
                                return p;
                            }

                            var card = roundRectPath(x, y, w, h, 8);
                            ctx.fillStyle = "rgba(20,16,12,0.88)";
                            ctx.fill(card);
                            ctx.lineWidth = 1.5;
                            ctx.strokeStyle = "rgba(139,69,19,0.95)";
                            ctx.stroke(card);

                            for (i = 0; i < lines.length; i++) {
                                var s = lines[i];
                                var c = "#fff";
                                if (s.indexOf("out of range") !== -1) c = "#ff5c5c";
                                else if (s.indexOf("plan") === 0)     c = (H.plan && H.plan.can) ? "#6cff6c" : "#ffae00";
                                ctx.fillStyle = c;
                                ctx.fillText(s, x + padX, y + padY + (i + 0.85) * lineH);
                            }
                            ctx.restore();
                        })();
                    }
                    mainContext.globalAlpha = 1;

                    // RENDER ANIM TEXTS:
                    textManager.update(delta, mainContext, xOffset, yOffset);
                    let emojis = {
                        joy: "😂",
                        sob: "😭",
                        sus: "🤨",
                        skull: "💀",
                        kiss: "😘",
                        omg: "😲",
                        "500IQ": "🤯",
                        pls: "🥺",
                        horny: "🥵",
                        cold: "🥶",
                        cry: "😢",
                        sorry: "😓",
                        yummy: "😋",
                        angry: "😡",
                        skull: "💀",
                        dizzy: "🥴",
                        party: "🥳",
                        ez: "😎",
                        wink: "😉",
                        flushed: "😳",
                        thumbsup: "👍",
                    };
                    for (let i = 0; i < players.length; ++i) {
                        let player = players[i];
                        if (
                            player.visible &&
                            player.chatMessages &&
                            player.chatMessages.length > 0
                        ) {
                            let tmpX = player.x - xOffset;
                            let baseY = player.y - player.scale - yOffset - 90;
                            let yOffsetIncrement = 50;
                            for (let j = 0; j < player.chatMessages.length; j++) {
                                let chatObj = player.chatMessages[j];
                                let chatMessage = chatObj.message;
                                let tmpY =
                                    baseY - (player.chatMessages.length - 1 - j) * yOffsetIncrement;
                                if (Date.now() - chatObj.time > 5000) {
                                    player.chatMessages.splice(j, 1);
                                    j--;
                                    continue;
                                }
                                mainContext.font = "32px Hammersmith One";
                                let tmpSize = mainContext.measureText(chatMessage);
                                mainContext.textBaseline = "middle";
                                mainContext.textAlign = "center";
                                let tmpH = 47;
                                let tmpW = tmpSize.width + 17;
                                mainContext.fillStyle = "rgba(0,0,0,0.2)";
                                mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                                mainContext.fill();
                                mainContext.fillStyle = "#e3e3e3";
                                for (let e in emojis) {
                                    chatMessage = chatMessage.replaceAll(":" + e + ":", emojis[e]);
                                }

                                mainContext.fillText(chatMessage, tmpX, tmpY);
                            }
                        }
                    }
                    let allChats = [];
                    if (allChats.length) {
                        allChats
                            .filter((ch) => ch.active && ch.owner.isPlayer)
                            .forEach((ch) => {
                            if (!ch.alive) {
                                if (ch.alpha <= 1) {
                                    ch.alpha += delta / 250;
                                    if (ch.alpha >= 1) {
                                        ch.alpha = 1;
                                        ch.alive = true;
                                    }
                                }
                            } else {
                                ch.alpha -= delta / 5000;
                                if (ch.alpha <= 0) {
                                    ch.alpha = 0;
                                    ch.active = false;
                                }
                            }
                            if (ch.active) {
                                mainContext.font = "20px Ubuntu";
                                let tmpSize = mainContext.measureText(ch.chat);
                                mainContext.textBaseline = "middle";
                                mainContext.textAlign = "center";
                                let tmpX = ch.owner.x - xOffset;
                                let tmpY = ch.owner.y - ch.owner.scale - yOffset - 90;
                                let tmpH = 40;
                                let tmpW = tmpSize.width + 15;
                                mainContext.globalAlpha = ch.alpha;
                                mainContext.fillStyle = ch.owner.isTeam(player)
                                    ? "#8ecc51"
                                : "#cc5151";
                                mainContext.strokeStyle = "rgb(25, 25, 25)";
                                mainContext.strokeText(ch.owner.name, tmpX, tmpY - 45);
                                mainContext.fillText(ch.owner.name, tmpX, tmpY - 45);
                                mainContext.lineWidth = 5;
                                mainContext.fillStyle = "#ccc";
                                mainContext.strokeStyle = "rgb(25, 25, 25)";
                                mainContext.roundRect(
                                    tmpX - tmpW / 2,
                                    tmpY - tmpH / 2,
                                    tmpW,
                                    tmpH,
                                    6
                                );
                                mainContext.stroke();
                                mainContext.fill();
                                mainContext.fillStyle = "#fff";
                                mainContext.strokeStyle = "#000";
                                mainContext.strokeText(ch.chat, tmpX, tmpY);
                                mainContext.fillText(ch.chat, tmpX, tmpY);
                                ch.y -= delta / 100;
                            }
                        });
                    }
                    mainContext.globalAlpha = 1;
                    renderMinimap(delta);
                }
 function renderPlayer(obj, ctxt) {
                    ctxt = ctxt || mainContext;
                    ctxt.lineWidth = outlineWidth;
                    ctxt.lineJoin = "miter";
                    let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS||1);
                    let oHandAngle = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndS||1):1;
                    let oHandDist = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndD||1):1;

                    let katanaMusket = (obj == player && obj.weapons[0] == 3 && obj.weapons[1] == 15);

                    // TAIL/CAPE:
                    if (obj.tailIndex > 0) {
                        renderTail(obj.tailIndex, ctxt, obj);
                    }

                    // WEAPON BELLOW HANDS:
                    if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                        renderTool(items.weapons[katanaMusket ? 4 : obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                        if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                            renderProjectile(obj.scale, 0,
                                             items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                        }
                    }

                    // HANDS:
                    let ob=obj.sid==player.sid&&(colors[mode])||{}
                    ctxt.fillStyle = obj.sid==player.sid?colors[mode]&&(colors[mode].base)||config.skinColors[obj.skinColor]:config.skinColors[obj.skinColor];
                    renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                    renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                                 (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

                    // WEAPON ABOVE HANDS:
                    if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                        renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                        if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                            renderProjectile(obj.scale, 0,
                                             items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                        }
                    }

                    // BUILD ITEM:
                    if (obj.buildIndex >= 0) {
                        var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
                        ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
                    }

                    // BODY:
                    // SKIN:
                    let didrender=false;
                    if(ob.goUnder&&false)
                        if (obj.skinIndex > 0) {
                            didrender=true
                            ctxt.rotate(Math.PI/2);
                            renderSkin(obj.skinIndex, ctxt, null, obj);
                        }
                    let oldSS=ctxt.strokeStyle
                    ctxt.strokeStyle=ob.outline
                    renderCircle(0, 0, obj.scale, ctxt);
                    ctxt.strokeStyle=oldSS
                    if(!didrender)
                        if (obj.skinIndex > 0) {
                            didrender=true
                            ctxt.rotate(Math.PI/2);
                            renderSkin(obj.skinIndex, ctxt, null, obj);
                        }

                }
 function renderDeadPlayer(obj, ctxt) {
                    ctxt = ctxt || mainContext;
                    ctxt.lineWidth = outlineWidth;
                    ctxt.lineJoin = "miter";
                    let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS||1);
                    let oHandAngle = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndS||1):1;
                    let oHandDist = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndD||1):1;

                    // WEAPON BELLOW HANDS:
                    if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                        renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                        if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                            renderProjectile(obj.scale, 0,
                                             items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                        }
                    }

                    // HANDS:
                    ctxt.fillStyle = config.skinColors[obj.skinColor];
                    renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                    renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                                 (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

                    // WEAPON ABOVE HANDS:
                    if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                        renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                        if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                            renderProjectile(obj.scale, 0,
                                             items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                        }
                    }

                    // BUILD ITEM:
                    if (obj.buildIndex >= 0) {
                        var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
                        ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
                    }

                    // BODY:
                    renderCircle(0, 0, obj.scale, ctxt);

                    ctxt.lineWidth = 2;
                    ctxt.fillStyle = "#555";
                    ctxt.font = "35px Hammersmith One";
                    ctxt.textBaseline = "middle";
                    ctxt.textAlign = "center";

                    ctxt.fillText("(", 20, 5);

                    ctxt.rotate(Math.PI / 2);
                    ctxt.font = "30px Hammersmith One";
                    ctxt.fillText("E", -15, 15/2);
                    ctxt.fillText("Z", 15, 15/2);

                }
function renderPlayers(xOffset, yOffset, zIndex) {
                    mainContext.globalAlpha = playerglobalAlpha
                    mainContext.fillStyle = "#91b2db";
                    for (let i = 0; i < players.length; i++) {
                        const tmpObj = players[i];
                        if (tmpObj.zIndex !== zIndex) continue;

                        tmpObj.animate(delta);
                        GM_setValue(tmpObj.sid,tmpObj.visible?tmpObj.tmpObj:null)
                        if (!tmpObj.visible) continue;
                        tmpObj.skinRot += 0.002 * delta;
                        const tmpDir = (!configs.showDir && !useWasd && tmpObj === player)
                        ? (configs.attackDir ? getVisualDir() : getSafeDir())
                        : (tmpObj.dir || 0);

                        mainContext.save();
                        mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                        mainContext.rotate(tmpDir + tmpObj.dirPlus);
                        renderPlayer(tmpObj, mainContext);
                        mainContext.restore();

                        // ─── Now draw for every other player ───
                        if (tmpObj !== player&&isEnemyPlayer(tmpObj)) {
                            drawEnemyLowHealth(mainContext, tmpObj, xOffset, yOffset);
                            drawDamageIndicator(mainContext, tmpObj, xOffset, yOffset);
                            drawInstaZone(mainContext, tmpObj, xOffset, yOffset);
                        }
                    }
                }
function renderBiomeOutlines(xOffset, yOffset, ctx, style = {}) {
                    const S = (style.biomeOutlines || {});
                    if (S.enabled === false) return;

                    const lineW = S.width ?? 2;
                    const alpha = S.alpha ?? 0.15;
                    const colSG = (S.colors && S.colors.snowGrass) || S.color || "#FFFFFF";
                    const colGD = (S.colors && S.colors.grassDesert) || S.color || "#FFFFFF";
                    const dash  = S.dash || [8, 6];

                    // screen-space Y positions for the two biome seams:
                    // - snow/grass seam: config.snowBiomeTop
                    // - grass/desert seam: config.mapScale - config.snowBiomeTop
                    const ySG = Math.round(config.snowBiomeTop - yOffset) + 0.5;                         // snow/grass
                    const yGD = Math.round((config.mapScale - config.snowBiomeTop) - yOffset) + 0.5;     // grass/desert

                    ctx.save();
                    ctx.lineWidth = lineW;
                    ctx.setLineDash(dash);
                    ctx.globalAlpha = alpha;

                    // Optional shadow for contrast on dark maps
                    if (S.shadowBlur) {
                        ctx.shadowBlur = S.shadowBlur;
                        ctx.shadowColor = S.shadowColor || "rgba(0,0,0,0.7)";
                    }

                    // draw a line only if it’s on screen
                    const drawHLine = (y, color) => {
                        if (y >= 0 && y <= maxScreenHeight) {
                            ctx.beginPath();
                            ctx.strokeStyle = color;
                            ctx.moveTo(0, y);
                            ctx.lineTo(maxScreenWidth, y);
                            ctx.stroke();
                        }
                    };

                    drawHLine(ySG, colSG);
                    drawHLine(yGD, colGD);

                    ctx.restore();
                }

                function renderDeadPlayers(xOffset, yOffset) {
                    mainContext.fillStyle = "#91b2db";
                    const currentTime = Date.now();
                    deadPlayers.filter(dead => dead.active).forEach((dead) => {
                        if (!dead.startTime) {
                            dead.startTime = currentTime;
                            dead.angle = 0;
                            dead.radius = 0.1;
                            dead.fallSpeed = 0.5;
                        }
                        const timeElapsed = currentTime - dead.startTime;
                        const maxAlpha = 1;
                        dead.alpha = Math.max(0, maxAlpha - (timeElapsed / 3000));
                        dead.animate(delta);
                        mainContext.globalAlpha = dead.alpha;
                        mainContext.strokeStyle = outlineColor;
                        mainContext.save();
                        mainContext.translate(dead.x - xOffset, dead.y - yOffset);
                        dead.fallSpeed += 0.05;
                        dead.y += dead.fallSpeed;
                        dead.angle += 0.05;
                        mainContext.rotate(dead.angle);
                        renderDeadPlayer(dead, mainContext);
                        mainContext.restore();
                        mainContext.fillStyle = "#91b2db";
                        if (timeElapsed >= 3000) {
                            dead.active = false;
                            dead.startTime = null;
                        }
                    });
                }

                // RENDER PLAYERS:
                damageIndicatorFontSize = 30; // px — change this in the console


                // ───────── Helper draw functions (same as before) ─────────
                const drawEnemyLowHealth = (ctx, e, xOffset, yOffset) => {
                    const lowHealthThreshold = 30;
                    if (!(e && e.health != null && e.maxHealth != null) || e.health > lowHealthThreshold) return;
                    const radius = (e.getScale ? e.getScale() : e.scale) || 30;
                    const x = e.x - xOffset, y = e.y - yOffset;
                    ctx.save();
                    ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
                    ctx.lineWidth = 3;
                    ctx.beginPath(); ctx.arc(x, y, radius + 10, 0, Math.PI * 2); ctx.stroke();
                    ctx.restore();
                };

                let instaRingTime = 0;
                const drawDamageIndicator = (ctx, e, xOffset, yOffset) => {
                    const dmg = e?.damageThreat;
                    if (!(dmg > 0)) return;
                    const radius = e.scale || 20;
                    const x = e.x - xOffset, y = e.y - yOffset - (radius + 10);
                    const maxDmg = 100;
                    const clamped = Math.min(dmg, maxDmg);
                    const ratio = clamped / maxDmg;
                    const r = Math.floor(ratio * 255);
                    const g = Math.floor((1 - ratio) * 255);
                    const text = dmg >= 101 ? "INSTA" : `–${Math.round(dmg)}`;
                    ctx.save();
                    ctx.globalAlpha = 1;
                    ctx.fillStyle = `rgba(${r}, ${g}, 0, 0.9)`;
                    ctx.font = `bold ${window.damageIndicatorFontSize || 16}px Arial`;
                    ctx.textAlign = "center";
                    ctx.fillText(text, x, y);
                    ctx.restore();
                    ctx.globalAlpha = playerglobalAlpha;
                };



                const drawInstaZone = (ctx, e, xOffset, yOffset) => {
                    if (!e || !(e.damageThreat >= 101)) return;
                    const x = e.x - xOffset, y = e.y - yOffset;

                    // weapon range if available; else 0
                    const wId0 = Array.isArray(e.weapons) ? e.weapons[0] : null;
                    const w0   = (Number.isInteger(wId0) && items?.weapons?.[wId0]) ? items.weapons[wId0] : null;
                    const wRange = w0?.range || 0;

                    const baseRadius = (e.scale || 20) + 10;
                    const pulse = Math.sin(instaRingTime * 4) * 4;
                    const radius = baseRadius + pulse + wRange;
                    const glowAlpha = 0.4 + (Math.sin(instaRingTime * 4) + 1) * 0.3;

                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(255, 0, 0, ${glowAlpha.toFixed(2)})`;
                    ctx.lineWidth = 4 + pulse * 0.2;
                    ctx.shadowColor = `rgba(255, 0, 0, ${glowAlpha.toFixed(2)})`;
                    ctx.shadowBlur = 20 + pulse * 1.5;
                    ctx.stroke();
                    ctx.restore();
                };

                function isEnemyPlayer(targetPlayer) {
                    if (!targetPlayer || !player) return false;
                    if(!player.team)return true
                    // Check for same SID or same encoded team
                    const sameSID = targetPlayer.sid === player.sid;
                    const sameTeam = targetPlayer.team === player.team;

                    return !(sameSID || sameTeam);
                }
