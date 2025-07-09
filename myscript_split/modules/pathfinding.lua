-- Pathfinding utilities for Roblox NPC movement
-- Provides smooth updates while following dynamically updating paths

local PathfindingService = game:GetService("PathfindingService")
local Players = game:GetService("Players")

-- Exposed globals used by the main script
local currentPath = {}
local targetPosition = nil

-- internal state for path versioning
local _pathVersion = 0
local _recalcThread
local _followThread

-- Predicts where a player will be in the near future
local function PredictPlayerPosition(player)
    local character = player and player.Character
    local humanoid = character and character:FindFirstChildOfClass("Humanoid")
    if humanoid and character.PrimaryPart then
        local velocity = humanoid.WalkSpeed * humanoid.WalkDirection + humanoid.RootPart.Velocity
        return character.PrimaryPart.Position + velocity
    end
    return nil
end

-- Teleports the local player a short distance in front of the target player
local function teleportInFrontOfPlayer(targetPlayerName)
    local player = Players.LocalPlayer
    local targetPlayer = Players:FindFirstChild(targetPlayerName)
    if targetPlayer and targetPlayer.Character and targetPlayer.Character.PrimaryPart then
        local targetVelocity = targetPlayer.Character.PrimaryPart.Velocity
        local predicted = targetPlayer.Character.PrimaryPart.Position + targetVelocity
        if player.Character then
            player.Character:SetPrimaryPartCFrame(CFrame.new(predicted))
        end
    end
end

-- Utility to increase a number by a percentage
local function increaseByPercentage(number, percentage)
    number = tonumber(number)
    percentage = tonumber(percentage)
    assert(number and percentage, "Both arguments must be valid numbers")
    assert(percentage >= 0, "Percentage should be a positive value")
    return number + number * (percentage / 100)
end

-- Build a path from the humanoid to the target position
local function getPathToPosition(pos, humanoid)
    local path = PathfindingService:CreatePath({
        AgentRadius = humanoid.HipHeight / 2,
        AgentHeight = humanoid.HipHeight,
        AgentCanJump = true,
        AgentJumpHeight = humanoid.JumpHeight,
        AgentMaxSlope = humanoid.MaxSlopeAngle,
        AgentMaxStepHeight = humanoid.HipHeight,
    })
    local ok = pcall(function()
        path:ComputeAsync(humanoid.RootPart.Position, pos)
    end)
    if not ok or path.Status ~= Enum.PathStatus.Success then
        return nil
    end
    return path
end

-- Loop that periodically recalculates the path
local function startPathRecalculationLoop(humanoid)
    if _recalcThread then return end
    _recalcThread = task.spawn(function()
        while targetPosition do
            local path = getPathToPosition(targetPosition, humanoid)
            if path then
                currentPath = path:GetWaypoints()
            else
                currentPath = {}
            end
            _pathVersion += 1
            task.wait(0.5)
        end
    end)
end

-- Loop that follows the current path step by step
local function startPathFollowingLoop(humanoid)
    if _followThread then return end
    _followThread = task.spawn(function()
        local localVersion = _pathVersion
        local localPath = currentPath
        local index = 1
        while targetPosition do
            if index > #localPath then
                task.wait(0.05)
                if localVersion ~= _pathVersion then
                    localVersion = _pathVersion
                    localPath = currentPath
                    index = 1
                end
                continue
            end
            local waypoint = localPath[index]
            humanoid:MoveTo(waypoint.Position)
            humanoid.MoveToFinished:Wait()
            if localVersion ~= _pathVersion then
                localVersion = _pathVersion
                localPath = currentPath
                index = 1
            else
                index += 1
            end
        end
    end)
end

-- Public function used by the main script
local function moveToTarget(target, humanoid)
    humanoid = humanoid or Players.LocalPlayer.Character:WaitForChild("Humanoid")
    targetPosition = typeof(target) == "CFrame" and target.Position or target

    startPathRecalculationLoop(humanoid)
    startPathFollowingLoop(humanoid)
end

return {
    PredictPlayerPosition = PredictPlayerPosition,
    teleportInFrontOfPlayer = teleportInFrontOfPlayer,
    increaseByPercentage = increaseByPercentage,
    getPathToPosition = getPathToPosition,
    moveToTarget = moveToTarget,
}
