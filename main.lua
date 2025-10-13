--[[
    RevampLua.lua
    This refactor wraps the legacy Miner's Haven automation script in a single file
    while organizing key helpers into logical buckets exposed through the `Revamp` table.
    The original behaviour is preserved, but consumers can now access focused modules such
    as `Revamp.Utilities`, `Revamp.Pathing`, `Revamp.Combat`, etc. for easier extension.
    AutoRebirth helpers initialise after the corresponding UI button runs; until then the
    exported stubs raise a descriptive error so you know the setup step is pending.
]]

local Revamp = {
    Utilities = {},
    Pathing = {},
    Combat = {},
    Farming = {},
    Inventory = {},
    Data = {
        SafeZones = {}
    },
    UI = {},
    Logging = {},
    Services = {},
    State = {}
}

local remoteSpy = {active = false}

function remoteSpy.start()
    warn("[Revamp] Remote spy disabled (proxy removed).")
    remoteSpy.active = false
    return false
end

function remoteSpy.stop()
    remoteSpy.active = false
    return true
end

local inboundSpy = {active = false}

function inboundSpy.start()
    warn("[Revamp] Inbound spy disabled (proxy removed).")
    inboundSpy.active = false
    return false
end

function inboundSpy.stop()
    inboundSpy.active = false
    return true
end

Revamp.State.remoteSpy = remoteSpy.active
Revamp.State.inboundSpy = inboundSpy.active

local function teamCheck(name)
    local localPlayer = game.Players.LocalPlayer
    local playerTeam = nil

    for _, team in pairs(workspace.Teams:GetChildren()) do
        if team:FindFirstChild(localPlayer.Name) then
            playerTeam = team
            break
        end
    end

    if not playerTeam then
        return false
    end

    return playerTeam:FindFirstChild(name) ~= nil
end

Revamp.Utilities.teamCheck = teamCheck

local function findClosestPlayer()
    local players = game.Players:GetPlayers()
    local localPlayer = game.Players.LocalPlayer
    local localCharacter = localPlayer.Character
    if not localCharacter or not localCharacter.PrimaryPart then return nil end

    local localPosition = localCharacter.PrimaryPart.Position
    local closestPlayer = nil
    local closestDistance = math.huge

    for _, player in pairs(players) do
        if player ~= localPlayer then
            local character = player.Character
            if character and character:FindFirstChild("Humanoid") and character.Humanoid.Health > 0 then
                local primaryPart = character.PrimaryPart
                if primaryPart then
                    local distance = (localPosition - primaryPart.Position).Magnitude
                    if distance < closestDistance and not teamCheck(player.Name) then
                        closestPlayer = player
                        closestDistance = distance
                    end
                end
            end
        end
    end

    return closestPlayer
end

Revamp.Utilities.findClosestPlayer = findClosestPlayer

print("Starting up")
--loadstring(game:HttpGet("https://raw.githubusercontent.com/naquangaston/HostedFiles/main/myscript.lua"))()
local incDMG_=100
local justDied=false
local prefixes = loadstring(game:HttpGet("https://raw.githubusercontent.com/gaston1799/HostedFiles/refs/heads/main/table.lua"))()


Revamp.Data.prefixes = prefixes

-- Safe-zone rectangle for AutoPVP/Kill Aura (X/Z only). Update with your captures.
local SafeZonePolygon = {
    Vector2.new(-47.553, 585.940),
    Vector2.new(-277.322, 672.467),
    Vector2.new(-344.602, 483.516),
    Vector2.new(-114.346, 401.818)
}

Revamp.Data.SafeZone = {polygon = SafeZonePolygon}

local MANTIS_ZONE_POLYGON = {
    Vector2.new(591.384, -16412.795),
    Vector2.new(-481.543, -16411.883),
    Vector2.new(429.424, -17475.959),
    Vector2.new(593.891, -16411.883)
}
local MANTIS_TELEPORT_ENTRY = Vector3.new(200.921, 708.134, -16601.699)
local MANTIS_RETURN_POSITION = Vector3.new(67.475, 641.687, 476.413)
local MANTIS_INSIDE_POSITION = Vector3.new(283.289, 660.560, -16678.158)
Revamp.Data.Teleporters = Teleporters

--Miner's Haven
local FetchItemModule
local TycoonBase
local MyTycoon
local MoneyLibary
local players
local self
local char
local root
local mouse
local value
local followEm

local userInputService = game:GetService("UserInputService")
local player = game:GetService("Players").LocalPlayer
local humanoid = nil
local LegitPathing = false
local pathfindingComplete = false

local function getItem(name)
    local success, result =
        pcall(function()
            return game.ReplicatedStorage.Items[name]
        end)
    if success then
        return result
    end
    warn("Failed to find item:", name, result)
    return nil
end

local function GetDistanceBetweenCFrame(cframe1, cframe2)
    local position1 = cframe1.Position
    local position2 = cframe2.Position
    return (position1 - position2).Magnitude
end

local function ShopItems()
    for _, possible in pairs(getgc(true)) do
        if type(possible) == "table" and rawget(possible, "Miscs") then
            return possible["All"]
        end
    end
    return {}
end

local function HasItem(Needed, count)
    local owned = game:GetService("ReplicatedStorage").HasItem:InvokeServer(Needed) or 0
    if count then
        return owned
    end
    return owned > 0
end

local function IsShopItem(Needed)
    for _, shopEntry in pairs(ShopItems()) do
        if tonumber(shopEntry.ItemId.Value) == tonumber(Needed) then
            return true
        end
    end
    return false
end

local function ItemPlaced(obj)
    local ok =
        pcall(function()
            return obj.name or obj.id
        end)
    if not ok then
        return false
    end
    if not MyTycoon then
        return false
    end
    for _, item in MyTycoon:GetChildren() do
        if item.ItemId.Value == obj.id or item.name == obj.Name then
            return true
        end
    end
    return false
end

local function uninitialisedHelper(name)
    return function()
        error(("RevampLua helper '%s' is not initialised yet. Run the AutoRebirth setup first."):format(name))
    end
end

local goTo = uninitialisedHelper("goTo")
local goBack = uninitialisedHelper("goBack")
local loadLayouts = uninitialisedHelper("loadLayouts")
local farmRebirth = uninitialisedHelper("farmRebirth")
local hasCat = uninitialisedHelper("hasCat")

local autoJump = false
local autoFight = false
local autoEatEnabled = false
local autoEatTask = nil
local AUTO_FOOD_NAME = "Food"
local AUTO_FOOD_COOLDOWN = 2
local autoZoneEnabled = false
local autoZoneTask = nil
local AUTO_ZONE_POLL_RATE = 0.3
local autoZoneBaseCF = nil
local startAutoZoneLoop
local stopAutoZoneLoop
local autoZoneCancelToken = 0
local autoFlightChaseEnabled = false
local autoFlightChaseTask = nil
local AUTO_FLIGHT_POLL_RATE = 0.1
local autoFireballEnabled = false
local autoFireballTask = nil
local AUTO_FIREBALL_INTERVAL = 0.4
local FIREBALL_TOOL_NAMES = {
    fireball = true,
    lightningball = true
}
local updateChaseDebug
local PATH_DYNAMIC_TRIGGER = 300
local PATH_DYNAMIC_REPATH_DISTANCE = 18
local PATH_DYNAMIC_ARRIVAL_DISTANCE = 140
local PATH_DYNAMIC_MAX_ITERATIONS = 12
local Teleporters = {}
local mantisTeleportActive = false
local mantisTeleportReturnCF = nil
local returningHome = false
local returnHomeCF = nil
local returnMoveToken = 0
local finding = false
local done_ = true
local legitCoin = true
local attacking_ = false
local PathfindingService = game:GetService("PathfindingService")
local RunService = game:GetService("RunService")
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local DamageRemote = ReplicatedStorage:FindFirstChild("jdskhfsIIIllliiIIIdchgdIiIIIlIlIli", true)

-- Lightweight combat debug UI that floats above other players showing hit estimates and HP
local function trimTrailingZeros(numberString)
    local integer, fractional = numberString:match("^(%-?%d+)%.(%d+)$")
    if not integer then
        return numberString
    end
    fractional = fractional:gsub("0+$", "")
    if fractional == "" then
        return integer
    end
    return integer .. "." .. fractional
end

local function formatCombatNumber(value)
    local number = tonumber(value)
    if not number then
        return value ~= nil and tostring(value) or "?"
    end
    local absNumber = math.abs(number)
    local chosenPrefix = prefixes[1]
    for index = #prefixes, 1, -1 do
        local candidate = prefixes[index]
        if absNumber >= candidate.number then
            chosenPrefix = candidate
            break
        end
    end
    local scaled = number / chosenPrefix.number
    local formatted
    if absNumber < 1 then
        formatted = string.format("%.2f", scaled)
    elseif math.abs(scaled) >= 100 then
        formatted = string.format("%.0f", scaled)
    elseif math.abs(scaled) >= 10 then
        formatted = string.format("%.1f", scaled)
    else
        formatted = string.format("%.2f", scaled)
    end
    formatted = trimTrailingZeros(formatted)
    if formatted == "-0" then
        formatted = "0"
    end
    if chosenPrefix.prefix ~= "" then
        formatted = formatted .. chosenPrefix.prefix
    end
    return formatted
end

local function getPlayerLevel(player)
    if not player then
        return nil
    end
    local stats = player:FindFirstChild("leaderstats")
    if not stats then
        return nil
    end
    local levelValue = stats:FindFirstChild("Level") or stats:FindFirstChild("level")
    if not levelValue then
        return nil
    end
    return tonumber(levelValue.Value)
end

local function getPlayerHumanoid(player)
    local character = player and player.Character
    if not character then
        return nil
    end
    return character:FindFirstChildOfClass("Humanoid")
end

local function getCharacterHealth(player)
    local humanoid = getPlayerHumanoid(player)
    if humanoid then
        local current = humanoid.Health
        local max = humanoid.MaxHealth
        if max <= 0 then
            max = current
        end
        return current, math.max(current, max)
    end
    local level = getPlayerLevel(player)
    if level then
        local estimated = level * 20
        return estimated, estimated
    end
    return nil, nil
end

local DAMAGE_STAT_NAMES = {"Damage", "damage", "DMG", "Dmg"}

local function estimatePlayerDamage(player)
    if not player then
        return nil
    end
    local stats = player:FindFirstChild("leaderstats")
    if stats then
        for _, name in ipairs(DAMAGE_STAT_NAMES) do
            local stat = stats:FindFirstChild(name)
            if stat then
                local value = tonumber(stat.Value)
                if value then
                    return value
                end
            end
        end
    end
    local level = getPlayerLevel(player)
    if level then
        return level * 2
    end
    local _, maxHealth = getCharacterHealth(player)
    if maxHealth and maxHealth > 0 then
        return maxHealth / 10
    end
    return nil
end

local function computeHitCount(health, damage)
    if not health or health <= 0 or not damage or damage <= 0 then
        return "?"
    end
    local hits = math.ceil(health / damage)
    if hits < 1 then
        hits = 1
    end
    return tostring(hits)
end

local OVERHEAD_UPDATE_INTERVAL = 0.2
local DEBUG_TAG_NAME = "RevampHitsDebug"
local OverheadEntries = {}
local OverheadConnections = {}
local overheadUpdateAccumulator = 0
local DEFAULT_OVERHEAD_TEXT = "HitsTPlayer: ?\nHitsTThem: ?\nHP: ?"

local function destroyPlayerGui(player)
    local entry = OverheadEntries[player]
    if entry then
        if entry.gui then
            entry.gui:Destroy()
        end
        OverheadEntries[player] = nil
    end
end

local function stopTrackingPlayer(player)
    destroyPlayerGui(player)
    local connections = OverheadConnections[player]
    if connections then
        for _, connection in pairs(connections) do
            if typeof(connection) == "RBXScriptConnection" then
                connection:Disconnect()
            end
        end
        OverheadConnections[player] = nil
    end
end

local function createGuiForCharacter(player, character)
    if player == Players.LocalPlayer then
        return
    end
    if not character then
        return
    end
    destroyPlayerGui(player)
    local adornee = character:FindFirstChild("Head") or character:FindFirstChild("HumanoidRootPart")
    if not adornee then
        local ok, result = pcall(function()
            return character:WaitForChild("Head", 2)
        end)
        if ok then
            adornee = result
        end
    end
    if not adornee then
        local ok, result = pcall(function()
            return character:WaitForChild("HumanoidRootPart", 2)
        end)
        if ok then
            adornee = result
        end
    end
    if not adornee then
        return
    end
    local existing = adornee:FindFirstChild(DEBUG_TAG_NAME)
    if existing then
        existing:Destroy()
    end
    local billboard = Instance.new("BillboardGui")
    billboard.Name = DEBUG_TAG_NAME
    billboard.AlwaysOnTop = true
    billboard.Size = UDim2.new(0, 220, 0, 80)
    billboard.StudsOffsetWorldSpace = Vector3.new(0, 4.5, 0)
    billboard.MaxDistance = 600
    billboard.ResetOnSpawn = false
    billboard.LightInfluence = 0
    billboard.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
    billboard.Adornee = adornee
    billboard.Parent = adornee

    local textLabel = Instance.new("TextLabel")
    textLabel.Name = "Info"
    textLabel.BackgroundTransparency = 1
    textLabel.Size = UDim2.new(1, -8, 1, -8)
    textLabel.Position = UDim2.new(0, 4, 0, 4)
    textLabel.Font = Enum.Font.SourceSansBold
    textLabel.TextSize = 16
    textLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
    textLabel.TextStrokeTransparency = 0.5
    textLabel.TextWrapped = true
    textLabel.TextXAlignment = Enum.TextXAlignment.Left
    textLabel.TextYAlignment = Enum.TextYAlignment.Top
    textLabel.Text = DEFAULT_OVERHEAD_TEXT
    textLabel.Parent = billboard

    OverheadEntries[player] = {
        gui = billboard,
        label = textLabel
    }
end

local function computeOverheadText(player)
    local localPlayer = Players.LocalPlayer
    if not localPlayer then
        return DEFAULT_OVERHEAD_TEXT
    end

    local localHealth, localMaxHealth = getCharacterHealth(localPlayer)
    local enemyHealth, enemyMaxHealth = getCharacterHealth(player)
    local enemyDamage = estimatePlayerDamage(player)
    local localDamage = estimatePlayerDamage(localPlayer)

    local hitsToKillYou = computeHitCount(localMaxHealth or localHealth, enemyDamage)
    local hitsToKillEnemy = computeHitCount(enemyMaxHealth or enemyHealth, localDamage)
    local hpValue = enemyHealth or enemyMaxHealth
    local hpText = hpValue and formatCombatNumber(hpValue) or "?"

    return string.format("HitsTPlayer: %s\nHitsTThem: %s\nHP: %s", hitsToKillYou, hitsToKillEnemy, hpText)
end

local function trackPlayer(player)
    if player == Players.LocalPlayer then
        return
    end

    stopTrackingPlayer(player)

    local connections = {}
    connections.characterAdded =
        player.CharacterAdded:Connect(function(character)
        task.spawn(function()
            createGuiForCharacter(player, character)
        end)
    end)
    connections.characterRemoving =
        player.CharacterRemoving:Connect(function()
        destroyPlayerGui(player)
    end)
    OverheadConnections[player] = connections

    if player.Character then
        task.spawn(function()
            createGuiForCharacter(player, player.Character)
        end)
    end
end

RunService.Heartbeat:Connect(function(dt)
    if next(OverheadEntries) == nil then
        overheadUpdateAccumulator = 0
        return
    end

    overheadUpdateAccumulator = overheadUpdateAccumulator + dt
    if overheadUpdateAccumulator < OVERHEAD_UPDATE_INTERVAL then
        return
    end
    overheadUpdateAccumulator = 0

    local toCleanup = {}
    for player, entry in pairs(OverheadEntries) do
        if not player.Parent then
            table.insert(toCleanup, player)
        elseif not entry.gui or not entry.gui.Parent then
            table.insert(toCleanup, player)
        else
            entry.label.Text = computeOverheadText(player)
        end
    end
    for _, player in ipairs(toCleanup) do
        stopTrackingPlayer(player)
    end
end)

for _, otherPlayer in ipairs(Players:GetPlayers()) do
    task.spawn(function()
        trackPlayer(otherPlayer)
    end)
end

Players.PlayerAdded:Connect(function(player)
    task.spawn(function()
        trackPlayer(player)
    end)
end)
Players.PlayerRemoving:Connect(stopTrackingPlayer)

local selectedPlayerName = "" -- Variable to store the name of the selected player
local selectedPlayer  -- Variable to store the instance of the selected player
local maxDistance = 10 -- Maximum distance to stay near the selected player

-- Function to predict future position of a player based on velocity
local function PredictPlayerPosition(player, deltaTime)
    local character = player and player.Character
    if not character then
        return nil
    end

    local root = character:FindFirstChild("HumanoidRootPart")
    if not root then
        return nil
    end

    deltaTime = deltaTime or 0.2
    local velocity = root.AssemblyLinearVelocity or root.Velocity or Vector3.zero
    return root.Position + velocity * deltaTime
end

local function teleportInFrontOfPlayer(targetPlayerName)
    local player = game.Players.LocalPlayer
    local targetPlayer = game.Players:FindFirstChild(targetPlayerName)

    if targetPlayer then
        local targetCharacter = targetPlayer.Character
        local targetHumanoid = targetCharacter and targetCharacter:FindFirstChild("Humanoid")

        if targetCharacter and targetHumanoid then
            local targetVelocity = targetCharacter.PrimaryPart.Velocity
            local predictedPosition = targetCharacter.PrimaryPart.Position + targetVelocity

            player.Character:SetPrimaryPartCFrame(CFrame.new(predictedPosition))
        end
    end
end

local function increaseByPercentage(number, percentage)
    number = tonumber(number)
    percentage = tonumber(percentage)

    if not number or not percentage then
        error("Both arguments must be valid numbers.")
    end

    if percentage < 0 then
        error("Percentage should be a positive value.")
    end

    local increaseAmount = number * (percentage / 100)
    local result = number + increaseAmount

    return result
end
local pathfindingService = game:GetService("PathfindingService")

local function getPathToPosition(targetPosition, humanoid)
    local startPosition = humanoid.RootPart.Position
    local path = pathfindingService:CreatePath({
        AgentRadius = humanoid.HipHeight / 2,
        AgentHeight = humanoid.HipHeight,
        AgentCanJump = true,
        AgentJumpHeight = humanoid.JumpHeight,
        AgentMaxSlope = humanoid.MaxSlopeAngle,
        AgentMaxStepHeight = humanoid.HipHeight,
    })
    path:ComputeAsync(startPosition, targetPosition)
    return path
