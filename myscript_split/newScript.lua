print("Starting up")
local currentPlaceID=game.PlaceId
local games={
	animalSim=5712833750,
	miners = 258258996,
	bloxFruits = 2753915549
}
print("waiting for game to load")
repeat
	wait()
until game:IsLoaded()
print("game laoded")
local prefixs = {
	{ Prefix = "",      Number = 1e0,   Term = "Ones"             },
	{ Prefix = "k",     Number = 1e3,   Term = "Thousand"         },
	{ Prefix = "M",     Number = 1e6,   Term = "Million"          },
	{ Prefix = "B",     Number = 1e9,   Term = "Billion"          },
	{ Prefix = "T",     Number = 1e12,  Term = "Trillion"         },
	{ Prefix = "qd",    Number = 1e15,  Term = "Quadrillion"      },
	{ Prefix = "Qn",    Number = 1e18,  Term = "Quintillion"      },
	{ Prefix = "sx",    Number = 1e21,  Term = "Sextillion"       },
	{ Prefix = "Sp",    Number = 1e24,  Term = "Septillion"       },
	{ Prefix = "O",     Number = 1e27,  Term = "Octillion"        },
	{ Prefix = "N",     Number = 1e30,  Term = "Nonillion"        },
	{ Prefix = "de",    Number = 1e33,  Term = "Decillion"        },
	{ Prefix = "Ud",    Number = 1e36,  Term = "Undecillion"      },
	{ Prefix = "DD",    Number = 1e39,  Term = "Duodecillion"     },
	{ Prefix = "tdD",   Number = 1e42,  Term = "Tredecillion"     },
	{ Prefix = "qdD",   Number = 1e45,  Term = "Quattuordecillion"},
	{ Prefix = "QnD",   Number = 1e48,  Term = "Quindecillion"    },
	{ Prefix = "sxD",   Number = 1e51,  Term = "Sedecillion"      },
	{ Prefix = "SpD",   Number = 1e54,  Term = "Septendecillion"  },
	{ Prefix = "OcD",   Number = 1e57,  Term = "Octodecillion"    },
	{ Prefix = "NvD",   Number = 1e60,  Term = "Novemdecillion"   },
	{ Prefix = "Vgn",   Number = 1e63,  Term = "Vigintillion"     },
	{ Prefix = "UVg",   Number = 1e66,  Term = "Unvigintillion"   },
	{ Prefix = "DVg",   Number = 1e69,  Term = "Duovigintillion"  },
	{ Prefix = "TVg",   Number = 1e72,  Term = "Tresvigintillion" },
	{ Prefix = "qtV",   Number = 1e75,  Term = "Quattuorvigintillion"},
	{ Prefix = "QnV",   Number = 1e78,  Term = "Quinvigintillion" },
	{ Prefix = "SeV",   Number = 1e81,  Term = "Sesvigintillion"  },
	{ Prefix = "SPG",   Number = 1e84,  Term = "Septemvigintillion"},
	{ Prefix = "OVG",   Number = 1e87,  Term = "Octovigintillion" },
	{ Prefix = "NVG",   Number = 1e90,  Term = "Novemvigintillion"},
	{ Prefix = "TGN",   Number = 1e93,  Term = "Trigintillion"    },
	{ Prefix = "UTG",   Number = 1e96,  Term = "Untrigintillion"  },
	{ Prefix = "DTG",   Number = 1e99,  Term = "Duotrigintillion" },
	{ Prefix = "tsTG",  Number = 1e102, Term = "Trestrigintillion"},
	{ Prefix = "qtTG",  Number = 1e105, Term = "Quattuortrigintillion"},
	{ Prefix = "QnTG",  Number = 1e108, Term = "Quintrigintillion"},
	{ Prefix = "ssTG",  Number = 1e111, Term = "Sestrigintillion" },
	{ Prefix = "SpTG",  Number = 1e114, Term = "Septentrigintillion"},
	{ Prefix = "OcTG",  Number = 1e117, Term = "Octotrigintillion" },
	{ Prefix = "NoTG",  Number = 1e120, Term = "Novemtrigintillion"},
	{ Prefix = "QdDR",  Number = 1e123, Term = "Quadragintillion" },
	{ Prefix = "uQDR",  Number = 1e126, Term = "Unquadragintillion"},
	{ Prefix = "dQDR",  Number = 1e129, Term = "Duoquadragintillion"},
	{ Prefix = "tQDR",  Number = 1e132, Term = "Tresquadragintillion"},
	{ Prefix = "qdQDR", Number = 1e135, Term = "Quattuorquadragintillion"},
	{ Prefix = "QnQDR", Number = 1e138, Term = "Quinquadragintillion"},
	{ Prefix = "sxQDR", Number = 1e141, Term = "Sesquadragintillion"},
	{ Prefix = "SpQDR", Number = 1e144, Term = "Septenquadragintillion"},
	{ Prefix = "OQDDr", Number = 1e147, Term = "Octoquadragintillion"},
	{ Prefix = "NQDDr", Number = 1e150, Term = "Novemquadragintillion"},
	{ Prefix = "qQGNT",Number = 1e153, Term = "Quinquagintillion"},
	{ Prefix = "uQGNT",Number = 1e156, Term = "Unquinquagintillion"},
	{ Prefix = "dQGNT",Number = 1e159, Term = "Duoquinquagintillion"},
	{ Prefix = "tQGNT",Number = 1e162, Term = "Tresquinquagintillion"},
	{ Prefix = "qdQGNT",Number=1e165, Term= "Quattuorquinquagintillion"},
	{ Prefix = "QnQGNT",Number=1e168,Term= "Quinquinquagintillion"},
	{ Prefix = "sxQGNT",Number=1e171,Term= "Sesquinquagintillion"},
	{ Prefix = "SpQGNT",Number=1e174,Term= "Septenquinquagintillion"},
	{ Prefix = "OQQGNT",Number=1e177,Term= "Octoquinquagintillion"},
	{ Prefix = "NQQGNT",Number=1e180,Term= "Novemquinquagintillion"},
	{ Prefix = "SXGNTL",Number=1e183,Term= "Sexagintillion"},
	{ Prefix = "USXGNTL",Number=1e186,Term="Unsexagintillion"},
	{ Prefix = "DSXGNTL",Number=1e189,Term="Duosexagintillion"},
	{ Prefix = "TSXGNTL",Number=1e192,Term="Tresexagintillion"},
	{ Prefix = "QTSXGNTL",Number=1e195,Term="Quattuorsexagintillion"},
	{ Prefix = "QNSXGNTL",Number=1e198,Term="Quinsexagintillion"},
	{ Prefix = "SXSXGNTL",Number=1e201,Term="Sesexagintillion"},
	{ Prefix = "SPSXGNTL",Number=1e204,Term="Septensexagintillion"},
	{ Prefix = "OSXGNTL",Number=1e207,Term="Octosexagintillion"},
	{ Prefix = "NVSXGNTL",Number=1e210,Term="Novemsexagintillion"},
	{ Prefix = "SPTGNTL",Number=1e213,Term="Septuagintillion"},
	{ Prefix = "USPTGNTL",Number=1e216,Term="Unseptuagintillion"},
	{ Prefix = "DSPTGNTL",Number=1e219,Term="Duoseptuagintillion"},
	{ Prefix = "TSPTGNTL",Number=1e222,Term="Treseptuagintillion"},
	{ Prefix = "QTSPTGNTL",Number=1e225,Term="Quattuorseptuagintillion"},
	{ Prefix = "QNSPTGNTL",Number=1e228,Term="Quinseptuagintillion"},
	{ Prefix = "SXSPTGNTL",Number=1e231,Term="Seseptuagintillion"},
	{ Prefix = "SPSPTGNTL",Number=1e234,Term="Septenseptuagintillion"},
	{ Prefix = "OSPTGNTL",Number=1e237,Term="Octoseptuagintillion"},
	{ Prefix = "NVSPTGNTL",Number=1e240,Term="Novemseptuagintillion"},
	{ Prefix = "OTGNTL", Number=1e243,Term="Octogintillion"},
	{ Prefix = "UOTGNTL",Number=1e246,Term="Unoctogintillion"},
	{ Prefix = "DOTGNTL",Number=1e249,Term="Duooctogintillion"},
	{ Prefix = "TOTGNTL",Number=1e252,Term="Treoctogintillion"},
	{ Prefix = "QTOTGNTL",Number=1e255,Term="Quattuoroctogintillion"},
	{ Prefix = "QNOTGNTL",Number=1e258,Term="Quinoctogintillion"},
	{ Prefix = "SXOTGNTL",Number=1e261,Term="Sexoctogintillion"},
	{ Prefix = "SPOTGNTL",Number=1e264,Term="Septemoctogintillion"},
	{ Prefix = "OTOTGNTL",Number=1e267,Term="Octooctogintillion"},
	{ Prefix = "NVOTGNTL",Number=1e270,Term="Novemoctogintillion"},
	{ Prefix = "NONGNTL",Number=1e273,Term="Nonagintillion"},
	{ Prefix = "UNONGNTL",Number=1e276,Term="Unnonagintillion"},
	{ Prefix = "DNONGNTL",Number=1e279,Term="Duononagintillion"},
	{ Prefix = "TNONGNTL",Number=1e282,Term="Trenonagintillion"},
	{ Prefix = "QTNONGNTL",Number=1e285,Term="Quattuornonagintillion"},
	{ Prefix = "QNNONGNTL",Number=1e288,Term="Quinnonagintillion"},
	{ Prefix = "SXNONGNTL",Number=1e291,Term="Senonagintillion"},
	{ Prefix = "SPNONGNTL",Number=1e294,Term="Septenonagintillion"},
	{ Prefix = "OTNONGNTL",Number=1e297,Term="Octononagintillion"},
	{ Prefix = "NONONGNTL",Number=1e300,Term="Novemnonagintillion"},
	{ Prefix = "CENT",   Number=1e303,Term="Centillion"},
	{ Prefix = "UNCENT", Number=1e306,Term="Uncentillion"},
}

