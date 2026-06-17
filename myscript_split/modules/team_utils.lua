local function teamCheck(name)
    local playerTeam=nil
    local includesMember
    for a,b in pairs(workspace.Teams:GetChildren())do
        print(b)
        for c,member in pairs(b:GetChildren())do
            if(member.value==game.Players.LocalPlayer.Name)then
                playerTeam=a
                print(a,b,c,member)
            end
        end
    end
    if not playerTeam then return false end
    for a,b in pairs(workspace.Teams:GetChildren()[playerTeam]:GetChildren())do
        if(b.value==name)then return true end
    end
    return false
end

local function findClosestPlayer()
    local players = game.Players:GetPlayers()
    local closestPlayer = nil
    local closestDistance = math.huge
    local localPlayerPosition = game.Players.LocalPlayer.Character and game.Players.LocalPlayer.Character.PrimaryPart.Position

    if localPlayerPosition then
        for _, player in pairs(players) do
            if player ~= game.Players.LocalPlayer and player.Character and player.Character:FindFirstChild("Humanoid") and player.Character.Humanoid.Health > 0 then
                local playerPosition = player.Character and player.Character.PrimaryPart and player.Character.PrimaryPart.Position
                if playerPosition then
                    local distance = (localPlayerPosition - playerPosition).Magnitude
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

return {
    teamCheck = teamCheck,
    findClosestPlayer = findClosestPlayer
}