end
local function moveToTarget(target, humanoid, options)
    options = options or {}
    local player = game.Players.LocalPlayer
    humanoid = humanoid or player.Character:WaitForChild("Humanoid")

    local targetPosition = target

    if typeof(target) == "CFrame" then
        targetPosition = target.Position
    elseif typeof(target) ~= "Vector3" then
        warn("Invalid target type. Expected CFrame or Vector3.")
        return
    end

    local path = getPathToPosition(targetPosition, humanoid)
    local waypoints = path:GetWaypoints()
    local currentWaypointIndex = 1
    local defaultDistance

    local cancelCheck = options.cancelled
    local function isCancelled()
        return cancelCheck and cancelCheck()
    end

    local function moveToFinished()
        humanoid.MoveToFinished:Wait()
    end

    while currentWaypointIndex <= #waypoints do
        if isCancelled() or attacking_ or justDied then
            humanoid:Move(Vector3.new())
            break
        end
        local currentWaypoint = waypoints[currentWaypointIndex]

        if currentWaypointIndex == 1 then
            humanoid:MoveTo(currentWaypoint.Position)
            moveToFinished()
            wait(1)
            defaultDistance = (currentWaypoint.Position - humanoid.RootPart.Position).Magnitude
            print("defaultDistance:",defaultDistance)
        else
            local distanceToWaypoint = (currentWaypoint.Position - humanoid.RootPart.Position).Magnitude
            if currentWaypoint.Action == Enum.PathWaypointAction.Jump then
                humanoid.Jump=true
            end
            while (distanceToWaypoint-3) > (defaultDistance or 5) do
                if isCancelled() or attacking_ or justDied then
                    humanoid:Move(Vector3.new())
                    break
                end
                humanoid:MoveTo(currentWaypoint.Position)
                moveToFinished()
                distanceToWaypoint = (currentWaypoint.Position - humanoid.RootPart.Position).Magnitude
                wait(0) -- Adjust the delay as needed
            end
        end

        currentWaypointIndex = currentWaypointIndex + 1
    end
    return currentWaypointIndex > #waypoints
end

local function getHumanoidRootPart(h)
    if not h then
        return nil
    end
    return h.RootPart or (h.Parent and h.Parent:FindFirstChild("HumanoidRootPart"))
end

local function followDynamicTarget(targetPlayer, humanoid, options)
    options = options or {}
    humanoid = humanoid or (player.Character and player.Character:FindFirstChildOfClass("Humanoid"))
    if not humanoid then
        return false
    end
    local function shouldAbort()
        return (options.cancelled and options.cancelled()) or false
    end
    local arrivalDistance = options.arrivalDistance or PATH_DYNAMIC_ARRIVAL_DISTANCE
    local repathDistance = options.repathDistance or PATH_DYNAMIC_REPATH_DISTANCE
    local maxIterations = options.maxIterations or PATH_DYNAMIC_MAX_ITERATIONS
    local path =
        pathfindingService:CreatePath({
        AgentRadius = humanoid.HipHeight / 2,
        AgentHeight = humanoid.HipHeight,
        AgentCanJump = true,
        AgentJumpHeight = humanoid.JumpHeight,
        AgentMaxSlope = humanoid.MaxSlopeAngle,
        AgentMaxStepHeight = humanoid.HipHeight
    })
    local lastGoal = nil
    local iterations = 0
    local originalFinding = finding
    finding = true
    local reachedGoal = false

    local success, err =
        pcall(function()
        while iterations < maxIterations do
            if shouldAbort() then
                return
            end
            local targetCharacter = targetPlayer.Character
            local targetRoot = targetCharacter and targetCharacter:FindFirstChild("HumanoidRootPart")
            if not targetRoot then
                return
            end
            local rootPart = getHumanoidRootPart(humanoid)
            if not rootPart then
                return
            end
            local currentDistance = (targetRoot.Position - rootPart.Position).Magnitude
            if currentDistance <= arrivalDistance then
                reachedGoal = true
                return
            end

            local needRepath = false
            if not lastGoal then
                needRepath = true
            else
                local delta = (targetRoot.Position - lastGoal).Magnitude
                if delta >= repathDistance then
                    needRepath = true
                end
            end

            if needRepath then
                path:ComputeAsync(rootPart.Position, targetRoot.Position)
                lastGoal = targetRoot.Position
                iterations = iterations + 1
            end

            if path.Status ~= Enum.PathStatus.Success then
                return
            end

            local waypoints = path:GetWaypoints()
            for index = 2, #waypoints do
                if shouldAbort() then
                    humanoid:Move(Vector3.new())
                    return
                end
                local waypoint = waypoints[index]
                humanoid:MoveTo(waypoint.Position)
                if waypoint.Action == Enum.PathWaypointAction.Jump then
                    humanoid.Jump = true
                end
                local reached = humanoid.MoveToFinished:Wait()
                if not reached then
                    break
                end

                rootPart = getHumanoidRootPart(humanoid)
                targetCharacter = targetPlayer.Character
                targetRoot = targetCharacter and targetCharacter:FindFirstChild("HumanoidRootPart")
                if not rootPart or not targetRoot then
                    return
                end
                currentDistance = (targetRoot.Position - rootPart.Position).Magnitude
                if currentDistance <= arrivalDistance then
                    reachedGoal = true
                    humanoid:Move(Vector3.new())
                    return
                end
                if (targetRoot.Position - lastGoal).Magnitude >= repathDistance then
                    break
                end
            end
        end
    end)

    if not success then
        warn("[Revamp] followDynamicTarget error:", err)
    end

    finding = originalFinding
    humanoid:Move(Vector3.new())
    return reachedGoal
end

local function coerceVector3(value)
    if typeof(value) == "Vector3" then
        return value
    end
    if typeof(value) == "CFrame" then
        return value.Position
    end
    if typeof(value) == "Instance" and value:IsA("BasePart") then
        return value.Position
    end
    return nil
end

local function waitWithCancel(duration, cancelled)
    local deadline = os.clock() + duration
    while os.clock() < deadline do
        if cancelled and cancelled() then
            return false
        end
        task.wait(0.05)
    end
    return true
end

local function registerTeleporter(name, config)
    if typeof(name) ~= "string" then
        warn("[Revamp] registerTeleporter expects string name")
        return false
    end
    config = config or {}
    local entry = coerceVector3(config.entry or config.touch or config.position or config.from)
    local destination = coerceVector3(config.destination or config.exit or config.target or config.to)
    if not entry or not destination then
        warn(string.format("[Revamp] Teleporter '%s' missing entry or destination vector", name))
        return false
    end
    Teleporters[name] = {
        entry = entry,
        destination = destination,
        waitTime = config.waitTime or 0.75,
        arrivalRadius = config.arrivalRadius or 12,
        penalty = config.penalty or 40,
        enabled = config.enabled ~= false,
        maxEntryDistance = config.maxEntryDistance,
        minDirectDistance = config.minDirectDistance or (PATH_DYNAMIC_TRIGGER + 30),
        snapOnFail = config.snapOnFail ~= false,
        cooldown = config.cooldown or 0,
        lastUsed = 0,
        description = config.description,
        postDelay = config.postDelay or 0
    }
    return true
end

local function unregisterTeleporter(name)
    if Teleporters[name] then
        Teleporters[name] = nil
        return true
    end
    return false
end

local function clearTeleporters()
    table.clear(Teleporters)
end

local function useTeleporter(name, humanoid, options)
    local tele = Teleporters[name]
    if not tele or not tele.enabled then
        return false
    end
    humanoid = humanoid or (player.Character and player.Character:FindFirstChildOfClass("Humanoid"))
    if not humanoid then
        return false
    end
    if tele.cooldown > 0 and (os.clock() - tele.lastUsed) < tele.cooldown then
        return false
    end
    local cancelled = options and options.cancelled
    local reachedEntry = moveToTarget(tele.entry, humanoid, {cancelled = cancelled})
    if not reachedEntry then
        return false
    end
    if not waitWithCancel(tele.waitTime, cancelled) then
        return false
    end
    local rootPart = getHumanoidRootPart(humanoid)
    if not rootPart then
        return false
    end
    if (rootPart.Position - tele.destination).Magnitude > tele.arrivalRadius then
        if tele.snapOnFail then
            local ok = pcall(function()
                rootPart.CFrame = CFrame.new(tele.destination)
            end)
            if not ok then
                return false
            end
        else
            return false
        end
    end
    if tele.postDelay > 0 then
        if not waitWithCancel(tele.postDelay, cancelled) then
            return false
        end
    end
    tele.lastUsed = os.clock()
    return true
end

local function selectTeleportRoute(currentPos, targetPos, directDistance, options)
    local bestName
    local bestData
    local bestCost
    local now = os.clock()
    local margin = options and options.margin or 30
    for name, tele in pairs(Teleporters) do
        if tele.enabled then
            local passesMin = not tele.minDirectDistance or directDistance >= tele.minDirectDistance
            local passesCooldown = not (tele.cooldown and tele.cooldown > 0 and (now - tele.lastUsed) < tele.cooldown)
            if passesMin and passesCooldown then
                local distToEntry = (tele.entry - currentPos).Magnitude
                local withinEntry = not tele.maxEntryDistance or distToEntry <= tele.maxEntryDistance
                if withinEntry then
                    local distFromExit = (targetPos - tele.destination).Magnitude
                    local totalCost = distToEntry + distFromExit + (tele.penalty or 0)
                    if (not bestCost or totalCost < bestCost) and totalCost < directDistance - margin then
                        bestName = name
                        bestData = tele
                        bestCost = totalCost
                    end
                end
            end
        end
    end
    return bestName, bestData
end

local function tryTeleportRoute(humanoid, targetPosition, options)
    humanoid = humanoid or (player.Character and player.Character:FindFirstChildOfClass("Humanoid"))
    if not humanoid then
        return false
    end
    local rootPart = getHumanoidRootPart(humanoid)
    if not rootPart then
        return false
    end
    local directDistance = (targetPosition - rootPart.Position).Magnitude
    local name = nil
    local tele = nil
    name, tele = selectTeleportRoute(rootPart.Position, targetPosition, directDistance, options)
    if not name or not tele then
        return false
    end
    return useTeleporter(name, humanoid, options)
end


local function defineNilLocals()
    if FetchItemModule == nil then
        local success, result =
            pcall(
            function()
                FetchItemModule = require(game:GetService("ReplicatedStorage").FetchItem)
            end
        )
        if not success then
            warn("Failed to define FetchItemModule:", result)
        end
    end

    if TycoonBase == nil then
        local success, result =
            pcall(
            function()
                TycoonBase = player.PlayerTycoon.Value.Base
            end
        )
        if not success then
            warn("Failed to define TycoonBase:", result)
        end
    end

    if MyTycoon == nil then
        local success, result =
            pcall(
            function()
                MyTycoon = player.PlayerTycoon.Value
            end
        )
        if not success then
            warn("Failed to define MyTycoon:", result)
        end
    end

    if MoneyLibary == nil then
        local success, result =
            pcall(
            function()
                MoneyLibary = require(game:GetService("ReplicatedStorage").MoneyLib)
            end
        )
        if not success then
            warn("Failed to define MoneyLibary:", result)
        end
    end

    if players == nil then
        players = game:GetService("Players")
    end

    if self == nil then
        self = players.LocalPlayer
    end

    if char == nil then
        local success, result =
            pcall(
            function()
                char = self.Character
            end
        )
        if not success then
            warn("Failed to define char:", result)
        end
    end

    if root == nil then
        local success, result =
            pcall(
            function()
                root = char.HumanoidRootPart
            end
        )
        if not success then
            warn("Failed to define root:", result)
        end
    end

    if mouse == nil then
        mouse = self:GetMouse()
    end

    if value == nil then
        local success, result =
            pcall(
            function()
                value = self.Rebirths
            end
        )
        if not success then
            warn("Failed to define value:", result)
        end
    end
end

local function waitForChar()
    repeat
        wait()
    until game:GetService("Players").LocalPlayer.Character
end

local function defineLocals()
    print("waiting for character to load")
    repeat
        wait()
    until game:GetService("Players").LocalPlayer.Character
    local success, result

    success, result =
        pcall(
        function()
            FetchItemModule = require(game:GetService("ReplicatedStorage").FetchItem)
        end
    )
    if not success then
        warn("Failed to define FetchItemModule:", result)
    end

    success, result =
        pcall(
        function()
            TycoonBase = player.PlayerTycoon.Value.Base
        end
    )
    if not success then
        warn("Failed to define TycoonBase:", result)
    end

    success, result =
        pcall(
        function()
            MyTycoon = player.PlayerTycoon.Value
        end
    )
    if not success then
        warn("Failed to define MyTycoon:", result)
    end

    success, result =
        pcall(
        function()
            MoneyLibary = require(game:GetService("ReplicatedStorage").MoneyLib)
        end
    )
    if not success then
        warn("Failed to define MoneyLibary:", result)
    end

    players = game:GetService("Players")
    self = players.LocalPlayer

    success, result =
        pcall(
        function()
            char = self.Character
        end
    )
    if not success then
        warn("Failed to define char:", result)
        return
    end

    success, result =
        pcall(
        function()
            root = char.HumanoidRootPart
        end
    )
    if not success then
        warn("Failed to define root:", result)
        return
    end

    mouse = self:GetMouse()

    success, result =
        pcall(
        function()
            value = self.Rebirths
        end
    )
    if not success then
        warn("Failed to define value:", result)
    end

    humanoid = char:WaitForChild("Humanoid")

    pathfindingComplete = true
    finding = false
    done_ = true
    legitCoin = true
end
defineLocals()

local function updateSelectedPlayer()
    selectedPlayer = Players:FindFirstChild(selectedPlayerName)
end

local function stayNearPlayer()
    updateSelectedPlayer()
    while followEm do
        if selectedPlayer and selectedPlayer.Character then
            local targetPosition = selectedPlayer.Character.HumanoidRootPart.Position
            local distance = (targetPosition - humanoidRoot.Position).Magnitude

            if distance > maxDistance then
                local direction = (targetPosition - humanoidRoot.Position).Unit
                local newPosition = targetPosition - direction * maxDistance
                humanoidRoot.CFrame = CFrame.new(newPosition)
            end
        end
        wait() -- Adjust the wait time according to your needs
    end
    wait(1)
    stayNearPlayer()
end

local usertarget = false
-- Function to perform A* pathfinding
local function PathfindTo(target, time)
    waitForChar()
    repeat
        wait(0)
    until not finding

    if not LegitPathing then
        local targetCFrame = target
        if typeof(target) == "Vector3" then
            targetCFrame = CFrame.new(target)
        elseif typeof(target) == "Instance" and target:IsA("BasePart") then
            targetCFrame = target.CFrame
        end
        local ok =
            pcall(function()
                humanoidRoot.CFrame = targetCFrame
            end)
        if not ok then
            humanoidRoot.Position = targetCFrame.Position
        end
        pathfindingComplete = true
        finding = false
        spawn(
            function()
                wait(time or 1)
                finding = false
            end
        )
        return true
    end
    finding = true
    local path = game:GetService("PathfindingService"):FindPathAsync(humanoid.RootPart.Position, target.Position)

    if path.Status == Enum.PathStatus.Success then
        local waypoints = path:GetWaypoints()
        local currentIndex = 1

        -- Enable flag to indicate pathfinding is in progress
        pathfindingComplete = false

        while currentIndex <= #waypoints do
            local waypoint = waypoints[currentIndex]

            if waypoint.Action == Enum.PathWaypointAction.Jump then
                humanoid.Jump = true
                humanoid:MoveTo(waypoint.Position)
                currentIndex = currentIndex + 1 -- Move to the next waypoint immediately
            else
                humanoid:MoveTo(waypoint.Position)
                humanoid.MoveToFinished:Wait()

                -- Check if the pathfinding was interrupted
                if pathfindingComplete then
                    break
                end

                currentIndex = currentIndex + 1
            end
        end

        print("Reached target position!")
        finding = false
        return true
    else
        print("Failed to find a path to the target.")
        finding = false
        return true
    end

    -- Check the distance to the target position continuously
    while (humanoid.RootPart.Position - target.Position).Magnitude > 1 do
        if pathfindingComplete then
            break
        end
        wait()
    end

    print("Target position reached!")
    finding = false
    return true -- Return true to indicate the target was reached
end

-- Separate loop for handling jumps
spawn(
    function()
        while true do
            if humanoid.MoveToFinished:Wait() then
            local success, activeTarget = pcall(function()
                return humanoid:GetMoveToPart()
            end)
            if (not success or activeTarget == nil) and not pathfindingComplete then
                humanoid.Jump = true
            end
        end
    end
    end
)

-- Event listener for player input
userInputService.InputBegan:Connect(
    function(input)
        if input.UserInputType == Enum.UserInputType.Keyboard and not pathfindingComplete then
            humanoid:Move(Vector3.new()) -- Stop the character's movement
            pathfindingComplete = true -- Set the flag to interrupt pathfinding
        end
    end
)

local event = {current = humanoid:GetState(), last = humanoid:GetState()}

local events = {
    Landed = function()
        if autoJump then
            repeat
                wait(.1)
            until event.current.Name == "Running"
            game.Players.LocalPlayer.Character.Humanoid.Jump = true
        end
    end
}

local function Jump_()
    humanoid.Jump = true
end

local function v2()
    event.last = event.current
    if event.current ~= humanoid:GetState() then
        warn("State change", humanoid:GetState())
        event.current = humanoid:GetState()
        local eventFunction = events[humanoid:GetState().Name]
        if eventFunction then
            print("Running", humanoid:GetState().Name)
            eventFunction()
        end
    end
end

game:GetService("RunService").Heartbeat:Connect(v2)
local function CombineCFrameAndVector(cframe, vector)
    return cframe + vector
end
local function BloxFruit()
    loadstring(game:HttpGet("https://raw.githubusercontent.com/Augustzyzx/UraniumMobile/main/UraniumKak.lua"))()
end
local function getFoodTool()
    local char = player.Character
    if char then
        local equipped = char:FindFirstChild(AUTO_FOOD_NAME)
        if equipped and equipped:IsA("Tool") then
            return equipped
        end
    end
    local backpack = player:FindFirstChild("Backpack") or player.Backpack
    if backpack then
        local tool = backpack:FindFirstChild(AUTO_FOOD_NAME)
        if tool and tool:IsA("Tool") then
            return tool
        end
    end
    return nil
