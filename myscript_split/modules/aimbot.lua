local TweenService = game:GetService("TweenService")
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

local Aimbot = {}

-- Settings
Aimbot.aimSpeed = 5          -- speed multiplier
Aimbot.aimEnabled = false    -- toggle aimbot on/off
Aimbot.smoothAim = true      -- use Tween or instant snap
Aimbot.targetType = "player" -- "player" or "npc"

local localPlayer = Players.LocalPlayer
local camera = workspace.CurrentCamera

-- Helper: Get potential targets based on type
local function getTargets()
    if Aimbot.targetType == "player" then
        local targets = {}
        for _, plr in pairs(Players:GetPlayers()) do
            if plr ~= localPlayer and plr.Character and plr.Character:FindFirstChild("HumanoidRootPart") then
                table.insert(targets, plr.Character.HumanoidRootPart)
            end
        end
        return targets
    elseif Aimbot.targetType == "npc" then
        -- customize this to fit your NPC model locations
        local npcs = workspace:FindFirstChild("NPCs")
        if not npcs then return {} end
        local targets = {}
        for _, npc in pairs(npcs:GetChildren()) do
            local hrp = npc:FindFirstChild("HumanoidRootPart")
            if hrp then
                table.insert(targets, hrp)
            end
        end
        return targets
    else
        return {}
    end
end

-- Helper: Find closest target to center of screen
local function findClosestTarget()
    local targets = getTargets()
    local closestTarget = nil
    local shortestDistance = math.huge
    local viewportCenter = Vector2.new(camera.ViewportSize.X/2, camera.ViewportSize.Y/2)

    for _, targetPart in pairs(targets) do
        local screenPos, onScreen = camera:WorldToViewportPoint(targetPart.Position)
        if onScreen then
            local dist = (Vector2.new(screenPos.X, screenPos.Y) - viewportCenter).Magnitude
            if dist < shortestDistance then
                shortestDistance = dist
                closestTarget = targetPart
            end
        end
    end

    return closestTarget
end

-- Tween object reference, reused for smooth aiming
local currentTween = nil

-- Core function to update aim every frame
local function aimAtTarget(targetPart, dt)
    if not targetPart then return end

    local camCFrame = camera.CFrame
    local direction = (targetPart.Position - camCFrame.Position).Unit
    local targetCFrame = CFrame.new(camCFrame.Position, camCFrame.Position + direction)

    if Aimbot.smoothAim then
        -- Tween from current CFrame to target CFrame
        if currentTween then
            currentTween:Cancel()
        end
        local tweenInfo = TweenInfo.new(Aimbot.aimSpeed * dt, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)
        currentTween = TweenService:Create(camera, tweenInfo, {CFrame = targetCFrame})
        currentTween:Play()
    else
        -- Instant snap aim
        camera.CFrame = targetCFrame
    end
end

-- Main update loop, connected to RenderStepped
function Aimbot:start()
    self._conn = RunService.RenderStepped:Connect(function(dt)
        if not self.aimEnabled then return end

        local target = findClosestTarget()
        if target then
            aimAtTarget(target, dt)
        end
    end)
end

function Aimbot:stop()
    if self._conn then
        self._conn:Disconnect()
        self._conn = nil
    end
    if currentTween then
        currentTween:Cancel()
        currentTween = nil
    end
end

return Aimbot