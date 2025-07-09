local function PredictPlayerPosition(player)
    local character = player.Character
    if character then
        local humanoid = character:FindFirstChildOfClass("Humanoid")
        if humanoid then
            local velocity = humanoid.WalkSpeed * humanoid.WalkDirection + humanoid.RootPart.Velocity
            local time = 1  -- You can adjust this value to predict the position at a specific time in the future

            local predictedPosition = character.PrimaryPart.Position + velocity * time
            return predictedPosition
        end
    end

    return nil  -- Return nil if prediction is not possible
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

function increaseByPercentage(number, percentage)
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
local function moveToTarget(target, humanoid)
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

    local function moveToFinished()
        humanoid.MoveToFinished:Wait()
    end

    while currentWaypointIndex <= #waypoints do
        if(attacking_ or  justDied) then break end
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
                if(attacking_ or  justDied) then break end
                humanoid:MoveTo(currentWaypoint.Position)
                moveToFinished()
                distanceToWaypoint = (currentWaypoint.Position - humanoid.RootPart.Position).Magnitude
                wait(0) -- Adjust the delay as needed
            end
        end

        currentWaypointIndex = currentWaypointIndex + 1
    end
end

return {
    PredictPlayerPosition = PredictPlayerPosition,
    teleportInFrontOfPlayer = teleportInFrontOfPlayer,
    increaseByPercentage = increaseByPercentage,
    getPathToPosition = getPathToPosition,
    moveToTarget = moveToTarget
}