end

local function consumeFood()
    local tool = getFoodTool()
    if not tool then
        return false
    end

    local char = player.Character or player.CharacterAdded:Wait()
    local humanoid = char:FindFirstChildOfClass("Humanoid") or char:WaitForChild("Humanoid")
    if humanoid.Health >= humanoid.MaxHealth then
        return false
    end
    if tool.Parent == player.Backpack then
        humanoid:EquipTool(tool)
        task.wait(0.1)
    end

    local success, err = pcall(function()
        tool:Activate()
    end)
    if not success then
        warn("Failed to use Food:", err)
        return false
    end
    return true
end

local function heal()
    if consumeFood() then
        print("[AutoEat] Consumed Food")
        return true
    end
    warn("[AutoEat] No Food found to consume")
    return false
end

local function stopAutoEat()
    autoEatEnabled = false
end

local function startAutoEat()
    if autoEatTask then
        return
    end
    autoEatTask =
        task.spawn(function()
        while autoEatEnabled do
            local success = consumeFood()
            local delay = success and AUTO_FOOD_COOLDOWN or 1
            task.wait(delay)
        end
        autoEatTask = nil
    end)
end
local function normalizeFireballName(name)
    if type(name) ~= "string" then
        return ""
    end
    return string.lower((name:gsub("%s+", "")))
end

local function findFireballTool()
    local localPlayer = Players.LocalPlayer
    if not localPlayer then
        return nil, false
    end

    local character = localPlayer.Character
    local backpack = localPlayer:FindFirstChild("Backpack")

    for _, container in ipairs({character, backpack}) do
        if container then
            for _, tool in ipairs(container:GetChildren()) do
                if tool:IsA("Tool") and FIREBALL_TOOL_NAMES[normalizeFireballName(tool.Name)] then
                    return tool, container == character
                end
            end
        end
    end

    return nil, false
end

local function findFireballRemote(tool)
    if not tool then
        return nil
    end

    local remote = tool:FindFirstChild("FireballEvent", true)
    if remote and (remote:IsA("RemoteEvent") or remote:IsA("RemoteFunction")) then
        return remote
    end

    for _, descendant in ipairs(tool:GetDescendants()) do
        if descendant:IsA("RemoteEvent") or descendant:IsA("RemoteFunction") then
            local lowerName = descendant.Name:lower()
            if lowerName:find("fire") or lowerName:find("ball") or lowerName:find("lightning") then
                return descendant
            end
        end
    end

    return nil
end

local function fireFireballAtPosition(targetPosition)
    if typeof(targetPosition) ~= "Vector3" then
        return false
    end

    local localPlayer = Players.LocalPlayer
    local character = localPlayer and localPlayer.Character
    local humanoid = character and character:FindFirstChildOfClass("Humanoid")
    if not humanoid or humanoid.Health <= 0 then
        return false
    end

    local tool, alreadyEquipped = findFireballTool()
    if not tool then
        return false
    end

    if not alreadyEquipped then
        local ok, err = pcall(function()
            humanoid:EquipTool(tool)
        end)
        if not ok then
            warn("[AutoFireball] Failed to equip tool:", err)
            return false
        end
        task.wait(0.1)
    end

    local remote = findFireballRemote(tool)
    if remote then
        local ok, err
        if remote:IsA("RemoteEvent") then
            ok, err = pcall(remote.FireServer, remote, targetPosition)
        else
            ok, err = pcall(remote.InvokeServer, remote, targetPosition)
        end
        if not ok then
            warn("[AutoFireball] Failed to fire remote:", err)
            return false
        end
        return true
    end

    local ok, err = pcall(tool.Activate, tool)
    if not ok then
        warn("[AutoFireball] Failed to activate tool:", err)
        return false
    end

    return true
end

local function resolveFireballTarget(target)
    if target == nil then
        return nil
    end

    local targetType = typeof(target)
    if targetType == "Vector3" then
        return target
    elseif targetType == "Instance" then
        if target:IsA("Player") then
            return resolveFireballTarget(target.Character)
        end

        local root =
            target:FindFirstChild("HumanoidRootPart") or target:FindFirstChild("Torso") or
            target:FindFirstChild("UpperTorso") or
            target.PrimaryPart
        if root then
            return root.Position
        end
    elseif targetType == "string" then
        local model = workspace:FindFirstChild(target)
        if model then
            local position = resolveFireballTarget(model)
            if position then
                return position
            end
        end

        local playerInstance = Players:FindFirstChild(target)
        if playerInstance then
            return resolveFireballTarget(playerInstance)
        end
    end

    return nil
end

local function useAllFire(player_)
    local targetPosition = resolveFireballTarget(player_)
    if not targetPosition then
        return false
    end
    return fireFireballAtPosition(targetPosition)
end

local function useAllFire_(pos)
    local targetPosition = resolveFireballTarget(pos)
    if not targetPosition then
        return false
    end
    return fireFireballAtPosition(targetPosition)
end

local function getAutoFireballTargetPosition()
    if usertarget and t_ ~= "" then
        local targetPlayer = findPlr(t_)
        if targetPlayer and targetPlayer.Character then
            local root =
                targetPlayer.Character:FindFirstChild("HumanoidRootPart") or
                targetPlayer.Character:FindFirstChild("Torso") or
                targetPlayer.Character:FindFirstChild("UpperTorso")
            if root then
                return root.Position
            end
        end
    end

    local closestPlayer = findClosestPlayer()
    if closestPlayer and closestPlayer.Character then
        local root =
            closestPlayer.Character:FindFirstChild("HumanoidRootPart") or
            closestPlayer.Character:FindFirstChild("Torso") or
            closestPlayer.Character:FindFirstChild("UpperTorso")
        if root then
            return root.Position
        end
    end

    local localPlayer = Players.LocalPlayer
    local character = localPlayer and localPlayer.Character
    local root = character and character:FindFirstChild("HumanoidRootPart")
    if root then
        return root.Position + root.CFrame.LookVector * 60
    end

    return nil
end

local function startAutoFireball()
    if autoFireballEnabled then
        return
    end
    autoFireballEnabled = true
    Revamp.State.autoFireball = true
    if autoFireballTask then
        return
    end

    autoFireballTask =
        task.spawn(function()
        print("[AutoFireball] Enabled")
        while autoFireballEnabled do
            local waitTime = AUTO_FIREBALL_INTERVAL
            local ok, fired =
                pcall(function()
                local targetPosition = getAutoFireballTargetPosition()
                if not targetPosition then
                    return false
                end
                return fireFireballAtPosition(targetPosition)
            end)
            if not ok then
                warn("[AutoFireball] Loop error:", fired)
                waitTime = AUTO_FIREBALL_INTERVAL * 2
            elseif not fired then
                waitTime = AUTO_FIREBALL_INTERVAL * 1.5
            end
            task.wait(waitTime)
        end
        autoFireballTask = nil
        print("[AutoFireball] Disabled")
    end)
end

local function stopAutoFireball()
    if not autoFireballEnabled then
        return
    end
    autoFireballEnabled = false
    Revamp.State.autoFireball = false
    if autoFireballTask then
        repeat
            task.wait()
        until autoFireballTask == nil
    end
end

local function hitHumanoid(targetHumanoid)
    if not targetHumanoid or not targetHumanoid.Parent then
        return false
    end
    local ok, err = pcall(DamageRemote.FireServer, DamageRemote, targetHumanoid, 1)
    if not ok then
        warn("Failed to strike humanoid:", err)
        return false
    end
    return true
end
local function destroyAll()
    game.ReplicatedStorage.DestroyAll:InvokeServer()
    wait(.7)
end
local function conv(cash)
    local p = ""
    for _, prefix in pairs(prefixs) do
        if (cash:match(prefix.Prefix)) then
            p = _
        end
    end
    cash = tonumber(string.split(cash, prefixs[p].Prefix)[1]) * prefixs[p].Number
    return cash
end
local function comparCash(a)
    return conv(a) < conv(string.split(game.Players.LocalPlayer.leaderstats.Cash.value, "$")[2])
end
local function updated_()
    Players = game:GetService("Players")
    player = Players.LocalPlayer
    character = player.Character
    humanoid = character:WaitForChild("Humanoid")
    humanoidRoot = character:WaitForChild("HumanoidRootPart")
end

local path =
    PathfindingService:CreatePath(
    {
        AgentRadius = 3,
        AgentHeight = 6,
        AgentCanJump = true,
        AgentCanClimb = true,
        Costs = {
            Water = 20,
            Neon = math.huge
        }
    }
)

local waypoints
local nextWaypointIndex
local reachedConnection
local blockedConnection
local function followPath(destination)
    done_ = false
    -- Compute the path
    local success, errorMessage =
        pcall(
        function()
            path:ComputeAsync(character.PrimaryPart.Position, destination)
        end
    )
    if success and path.Status == Enum.PathStatus.Success then
        -- Get the path waypoints
        waypoints = path:GetWaypoints()
        -- Detect if path becomes blocked
        blockedConnection =
            path.Blocked:Connect(
            function(blockedWaypointIndex)
                -- Check if the obstacle is further down the path
                if blockedWaypointIndex >= nextWaypointIndex then
                    -- Stop detecting path blockage until path is re-computed
                    blockedConnection:Disconnect()
                    -- Call function to re-compute new path
                    followPath(destination)
                end
            end
        )
        -- Detect when movement to next waypoint is complete
        if not reachedConnection then
            reachedConnection =
                humanoid.MoveToFinished:Connect(
                function(reached)
                    if reached and nextWaypointIndex < #waypoints then
                        -- Increase waypoint index and move to next waypoint
                        nextWaypointIndex = nextWaypointIndex + 1
                        humanoid:MoveTo(waypoints[nextWaypointIndex].Position)
                    else
                        done_ = true
                        print("D")
                        reachedConnection:Disconnect()
                        blockedConnection:Disconnect()
                    end
                end
            )
        end
        -- Initially move to second waypoint (first waypoint is path start; skip it)
        nextWaypointIndex = 2
        humanoid:MoveTo(waypoints[nextWaypointIndex].Position)
    else
        warn("Path not computed!", errorMessage)
    end
end
local function Clovers()
    return game.Workspace.Clovers:GetChildren()
end
local function Boxes()
    return game.Workspace.Boxes:GetChildren()
end
local function dist(a, b)
    return (a.Position - b.Position).Magnitude
end
local function waitDoneMove()
    while (not done_) do
        wait(0)
    end
    return true
end
local function getClosest(instances)
    if not humanoidRoot then
        return nil
    end

    local closestPart = nil
    local closestDistance = math.huge

    for _, instance in pairs(instances) do
        local part = instance
        if instance and instance:IsA("Model") then
            part = instance.PrimaryPart or instance:FindFirstChildWhichIsA("BasePart")
        end

        if part and part:IsA("BasePart") then
            local distance = (part.Position - humanoidRoot.Position).Magnitude
            if distance < closestDistance then
                closestDistance = distance
                closestPart = part
            end
        end
    end

    return closestPart, closestDistance
end
local function MoveTo(a)
    followPath(a.Position)
    return true
end

local function tp(coin)
    humanoidRoot.CFrame = coin.CFrame
    wait(.55)
end

local function myTeam(name)
    name = name or game.Players.LocalPlayer.Name
    local foundLeader = nil
    local foundTeam = nil

    for _, team in pairs(game.Workspace.Teams:GetChildren()) do
        local teamLeader = nil
        local hasMember = false

        for _, member in pairs(team:GetChildren()) do
            local ok, value = pcall(function()
                return member.Value
            end)

            if member.Name == "leader" and ok then
                if typeof(value) == "Instance" then
                    teamLeader = value.Name
                else
                    teamLeader = value
                end
            end

            if ok and value == name then
                hasMember = true
            elseif ok and typeof(value) == "Instance" and value.Name == name then
                hasMember = true
            end
        end

        if hasMember then
            foundLeader = teamLeader
            foundTeam = team.Name
            break
        end
    end

    return {foundLeader, foundTeam}
end
local function getTeams()
    local My
    local Teams_ = {}
    local myTeam = nil
    for i, v in pairs(game.Workspace.Teams:GetChildren()) do
        for i, _ in pairs(v:GetChildren()) do
            table.insert(Teams_, {_.value, v.name})
        end
    end
    return Teams_
end
local function getPos()
    local InSafe = {}
    local SafeZone1 = {86.3, 493.6}
    local SafeZone2 = {-3.5, 388.2}
    local mine = myTeam() or {}
    for _, v in pairs(game:GetService("Players"):GetPlayers()) do
        local character = v.Character
        local humanoid = character and character:FindFirstChildOfClass("Humanoid")
        local rootPart = character and character:FindFirstChild("HumanoidRootPart")

        if not (character and humanoid and rootPart) then
            -- Treat players without a loaded character as safe to avoid nil member access.
            InSafe[v.Name] = true
        else
            local x = rootPart.Position.X
            local z = rootPart.Position.Z
            local eTeam = myTeam(character.Name) or {}

            pcall(
                function()
                    if (SafeZone1[1] > x and SafeZone1[2] > z and SafeZone2[1] < x and SafeZone2[2] < z) then
                        if (mine[2] == nil or humanoid.Health == 0) then
                            InSafe[v.Name] = true
                        else
                            if (mine[1] == eTeam[1] or humanoid.Health == 0) then
                                InSafe[v.Name] = true
                            else
                                InSafe[v.Name] = false
                            end
                        end
                    else
                        if (humanoid.Health < 1) then
                            InSafe[v.Name] = true
                        else
                            InSafe[v.Name] = false
                        end
                    end
                end
            )
        end
    end
    return InSafe
end
local t_ = ""
local usertarget = false
print("waiting for game to load")
repeat
    wait()
until game:IsLoaded()
print("game laoded")

local function fire(event)
    return event:FireServer()
end
local egg = nil
--game:GetService("ReplicatedStorage").EggEvent
local treasure = nil
--ame:GetService("ReplicatedStorage").TreasureEvent
--local drop=game:GetService("ReplicatedStorage").disableOwnRide
local cf = game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame
local touchedMHBoxes = {}

local minerHavenBoxIncludePatterns = {"Diamond", "Research", "Golden", "Crystal"}
local minerHavenBoxExcludePatterns = {
    "overlay",
    "inside",
    "Lava",
    "Mine",
    "Handle",
    "Upgrade",
    "Conv",
    "Hitox",
    "Mesh",
    "Palm",
    "Sphere",
    "Smooth",
    "Grass",
    "Union",
    "Color",
    "Drop",
    "EGG",
    "Terrain",
    "Rock",
    "Sand",
    "Part",
    "rock",
    "Wedge",
    "Lights",
    "Tree",
    "Leaf"
}

local function cleanupTouchedMHBoxes()
    for box in pairs(touchedMHBoxes) do
        if not box or box.Parent == nil then
            touchedMHBoxes[box] = nil
        end
    end
end

local function getMinerHavenBoxKey(part)
    if part.Parent and part.Parent:IsA("Model") then
        return part.Parent
    end
    return part
end

local function isMinerHavenBox(part)
    if not part or not part:IsA("BasePart") then
        return false
    end
    if part:IsA("Terrain") then
        return false
    end

    local name = part.Name
    local included = false
    for _, pattern in ipairs(minerHavenBoxIncludePatterns) do
        if name:match(pattern) then
            included = true
            break
        end
    end
    if not included then
        return false
    end

    for _, pattern in ipairs(minerHavenBoxExcludePatterns) do
        if name:match(pattern) then
            return false
        end
    end

    return true
end

local function MHBox()
    cleanupTouchedMHBoxes()

    local player = game.Players.LocalPlayer
    local character = player.Character or player.CharacterAdded:Wait()
    local humanoidRootPart = character:WaitForChild("HumanoidRootPart")

    local candidateBoxes = {}

    for _, descendant in ipairs(game.Workspace:GetDescendants()) do
        if isMinerHavenBox(descendant) then
            local key = getMinerHavenBoxKey(descendant)
            if not touchedMHBoxes[key] then
                table.insert(candidateBoxes, {part = descendant, key = key})
            end
        end
    end

    if #candidateBoxes == 0 then
        return
    end

    table.sort(
        candidateBoxes,
        function(a, b)
            return (a.part.Position - humanoidRootPart.Position).Magnitude <
                (b.part.Position - humanoidRootPart.Position).Magnitude
        end
    )

    for _, boxData in ipairs(candidateBoxes) do
        local targetPart = boxData.part
        local key = boxData.key

        if targetPart and targetPart.Parent then
            local before = humanoidRootPart.CFrame
            PathfindTo(targetPart, 0.25)
            touchedMHBoxes[key] = os.clock()

            if LegitPathing then
                repeat
                    task.wait()
                until not finding
            else
                task.wait(0.1)
                humanoidRootPart.CFrame = before
            end
        else
            touchedMHBoxes[key] = nil
        end
    end

    cleanupTouchedMHBoxes()
end
local DMGbool = false
local FarmBool = false
local bool = false
local CurrentTarget = ""
local ctime = 0
local ltime = 0
local function farm()
    _G.speed = 0.005
    --ltime=os.clock()*100
    while _G.toggle == true do
        local point = nil
        local dist = nil
        humanoidRoot = character:WaitForChild("HumanoidRootPart")
        for _, coin in pairs(game.Workspace.CoinContainer:GetChildren()) do
            local magnitude = math.abs((coin.Coin.Position - humanoidRoot.Position).Magnitude)
            if (dist == nil) then
                dist = magnitude
            end
            if (magnitude < dist) then
                point = coin.Coin
                dist = magnitude
            end
        end
        if (legitCoin) then
            followPath(point.Position)
        else
            tp(point)
        end
    end
end
local function farm_()
    cf = game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame
    _G.speed = 0.05
    while _G.toggle == true do
        for i, v in pairs(game.Workspace:GetDescendants()) do
            if v:IsA("BasePart") then
                if not v:IsA("Terrain") then
                    if v.Name:match("Egg") then
                        -- print(v.Name)
                        wait(_G.speed)
                        cf = game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame
                        game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame = v.CFrame
                        wait(0)
                        game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame = cf
                    --wait(0.001)
                    end
                    if v.Name:match("Tre") then
                        --print(v.Name)
                        wait(_G.speed)
                        cf = game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame
                        game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame = v.CFrame
                        wait(0)
                        game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame = cf
                    --wait(0.001)
                    end
                end
            end
        end
        cf = mil
    end