print('Getting services')
PF = {}  -- global table

local PathfindingService = game:GetService("PathfindingService")
local RunService = game:GetService("RunService")
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local userInputService = game:GetService("UserInputService")
local Debris             = game:GetService("Debris")

local player = Players.LocalPlayer
local character = player.Character
local humanoid = character:FindFirstChildOfClass("Humanoid")
local autoJump = false;
local usertarget = false
-- pathfinder stuff
-- Internal state
local targetRef, targetType, followEnabled = nil, nil, false
local currentPath, pathVersion              = {}, 0
local lastTargetPos                         = nil

-- Helper to get Vector3 from our targetRef
local function resolvePos()
	if targetType == "Player" then
		local c = targetRef.Character
		return c and c:FindFirstChild("HumanoidRootPart") and c.HumanoidRootPart.Position
	elseif targetType == "Part" then
		return targetRef.Position
	elseif targetType == "Position" then
		return targetRef
	end
end

-- Recompute path loop
spawn(function()
	while true do
		if followEnabled then
			local pos = resolvePos()
			if pos and ((not lastTargetPos) or (pos - lastTargetPos).Magnitude > 2) then
				lastTargetPos = pos
				local ok, path = pcall(function()
					local p = PathfindingService:CreatePath({
						AgentRadius       = humanoid.HipHeight/2,
						AgentHeight       = humanoid.HipHeight,
						AgentCanJump      = true,
						AgentJumpHeight   = humanoid.JumpHeight,
						AgentMaxSlope     = humanoid.MaxSlopeAngle,
						AgentMaxStepHeight= humanoid.HipHeight,
					})
					p:ComputeAsync(rootPart.Position, pos)
					return p
				end)
				if ok and path.Status == Enum.PathStatus.Success then
					currentPath = path:GetWaypoints()
					pathVersion  = pathVersion + 1
					-- draw waypoints for debug:
					for _, wp in ipairs(currentPath) do
						local mark = Instance.new("Part")
						mark.Size       = Vector3.new(0.5,0.5,0.5)
						mark.Anchored   = true
						mark.CanCollide = false
						mark.Material   = Enum.Material.Neon
						mark.Color      = Color3.new(1,0,0)
						mark.CFrame     = CFrame.new(wp.Position)
						mark.Parent     = workspace
						Debris:AddItem(mark, 5)
					end
				else
					currentPath = {}
				end
			end
		else
			currentPath = {}
		end
		wait(0.5)
	end
end)

