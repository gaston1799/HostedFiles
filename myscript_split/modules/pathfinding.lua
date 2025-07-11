local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local PathfindingService = game:GetService("PathfindingService")

local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")

local targetPosition = nil  -- top scope target pos, set externally
local currentPath = {}      -- top scope current path waypoints
local followTarget = false  -- flag for follow mode

local _pathVersion = 0      -- version to track path updates

-- Disable keyboard input while following
local function disableMovementInput(disable)
    if disable then
        UserInputService.OverrideKeyboardMoveInput = Enum.OverrideKeyboardMoveDirection.None
    else
        UserInputService.OverrideKeyboardMoveInput = Enum.OverrideKeyboardMoveDirection.All
    end
end

-- Build path using Roblox pathfinder
local function computePathToTarget()
    if not humanoid or not targetPosition then return nil end
    local path = PathfindingService:CreatePath({
        AgentRadius = humanoid.HipHeight / 2,
        AgentHeight = humanoid.HipHeight,
        AgentCanJump = true,
        AgentJumpHeight = humanoid.JumpHeight,
        AgentMaxSlope = humanoid.MaxSlopeAngle,
        AgentMaxStepHeight = humanoid.HipHeight,
    })
    local success, err = pcall(function()
        path:ComputeAsync(humanoid.RootPart.Position, targetPosition)
    end)
    if not success or path.Status ~= Enum.PathStatus.Success then
        return nil
    end
    return path
end

-- Spawn path recalculation loop (runs forever)
task.spawn(function()
    while true do
        if targetPosition then
            local path = computePathToTarget()
            if path then
                currentPath = path:GetWaypoints()
                _pathVersion += 1
            else
                currentPath = {}
            end
        else
            currentPath = {}
        end
        task.wait(0.5) -- recalc interval
    end
end)

-- Spawn path following loop (runs forever)
task.spawn(function()
    local localPath = {}
    local localVersion = 0
    local index = 1
    
    while true do
        if not followTarget or not targetPosition or #currentPath == 0 then
            disableMovementInput(false)
            task.wait(0.1)
        else
            disableMovementInput(true)
            if localVersion ~= _pathVersion then
                localVersion = _pathVersion
                localPath = currentPath
                index = 1
            end
            
            if index > #localPath then
                -- reached end of path; wait for new path updates
                task.wait(0.1)
            else
                local waypoint = localPath[index]
                humanoid:MoveTo(waypoint.Position)
                humanoid.MoveToFinished:Wait()
                index += 1
            end
        end
        task.wait() -- yield so we don't freeze Roblox
    end
end)

-- Expose function to set target and start/stop follow
local function setTarget(pos)
    targetPosition = pos
end

local function setFollow(state)
    followTarget = state
end

return {
    setTarget = setTarget,
    setFollow = setFollow,
}