end
local function findPlr(name)
    for _, v in pairs(game:GetService("Players"):GetPlayers()) do
        if string.find(v.Name, name) then
            return v
        end
    end
    return nil
end
local damagedplayer = nil
local function damageplayer(player)
    for i, p in pairs(game.Workspace:GetChildren()) do
        if p.Name == player then
            --print("Damaging " .. player)
            hitHumanoid(p:FindFirstChildOfClass("Humanoid"))
        --print("Damaged " .. player)
        end
    end
end

local function aura()
    _G.speed2 = 0.05
    cf = game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame
    while _G.toggle2 == true do
        local function death()
            local Zoned = getPos()
            if (usertarget == true) then
                local player = findPlr(t_)
                if (Zoned[t_] == true) then
                    wait()
                    return
                end
                --print(player)
                local function atk()
                    --teleportInFrontOfPlayer(t_)
                    local predicted =
                        PredictPlayerPosition(player, 0.25) or
                        player.Character:WaitForChild("HumanoidRootPart").Position
                    local randomOffsetX = math.random(-15, 15)
                    local randomOffsetY = math.random(-15, 15)
                    local randomOffsetZ = math.random(-15, 15)
                    local destination =
                        predicted + Vector3.new(randomOffsetX, randomOffsetY, randomOffsetZ)
                    local rootPart = game.Players.LocalPlayer.Character:WaitForChild("HumanoidRootPart")
                    rootPart.CFrame = CFrame.lookAt(destination, predicted)
                    --game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame=player.Character.HumanoidRootPart.CFrame
                    wait(.1)
                    print("Target:", player, player.Character.Humanoid.Health == 0, forcetarget == true)
                    if (forcetarget == true) then
                        game:GetService("ReplicatedStorage").RideEvents.acceptEvent:FireServer(player.Name)
                    end
                    hitHumanoid(player.Character:FindFirstChildOfClass("Humanoid"))
                end
                pcall(atk)
                wait(0)
            else
                --for i,v in pairs(game.Players:GetChildren()) do for i,p in pairs(game.Workspace:GetChildren()) do if p.Name == v.Name and p.Name ~= game.Players.LocalPlayer.Name then print(p.Name,p.Health);game:GetService("ReplicatedStorage").jdskhfsIIIllliiIIIdchgdIiIIIlIlIli:FireServer(p.Humanoid,1) end end end
                local Closest = {}
                local alive = {}
                local npcs = {}
                for i, p in pairs(game.Workspace.NPC:GetChildren()) do
                    local head
                    local Humanoid_

                    for _i, _p in pairs(p:GetDescendants()) do
                        if (_p.Name == "Head") then
                            head = _p
                            break
                        end
                    end
                    for _i, _p in pairs(p:GetDescendants()) do
                        if (_p.Name == "Humanoid") then
                            Humanoid_ = _p
                            break
                        end
                    end

                    pcall(
                        function()
                            table.insert(
                                Closest,
                                {
                                    p,
                                    (head.Position -
                                        game.Players.LocalPlayer.Character:WaitForChild("HumanoidRootPart").Position).magnitude,
                                    p,
                                    {Humanoid_.Health, Humanoid_.MaxHealth}
                                }
                            )
                            npcs[i] = p
                        end
                    )
                end
                for _, player in pairs(game.Players:GetPlayers()) do
                    if not (player.Name == game.Players.LocalPlayer.Character.Name) then
                        for i, p in pairs(game.Workspace:GetChildren()) do
                            if p.Name == player.Name and p.Name ~= game.Players.LocalPlayer.Name then
                                pcall(
                                    function()
                                        table.insert(
                                            Closest,
                                            {
                                                player,
                                                player:DistanceFromCharacter(
                                                    game.Players.LocalPlayer.Character:WaitForChild("HumanoidRootPart").Position
                                                ),
                                                p,
                                                {p.Humanoid.Health, p.Humanoid.MaxHealth},
                                                player.Name
                                            }
                                        )
                                    end
                                )
                            end
                        end
                    end
                end
                table.sort(
                    Closest,
                    function(valueA, valueB)
                        return valueA[2] < valueB[2]
                    end
                )
                for _, player in pairs(Closest) do
                    if ((Closest[1][4][1] / Closest[1][4][2]) ~= 0) then
                        table.insert(alive, {player[1], player[3].Humanoid, player[4]})
                    end
                end
                --for _, npc in pairs(npcs) do if((Closest[1][4][1]/Closest[1][4][2])~=0) then table.insert(alive,{player[1],player[3].Humanoid,player[4]}) end end
                --atk closest player
                --if CurrentTarget~=alive[1][1].name then print('New Target:',alive[1][1].name) end
                CurrentTarget = alive[1][1].name
                for _, player in pairs(alive) do
                    if (not Zoned[player.name]) then
                        --hitHumanoid(player[2])
                        print(findClosestPlayer())
                        local closest = findClosestPlayer()
                        if closest and closest.Character then
                            hitHumanoid(closest.Character:FindFirstChildOfClass("Humanoid"))
                        end
                    end
                end
            end
        end
        if usertarget then
            wait(0)
        end
        if not usertarget then
            wait(_G.speed2)
        end
        pcall(death)
    end
    game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame = cf
    -- list events for i,p in pairs(game:GetService("ReplicatedStorage"):GetChildren()) do print(p)end
end
local function dmgloop()
    while DMGbool == true do
        wait(0.05)
        pcall(DMGall)
    end
end
local function toggleFarm()
    _G.toggle = not _G.toggle
    if _G.toggle == true then
        print("Auto exp:ON")
        farm()
    else
        print("Auto exp:OFF")
    end
end
local function toggleAura()
    _G.toggle2 = not _G.toggle2
    if _G.toggle2 == true then
        print("Aura:ON")
        aura()
    else
        print("Aura:OFF")
    end
end
local Venyx =
    loadstring(game:HttpGet("https://raw.githubusercontent.com/Stefanuk12/Venyx-UI-Library/main/source2.lua"))()
local UI =
    Venyx.new(
    {
        title = "Menu - By Pirator/Lucky - Edit By Doornextguyyhat"
    }
)

local Themes = {
    Background = Color3.fromRGB(24, 24, 24),
    Glow = Color3.fromRGB(0, 0, 0),
    Accent = Color3.fromRGB(10, 10, 10),
    LightContrast = Color3.fromRGB(20, 20, 20),
    DarkContrast = Color3.fromRGB(14, 14, 14),
    TextColor = Color3.fromRGB(255, 255, 255)
}

Revamp.UI.Themes = Themes

local Main =
    UI:addPage(
    {
        title = "Animal Sim",
        icon = 887262219
    }
)
local Miners =
    UI:addPage(
    {
        title = "Miner's Haven",
        icon = 887262219
    }
)
local Legends =
    UI:addPage(
    {
        title = "LoS",
        icon = 887262219
    }
)
local BloxF =
    UI:addPage(
    {
        title = "LoS",
        icon = 887262219
    }
)
local Gameplaydiv =
    Main:addSection(
    {
        title = "Gameplay"
    }
)
local Orbs =
    Legends:addSection(
    {
        title = "Orbs"
    }
)
local Minersdiv =
    Miners:addSection(
    {
        title = "Boxes"
    }
)
local Fruits =
    Main:addSection(
    {
        title = "Scripts/Hubs"
    }
)

local tb = {}
for _, player in pairs(game.Players:GetPlayers()) do
    if not (player.Name == game.Players.LocalPlayer.Character.Name) then
        for i, p in pairs(game.Workspace:GetChildren()) do
            if p.Name == player.Name and p.Name ~= game.Players.LocalPlayer.Name then
                table.insert(tb, player)
            end
        end
    end
end
local lis = nil
local function cb(text)
    --print(text,focusLost)
    t_ = text
    print("Searching " .. text)
    local Player = findPlr(text)
    print("Found " .. tostring(Player))
    local Player = game.Workspace:FindFirstChild(Player.Name)
    damagedplayer = tostring(Player)
    t_ = damagedplayer
    print("Updating list")
    local tb_ = {}
    for _, player in pairs(game.Players:GetPlayers()) do
        if not (player.Name == game.Players.LocalPlayer.Character.Name) then
            for i, p in pairs(game.Workspace:GetChildren()) do
                if p.Name == player.Name and p.Name ~= game.Players.LocalPlayer.Name then
                    table.insert(tb_, player)
                end
            end
        end
    end
    print(self)
    print(lis)
    print(tb_ == tb)
    print(
        Gameplaydiv:updateDropdown(
            lis,
            {
                title = "Set Target Player",
                default = damagedplayer or game.Players.LocalPlayer.Character.Name,
                list = {"testone", "testtwo", "onetweotree"},
                callback = cb
            }
        )
    )
end
local function cb_(text)
    --print(text,focusLost)
    t_ = text
    print("Searching " .. text)
    local Player = findPlr(text)
    print("Found " .. tostring(Player))
    local Player = game.Workspace:FindFirstChild(Player.Name)
    damagedplayer = tostring(Player)
    t_ = damagedplayer
    print("Updating list")
    local tb_ = {}
    for _, player in pairs(game.Players:GetPlayers()) do
        if not (player.Name == game.Players.LocalPlayer.Character.Name) then
            for i, p in pairs(game.Workspace:GetChildren()) do
                if p.Name == player.Name and p.Name ~= game.Players.LocalPlayer.Name then
                    table.insert(tb_, player)
                end
            end
        end
    end
    print(self)
    print(lis)
    print(tb_ == tb)
    Gameplaydiv:updateDropdown(
        lis,
        {
            title = "Set Target Player",
            default = damagedplayer or game.Players.LocalPlayer.Character.Name,
            list = tb_,
            callback = cb
        }
    )
end
lis =
    Gameplaydiv:addDropdown(
    {
        title = "Set Target Player",
        default = game.Players.LocalPlayer.Character.Name,
        list = tb,
        callback = function(text)
            --print(text,focusLost)
            t_ = text
            print("Searching " .. text)
            local Player = findPlr(text)
            print("Found " .. tostring(Player))
            local Player = game.Workspace:FindFirstChild(Player.Name)
            damagedplayer = tostring(Player)
            t_ = damagedplayer
            print("Updating list")
            local tb_ = {}
            for _, player in pairs(game.Players:GetPlayers()) do
                if not (player.Name == game.Players.LocalPlayer.Character.Name) then
                    for i, p in pairs(game.Workspace:GetChildren()) do
                        if p.Name == player.Name and p.Name ~= game.Players.LocalPlayer.Name then
                            table.insert(tb_, player)
                        end
                    end
                end
            end
            print(self)
            print(lis)
            print(tb_ == tb)
            Gameplaydiv:updateDropdown(
                lis,
                {
                    title = "Set Target Player",
                    default = damagedplayer or game.Players.LocalPlayer.Character.Name,
                    list = tb_
                }
            )
            print("list updated")
        end
    }
)
local collectBoxesTask = nil
Gameplaydiv:addToggle(
    {
        title = "Auto exp farfm",
        toggled = nil,
        callback = function(value)
            player = Players.LocalPlayer
            character = player.Character
            humanoid = character:WaitForChild("Humanoid")
            humanoidRoot = character:WaitForChild("HumanoidRootPart")
            _G.toggle = not value
            toggleFarm()
        end
    }
)

Gameplaydiv:addToggle(
    {
        title = "LegitMode",
        toggled = nil,
        callback = function(value)
            legitCoin = not (not value)
        end
    }
)

local dmga

Gameplaydiv:addToggle(
    {
        title = "Kill aura",
        toggled = nil,
        callback = function(value)
            _G.toggle2 =  not value
            toggleAura()
        end
    }
)
Gameplaydiv:addToggle(
    {
        title = "Auto PVP",
        toggled = nil,
        callback = function(value)
            _G.autoPVP = not not value
            print("_G.autoPVP",_G.autoPVP)
        end
    }
)
Gameplaydiv:addToggle(
    {
        title = "Auto Jump",
        toggled = nil,
        callback = function(value)
            autoJump = not not value
            Revamp.State.autoJump = autoJump
            print("Autojump:", autoJump)
        end
    }
)
Gameplaydiv:addToggle(
    {
        title = "Auto Eat",
        toggled = nil,
        callback = function(value)
            autoEatEnabled = not not value
            Revamp.State.autoEat = autoEatEnabled
            if autoEatEnabled then
                startAutoEat()
            else
                stopAutoEat()
            end
        end
    }
)
Gameplaydiv:addToggle(
    {
        title = "Auto Fight",
        toggled = nil,
        callback = function(value)
            autoFight = not not value
            print("AutoFight:", autoFight)
        end
    }
)
Gameplaydiv:addToggle(
    {
        title = "autoFireball",
        toggled = nil,
        callback = function(value)
            if value then
                startAutoFireball()
            else
                stopAutoFireball()
            end
        end
    }
)
Gameplaydiv:addToggle(
    {
        title = "Auto Zone",
        toggled = nil,
        callback = function(value)
            autoZoneEnabled = not not value
            Revamp.State.autoZone = autoZoneEnabled
            if autoZoneEnabled then
                local character = player.Character
                local rootPart = character and character:FindFirstChild("HumanoidRootPart")
                autoZoneBaseCF = rootPart and rootPart.CFrame or autoZoneBaseCF
                startAutoZoneLoop()
            else
                stopAutoZoneLoop()
            end
        end
    }
)
Gameplaydiv:addToggle(
    {
        title = "Flight Chase",
        toggled = nil,
        callback = function(value)
            autoFlightChaseEnabled = not not value
            Revamp.State.autoFlightChase = autoFlightChaseEnabled
            if autoFlightChaseEnabled then
                startAutoFlightChase()
            else
                stopAutoFlightChase()
            end
        end
    }
)
Gameplaydiv:addToggle(
    {
        title = "Use target",
        toggled = nil,
        callback = function(value)
            usertarget = value
        end
    }
)
Gameplaydiv:addButton(
    {
        title = "Damage Player",
        callback = function()
            damageplayer(damagedplayer)
        end
    }
)
Fruits:addButton(
    {
        title = "Uranium Hub",
        callback = function()
            BloxFruit()
        end
    }
)
Fruits:addButton(
    {
        title = "Load AW Script",
        callback = function()
            local ok, err =
                pcall(function()
                    loadstring(game:HttpGet("https://raw.githubusercontent.com/AWdadwdwad2/net/refs/heads/main/h"))()
                end)
            if not ok then
                warn("[Revamp] Failed to load AW script:", err)
            end
        end
    }
)
Orbs:addButton(
    {
        title = "Get all",
        callback = function()
            cf = game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame
            for i, v in pairs(game.Workspace.orbFolder.City:GetChildren()) do
                if
                    (not v.Name:match("Union") and not v.Name:match("sea") and not v.Name:match("Cactus") and
                        not (v.name == "Part"))
                 then
                    -- print(v.name)
                    local inner = nil
                    for i, p in pairs(v:GetChildren()) do
                        if (p.Name:match("inner")) then
                            inner = p
                        end
                    end
                    local playerPos = game.Players.LocalPlayer.Character.HumanoidRootPart.Position
                    --local ipos=(GetPos(inner))
                    --local d=(playerPos - inner.Position).Magnitude
                    --if(inner.Position.Y<10 and not lastOrb[inner.Position] and (dist==nil or dist>d)) then dist=d;orb=inner end
                    game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame = inner.CFrame
                    wait(0)
                end
            end
            game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame = cf
        end
    }
)
local _cb_1 = false
local _cb1 = false
local __cb1 = false
local function destoryAll()
    game.ReplicatedStorage.DestroyAll:InvokeServer()
    wait(1)
end
local function openBox()
    for i, mysteryBox in pairs(game.Players.LocalPlayer.Crates:GetChildren()) do
        game.ReplicatedStorage.MysteryBox:InvokeServer(mysteryBox.Name)
    end
end

Minersdiv:addToggle(
    {
        title = "Collect Boxes",
        toggled = nil,
        callback = function(value)
            if value then
                if collectBoxesTask then
                    return
                end
                _cb1 = true
                collectBoxesTask =
                    task.spawn(function()
                    while _cb1 do
                        local ok, err = pcall(MHBox)
                        if not ok then
                            warn("[Revamp] Collect Boxes failed:", err)
                            task.wait(0.6)
                        else
                            task.wait(0.25)
                        end
                    end
                    collectBoxesTask = nil
                end)
            else
                _cb1 = false
            end
        end
    }
)
Minersdiv:addToggle(
    {
        title = "Auto open Boxes",
        toggled = nil,
        callback = function(value)
            __cb1 = value
            while (__cb1) do
                pcall(openBox)
            end
        end
    }
)

Minersdiv:addToggle(
    {
        title = "Collect Clovers",
        toggled = nil,
        callback = function(value)
            _cb_1 = value
            while (_cb_1) do
                local pos = humanoidRoot.CFrame
                humanoidRoot.CFrame = getClosest(Clovers()).CFrame
                wait(1.2)
                humanoidRoot.CFrame = pos
                wait(1)
                humanoidRoot.CFrame = pos
                --wait(getgenv().duration+getgenv().duration_)
            end
        end
    }
)
Minersdiv:addToggle(
    {
        title = "Legit Pathing?",
        toggled = nil,
        callback = function(value)
            LegitPathing = value
        end
    }
)
local cost1
local cost2
Minersdiv:addTextbox(
    {
        title = "layout 2 cost?",
        default = "10M",
        callback = function(text, focusLost)
            if (focusLost) then
                if conv(text) then
                    cost1 = text
                end
            end
        end
    }
)
Minersdiv:addTextbox(
    {
        title = "layout 3 cost?",
        default = "10qd",
        callback = function(text, focusLost)
            if (focusLost) then
                if conv(text) then
                    cost2 = text
                end
            end
        end
    }
)