-- Follow path loop
spawn(function()
	local lastVer = 0
	while true do
		if followEnabled and pathVersion > lastVer and #currentPath > 0 then
			lastVer = pathVersion
			for _, wp in ipairs(currentPath) do
				humanoid:MoveTo(wp.Position)
				humanoid.MoveToFinished:Wait()
				if not followEnabled then break end
			end
		end
		RunService.Heartbeat:Wait()
	end
end)

-- #### PF API ####
function PF.setTargetPlayer(player)
	if player and Players:FindFirstChild(player.Name) then
		targetRef, targetType = player, "Player"
	end
end

function PF.setTargetPart(part)
	if part and part:IsA("BasePart") then
		targetRef, targetType = part, "Part"
	end
end

function PF.setTargetPosition(vec3)
	if typeof(vec3) == "Vector3" then
		targetRef, targetType = vec3, "Position"
	end
end

function PF.setFollow(onOff)
	followEnabled = onOff and true or false
end

-- all util functions
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
-- Function to predict future position of a player based on velocity
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

function Jump_()
	humanoid.Jump = true
end
local function dist(a, b)
	return (a.Position - b.Position).Magnitude
end
function v2()
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
local function updated_()
	Players = game:GetService("Players")
	player = Players.LocalPlayer
	character = player.Character
	humanoid = character:WaitForChild("Humanoid")
	humanoidRoot = character:WaitForChild("HumanoidRootPart")
end
local function findPlr(name)
	for _, v in pairs(game:GetService("Players"):GetPlayers()) do
		if string.find(v.Name, name) then
			return v
		end
	end
	return nil