Minersdiv:addButton(
    {
        title = "Load AutoRebirth",
        callback = function()
            defineNilLocals()
            local obj = {
                ["Catalyst of Thunder"] = {
                    name = "Draedon's Gauntlet",
                    items = {
                        "True Book of Knowledge",
                        "Tempest Refiner",
                        "Lightningbolt Predictor",
                        "Azure Purifier",
                        "Mystical Thunder",
                        "Tesla Refuter"
                    },
                    Catalyst = "Catalyst of Thunder"
                },
                ["Catalyst of Void"] = {
                    name = "Daestrophe",
                    items = {
                        "True Book of Knowledge",
                        "The Fissure",
                        "The Daegelart",
                        "Overlord's Telamonster",
                        "Eternal Fracture",
                        "Void Drive"
                    },
                    Catalyst = "Catalyst of Void"
                },
                ["Catalyst of Spirits"] = {
                    name = "Delta Phantom",
                    items = {
                        "True Book of Knowledge",
                        "Eternal Limbo",
                        "Brimstone Spires",
                        "Dark Illuminator",
                        "Forbidden Magic",
                        "Anguished Guardian of the Gate"
                    },
                    Catalyst = "Catalyst of Spirits"
                },
                ["Catalyst of Destruction"] = {
                    name = "Pandora's Box",
                    items = {
                        "True Book of Knowledge",
                        "Dreamer's Blight",
                        "Dreamer's Valor",
                        "Dreamer's Nightmare",
                        "Dreamer's Terror",
                        "Devourer of Nightmares"
                    },
                    Catalyst = "Catalyst of Destruction"
                },
                ["Catalyst of the Supreme"] = {
                    name = "Elysium Solemnity",
                    items = {
                        "True Book of Knowledge",
                        "True Overlord Device",
                        "Aethereal Synthesizer",
                        "Final Eclipse Gate",
                        "Crystal Altar",
                        "Champion Infuser"
                    },
                    Catalyst = "Catalyst of the Supreme"
                },
                ["Catalyst of Light"] = {
                    name = "Optic Origin",
                    items = {
                        "True Book of Knowledge",
                        "Morning Star",
                        "Neutron Star",
                        "Catalyzed Star",
                        "Ore Nova",
                        "Void Star"
                    },
                    Catalyst = "Catalyst of Light"
                },
                ["Catalyst of Earth"] = {
                    name = "Havium Mine",
                    items = {
                        "True Book of Knowledge",
                        "Yuttrium Mine",
                        "Symmetryte Mine",
                        "Yuntonium Mine",
                        "Solarium Mine",
                        "Gargantium Mine"
                    },
                    Catalyst = "Catalyst of Earth"
                },
                ["Catalyst of Death"] = {
                    name = "The Death Cap",
                    items = {
                        "True Book of Knowledge",
                        "Dreamer's Blight",
                        "Deadly Spore",
                        "Azure Spore",
                        "Delta Phantom",
                        "Lord of Tenebrous"
                    },
                    Catalyst = "Catalyst of Death"
                },
                ["Catalyst of Fire"] = {
                    name = "Vulcan's Wrath",
                    items = {
                        "True Book of Knowledge",
                        "Igneous Forge",
                        "Searing Heat",
                        "Spirit of Fire",
                        "Firecrystallized System",
                        "Vulcan's Destiny"
                    },
                    Catalyst = "Catalyst of Fire"
                },
                ["Catalyst of Fortune"] = {
                    name = "Midas Blaster",
                    items = {
                        "True Book of Knowledge",
                        "King Gold Mine",
                        "Massive Diamond Drill",
                        "Sage Justice",
                        "Coliseum Catharsis",
                        "Sage King"
                    },
                    Catalyst = "Catalyst of Fortune"
                },
                ["Catalyst of Power"] = {
                    name = "Tyrant's Throne",
                    items = {
                        "True Book of Knowledge",
                        "V-tolite Mine",
                        "Tyrant's Forge",
                        "Mystical Thunder",
                        "Void Drive",
                        "Gargantium Core"
                    },
                    Catalyst = "Catalyst of Power"
                },
                ["Catalyst of Nature"] = {
                    name = "Garden of Gaia",
                    items = {
                        "True Book of Knowledge",
                        "Gaia's Grasp",
                        "Dreamer's Life",
                        "Frozen Peaks",
                        "Ambrosia Garden",
                        "Deadly Spore"
                    },
                    Catalyst = "Catalyst of Nature"
                },
                ["Catalyst of Space"] = {
                    name = "Ore Hypernova",
                    items = {
                        "True Book of Knowledge",
                        "Optic Origin",
                        "Blue Supergiant",
                        "Aurora Borealis",
                        "Stardust Pulsar",
                        "Stellarite Mine"
                    },
                    Catalyst = "Catalyst of Space"
                },
                ["Catalyst of Knowledge"] = {
                    name = "Enchanted Library",
                    items = {
                        "True Book of Knowledge",
                        "Book of Knowledge",
                        "Stardust Illuminator",
                        "Statue of Knowledge",
                        "Ore Indoctrinator",
                        "Ancient Coliseum"
                    },
                    Catalyst = "Catalyst of Knowledge"
                },
                ["Catalyst of Time"] = {
                    name = "The Hourglass",
                    items = {
                        "True Book of Knowledge",
                        "Grandfather Clockwork",
                        "Interstellar Conqueror",
                        "Temporal Enchantment",
                        "Temporal Armageddon",
                        "The Trinity"
                    },
                    Catalyst = "Catalyst of Time"
                },
                ["Catalyst of Blood Magic"] = {
                    name = "Swag City",
                    items = {
                        "True Book of Knowledge",
                        "Draconicglass Mine",
                        "Azure Purifier",
                        "Dreamer's Nightmare",
                        "Funky Town",
                        "Devil's Spore"
                    },
                    Catalyst = "Catalyst of Blood Magic"
                },
                ["Catalyst of Necromancy"] = {
                    name = "Methuselah's Mask",
                    items = {
                        "True Book of Knowledge",
                        "The Death Cap",
                        "Lord of Tenebrous",
                        "Castle Bravo",
                        "Tsar Bomba",
                        "Son of Poison"
                    },
                    Catalyst = "Catalyst of Necromancy"
                },
                ["Catalyst of Magic"] = {
                    name = "Meralin's Sorcery",
                    items = {
                        "True Book of Knowledge",
                        "Forbidden Magic",
                        "Mystical Thunder",
                        "Swag City",
                        "Methuselah's Mask",
                        "Soul Blossom"
                    },
                    Catalyst = "Catalyst of Magic"
                },
                ["Catalyst of Oblivion"] = {
                    name = "The Heart of Void",
                    items = {
                        "True Book of Knowledge",
                        "Daestrophe",
                        "Void Star",
                        "Devourer of Nightmares",
                        "Oblivion Emission",
                        "The Forbidden Tome"
                    },
                    Catalyst = "Catalyst of Oblivion"
                }
            }
            Revamp.Data.Catalysts = obj
            local Fusions = {
                ["Phasecursor Mine"] = {
                    fusion = "Phasecursor Mine",
                    cost = "100k",
                    item = getItem("Phasecursor Mine"),
                    needed = {
                        ["Precursor Mine"] = {item = getItem("Precursor Mine"), count = 6},
                        ["Phase Refiner"] = {item = getItem("Phase Refiner"), count = 3}
                    }
                },
                ["Dragon Cannon"] = {
                    fusion = "Dragon Cannon",
                    cost = "200k",
                    item = getItem("Dragon Cannon"),
                    needed = {
                        ["Railgun Cannon"] = {item = getItem("Railgun Cannon"), count = 5},
                        ["Dragon Blaster"] = {item = getItem("Dragon Blaster"), count = 2}
                    }
                },
                ["Azure Spore"] = {
                    fusion = "Azure Spore",
                    cost = "75k",
                    item = getItem("Azure Spore"),
                    needed = {
                        ["Wild Spore"] = {item = getItem("Wild Spore"), count = 3},
                        ["Azure Refiner"] = {item = getItem("Azure Refiner"), count = 6}
                    }
                },
                ["Catalyzed Star"] = {
                    fusion = "Catalyzed Star",
                    cost = "150k",
                    item = getItem("Catalyzed Star"),
                    needed = {
                        ["The Catalyst"] = {item = getItem("The Catalyst"), count = 10},
                        ["Morning Star"] = {item = getItem("Morning Star"), count = 5}
                    }
                },
                ["Diamond Breech Loader"] = {
                    fusion = "Diamond Breech Loader",
                    cost = "200k",
                    item = getItem("Diamond Breech Loader"),
                    needed = {
                        ["Massive Diamond Mine"] = {item = getItem("Massive Diamond Mine"), count = 10},
                        ["Breech Loader"] = {item = getItem("Breech Loader"), count = 5}
                    }
                },
                ["Eternal Fracture"] = {
                    fusion = "Eternal Fracture",
                    cost = "100k",
                    item = getItem("Eternal Fracture"),
                    needed = {
                        ["Eternal Journey"] = {item = getItem("Eternal Journey"), count = 6},
                        ["The Fracture"] = {item = getItem("The Fracture"), count = 3}
                    }
                },
                ["Quantum Clockwork"] = {
                    fusion = "Quantum Clockwork",
                    cost = "75k",
                    item = getItem("Quantum Clockwork"),
                    needed = {
                        ["Quantum Ore Cleaner"] = {item = getItem("Quantum Ore Cleaner"), count = 10},
                        ["Clockwork"] = {item = getItem("Clockwork"), count = 5}
                    }
                },
                ["Lightningbolt Predictor"] = {
                    fusion = "Lightningbolt Predictor",
                    cost = "75k",
                    item = getItem("Lightningbolt Predictor"),
                    needed = {
                        ["Lightningbolt Refiner"] = {item = getItem("Lightningbolt Refiner"), count = 6},
                        ["Astral Predictor"] = {item = getItem("Astral Predictor"), count = 3}
                    }
                },
                ["Frozen Eclipse"] = {
                    fusion = "Frozen Eclipse",
                    cost = "75k",
                    item = getItem("Frozen Eclipse"),
                    needed = {
                        ["Frozen Justice"] = {item = getItem("Frozen Justice"), count = 3},
                        ["Gate of Eclipse"] = {item = getItem("Gate of Eclipse"), count = 6}
                    }
                },
                ["Sage Justice"] = {
                    fusion = "Sage Justice",
                    cost = "250k",
                    item = getItem("Sage Justice"),
                    needed = {
                        ["Sage Redeemer"] = {item = getItem("Sage Redeemer"), count = 5},
                        ["Blind Justice"] = {item = getItem("Blind Justice"), count = 10}
                    }
                },
                ["Dark Illuminator"] = {
                    fusion = "Dark Illuminator",
                    cost = "200k",
                    item = getItem("Dark Illuminator"),
                    needed = {
                        ["Ore Illuminator"] = {item = getItem("Ore Illuminator"), count = 4},
                        ["Dark Magic"] = {item = getItem("Dark Magic"), count = 8}
                    }
                },
                ["Symcorpium Mine"] = {
                    fusion = "Symcorpium Mine",
                    cost = "250k",
                    item = getItem("Symcorpium Mine"),
                    needed = {
                        ["Scorpium Mine"] = {item = getItem("Scorpium Mine"), count = 10},
                        ["Symmetrium Mine"] = {item = getItem("Symmetrium Mine"), count = 5}
                    }
                },
                ["Ambrosia Garden"] = {
                    fusion = "Ambrosia Garden",
                    cost = "100k",
                    item = getItem("Ambrosia Garden"),
                    needed = {
                        ["Sakura Garden"] = {item = getItem("Sakura Garden"), count = 6},
                        ["Ambrosia Fountain"] = {item = getItem("Ambrosia Fountain"), count = 3}
                    }
                },
                ["Anguished Garden"] = {
                    fusion = "Anguished Garden",
                    cost = "100k",
                    item = getItem("Anguished Garden"),
                    needed = {
                        ["Dreamer's Anguish"] = {item = getItem("Dreamer's Anguish"), count = 5},
                        ["Sakura Garden"] = {item = getItem("Sakura Garden"), count = 10}
                    }
                },
                ["Anguished Guardian of the Gate"] = {
                    fusion = "Anguished Guardian of the Gate",
                    cost = "200k",
                    item = getItem("Anguished Guardian of the Gate"),
                    needed = {
                        ["Dreamer's Anguish"] = {item = getItem("Dreamer's Anguish"), count = 4},
                        ["Guardian of the Gate"] = {item = getItem("Guardian of the Gate"), count = 8}
                    }
                },
                ["Firecrystallized System"] = {
                    fusion = "Firecrystallized System",
                    cost = "75k",
                    item = getItem("Firecrystallized System"),
                    needed = {
                        ["Industrial Firecrystal Mine"] = {item = getItem("Industrial Firecrystal Mine"), count = 4},
                        ["Crystallized System"] = {item = getItem("Crystallized System"), count = 8}
                    }
                },
                ["Illuminator Evaluator"] = {
                    fusion = "Illuminator Evaluator",
                    cost = "75k",
                    item = getItem("Illuminator Evaluator"),
                    needed = {
                        ["Ore Illuminator"] = {item = getItem("Ore Illuminator"), count = 4},
                        ["Flaming Schrodinger"] = {item = getItem("Flaming Schrodinger"), count = 8}
                    }
                },
                ["Nature's Temple"] = {
                    fusion = "Nature's Temple",
                    cost = "150k",
                    item = getItem("Nature's Temple"),
                    needed = {
                        ["Nature's Grip"] = {item = getItem("Nature's Grip"), count = 10},
                        ["Ancient Temple"] = {item = getItem("Ancient Temple"), count = 5}
                    }
                },
                ["The Pizzalyst"] = {
                    fusion = "The Pizzalyst",
                    cost = "75k",
                    item = getItem("The Pizzalyst"),
                    needed = {
                        ["The Catalyst"] = {item = getItem("The Catalyst"), count = 6},
                        ["Pizza Blaster"] = {item = getItem("Pizza Blaster"), count = 3}
                    }
                },
                ["Yuntonium Mine"] = {
                    fusion = "Yuntonium Mine",
                    cost = "150k",
                    item = getItem("Yuntonium Mine"),
                    needed = {
                        ["Newtonium Mine"] = {item = getItem("Newtonium Mine"), count = 6},
                        ["Yunium Mine"] = {item = getItem("Yunium Mine"), count = 3}
                    }
                },
                ["Massive Quantum Diamond Cleaner"] = {
                    fusion = "Massive Quantum Diamond Cleaner",
                    cost = "350k",
                    item = getItem("Massive Quantum Diamond Cleaner"),
                    needed = {
                        ["Quantum Ore Cleaner"] = {item = getItem("Quantum Ore Cleaner"), count = 13},
                        ["Massive Diamond Mine"] = {item = getItem("Massive Diamond Mine"), count = 6}
                    }
                }
            }
            Revamp.Data.Fusions = Fusions
            local Evolved = {
                ["Phase Refiner"] = {
                    cost = "75k",
                    evolved = getItem("Phase Refiner"),
                    reborn = getItem("Phase Conveyor"),
                    r = "Phase Conveyor",
                    count = 10
                },
                ["Dragon Blaster"] = {
                    cost = "150k",
                    evolved = getItem("Dragon Blaster"),
                    reborn = getItem("Blaster"),
                    r = "Blaster",
                    count = 5
                },
                ["Saturated Catalyst"] = {
                    cost = "75k",
                    evolved = getItem("Saturated Catalyst"),
                    reborn = getItem("The Catalyst"),
                    r = "The Catalyst",
                    count = 10
                },
                ["Quantum Ore Polisher"] = {
                    cost = "50k",
                    evolved = getItem("Quantum Ore Polisher"),
                    reborn = getItem("Quantum Ore Cleaner"),
                    r = "Quantum Ore Cleaner",
                    count = 7
                },
                ["Deadly Spore"] = {
                    cost = "100k",
                    evolved = getItem("Deadly Spore"),
                    reborn = getItem("Wild Spore"),
                    r = "Wild Spore",
                    count = 12
                },
                ["Symmetryte Mine"] = {
                    cost = "200k",
                    evolved = getItem("Symmetryte Mine"),
                    reborn = getItem("Symmetrium Mine"),
                    r = "Symmetrium Mine",
                    count = 8
                },
                ["Swift Justice"] = {
                    cost = "75k",
                    evolved = getItem("Swift Justice"),
                    reborn = getItem("Blind Justice"),
                    r = "Blind Justice",
                    count = 7
                },
                ["Sakura Falls"] = {
                    cost = "100k",
                    evolved = getItem("Sakura Falls"),
                    reborn = getItem("Sakura Garden"),
                    r = "Sakura Garden",
                    count = 7
                },
                ["Neutron Star"] = {
                    cost = "100k",
                    evolved = getItem("Neutron Star"),
                    reborn = getItem("Red Giant"),
                    r = "Red Giant",
                    count = 10
                },
                ["Astral Setter"] = {
                    cost = "50k",
                    evolved = getItem("Astral Setter"),
                    reborn = getItem("Astral Predictor"),
                    r = "Astral Predictor",
                    count = 12
                },
                ["Sage King"] = {
                    cost = "50k",
                    evolved = getItem("Sage King"),
                    reborn = getItem("Sage Redeemer"),
                    r = "Sage Redeemer",
                    count = 12
                },
                ["Final Eclipse Gate"] = {
                    cost = "75k",
                    evolved = getItem("Final Eclipse Gate"),
                    reborn = getItem("Gate of Eclipse"),
                    r = "Gate of Eclipse",
                    count = 10
                },
                ["Ambrosia Forest"] = {
                    cost = "50k",
                    evolved = getItem("Ambrosia Forest"),
                    reborn = getItem("Ambrosia Fountain"),
                    r = "Ambrosia Fountain",
                    count = 7
                },
                ["Ancient Coliseum"] = {
                    cost = "50k",
                    evolved = getItem("Ancient Coliseum"),
                    reborn = getItem("Ancient Temple"),
                    r = "Ancient Temple",
                    count = 10
                },
                ["Newtonium Excavator"] = {
                    cost = "150k",
                    evolved = getItem("Newtonium Excavator"),
                    reborn = getItem("Newtonium Mine"),
                    r = "Newtonium Mine",
                    count = 14
                },
                ["Tesla Refuter"] = {
                    cost = "100k",
                    evolved = getItem("Tesla Refuter"),
                    reborn = getItem("Tesla Resetter"),
                    r = "Tesla Resetter",
                    count = 10
                },
                ["Super Schrodinger"] = {
                    cost = "75k",
                    evolved = getItem("Super Schrodinger"),
                    reborn = getItem("Flaming Schrodinger"),
                    r = "Flaming Schrodinger",
                    count = 12
                },
                ["Frozen Peaks"] = {
                    cost = "50k",
                    evolved = getItem("Frozen Peaks"),
                    reborn = getItem("Frozen Justice"),
                    r = "Frozen Justice",
                    count = 9
                },
                ["Forbidden Magic"] = {
                    cost = "75k",
                    evolved = getItem("Forbidden Magic"),
                    reborn = getItem("Dark Magic"),
                    r = "Dark Magic",
                    count = 12
                },
                ["Massive Diamond Drill"] = {
                    cost = "50k",
                    evolved = getItem("Massive Diamond Drill"),
                    reborn = getItem("Massive Diamond Mine"),
                    r = "Massive Diamond Mine",
                    count = 9
                },
                ["Ore Indoctrinator"] = {
                    cost = "666k",
                    evolved = getItem("Ore Indoctrinator"),
                    reborn = getItem("Ore Illuminator"),
                    r = "Ore Illuminator",
                    count = 66
                },
                ["Dreamer's Nightmare"] = {
                    cost = "150k",
                    evolved = getItem("Dreamer's Nightmare"),
                    reborn = getItem("Dreamer's Anguish"),
                    r = "Dreamer's Anguish",
                    count = 7
                },
                ["Dreamer's Terror"] = {
                    cost = "150k",
                    evolved = getItem("Dreamer's Terror"),
                    reborn = getItem("Dreamer's Fright"),
                    r = "Dreamer's Fright",
                    count = 50
                },
                ["Zenith Will"] = {
                    cost = "200k",
                    evolved = getItem("Zenith Will"),
                    reborn = getItem("Righteous Will"),
                    r = "Righteous Will",
                    count = 20
                },
                ["Draconicglass Mine"] = {
                    cost = "150k",
                    evolved = getItem("Draconicglass Mine"),
                    reborn = getItem("Dragonglass Mine"),
                    r = "Dragonglass Mine",
                    count = 15
                },
                ["The Daegelart"] = {
                    cost = "150k",
                    evolved = getItem("The Daegelart"),
                    reborn = getItem("The Abomination"),
                    r = "The Abomination",
                    count = 10
                },
                ["Tsar Bomba"] = {
                    cost = "1M",
                    evolved = getItem("Tsar Bomba"),
                    reborn = getItem("Big Bertha"),
                    r = "Big Bertha",
                    count = 100
                },
                ["Aethereal Synthesizer"] = {
                    cost = "100k",
                    evolved = getItem("Aethereal Synthesizer"),
                    reborn = getItem("Aether Refinery"),
                    r = "Aether Refinery",
                    count = 15
                },
                ["The Fissure"] = {
                    cost = "75k",
                    evolved = getItem("The Fissure"),
                    reborn = getItem("The Fracture"),
                    r = "The Fracture",
                    count = 10
                },
                ["Pizza Bombarder"] = {
                    cost = "75k",
                    evolved = getItem("Pizza Bombarder"),
                    reborn = getItem("Pizza Blaster"),
                    r = "Pizza Blaster",
                    count = 10
                },
                ["Yuttrium Mine"] = {
                    cost = "75k",
                    evolved = getItem("Yuttrium Mine"),
                    reborn = getItem("Yunium Mine"),
                    r = "Yunium Mine",
                    count = 11
                },
                ["Crystallized Engine"] = {
                    cost = "75k",
                    evolved = getItem("Crystallized Engine"),
                    reborn = getItem("Crystallized System"),
                    r = "Crystallized System",
                    count = 8
                },
                ["Eternal Limbo"] = {
                    cost = "100k",
                    evolved = getItem("Eternal Limbo"),
                    reborn = getItem("Eternal Journey"),
                    r = "Eternal Journey",
                    count = 20
                },
                ["Tempest Refiner"] = {
                    cost = "200k",
                    evolved = getItem("Tempest Refiner"),
                    reborn = getItem("Lightningbolt Refiner"),
                    r = "Lightningbolt Refiner",
                    count = 20
                },
                ["Grandfather Clockwork"] = {
                    cost = "100k",
                    evolved = getItem("Grandfather Clockwork"),
                    reborn = getItem("Clockwork"),
                    r = "Clockwork",
                    count = 11
                },
                ["Turbine Chamber"] = {
                    cost = "125k",
                    evolved = getItem("Turbine Chamber"),
                    reborn = getItem("Cooling Chamber"),
                    r = "Cooling Chamber",
                    count = 11
                },
                ["Atomyke Mine"] = {
                    cost = "150k",
                    evolved = getItem("Atomyke Mine"),
                    reborn = getItem("Atomium Mine"),
                    r = "Atomium Mine",
                    count = 15
                },
                ["V-tolite Mine"] = {
                    cost = "150k",
                    evolved = getItem("V-tolite Mine"),
                    reborn = getItem("Pilotite Mine"),
                    r = "Pilotite Mine",
                    count = 7
                },
                ["Dimension Extractor"] = {
                    cost = "250k",
                    evolved = getItem("Dimension Extractor"),
                    reborn = getItem("Breech Loader"),
                    r = "Breech Loader",
                    count = 12
                },
                ["Azure Purifier"] = {
                    cost = "75k",
                    evolved = getItem("Azure Purifier"),
                    reborn = getItem("Azure Refiner"),
                    r = "Azure Refiner",
                    count = 9
                },
                ["Searing Heat"] = {
                    cost = "75k",
                    evolved = getItem("Searing Heat"),
                    reborn = getItem("Scorching Heat"),
                    r = "Scorching Heat",
                    count = 8
                },
                ["Atmospheric Steamwork"] = {
                    cost = "50k",
                    evolved = getItem("Atmospheric Steamwork"),
                    reborn = getItem("Gravitational Gearwork"),
                    r = "Gravitational Gearwork",
                    count = 13
                },
                ["Dreamer's Valor"] = {
                    cost = "100k",
                    evolved = getItem("Dreamer's Valor"),
                    reborn = getItem("Dreamer's Might"),
                    r = "Dreamer's Might",
                    count = 25
                },
                ["Guardian of the Portal"] = {
                    cost = "75k",
                    evolved = getItem("Guardian of the Portal"),
                    reborn = getItem("Guardian of the Gate"),
                    r = "Guardian of the Gate",
                    count = 12
                },
                ["Atlantic Monument"] = {
                    cost = "75k",
                    evolved = getItem("Atlantic Monument"),
                    reborn = getItem("Atlantic Monolith"),
                    r = "Atlantic Monolith",
                    count = 10
                },
                ["Breached Motherboard"] = {
                    cost = "100k",
                    evolved = getItem("Breached Motherboard"),
                    reborn = getItem("Invasive Cyberlord"),
                    r = "Invasive Cyberlord",
                    count = 10
                },
                ["Phase Bombarder"] = {
                    cost = "75k",
                    evolved = getItem("Phase Bombarder"),
                    reborn = getItem("Phase Refiner"),
                    r = "Phase Refiner",
                    count = 11
                },
                ["Gaia's Grasp"] = {
                    cost = "100k",
                    evolved = getItem("Gaia's Grasp"),
                    reborn = getItem("Nature's Grip"),
                    r = "Nature's Grip",
                    count = 20
                },
                ["Mad Monsterous Melter"] = {
                    cost = "300k",
                    evolved = getItem("Mad Monsterous Melter"),
                    reborn = getItem("Big Bad Blaster"),
                    r = "Big Bad Blaster",
                    count = 20
                },
                ["Ore Chainsaw"] = {
                    cost = "300k",
                    evolved = getItem("Ore Chainsaw"),
                    reborn = getItem("Ore Sawmill"),
                    r = "Ore Sawmill",
                    count = 28
                },
                ["Scorponyte Mine"] = {
                    cost = "125k",
                    evolved = getItem("Scorponyte Mine"),
                    reborn = getItem("Scorpium Mine"),
                    r = "Scorpium Mine",
                    count = 17
                },
                ["Temporal Enchantment"] = {
                    cost = "100k",
                    evolved = getItem("Temporal Enchantment"),
                    reborn = getItem("Timeless Enhancement"),
                    r = "Timeless Enhancement",
                    count = 25
                },
                ["Banana Sundae Refiner"] = {
                    cost = "100k",
                    evolved = getItem("Banana Sundae Refiner"),
                    reborn = getItem("Banana Split Upgrader"),
                    r = "Banana Split Upgrader",
                    count = 7
                },
                ["Temporal Armageddon"] = {
                    cost = "600k",
                    evolved = getItem("Temporal Armageddon"),
                    reborn = getItem("Fractured Reality"),
                    r = "Fractured Reality",
                    count = 30
                },
                ["Shard City"] = {
                    cost = "350k",
                    evolved = getItem("Shard City"),
                    reborn = getItem("Shard Park"),
                    r = "Shard Park",
                    count = 15
                },
                ["Green Tea Kettle"] = {
                    cost = "50k",
                    evolved = getItem("Green Tea Kettle"),
                    reborn = getItem("Green Tea Latte"),
                    r = "Green Tea Latte",
                    count = 7
                },
                ["Solar Eruption"] = {
                    cost = "50k",
                    evolved = getItem("Solar Eruption"),
                    reborn = getItem("Solar Flare"),
                    r = "Solar Flare",
                    count = 16
                },
                ["Lunar Bombardment"] = {
                    cost = "50k",
                    evolved = getItem("Lunar Bombardment"),
                    reborn = getItem("Solar Flare"),
                    r = "Solar Flare",
                    count = 16
                },
                ["Nuclear Castle"] = {
                    cost = "500k",
                    evolved = getItem("Nuclear Castle"),
                    reborn = getItem("Nuclear Stronghold"),
                    r = "Nuclear Stronghold",
                    count = 20
                },
                ["Demon Core"] = {
                    cost = "125k",
                    evolved = getItem("Demon Core"),
                    reborn = getItem("Toxic Waste Disposal"),
                    r = "Toxic Waste Disposal",
                    count = 10
                },
                ["Industrial Firegem Quarry"] = {
                    cost = "80k",
                    evolved = getItem("Industrial Firegem Quarry"),
                    reborn = getItem("Industrial Firecrystal Mine"),
                    r = "Industrial Firecrystal Mine",
                    count = 7
                },
                ["Heavenly Flux"] = {
                    cost = "250k",
                    evolved = getItem("Heavenly Flux"),
                    reborn = getItem("Skyliner Flux"),
                    r = "Skyliner Flux",
                    count = 8
                },
                ["Vortex Singularity"] = {
                    cost = "400k",
                    evolved = getItem("Vortex Singularity"),
                    reborn = getItem("Vortex Chamber"),
                    r = "Vortex Chamber",
                    count = 15
                }
            }
            Revamp.Data.Evolved = Evolved
            for catalyst, data in pairs(obj) do
                data.Item = getItem(catalyst)
                print("Added:" .. catalyst)
            end
            for catalyst, data in pairs(obj) do
                data.Item = getItem(catalyst)
                for item, _ in data.items do
                    data[_] = getItem(_)
                end
                print("Added:" .. catalyst)
            end

            hasCat = function(catalystName)
                local catalystData = obj[catalystName]
                if not catalystData then
                    print("Catalyst not found: " .. catalystName)
                    return false
                end

                local missingItems = {}

                for _, itemName in ipairs(catalystData.items) do
                    local item = getItem(itemName)
                    if not HasItem(item.ItemId.Value) then
                        table.insert(missingItems, itemName)
                    end
                end

                if #missingItems == 0 then
                    print("All items required for " .. catalystName .. " are present.")
                    return true
                else
                    print("Missing items for " .. catalystName .. ":")
                    for _, missingItem in ipairs(missingItems) do
                        print("- " .. missingItem)
                        -- Check if the missing item is an evolved item
                        if Evolved[missingItem] then
                            local evolutionData = Evolved[missingItem]
                            local baseItem = evolutionData.reborn
                            local requiredCount = evolutionData.count
                            local currentCount = HasItem(baseItem.ItemId.Value, true)
                            if currentCount >= requiredCount then
                                print("  You can evolve " .. baseItem.Name .. " into " .. missingItem .. ".")
                            else
                                print("  You need " .. (requiredCount - currentCount) .. " more " .. baseItem.Name .. "(s) to evolve into " .. missingItem .. ".")
                            end
                        end
                        -- Check if the missing item is a fusion item
                        if Fusions[missingItem] then
                            local fusionData = Fusions[missingItem]
                            print("  To create " .. missingItem .. ", you need:")
                            for componentName, componentData in pairs(fusionData.needed) do
                                local componentItem = componentData.item
                                local requiredCount = componentData.count
                                local currentCount = HasItem(componentItem.ItemId.Value, true)
                                if currentCount >= requiredCount then
                                    print("    - " .. componentName .. ": You have enough.")
                                else
                                    print("    - " .. componentName .. ": You need " .. (requiredCount - currentCount) .. " more.")
                                end
                            end
                        end
                        -- Check if the missing item is available in the shop
                        if IsShopItem(item.ItemId.Value) then
                            print("  " .. missingItem .. " is available in the shop.")
                        else
                            print("  " .. missingItem .. " is not available in the shop. Check other sources.")
                        end
                    end
                    return false
                end

            end
            Revamp.Inventory.hasCat = hasCat
            local oldPos
            goTo = function()
                TycoonBase = game.Players.LocalPlayer.PlayerTycoon.Value.Base
                if GetDistanceBetweenCFrame(TycoonBase.CFrame, root.CFrame) > 100 then
                    oldPos = game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame
                    if finding then
                        pathfindingComplete = true
                    end
                    PathfindTo(TycoonBase.CFrame, 2)
                end
            end
            goBack = function()
                if (oldPos) then
                    PathfindTo(oldPos)
                end
                oldPos = nil
            end
            Revamp.Pathing.goTo = goTo
            Revamp.Pathing.goBack = goBack
            local library =
                loadstring(
                game:HttpGet(
                    "https://raw.githubusercontent.com/TheAbsolutionism/Wally-GUI-Library-V2-Remastered/main/Library%20Code",
                    true
                )
            )() --//Wally UI Lib V2 Remastered by: https://forum.robloxscripts.com/showthread.php?tid=3180
            library.options.underlinecolor = "rainbow" --//makes the underline of each "window" rainbow
            library.options.toggledisplay = "Fill" --//Applies to all toggles, [Fill] OFF = RED, ON = GREEN [CHECK] OFF = BLANK,ON = CHECKMARK
            local mainW = library:CreateWindow("Miner's Haven") --//Name of window
            local Section = mainW:Section("Farm", true)

            --//AntiAFK Credits to: https://v3rmillion.net/showthread.php?tid=772135
            local vu = game:GetService("VirtualUser")
            game:GetService("Players").LocalPlayer.Idled:connect(
                function()
                    vu:Button2Down(Vector2.new(0, 0), workspace.CurrentCamera.CFrame)
                    task.wait(1)
                    vu:Button2Up(Vector2.new(0, 0), workspace.CurrentCamera.CFrame)
                end
            )
            --//AntiAFK Credits to: https://v3rmillion.net/showthread.php?tid=772135

            --//Enables Rebirth Farming
            local reFarm =
                mainW:Toggle(
                "Rebirth Farm",
                {flag = "rebfarm"},
                function()
                    if mainW.flags.rebfarm then
                        loadLayouts()
                        farmRebirth()
                    end
                end
            )

            --//User chooses if they want second layout to be used
            local tFarm =
                mainW:Toggle(
                "Enable Second Layout?",
                {flag = "seclayout"},
                function()
                end
            )
            local tFarm_ =
                mainW:Toggle(
                "Enable Third Layout?",
                {flag = "thirdlayout"},
                function()
                end
            )
            local _tFarm_ =
                mainW:Toggle(
                "Clear after first layout?",
                {flag = "seclayoutclear"},
                function()
                end
            )
            local tFarm_ =
                mainW:Toggle(
                "Clear after second layout?",
                {flag = "thirdlayoutclear"},
                function()
                end
            )
            local RFarm_ =
                mainW:Toggle(
                "Rebirths with layout?",
                {flag = "rebirthWL"},
                function()
                end
            )

            --//Auto Rebirth Toggle
            local autoReb =
                mainW:Toggle(
                "Auto Rebirth",
                {flag = "aReb"},
                function()
                    farmRebirth()
                end
            )

            --//Input time between layouts
            local timeBox =
                mainW:Box(
                "Time first layout",
                {
                    default = 0,
                    type = "number",
                    min = 0,
                    max = 9999, --//You can change this to math.huge if u want. (Currently set to 60 Seconds / 1 Minute)
                    flag = "duration",
                    location = {getgenv()}
                },
                function(new)
                    getgenv().duration = new
                end
            )
            local timeBox_ =
                mainW:Box(
                "Time second layout",
                {
                    default = 0,
                    type = "number",
                    min = 0,
                    max = 9999, --//You can change this to math.huge if u want. (Currently set to 60 Seconds / 1 Minute)
                    flag = "duration2",
                    location = {getgenv()}
                },
                function(new)
                    getgenv().duration2 = new
                end
            )

            --//Select First Layout
            mainW:Dropdown(
                "First Layout",
                {
                    default = "First Layout",
                    location = getgenv(),
                    flag = "layoutone",
                    list = {
                        "Layout1",
                        "Layout2",
                        "Layout3"
                    }
                },
                function()
                    print("Selected: " .. getgenv().layoutone)
                end
            )

            --//Select Second Layout
            mainW:Dropdown(
                "Second Layout",
                {
                    default = "Second Layout",
                    location = getgenv(),
                    flag = "layoutwo",
                    list = {
                        "Layout1",
                        "Layout2",
                        "Layout3"
                    }
                },
                function()
                    print("Selected: " .. getgenv().layoutwo)
                end
            )
            --//Select Third Layout
            mainW:Dropdown(
                "Third Layout",
                {
                    default = "Third Layout",
                    location = getgenv(),
                    flag = "layouthree",
                    list = {
                        "Layout1",
                        "Layout2",
                        "Layout3"
                    }
                },
                function()
                    print("Selected: " .. getgenv().layouthree)
                end
            )

            mainW:Dropdown(
                "Rebrith W Layout",
                {
                    default = "Rebirth Layout",
                    location = getgenv(),
                    flag = "rebirthlayout",
                    list = {
                        "Layout1",
                        "Layout2",
                        "Layout3"
                    }
                },
                function()
                    print("Selected: " .. getgenv().rebirthlayout)
                end
            )

            loadLayouts = function()
                task.spawn(
                    function()
                        goTo()
                        wait(.5)
                        game:GetService("ReplicatedStorage").Layouts:InvokeServer("Load", getgenv().layoutone) --//Loads first layout
                        wait(.1)
                        goBack()
                        --task.wait(getgenv().duration) --//Duration between layouts
                        if mainW.flags.seclayout then --//Checks if "Enable second layout" toggle is true
                            repeat
                                wait(0)
                            until comparCash(cost1)
                            if (mainW.flags.seclayoutclear) then
                                goTo()
                                wait(.5)
                                destroyAll()
                                wait(.1)
                                goBack()
                            end
                            goTo()
                            wait(.2)
                            game:GetService("ReplicatedStorage").Layouts:InvokeServer("Load", getgenv().layoutwo) --//Loads second layout
                            wait(.1)
                            goBack()
                            task.wait(getgenv().duration_)
                            if mainW.flags.thirdlayout then --//Checks if "Enable second layout" toggle is true
                                repeat
                                    wait(0)
                                until comparCash(cost2)
                                if (mainW.flags.thirdlayoutclear) then
                                    goTo()
                                    wait(.5)
                                    destroyAll()
                                    wait(.1)
                                    goBack()
                                end
                                goTo()
                                wait(.2)
                                game:GetService("ReplicatedStorage").Layouts:InvokeServer("Load", getgenv().layouthree) --//Loads third layout
                                wait(.1)
                                goBack()
                            end
                        end
                    end
                )
            end
            Revamp.Farming.loadLayouts = loadLayouts

            --//Auto Rebirth Function
            farmRebirth = function()
                print("Print trying auto?")
                task.spawn(
                    function()
                        print("Auto Going?")
                        while mainW.flags.aReb do
                            local canRebirth =
                                game:GetService("Players").LocalPlayer.PlayerGui.GUI.Money.Value >=
                                MoneyLibary.RebornPrice(game:GetService("Players").LocalPlayer)
                            wait(0)
                            --print("----------------------------")
                            --print(canRebirth)
                            if canRebirth then
                                if mainW.flags.rebirthWl then
                                    print("With Layouth")
                                    goTo()
                                    wait(.2)
                                    game:GetService("ReplicatedStorage").Layouts:InvokeServer(
                                        "Load",
                                        getgenv().rebirthlayout
                                    )
                                    wait(.7)
                                    game:GetService("ReplicatedStorage").Rebirth:InvokeServer(26) --// I dont know what "26" means dont change it.
                                    task.wait()
                                    wait(.1)
                                    goBack()
                                else
                                    print("WithoutLayout")
                                    goTo()
                                    wait(.2)
                                    game:GetService("ReplicatedStorage").Rebirth:InvokeServer(26) --// I dont know what "26" means dont change it.
                                    task.wait()
                                    wait(.1)
                                    goBack()
                                end
                            end
                        end
                    end
                )
            end
            Revamp.Farming.farmRebirth = farmRebirth
            Revamp.Farming.MinerFarm = farmRebirth

            --//Auto Load
            value:GetPropertyChangedSignal("Value"):Connect(
                function()
                    task.wait(0.75)
                    if mainW.flags.rebfarm then
                        loadLayouts()
                    end
                end
            )
            --//Auto Load
        end
    }
)

Gameplaydiv:addTextbox(
    {
        title = "Force Join Pack",
        default = "Case Sensitive",
        callback = function(text, focusLost)
            if (focusLost) then
                for i, v in pairs(game.Workspace.Teams:GetChildren()) do
                    if string.find(text, v.Name) then
                        game:GetService("ReplicatedStorage").acceptedEvent:FireServer(v.Name)
                    end
                end
            end
        end
    }
)

Gameplaydiv:addButton(
    {
        title = "Print All Teams (F9)",
        callback = function()
            for i, v in pairs(game.Workspace.Teams:GetChildren()) do
                print(v.Name)
            end
        end
    }
)

Gameplaydiv:addTextbox(
    {
        title = "Force Player Ride",
        default = "Case Sensitive",
        callback = function(text, focusLost)
            if (focusLost) then
                for i, v in pairs(game.Players:GetChildren()) do
                    if string.find(v.Name, text) then
                        game:GetService("ReplicatedStorage").RideEvents.acceptEvent:FireServer(v.Name)
                    end
                end
            end
        end
    }
)

local Theme =
    UI:addPage(
    {
        title = "Theme",
        icon = 4890363233
    }
)

local Colors =
    Theme:addSection(
    {
        title = "Colors"
    }
)
for theme, color in pairs(Themes) do
    Colors:addColorPicker(
        {
            title = theme,
            default = color,
            callback = function(color3)
                UI:setTheme(
                    {
                        theme = theme,
                        color3 = color3
                    }
                )
            end
        }
    )