end
local function getClosest(t)
	local _ = {}
	print(t)
	for i, v in pairs(t) do
		_[#_ + 1] = v
		print(dist(v, humanoidRoot))
	end
	table.sort(
		_,
		function(a, b)
			return dist(a, humanoidRoot) < dist(b, humanoidRoot)
		end
	)
	return _[1]
end
local function fire(event)
	return event:FireServer()
end
local function tp(coin)
	humanoidRoot.CFrame = coin.CFrame
	wait(.55)
end
-- all minerHaven stuff go here
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
local function triggerRemoteDropMultiple(times)
	local remote = game:GetService("ReplicatedStorage"):FindFirstChild("RemoteDrop")
	if not remote or not remote:IsA("RemoteEvent") then
		warn("❌ RemoteDrop not found or is not a RemoteEvent.")
		return
	end

	times = tonumber(times) or 1
	for i = 1, times do
		print(("🚀 Firing RemoteDrop %d/%d"):format(i, times))
		remote:FireServer()
		wait(.4)  -- wait 1 second between calls
	end
end
local rebirthTextObject = nil

-- Find and save the UI element once
local function findRebirthTextObject()
	for _, descendant in pairs(game:GetDescendants()) do
		if descendant:IsA("TextLabel") or descendant:IsA("TextButton") or descendant:IsA("TextBox") then
			if descendant.Text and typeof(descendant.Text) == "string" and descendant.Text:lower():find("be reborn") then
				return descendant
			end
		end
	end
	return nil
end
local function parsePrice(str)
	local numberPart, prefix = str:match("([%d%.]+)(%a*)")
	local number = tonumber(numberPart) or 0

	for _, p in pairs(prefixs) do
		if p.Prefix == prefix then
			return number * p.Number
		end
	end

	return number
end
-- Use this function to get the rebirth price whenever needed
local function getRebirthPriceFromObject()
	if not rebirthTextObject then
		rebirthTextObject = findRebirthTextObject()
	end

	local text = rebirthTextObject.Text
	local priceStr = text:match("%$([%d%.]+%a*)")
	if not priceStr then
		return nil
	end
	return parsePrice(priceStr) -- use parsePrice from earlier
end
local function destroyAll()
	game.ReplicatedStorage.DestroyAll:InvokeServer()
	wait(.7)
end
local myLeader
local myT
local function myTeam(name)
    if (name == nil) then
        name = game.Players.LocalPlayer.name
    end
    local d = nil
    for i, v in pairs(game.Workspace.Teams:GetChildren()) do
        for i, _ in pairs(v:GetChildren()) do
            if (_.name == "leader") then
                myLeader = _.value
            end
            if (name == _.value) then
                myT = v.name
            end
        end
        return {myLeader, myT}
    end
end
-- all animalSim go here
local function getPos()
	local InSafe = {}
	local SafeZone1 = {-46.58, 587.71}
	local SafeZone2 = {-345.11, 485.19}
	local mine = myTeam()

	for _, v in pairs(game:GetService("Players"):GetPlayers()) do
		pcall(function()
			local char = v.Character
			local hrp = char and char:FindFirstChild("HumanoidRootPart")
			local hum = char and char:FindFirstChild("Humanoid")

			if not char or not hrp or not hum then
				InSafe[v.Name] = true -- assume safe if invalid character
				return
			end

			local x, z = hrp.Position.X, hrp.Position.Z
			local eTeam = myTeam(char.Name)

			local inSafeZone = (SafeZone1[1] > x and SafeZone1[2] > z and SafeZone2[1] < x and SafeZone2[2] < z)
			local isDead = hum.Health <= 0

			if inSafeZone then
				if (mine[2] == nil or isDead) then
					InSafe[v.Name] = true
				else
					InSafe[v.Name] = (mine[1] == eTeam[1] or isDead)
				end
			else
				InSafe[v.Name] = isDead
			end
		end)
	end

	return InSafe
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
local damagedplayer = nil
local function damageplayer(player)
	for i, p in pairs(game.Workspace:GetChildren()) do
		if p.Name == player then
			--print("Damaging " .. player)
			game:GetService("ReplicatedStorage").jdskhfsIIIllliiIIIdchgdIiIIIlIlIli:FireServer(p.Humanoid, 1) -- the last arguement is not damage don't bother changin it
			--print("Damaged " .. player)
		end
	end
end

local function teleportNear(targetHRP)
	local offset = Vector3.new(
		math.random(-15, 15),
		math.random(-15, 15),
		math.random(-15, 15)
	)
	local localHRP = Players.LocalPlayer.Character
		:FindFirstChild("HumanoidRootPart")
	if localHRP then
		localHRP.CFrame = CFrame.new(targetHRP.Position + offset)
	end
end
local function useAllFire(player_)
	local Balls = {"Fireball", "Lightningball"}
	local Locations = {"Backpack", "Character"}
	for i, player in pairs(game.Players:GetChildren()) do
		for _, Ball in pairs(Balls) do
			for i, Location in pairs(Locations) do
				local CheckBall = player[Location]:FindFirstChild(Ball)
				if (CheckBall) then --print(player.Name.." has: "..Ball)
					for a, b in pairs(CheckBall:GetChildren()) do
						--print(b)
					end
					CheckBall.FireballEvent:FireServer(player_.Position)
				end
			end
			--if earlyreturn then return end
		end
	end
end
local function useAllFire_(pos)
	local Balls = {"Fireball", "Lightningball"}
	local Locations = {"Backpack", "Character"}
	for i, player in pairs(game.Players:GetChildren()) do
		for _, Ball in pairs(Balls) do
			for i, Location in pairs(Locations) do
				local CheckBall = player[Location]:FindFirstChild(Ball)
				if (CheckBall) then --print(player.Name.." has: "..Ball)
					for a, b in pairs(CheckBall:GetChildren()) do
						--print(b)
					end
					CheckBall.FireballEvent:FireServer(pos)
				end
			end
			--if earlyreturn then return end
		end
	end
end
local function useTool(toolName)
    local humanoid = game.Players.LocalPlayer.Character:FindFirstChild("Humanoid")
    local player    = game.Players.LocalPlayer
    local char      = humanoid.Parent
    local backpack  = player:WaitForChild("Backpack")
    
    -- find the Tool in hand or backpack
    local tool = char:FindFirstChild(toolName) or backpack:FindFirstChild(toolName)
    if not tool or not tool:IsA("Tool") then
        warn("useTool(): couldn’t find Tool named “"..toolName.."”")
        return
    end

    -- equip if needed
    if tool.Parent ~= char then
        humanoid:EquipTool(tool)
        task.wait(0)  -- give Roblox a sec to parent it
    end

    -- activate (i.e. use) the tool
    tool:Activate()

    -- optional: deactivate right after if supported
    if tool.Deactivate then
        task.wait(0)
        tool:Deactivate()
        humanoid:UnequipTools()

    end
end

local function heal()
	useTool('Food')
end
task.spawn(function()
    while true do
        local player = game.Players.LocalPlayer
        local char = player.Character or player.CharacterAdded:Wait()
        local humanoid = char:FindFirstChild("Humanoid")

        if humanoid and humanoid.Health < humanoid.MaxHealth then
            heal()
            task.wait(2) -- cooldown
        else
        task.wait(0)
        end

    end
end)
-- Find the closest alive NPC or other player
local function findClosestTarget()
	local origin   = Players.LocalPlayer.Character
		:WaitForChild("HumanoidRootPart").Position
	local candidates = {}

	-- NPCs
	if workspace:FindFirstChild("NPC") then
		for _, npc in ipairs(workspace.NPC:GetChildren()) do
			local hrp = npc:FindFirstChild("HumanoidRootPart")
			local hm  = npc:FindFirstChild("Humanoid")
			if hrp and hm and hm.Health > 0 then
				table.insert(candidates, {entity=npc, hrp=hrp})
			end
		end
	end

	-- Other players
	for _, plr in ipairs(Players:GetPlayers()) do
		if plr ~= Players.LocalPlayer and plr.Character then
			local hrp = plr.Character:FindFirstChild("HumanoidRootPart")
			local hm  = plr.Character:FindFirstChild("Humanoid")
			if hrp and hm and hm.Health > 0 then
				table.insert(candidates, {entity=plr, hrp=hrp})
			end
		end
	end

	table.sort(candidates, function(a,b)
		return (a.hrp.Position - origin).Magnitude 
			< (b.hrp.Position - origin).Magnitude
	end)

	return candidates[1] and candidates[1].entity or nil
end
local function BloxFruit()
	loadstring(game:HttpGet("https://raw.githubusercontent.com/Augustzyzx/UraniumMobile/main/UraniumKak.lua"))()
end
-- updated damage math: 10 + (Level * 2)
local function findAttacker(dmg)
    for _, p in ipairs(Players:GetPlayers()) do
        if p ~= lp and p:FindFirstChild("leaderstats") then
            local lvl = p.leaderstats.Level.Value or 0
            if dmg == 10 + (lvl * 2) then
                return p
            end
        end
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
local function fetch(url)
    if game and game.HttpGet then                     -- most free exploits
        return game:HttpGet(url, true)               -- self, url, no-cache?
    end

    local req = (syn and syn.request)                -- Synapse X / Script‑Ware
        or http_request or request or (http and http.request)
    if req then
        local r = req({Url = url, Method = "GET"})
        return r.Body or r.body
    end

    error("No HTTP method found 🙃")
end

if(currentPlaceID == games.miners) then
	print('user is player miner havenn')
    function getItem(name)
				return game.ReplicatedStorage.Items[name]
			end
    local Catalysts = {
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
            local Fusions = {
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
            local Evolved = {
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

    
    function ItemPlaced(obj)
        local a, b =
            pcall(
                function()
                    return obj.name or obj.id
                end
            )
        if not a then
            return false
        end
        for _, item in MyTycoon:GetChildren() do
            if item.ItemId.Value == obj.id or item.name == obj.Name then
                return true
            end
        end
        return false
    end
    local function GetDistanceBetweenCFrame(cframe1, cframe2)
        local position1 = cframe1.Position
        local position2 = cframe2.Position
        return (position1 - position2).Magnitude
    end
    function ShopItems()
        for i, v in pairs(getgc(true)) do
            if type(v) == "table" and rawget(v, "Miscs") then
                return v["All"]
            end
        end
    end
    function HasItem(Needed, count)
        local r = game:GetService("ReplicatedStorage").HasItem:InvokeServer(Needed) or 0
        if r > 0 then
            if count then
                return r
            else
                return true
            end
        else
            if count then
                return r
            else
                return false
            end
        end
    end
    function IsShopItem(Needed)
        for i, v in pairs(ShopItems()) do
            if tonumber(v.ItemId.Value) == tonumber(Needed) then
                return true
            end
        end
        return false
    end
    --[[for catalyst, data in pairs(Catalysts) do
        data.Item = getItem(catalyst)
        for item, _ in data.items do
            data[_] = getItem(_)
        end
        print("Added:" .. catalyst)
    end
    --]]

    local function hasCat(name)
        local cat = nil
        for catalyst, data in pairs(obj) do
            if catalyst:match(name) then
                cat = data
                break
            end
        end
        if not cat then
            return nil
        end
        print("Cat found:" .. cat.Catalyst)
        if HasItem(getItem(cat.Catalyst).ItemId) then
            print("Already have:" .. cat.Catalyst)
            return true
        end
        print("Checking items")
        local hasAll = true
        for index, string in cat.items do
            local item = cat[string]
            local has = HasItem(item.ItemId.Value)
            if not has then
                hasAll = false
                if Evolved[string] then
                    local ev = Evolved[string]
                    local count = HasItem(ev.reborn.ItemId.Value, true)
                    if HasItem(ev.reborn.ItemId.Value, true) > ev.count then
                        repeat
                            warn("Evolve " .. ev.r)
                            wait(3)
                        until HasItem(item.ItemId.Value)
                    end
                end
                if Fusions[string] then
                    local ev = Fusions[string]
                    warn("Create the Fusion.." .. string)
                end
            end
        end
        if not hasAll then
            return false
        end
    end


        local oldPos
        local function goTo()
            return;
            TycoonBase = game.Players.LocalPlayer.PlayerTycoon.Value.Base
            if GetDistanceBetweenCFrame(TycoonBase.CFrame, root.CFrame) > 100 then
                oldPos = game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame
                if finding then
                    pathfindingComplete = true
                end
                PathfindTo(TycoonBase.CFrame, 2)
            end
        end
        local function goBack()
            return;
            if (oldPos) then
                PathfindTo(oldPos)
            end
            oldPos = nil
        end
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
        local tFarm__ =
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
                    if mainW.flags.aReb then
                        farmRebirth()
                    else
                        -- Session system will let the running loop exit by itself
                        print("Auto rebirth OFF")
                    end
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

        local loadLayoutsDrops = {0, 0, 0}

        function loadLayouts()
            task.spawn(function()
                goTo()
                wait(0.5)
                game:GetService("ReplicatedStorage").Layouts:InvokeServer("Load", getgenv().layoutone)
                wait(0.1)
                if loadLayoutsDrops[1] > 0 then -- use 1 here instead of 0
                print('Dropping ores')
                    triggerRemoteDropMultiple(loadLayoutsDrops[1])
                end
                goBack()

                if mainW.flags.seclayout then
                    repeat wait(0) until comparCash(cost1)
                    if mainW.flags.seclayoutclear then
                        goTo()
                        wait(0.5)
                        destroyAll()
                        wait(0.1)
                        goBack()
                    end
                    goTo()
                    wait(0.2)
                    game:GetService("ReplicatedStorage").Layouts:InvokeServer("Load", getgenv().layoutwo)
                    wait(0.1)
                    if loadLayoutsDrops[2] > 0 then -- use 2 here for second element
                        triggerRemoteDropMultiple(loadLayoutsDrops[2])
                    end
                    goBack()
                    task.wait(getgenv().duration_)

                    if mainW.flags.thirdlayout then
                        repeat wait(0) until comparCash(cost2)
                        if mainW.flags.thirdlayoutclear then
                            goTo()
                            wait(0.5)
                            destroyAll()
                            wait(0.1)
                            goBack()
                        end
                        goTo()
                        wait(0.2)
                        game:GetService("ReplicatedStorage").Layouts:InvokeServer("Load", getgenv().layouthree)
                        wait(0.1)
                        if loadLayoutsDrops[3] > 0 then -- use 3 here for third element
                            triggerRemoteDropMultiple(loadLayoutsDrops[3])
                        end
                        goBack()
                    end
                end
            end)
        end


        --//Auto Rebirth Function
        function farmRebirth()
            print("Starting auto rebirth...",mainW.flags.aReb)
            task.spawn(function()
                while mainW.flags.aReb do
                    local success, err = pcall(function()
                        local player = game:GetService("Players").LocalPlayer
                        local moneyGui = player.PlayerGui:WaitForChild("GUI"):WaitForChild("Money")
                        local currentMoney = moneyGui.Value
                        local rebirthPrice = getRebirthPriceFromObject()

                        if currentMoney >= rebirthPrice then
                            print("Rebirthing! Current money:", currentMoney, "Price:", rebirthPrice)
                            goTo()
                            wait(0.2)

                            if mainW.flags.rebirthWl then
                                game:GetService("ReplicatedStorage").Layouts:InvokeServer("Load", getgenv().rebirthlayout)
                                wait(0.7)
                            end

                            game:GetService("ReplicatedStorage").Rebirth:InvokeServer(26) -- Do not change 26
                            wait(0.5)

                            goBack()
                            wait(0.5)
                        else
                            -- Not enough money, wait a bit and check again
                            wait(1)
                        end
                    end)

                    if not success then
                        warn("Error in auto rebirth:", err)
                        wait(2) -- wait before retrying on error
                    end
                    task.wait(0.1) -- tiny delay to prevent locking up
                end
                print("Auto rebirth stopped.")
            end)
        end

        function farmRebirthOld()
            print("Print trying auto?")
            task.spawn(
                function()
                    print("Auto Going?")
                    while mainW.flags.aReb do
                        local canRebirth =
                            game:GetService("Players").LocalPlayer.PlayerGui.GUI.Money.Value >=
                            getRebirthPriceFromObject()
                        wait(0)
                        print("----------------------------")
                        print(canRebirth)
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

        --//Auto Load
        local Players = game:GetService("Players")
        local plr     = Players.LocalPlayer          -- or whoever you wanna watch

        -- 🏷️ wait for leaderstats & Life to be created
        local leaderstats = plr:WaitForChild("leaderstats")
        local lifeStat    = leaderstats:WaitForChild("Life")  -- IntValue

        -- 💡 hook only the Value property
        lifeStat:GetPropertyChangedSignal("Value"):Connect(function()
            task.wait(0.75)                          -- debounce / server delay
            print('Now is life:'..lifeStat.Value)
        end)



elseif (currentPlaceID == games.animalSim) then
	local Main =UI:addPage(
		{
			title = "Animal Sim",
			icon = 887262219
		}
	)
	local Gameplaydiv =
		Main:addSection(
			{
				title = "Gameplay"
			}
		)
	print('user is player animalSim normal mode')
	local t_ = ""
	local dmga
	local coinEvent = ReplicatedStorage:WaitForChild("Events"):WaitForChild("CoinEvent")
	local CarryEvent        = ReplicatedStorage.Events.CarryEvent
	local AttackEvent       = ReplicatedStorage.jdskhfsIIIllliiIIIdchgdIiIIIlIlIli
	-- Attack a single player entity
	local function attackPlayer(player)
		if not (player and player.Character) then return end
		local hrp = player.Character:FindFirstChild("HumanoidRootPart")
		local hm  = player.Character:FindFirstChild("Humanoid")
		if not (hrp and hm) then return end
        print('AttackIng:' .. player.name)
		--teleportNear(hrp)
		task.wait(0.1)

		if _G.forcetarget then
			CarryEvent:FireServer(player.Name)
		end
		AttackEvent:FireServer(hm, 1)
	end
    
	function aura()
		_G.speed2 = _G.speed2 or 0.05
		local player = Players.LocalPlayer
		local hrp    = player.Character:WaitForChild("HumanoidRootPart")
		local homeCF = hrp.CFrame

		while _G.toggle2 do

			pcall(function() 
               local safeMap = getPos()
                if _G.usertarget and t_ then
                    if not safeMap[t_] then
                        local tgt = findPlr(t_)
                        attackPlayer(tgt)
                    end
                else
                    local closest = findClosestTarget()
                    if closest and not safeMap[closest.Name] then
                        attackPlayer(closest)
                    end
                end
            end)

			task.wait(_G.usertarget and 0 or _G.speed2)
		end

		-- restore original position
		hrp.CFrame = homeCF
	end
	local function toggleFarm()
		_G.toggle = not _G.toggle
		if _G.toggle == true then
			print("Auto exp:ON")

			-- spam it every second (or change interval as you like)
			spawn(function()
				while _G.toggle do
					coinEvent:FireServer()    -- send to the server
					task.wait(0.2)              -- wait  (tweak for faster/slower)
				end
			end)

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
	
	local lis = nil
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
		--print(self)
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
		--print(self)
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
					--print(self)
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
			title = "Use target",
			toggled = nil,
			callback = function(value)
				usertarget = value
			end
		}
	)
	Gameplaydiv:addToggle(
		{
			title = "Auto PVP",
			toggled = nil,
			callback = function(value)
				_G.autoPVP =not  not value
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
				print("Autojump:", autoJump)
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
	-- state flags
	local chickenEnabled = false
	local puzzleEnabled  = false

	-- grab your events
	local chickenEvent = ReplicatedStorage:WaitForChild("ChickenEvent"):WaitForChild("RemoteEvent")
	local puzzleEvent  = ReplicatedStorage:WaitForChild("Easter2025"):WaitForChild("RemoteEvent")

	-- chicken combos
	local chickenCombos = {
		{}, {"Ice"}, {"Fire"}, {"Grass"}, {"Ice","Fire","Grass"}
	}

	-- add the toggles
	Gameplaydiv:addToggle({
		title   = "Auto Unlock Chicken",
		toggled = chickenEnabled,
		callback = function(state)
			chickenEnabled = state
		end
	})

	Gameplaydiv:addToggle({
		title   = "Auto Puzzle Solve",
		toggled = puzzleEnabled,
		callback = function(state)
			puzzleEnabled = state
		end
	})

	-- background loops
	spawn(function()
		while true do
			task.wait(0.3)
			if chickenEnabled then
				for _, combo in ipairs(chickenCombos) do
					chickenEvent:FireServer({ action = "craft", element_table = combo })
					task.wait(0.2)
				end
			end
		end
	end)
	spawn(function()
		while true do
			task.wait(1)
			if puzzleEnabled then
				for i = 1,25 do
					local puz = "PUZ"..i
					puzzleEvent:FireServer({ action = "pick_up",     puzzle_name = puz })
					task.wait(0.5)
					puzzleEvent:FireServer({ action = "put", puzzle_name = puz })
					task.wait(0.2)
				end
			end
		end
	end)
    -- apply on spawn & respawn
    local function hookHumanoid(humanoid)
    local prevHP = humanoid.Health
    
    humanoid:GetPropertyChangedSignal("Health"):Connect(function()
        local nowHP = humanoid.Health
        local dmg   = prevHP - nowHP

        if dmg > 0 and _G.autoPVP then
            local atkr = findAttacker(dmg)
            if atkr and atkr.Character then
                print(("👊 Took %d dmg from %s! Clapping back…"):format(dmg, atkr.Name))

                -- melee attack
                local theirHum = atkr.Character:FindFirstChild("Humanoid")
                if theirHum then
                    attackPlayer(atkr)
                end

                -- fireball spam
                local hrp = atkr.Character:FindFirstChild("HumanoidRootPart")
                if hrp then
                    useAllFireAt(hrp.Position)
                end
            else
                print(("👊 Took %d dmg (attacker unknown)"):format(dmg))
            end
        end

        prevHP = nowHP
    end)
end
    local lp=player
    local function onCharAdded(char)
    local humanoid = char:WaitForChild("Humanoid")
    hookHumanoid(humanoid)
    end

    if lp.Character then onCharAdded(lp.Character) end
    lp.CharacterAdded:Connect(onCharAdded)
    print('Hooked:' .. lp.name)
elseif (currentPlaceID == games.bloxFruits) then
	print('user is player animalSim gayFruits')
	local BloxF =
		UI:addPage(
			{
				title = "LoS",
				icon = 887262219
			}
		)
end
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
print("Loaded")
UI:SelectPage(
	{
		page = UI.pages[1],
		toggle = true
	}
)
local vu = game:GetService("VirtualUser")
			game:GetService("Players").LocalPlayer.Idled:connect(
				function()
					vu:Button2Down(Vector2.new(0, 0), workspace.CurrentCamera.CFrame)
					task.wait(1)
					vu:Button2Up(Vector2.new(0, 0), workspace.CurrentCamera.CFrame)
				end
			)
print('Anti AFK Loaded')