end

UI:SelectPage(
    {
        page = UI.pages[1],
        toggle = true
    }
)
--_G.speed=0.05;_G.toggle=true while _G.toggle == true do for i,v in pairs(game.Workspace:GetDescendants()) do if v:IsA("BasePart") and not v:IsA('Terrain') and (v.Name:match("Egg") or v.Name:match("Tre")) then wait(_G.speed);game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame = v.CFrame end end print("done");end
print("Loaded")
local localInfo = {}
local function findDmg(taken)
    if (taken == nil) then
        taken = 0
    end
    for _, v in pairs(game:GetService("Players"):GetPlayers()) do
        local Zoned = getPos()
        if (true) then
            local l = v.leaderstats.Level.value
            local info = {
                lvl = v.leaderstats.Level.value,
                dmg = l * 2,
                hp = (l * 2) * 10,
                player = v
            }
            --game.Players.LocalPlayer
            print("@", v.name, "#", v.leaderstats.Level.value, "$", info.dmg)
            if ((l * 2) == (taken - 10)) then
                print("Found:" .. v.name)
                return info
            end
        end
    end
end

local function isInsideSafeZone(position)
    if not position or #SafeZonePolygon < 3 then
        return false
    end
    local point = Vector2.new(position.X, position.Z)
    local inside = false
    local j = #SafeZonePolygon
    for i = 1, #SafeZonePolygon do
        local vi = SafeZonePolygon[i]
        local vj = SafeZonePolygon[j]
        local intersects =
            ((vi.Y > point.Y) ~= (vj.Y > point.Y)) and
            (point.X < (vj.X - vi.X) * (point.Y - vi.Y) / ((vj.Y - vi.Y) ~= 0 and (vj.Y - vi.Y) or 1e-6) + vi.X)
        if intersects then
            inside = not inside
        end
        j = i
    end
    return inside
end

Revamp.Data.Zones = Revamp.Data.Zones or {}
Revamp.Data.Zones.MantisWorld = {
    polygon = MANTIS_ZONE_POLYGON,
    teleporterName = "Revamp_MantisPortal",
    teleporterEntry = MANTIS_TELEPORT_ENTRY,
    insidePosition = MANTIS_INSIDE_POSITION,
    returnPosition = MANTIS_RETURN_POSITION
}
registerTeleporter("Revamp_MantisPortal", {
    entry = MANTIS_TELEPORT_ENTRY,
    destination = MANTIS_INSIDE_POSITION,
    waitTime = 0.8,
    arrivalRadius = 30,
    penalty = 0,
    minDirectDistance = 0
})

local function pointInPolygonXZ(position, polygon)
    if not polygon or #polygon < 3 then
        return false
    end
    local x = position.X
    local z = position.Z
    local inside = false
    local j = #polygon
    for i = 1, #polygon do
        local pi = polygon[i]
        local pj = polygon[j]
        local condition = ((pi.Y > z) ~= (pj.Y > z)) and
            (x < (pj.X - pi.X) * (z - pi.Y) / math.max(pj.Y - pi.Y, 1e-9) + pi.X)
        if condition then
            inside = not inside
        end
        j = i
    end
    return inside
end

local function findClosestZoneTarget()
    local localPlayer = player
    local localCharacter = localPlayer and localPlayer.Character
    local localRoot = localCharacter and localCharacter:FindFirstChild("HumanoidRootPart")
    if not localRoot then
        return nil
    end

    local myInfo = myTeam() or {}
    local myLeader = myInfo[1]
    local myTeamName = myInfo[2]

    local closestPlayer = nil
    local closestDistance = math.huge

    for _, otherPlayer in ipairs(Players:GetPlayers()) do
        if otherPlayer ~= localPlayer then
            local character = otherPlayer.Character
            local humanoid = character and character:FindFirstChildOfClass("Humanoid")
            local rootPart = character and character:FindFirstChild("HumanoidRootPart")
            if humanoid and humanoid.Health > 0 and rootPart and not isInsideSafeZone(rootPart.Position) then
                local otherInfo = {}
                local ok, result = pcall(myTeam, character and character.Name or otherPlayer.Name)
                if ok then
                    otherInfo = result or {}
                end
                local sameLeader = myLeader ~= nil and otherInfo[1] == myLeader
                local sameTeam = myTeamName ~= nil and otherInfo[2] == myTeamName
                if not sameLeader and not sameTeam then
                    local distance = (rootPart.Position - localRoot.Position).Magnitude
                    if distance < closestDistance then
                        closestDistance = distance
                        closestPlayer = otherPlayer
                    end
                end
            end
        end
    end

    return closestPlayer
end

local function findClosestEnemy()
    local localPlayer = player
    local localCharacter = localPlayer and localPlayer.Character
    local localRoot = localCharacter and localCharacter:FindFirstChild("HumanoidRootPart")
    if not localRoot then
        return nil
    end

    local myInfo = myTeam() or {}
    local myLeader = myInfo[1]
    local myTeamName = myInfo[2]

    local closestPlayer = nil
    local closestDistance = math.huge

    for _, otherPlayer in ipairs(Players:GetPlayers()) do
        if otherPlayer ~= localPlayer then
            local character = otherPlayer.Character
            local humanoid = character and character:FindFirstChildOfClass("Humanoid")
            local rootPart = character and character:FindFirstChild("HumanoidRootPart")
            if humanoid and humanoid.Health > 0 and rootPart then
                local otherInfo = {}
                local ok, result = pcall(myTeam, character and character.Name or otherPlayer.Name)
                if ok then
                    otherInfo = result or {}
                end
                local sameLeader = myLeader ~= nil and otherInfo[1] == myLeader
                local sameTeam = myTeamName ~= nil and otherInfo[2] == myTeamName
                if not sameLeader and not sameTeam then
                    local distance = (rootPart.Position - localRoot.Position).Magnitude
                    if distance < closestDistance then
                        closestDistance = distance
                        closestPlayer = otherPlayer
                    end
                end
            end
        end
    end

    return closestPlayer
end

local function engageEnemy(enemy, options)
    options = options or {}
    if not enemy or (not _G.autoPVP and not options.force) then
        return
    end

    local targetPlayer = enemy.player
    if not targetPlayer then
        return
    end

    local localPlayer = game.Players.LocalPlayer
    local localCharacter = localPlayer.Character
    if not localCharacter then
        return
    end
    local localRootPart = localCharacter:FindFirstChild("HumanoidRootPart")
    if not localRootPart then
        return
    end

    local allowedLevel = increaseByPercentage(localPlayer.leaderstats.Level.value, incDMG_)
    if allowedLevel < enemy.lvl then
        warn(targetPlayer.Name .. " is too strong")
        return
    end

    local targetCharacter = targetPlayer.Character
    local targetHumanoid = targetCharacter and targetCharacter:FindFirstChildOfClass("Humanoid")
    local targetRoot = targetCharacter and targetCharacter:FindFirstChild("HumanoidRootPart")
    if not targetHumanoid or not targetRoot then
        return
    end
    updated_()
    local mantisConfig = Revamp.Data.Zones and Revamp.Data.Zones.MantisWorld
    local function evaluateMantisState(targetPosition)
        if not mantisConfig or not mantisConfig.polygon then
            return false, false, nil
        end
        local currentRoot = getHumanoidRootPart(humanoid)
        local playerInside = false
        if currentRoot then
            playerInside = pointInPolygonXZ(currentRoot.Position, mantisConfig.polygon)
        end
        local targetInside = pointInPolygonXZ(targetPosition, mantisConfig.polygon)
        return playerInside, targetInside, currentRoot
    end
    local function enterMantis(targetPosition)
        if not mantisConfig then
            return false
        end
        local success = false
        if mantisConfig.teleporterName then
            success = useTeleporter(mantisConfig.teleporterName, humanoid, {
                cancelled = shouldCancel
            })
        end
        if not success and mantisConfig.teleporterEntry then
            success = moveToTarget(mantisConfig.teleporterEntry, humanoid, {
                cancelled = shouldCancel
            })
        end
        if not success and mantisConfig.insidePosition then
            success = pcall(function()
                local root = getHumanoidRootPart(humanoid)
                if root then
                    root.CFrame = CFrame.new(mantisConfig.insidePosition)
                end
            end)
        end
        if success then
            mantisTeleportActive = true
            mantisTeleportReturnCF =
                (mantisConfig.returnPosition and CFrame.new(mantisConfig.returnPosition)) or
                (localRootPart and localRootPart.CFrame)
            Revamp.State.mantisTeleportActive = true
        end
        return success
    end
    local function exitMantis()
        if not mantisTeleportActive then
            return
        end
        mantisTeleportActive = false
        Revamp.State.mantisTeleportActive = false
        if mantisConfig then
            local root = getHumanoidRootPart(humanoid)
            if mantisConfig.returnPosition then
                local ok = pcall(function()
                    if root then
                        root.CFrame = CFrame.new(mantisConfig.returnPosition)
                    end
                end)
                if not ok then
                    moveToTarget(mantisConfig.returnPosition, humanoid, {
                        cancelled = shouldCancel
                    })
                end
            elseif mantisTeleportReturnCF then
                pcall(function()
                    if root then
                        root.CFrame = mantisTeleportReturnCF
                    end
                end)
            end
        end
        mantisTeleportReturnCF = nil
    end
    local playerInsideMantis, targetInsideMantis, refreshedRootPart = evaluateMantisState(targetRoot.Position)
    if refreshedRootPart then
        localRootPart = refreshedRootPart
    end
    if mantisConfig then
        if targetInsideMantis and not playerInsideMantis then
            if enterMantis(targetRoot.Position) then
                playerInsideMantis, targetInsideMantis, refreshedRootPart = evaluateMantisState(targetRoot.Position)
                if refreshedRootPart then
                    localRootPart = refreshedRootPart
                end
            end
        elseif playerInsideMantis and mantisTeleportActive and not targetInsideMantis then
            exitMantis()
            playerInsideMantis, targetInsideMantis, refreshedRootPart = evaluateMantisState(targetRoot.Position)
            if refreshedRootPart then
                localRootPart = refreshedRootPart
            end
        end
    end
    local function attemptDynamicApproach()
        local rootPart = getHumanoidRootPart(humanoid)
        local currentTargetCharacter = targetPlayer.Character
        local targetRootPart = currentTargetCharacter and currentTargetCharacter:FindFirstChild("HumanoidRootPart")
        if not rootPart or not targetRootPart then
            return false
        end
        if tryTeleportRoute(
            humanoid,
            targetRootPart.Position,
            {
                cancelled = shouldCancel,
                margin = 30
            }
        ) then
            return true
        end
        local separation = (targetRootPart.Position - rootPart.Position).Magnitude
        if separation < PATH_DYNAMIC_TRIGGER then
            return false
        end
        return followDynamicTarget(
            targetPlayer,
            humanoid,
            {
                cancelled = shouldCancel
            }
        )
    end
    attemptDynamicApproach()
    targetCharacter = targetPlayer.Character
    targetHumanoid = targetCharacter and targetCharacter:FindFirstChildOfClass("Humanoid")
    targetRoot = targetCharacter and targetCharacter:FindFirstChild("HumanoidRootPart")
    if isInsideSafeZone(targetRoot.Position) then
        print(string.format("[AutoPVP] %s E-Zoned (already safe).", targetPlayer.Name))
        return
    end
    local wasReturning = returningHome
    if wasReturning then
        returningHome = false
        returnMoveToken = returnMoveToken + 1
    end
    local originalCF
    if returnHomeCF then
        originalCF = returnHomeCF
    else
        originalCF = localRootPart.CFrame
        returnHomeCF = originalCF
    end

    if attacking_ then
        return
    end

    local originalAutoJump = autoJump
    autoJump = false
    Revamp.State.autoJump = autoJump

    attacking_ = true
    Jump_()

    local lastHumanoid = targetHumanoid
    local function shouldCancel()
        return (options.cancelled and options.cancelled()) or false
    end

    local function tryRetarget()
        if not options.retargetOnKill or shouldCancel() then
            return false
        end
        local getter = options.getNewTarget
        if not getter then
            return false
        end
        local newPlayer = getter(targetPlayer)
        if newPlayer and newPlayer ~= targetPlayer then
            targetPlayer = newPlayer
            enemy.player = newPlayer
            enemy.lvl = (options.resolveLevel and options.resolveLevel(newPlayer)) or enemy.lvl
            lastHumanoid = nil
            return true
        end
        return false
    end

    if autoFight then
        -- only hit onces
        targetCharacter = targetPlayer.Character
        targetHumanoid = targetCharacter and targetCharacter:FindFirstChildOfClass("Humanoid")
        print("Hit once")
        hitHumanoid(targetHumanoid)
    end
    while _G.autoPVP or options.force do
        if shouldCancel() then
            break
        end
        attemptDynamicApproach()
        targetCharacter = targetPlayer.Character
        targetHumanoid = targetCharacter and targetCharacter:FindFirstChildOfClass("Humanoid")
        targetRoot = targetCharacter and targetCharacter:FindFirstChild("HumanoidRootPart")

        if not targetHumanoid or not targetRoot then
            if tryRetarget() then
                continue
            end
            break
        end

        if mantisConfig then
            local insidePlayer, insideTarget, refreshedRoot = evaluateMantisState(targetRoot.Position)
            if refreshedRoot then
                localRootPart = refreshedRoot
            end
            if insideTarget and not insidePlayer then
                enterMantis(targetRoot.Position)
                insidePlayer, insideTarget, refreshedRoot = evaluateMantisState(targetRoot.Position)
                if refreshedRoot then
                    localRootPart = refreshedRoot
                end
            elseif insidePlayer and mantisTeleportActive and not insideTarget then
                exitMantis()
                insidePlayer, insideTarget, refreshedRoot = evaluateMantisState(targetRoot.Position)
                if refreshedRoot then
                    localRootPart = refreshedRoot
                end
            end
        end

        if isInsideSafeZone(targetRoot.Position) then
            print(string.format("[AutoPVP] %s EZ zone", targetPlayer.Name))
            if tryRetarget() then
                continue
            end
            break
        end

        if targetHumanoid ~= lastHumanoid then
            lastHumanoid = targetHumanoid
        end

        hitHumanoid(targetHumanoid)
        local predictedPos = PredictPlayerPosition(targetPlayer, 0.25)
        if predictedPos then
            humanoid:MoveTo(predictedPos)
            updateChaseDebug(predictedPos)
        else
            humanoid:MoveTo(targetRoot.Position)
            updateChaseDebug(targetRoot.Position)
        end

        if targetHumanoid.Health <= 0 then
            if tryRetarget() then
                continue
            end
            break
        end

        wait(0.1)
    end

    if mantisTeleportActive then
        exitMantis()
    end

    attacking_ = false
    updateChaseDebug(nil)

    returningHome = true
    returnMoveToken = returnMoveToken + 1
    local myReturnToken = returnMoveToken
    local ok, err = pcall(function()
        moveToTarget(originalCF, nil, {
            cancelled = function()
                return myReturnToken ~= returnMoveToken
            end
        })
    end)
    if not ok then
        warn("Failed returning to origin:", err)
    end
    if myReturnToken == returnMoveToken then
        pcall(function()
            localRootPart.CFrame = originalCF
        end)
        returnHomeCF = nil
        returningHome = false
    end

    autoJump = originalAutoJump
    Revamp.State.autoJump = autoJump
end

local function getTargetLevelValue(targetPlayer)
    local stats = targetPlayer and targetPlayer:FindFirstChild("leaderstats")
    if not stats then
        return 0
    end
    local levelValue = stats:FindFirstChild("Level") or stats:FindFirstChild("level")
    if levelValue then
        return levelValue.Value or levelValue.value or 0
    end
    return 0
end

startAutoZoneLoop = function()
    if autoZoneTask then
        return
    end
    Revamp.State.autoZone = true
    autoZoneTask =
        task.spawn(function()
        while true do
            if not autoZoneEnabled then
                if autoZoneBaseCF and player.Character then
                    local rootPart = player.Character:FindFirstChild("HumanoidRootPart")
                    if rootPart then
                        PathfindTo(autoZoneBaseCF, 2)
                    end
                end
                break
            end
            local ok, err =
                pcall(function()
                    if not player.Character then
                        return
                    end
                    if not autoZoneBaseCF then
                        local rootPart = player.Character:FindFirstChild("HumanoidRootPart")
                        if rootPart then
                            autoZoneBaseCF = rootPart.CFrame
                        end
                    end
                    if attacking_ or returningHome then
                        return
                    end
                    local target = findClosestZoneTarget()
                    if target then
                        autoZoneCancelToken = autoZoneCancelToken + 1
                        local myToken = autoZoneCancelToken
                        if autoZoneBaseCF then
                            returnHomeCF = autoZoneBaseCF
                        end
                        engageEnemy(
                            {
                                player = target,
                                lvl = getTargetLevelValue(target)
                            },
                            {
                                force = true,
                                retargetOnKill = true,
                                getNewTarget = function()
                                    return findClosestZoneTarget()
                                end,
                                resolveLevel = getTargetLevelValue,
                                cancelled = function()
                                    return not autoZoneEnabled or myToken ~= autoZoneCancelToken
                                end
                            }
                        )
                    else
                        if autoZoneBaseCF and not finding then
                            local rootPart =
                                player.Character and player.Character:FindFirstChild("HumanoidRootPart")
                            if rootPart and (rootPart.Position - autoZoneBaseCF.Position).Magnitude > 7 then
                                PathfindTo(autoZoneBaseCF, 2)
                            end
                        end
                    end
                end)
            if not ok then
                warn("[AutoZone] loop error:", err)
            end
            task.wait(AUTO_ZONE_POLL_RATE)
        end
        autoZoneTask = nil
    end)
end

stopAutoZoneLoop = function()
    autoZoneEnabled = false
    Revamp.State.autoZone = false
    autoZoneBaseCF = nil
    autoZoneCancelToken = autoZoneCancelToken + 1
    pathfindingComplete = true
    updateChaseDebug(nil)
end

local chaseDebugPart = nil
updateChaseDebug = function(position)
    if not position then
        if chaseDebugPart then
            chaseDebugPart:Destroy()
            chaseDebugPart = nil
        end
        return
    end
    if not chaseDebugPart then
        chaseDebugPart = Instance.new("Part")
        chaseDebugPart.Name = "Revamp_ChaseDebug"
        chaseDebugPart.Anchored = true
        chaseDebugPart.CanCollide = false
        chaseDebugPart.Transparency = 0.5
        chaseDebugPart.Size = Vector3.new(2, 2, 2)
        chaseDebugPart.Color = Color3.fromRGB(255, 0, 0)
        chaseDebugPart.Parent = workspace
    end
    chaseDebugPart.CFrame = CFrame.new(position)
end


local function startAutoFlightChase()
    if autoFlightChaseTask then
        return
    end
    autoFlightChaseTask =
        task.spawn(function()
        while autoFlightChaseEnabled do
            local character = player.Character
            local humanoid = character and character:FindFirstChildOfClass("Humanoid")
            local rootPart = character and character:FindFirstChild("HumanoidRootPart")
            local camera = workspace.CurrentCamera
            if character and humanoid and rootPart and camera then
                local targetPlayer = findClosestEnemy()
                local targetRoot = targetPlayer and targetPlayer.Character and targetPlayer.Character:FindFirstChild("HumanoidRootPart")
                if targetRoot then
                    camera.CFrame = CFrame.lookAt(camera.CFrame.Position, targetRoot.Position)
                    rootPart.CFrame = CFrame.lookAt(rootPart.Position, targetRoot.Position)
                    humanoid:Move(Vector3.new(0, 0, -1), true)
                else
                    humanoid:Move(Vector3.new(), true)
                end
            end
            task.wait(AUTO_FLIGHT_POLL_RATE)
        end
        autoFlightChaseTask = nil
    end)
end

local function stopAutoFlightChase()
    autoFlightChaseEnabled = false
    if autoFlightChaseTask then
        while autoFlightChaseTask do
            task.wait(0)
        end
    end
end

_G.log6 = true
_G.log5 = false
local function hptp()
    local Humanoid = game.Players.LocalPlayer.Character.Humanoid
    local OldHealth = Humanoid.Health

    Humanoid:GetPropertyChangedSignal("Health"):Connect(
        function()
            local percent = OldHealth / Humanoid.Health
            local percent2 = Humanoid.Health / OldHealth

            if (_G.log6 == false) then
                return
            end
            if (Humanoid.Health < 1) then
                deathPose = game.Players.LocalPlayer.Character:WaitForChild("HumanoidRootPart").CFrame
                justDied=true
            end
            pcall(
                function()
                    if Humanoid.Health < OldHealth then
                        --game.Players.LocalPlayer.Character:WaitForChild("HumanoidRootPart").CFrame =CFrame.new(newPos)
                        local enemy = findDmg(OldHealth - Humanoid.Health)
                        print("damage taken", OldHealth - Humanoid.Health)
                        engageEnemy(enemy)
                    else
                        print("Healed", Humanoid.Health - OldHealth)
                    end
                end
            )
            OldHealth = Humanoid.Health
        end
    )
end
local Players = game:GetService("Players")
for _, player in pairs(game:GetService("Players"):GetPlayers()) do
end
game.Players.LocalPlayer.CharacterAdded:Connect(
    function(char)
        defineLocals()
        pcall(updated_)
        updated_()
        justDied=false
        if deathPose then
            moveToTarget(deathPose)
            game.Players.LocalPlayer.Character:WaitForChild("HumanoidRootPart").CFrame = deathPose
        end
        hptp()
    end
)
defineLocals()
pcall(updated_)
updated_()
hptp()
spawn(
function()
    local placeId = game.PlaceId
print(placeId)

local AnimalSim={
    main=5712833750,
    PvP=13399356664
}
Revamp.Data.AnimalSim = AnimalSim
-- List of select player names to protect automaticaly from others
local selectedPlayers = {
    "notime4crazy","282475249a7auto","9","Allaboutsuki","DefNotRealMe","Doornextguythat","Little_Puppywolf","ProGammerMove_1","RektBySuki","RektBySukisAlt","Rockyrode112","Rose_altl5","Sakura_Mirai","SimpleDisasters","TheBestAccount_mom","TheFreeAccount_Free1","TheOneMyth","Unicornzzz6109","baby46793","batman_kite","foalsarecut","iwillendUmadaf4","Miner_havennoob","naypolm","naypolm005","naypolm05","naypolm12","naypolm1789","qwertyPCLOL","ll_BANX","xXxnothingxXx274", "dexvilxtails","ninja1098583","J_esusTheCreator","L_ilBoomStick","TheReal_SigmaG","SpongeBobStartFish","HeyNo_ThatsBa","TheFreeAccount_Free1","PeanutNox2180","Tsubakidoki","notime4crazy"    -- Add more player names as needed
}
Revamp.Logging.selectedPlayers = selectedPlayers
local localPlayer = game.Players.LocalPlayer
if localPlayer then
    for i, playerName in ipairs(selectedPlayers) do
        if playerName == localPlayer.Name then
            table.remove(selectedPlayers, i)
            break
        end
    end
end

-- Dictionary to store initial health values for selected players
-- Function to log damage taken by selected players
local function LogDamage(player, damageAmount)

    if damageAmount<0 then damageAmount=-damageAmount end
    print(player.Name .. " took " .. damageAmount .. " damage")
    local enemy = findDmg(damageAmount)
    if not enemy then
        return
    end
    print(
        "IncDMG:",
        increaseByPercentage(game.Players.LocalPlayer.leaderstats.Level.value, incDMG_),
        enemy.lvl
    )
    engageEnemy(enemy)
    -- You can add more advanced logging or processing here if needed
end

-- Dictionary to store initial health values for selected players
local initialHealth = {}

-- Function to log events for selected players
local function LogEvent(player, event)
    print(player.Name .. " " .. event)
    -- You can add more advanced logging or processing here if needed
end

-- Function to connect to the player's health changes
local function ConnectHealthChanged(player)
    local function DisconnectHealthChanged()
        repeat wait(0) until player.Character:FindFirstChild("Humanoid");
        local humanoid = player.Character:FindFirstChild("Humanoid")
        if humanoid then
            initialHealth[player] = humanoid.Health

            local healthChangedConnection
            print("Connected HP",player)
            healthChangedConnection = humanoid:GetPropertyChangedSignal("Health"):Connect(function()
                local currentHealth = humanoid.Health
                local initialHealthValue = initialHealth[player]
                LogDamage(player,initialHealthValue - currentHealth)
                LogEvent(player, "health changed by " .. (initialHealthValue - currentHealth))
                initialHealth[player] = currentHealth
            end)

            player.Character.AncestryChanged:Connect(function(_, newParent)
                if newParent == nil then
                    print("Disconnected HP",player)
                    healthChangedConnection:Disconnect()
                end
            end)
        end
    end

    player.CharacterAdded:Connect(function()
        LogEvent(player, "character changed")
        DisconnectHealthChanged()
        -- Reconnect the event for the new character
    end)
    DisconnectHealthChanged()
end

-- Check existing players for selected names
for _, playerName in ipairs(selectedPlayers) do
    local existingPlayer = game.Players:FindFirstChild(playerName)
    if existingPlayer then
        LogEvent(existingPlayer, "joined")
        ConnectHealthChanged(existingPlayer)
    end
end

-- Connect to the PlayerAdded event for future players
game.Players.PlayerAdded:Connect(function(player)
    for _, playerName in ipairs(selectedPlayers) do
        if player.Name == playerName then
            LogEvent(player, "joined")
            ConnectHealthChanged(player)
        end
    end
end)
end
)

--[[
    Expose core helpers through the Revamp table so other scripts can opt into specific systems
    without traversing the entire legacy file. These assignments intentionally sit at the bottom
    to ensure every dependency is defined before export.
]]
Revamp.Utilities.teamCheck = teamCheck
Revamp.Utilities.findClosestPlayer = findClosestPlayer
Revamp.Utilities.PredictPlayerPosition = PredictPlayerPosition
Revamp.Utilities.teleportInFrontOfPlayer = teleportInFrontOfPlayer
Revamp.Utilities.increaseByPercentage = increaseByPercentage
Revamp.Utilities.defineNilLocals = defineNilLocals
Revamp.Utilities.waitForChar = waitForChar
Revamp.Utilities.defineLocals = defineLocals
Revamp.Utilities.updateSelectedPlayer = updateSelectedPlayer
Revamp.Utilities.stayNearPlayer = stayNearPlayer
Revamp.Utilities.CombineCFrameAndVector = CombineCFrameAndVector
Revamp.Utilities.conv = conv
Revamp.Utilities.comparCash = comparCash
Revamp.Utilities.updated = updated_
Revamp.Utilities.dist = dist
Revamp.Utilities.waitDoneMove = waitDoneMove
Revamp.Utilities.getClosest = getClosest
Revamp.Utilities.myTeam = myTeam
Revamp.Utilities.getTeams = getTeams
Revamp.Utilities.getPos = getPos
Revamp.Utilities.fire = fire
Revamp.Utilities.findDmg = findDmg
Revamp.Utilities.hptp = hptp
Revamp.Utilities.isInsideSafeZone = isInsideSafeZone

Revamp.Pathing.getPathToPosition = getPathToPosition
Revamp.Pathing.moveToTarget = moveToTarget
Revamp.Pathing.PathfindTo = PathfindTo
Revamp.Pathing.followPath = followPath
Revamp.Pathing.MoveTo = MoveTo
Revamp.Pathing.tp = tp
Revamp.Pathing.goTo = goTo
Revamp.Pathing.goBack = goBack
Revamp.Pathing.followDynamicTarget = followDynamicTarget
Revamp.Pathing.registerTeleporter = registerTeleporter
Revamp.Pathing.unregisterTeleporter = unregisterTeleporter
Revamp.Pathing.clearTeleporters = clearTeleporters
Revamp.Pathing.useTeleporter = function(name, humanoidOrOptions, maybeOptions)
    if typeof(humanoidOrOptions) == "table" or humanoidOrOptions == nil then
        return useTeleporter(name, nil, humanoidOrOptions)
    end
    return useTeleporter(name, humanoidOrOptions, maybeOptions)
end
Revamp.Pathing.tryTeleportRoute = tryTeleportRoute

Revamp.Combat.BloxFruit = BloxFruit
Revamp.Combat.heal = heal
Revamp.Combat.useAllFire = useAllFire
Revamp.Combat.useAllFireFromPosition = useAllFire_
Revamp.Combat.destroyAll = destroyAll
Revamp.Combat.damageplayer = damageplayer
Revamp.Combat.aura = aura
Revamp.Combat.dmgloop = dmgloop
Revamp.Combat.toggleFarm = toggleFarm
Revamp.Combat.toggleAura = toggleAura
Revamp.Combat.findPlr = findPlr
Revamp.Combat.farm = farm
Revamp.Combat.farmPassive = farm_
Revamp.Combat.Jump = Jump_
Revamp.Combat.v2 = v2
Revamp.Combat.engageEnemy = engageEnemy
Revamp.Combat.findClosestZoneTarget = findClosestZoneTarget
Revamp.Combat.startAutoZone = startAutoZoneLoop
Revamp.Combat.stopAutoZone = stopAutoZoneLoop
Revamp.Combat.findClosestEnemy = findClosestEnemy
Revamp.Combat.startAutoFlightChase = startAutoFlightChase
Revamp.Combat.stopAutoFlightChase = stopAutoFlightChase

Revamp.Farming.Clovers = Clovers
Revamp.Farming.Boxes = Boxes
Revamp.Farming.MHBox = MHBox
Revamp.Farming.destoryAll = destoryAll
Revamp.Farming.openBox = openBox
Revamp.Farming.loadLayouts = loadLayouts
Revamp.Farming.farmRebirth = farmRebirth
Revamp.Farming.MinerFarm = farmRebirth

Revamp.Inventory.getItem = getItem
Revamp.Inventory.ItemPlaced = ItemPlaced
Revamp.Inventory.ShopItems = ShopItems
Revamp.Inventory.HasItem = HasItem
Revamp.Inventory.IsShopItem = IsShopItem
Revamp.Inventory.hasCat = hasCat
Revamp.Inventory.GetDistanceBetweenCFrame = GetDistanceBetweenCFrame

Revamp.Logging.LogDamage = LogDamage
Revamp.Logging.LogEvent = LogEvent
Revamp.Logging.ConnectHealthChanged = ConnectHealthChanged
Revamp.Logging.initialHealth = initialHealth
Revamp.Logging.startRemoteSpy = function(options)
    local result = remoteSpy.start(options)
    Revamp.State.remoteSpy = remoteSpy.active
    return result
end
Revamp.Logging.stopRemoteSpy = function()
    local result = remoteSpy.stop()
    Revamp.State.remoteSpy = remoteSpy.active
    return result
end
Revamp.Logging.remoteSpyActive = function()
    return remoteSpy.active
end
Revamp.Logging.startInboundSpy = function(options)
    local result = inboundSpy.start(options)
    Revamp.State.inboundSpy = inboundSpy.active
    return result
end
Revamp.Logging.stopInboundSpy = function()
    local result = inboundSpy.stop()
    Revamp.State.inboundSpy = inboundSpy.active
    return result
end
Revamp.Logging.inboundSpyActive = function()
    return inboundSpy.active
end

Revamp.Services.Players = Players or game:GetService("Players")
Revamp.Services.RunService = RunService or game:GetService("RunService")
Revamp.Services.PathfindingService = PathfindingService or game:GetService("PathfindingService")
Revamp.Services.UserInputService = userInputService or game:GetService("UserInputService")
Revamp.Services.ReplicatedStorage = game:GetService("ReplicatedStorage")

Revamp.State.incDMG = incDMG_
Revamp.State.justDied = justDied
Revamp.State.autoJump = autoJump
Revamp.State.autoFight = autoFight
Revamp.State.autoEat = autoEatEnabled
Revamp.State.returningHome = returningHome
Revamp.State.returnHomeCF = returnHomeCF
Revamp.State.autoSelectTarget = usertarget
Revamp.State.autoZone = autoZoneEnabled
Revamp.State.autoFlightChase = autoFlightChaseEnabled
Revamp.State.autoFireball = autoFireballEnabled
Revamp.State.mantisTeleportActive = mantisTeleportActive
Revamp.State.inboundSpy = inboundSpy.active
Revamp.Pathing.registerTeleporter("MantisEntry", {
    entry = Vector3.new(200.921, 708.134, -16601.699),
    destination = Vector3.new(591.384, 647.570, -16412.795), -- adjust to your preferred inside spot
    waitTime = 0.75,
})
Revamp.Data.SafeZones.Mantis = {
    polygon = {
        Vector2.new(591.384, -16412.795),
        Vector2.new(-481.543, -16411.883),
        Vector2.new(429.424, -17475.959),
        Vector2.new(593.891, -16411.883),
    },
}

getgenv().RevampLua = Revamp

return Revamp
