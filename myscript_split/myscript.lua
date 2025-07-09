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
print("Starting up")
--loadstring(game:HttpGet("https://raw.githubusercontent.com/naquangaston/HostedFiles/main/myscript.lua"))()
local incDMG_=100
local justDied=false
local prefixs = {
    {Prefix = "", Number = 1, Term = "Ones"},
    {Prefix = "k", Number = 1000, Term = "Thousand"},
    {Prefix = "M", Number = 1000000, Term = "Million"},
    {Prefix = "B", Number = 1000000000, Term = "Billion"},
    {Prefix = "T", Number = 1000000000000, Term = "Trillion"},
    {Prefix = "qd", Number = 1000000000000000, Term = "Quadrillion"},
    {Prefix = "Qn", Number = 1000000000000000000, Term = "Quintilion"},
    {Prefix = "sx", Number = 1000000000000000000000, Term = "Sextillion"},
    {Prefix = "Sp", Number = 1000000000000000000000000, Term = "Septillion"},
    {Prefix = "O", Number = 1000000000000000000000000000, Term = "Octillion"},
    {Prefix = "N", Number = 1000000000000000000000000000000, Term = "Nonillion"},
    {Prefix = "de", Number = 1000000000000000000000000000000000, Term = "Decillion"},
    {Prefix = "Ud", Number = 1000000000000000000000000000000000000, Term = "Undecillion"},
    {Prefix = "DD", Number = 1000000000000000000000000000000000000000, Term = "Duodecillion"},
    {Prefix = "tdD", Number = 1000000000000000000000000000000000000000000, Term = "Tredecillion"},
    {Prefix = "qdD", Number = 1000000000000000000000000000000000000000000000, Term = "Quattuordecillion"},
    {Prefix = "QnD", Number = 1000000000000000000000000000000000000000000000000, Term = "Quindecillion"},
    {Prefix = "sxD", Number = 1000000000000000000000000000000000000000000000000000, Term = "Sedecillion"},
    {Prefix = "SpD", NumbQer = 1000000000000000000000000000000000000000000000000000000, Term = "Septendecillion"},
    {Prefix = "OcD", Number = 1000000000000000000000000000000000000000000000000000000000, Term = "Octodecillion"},
    {Prefix = "NvD", Number = 1000000000000000000000000000000000000000000000000000000000000, Term = "Novemdecillion"},
    {Prefix = "Vgn", Number = 1000000000000000000000000000000000000000000000000000000000000000, Term = "Vigintillion"},
    {
        Prefix = "UVg",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Unvigintillion"
    },
    {
        Prefix = "DVg",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Duovigintillion"
    },
    {
        Prefix = "TVg",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Tresvigintillion"
    },
    {
        Prefix = "qtV",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Quattuorvigintillion"
    },
    {
        Prefix = "QnV",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Quinvigintillion"
    },
    {
        Prefix = "SeV",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Sesvigintillion"
    },
    {
        Prefix = "SPG",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Septemvigintillion"
    },
    {
        Prefix = "OVG",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Octovigintilion"
    },
    {
        Prefix = "NVG",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Novemvigintillion"
    },
    {
        Prefix = "TGN",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Trigintillion"
    },
    {
        Prefix = "UTG",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Untrigintillion"
    },
    {
        Prefix = "DTG",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Duotrigintillion"
    },
    {
        Prefix = "tsTG",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Trestrigintillion"
    },
    {
        Prefix = "qtTG",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Quattuortrigintillion"
    },
    {
        Prefix = "QnTG",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Quintrigintillion"
    },
    {
        Prefix = "ssTG",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Sestrigintillion"
    },
    {
        Prefix = "SpTG",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Septentrigintillion"
    },
    {
        Prefix = "OcTG",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Octotrigintillion"
    },
    {
        Prefix = "NoTG",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Novemtrigintillion"
    },
    {
        Prefix = "QdDR",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Quadragintillion"
    },
    {
        Prefix = "uQDR",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Unquadragintillion"
    },
    {
        Prefix = "dQDR",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Duoquadragintillion"
    },
    {
        Prefix = "tQDR",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Tresquadragintillion"
    },
    {
        Prefix = "qdQDR",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Quattuorquadragintillion"
    },
    {
        Prefix = "QnQDR",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Quinquadragintillion"
    },
    {
        Prefix = "sxQDR",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Sesquadragintillion"
    },
    {
        Prefix = "SpQDR",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Septenquadragintillion"
    },
    {
        Prefix = "OQDDr",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Octoquadragintillion"
    },
    {
        Prefix = "NQDDr",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Novemquadragintillion"
    },
    {
        Prefix = "qQGNT",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Quinquagintillion"
    },
    {
        Prefix = "uQGNT",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Unquinquagintillion"
    },
    {
        Prefix = "dQGNT",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Duoquinquagintillion"
    },
    {
        Prefix = "tQGNT",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Tresquinquagintillion"
    },
    {
        Prefix = "qdQGNT",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Quattuorquinquagintillion"
    },
    {
        Prefix = "QnQGNT",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Quinquinquagintillion"
    },
    {
        Prefix = "sxQGNT",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Sesquinquagintillion"
    },
    {
        Prefix = "SpQGNT",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Septenquinquagintillion"
    },
    {
        Prefix = "OQQGNT",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Octoquinquagintillion"
    },
    {
        Prefix = "NQQGNT",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Novemquinquagintillion"
    },
    {
        Prefix = "SXGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Sexagintillion"
    },
    {
        Prefix = "USXGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Unsexagintillion"
    },
    {
        Prefix = "DSXGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Duosexagintillion"
    },
    {
        Prefix = "TSXGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Tresexagintillion"
    },
    {
        Prefix = "QTSXGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Quattuorsexagintillion"
    },
    {
        Prefix = "QNSXGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Quinsexagintillion"
    },
    {
        Prefix = "SXSXGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Sesexagintillion"
    },
    {
        Prefix = "SPSXGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Septensexagintillion"
    },
    {
        Prefix = "OSXGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Octosexagintillion"
    },
    {
        Prefix = "NVSXGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Novemsexagintillion"
    },
    {
        Prefix = "SPTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Septuagintillion"
    },
    {
        Prefix = "USPTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Unseptuagintillion"
    },
    {
        Prefix = "DSPTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Duoseptuagintillion"
    },
    {
        Prefix = "TSPTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Treseptuagintillion"
    },
    {
        Prefix = "QTSPTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Quattuorseptuagintillion"
    },
    {
        Prefix = "QNSPTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Quinseptuagintillion"
    },
    {
        Prefix = "SXSPTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Seseptuagintillion"
    },
    {
        Prefix = "SPSPTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Septenseptuagintillion"
    },
    {
        Prefix = "OSPTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Octoseptuagintillion"
    },
    {
        Prefix = "NVSPTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Novemseptuagintillion"
    },
    {
        Prefix = "OTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Octogintillion"
    },
    {
        Prefix = "UOTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Unoctogintillion"
    },
    {
        Prefix = "DOTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Duooctogintillion"
    },
    {
        Prefix = "TOTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Treoctogintillion"
    },
    {
        Prefix = "QTOTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Quattuoroctogintillion"
    },
    {
        Prefix = "QNOTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Quinoctogintillion"
    },
    {
        Prefix = "SXOTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Sexoctogintillion"
    },
    {
        Prefix = "SPOTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Septemoctogintillion"
    },
    {
        Prefix = "OTOTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Octooctogintillion"
    },
    {
        Prefix = "NVOTGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Novemoctogintillion"
    },
    {
        Prefix = "NONGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Nonagintillion"
    },
    {
        Prefix = "UNONGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Unnonagintillion"
    },
    {
        Prefix = "DNONGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Duononagintillion"
    },
    {
        Prefix = "TNONGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Trenonagintillion"
    },
    {
        Prefix = "QTNONGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Quattuornonagintillion"
    },
    {
        Prefix = "QNNONGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Quinnonagintillion"
    },
    {
        Prefix = "SXNONGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Senonagintillion"
    },
    {
        Prefix = "SPNONGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Septenonagintillion"
    },
    {
        Prefix = "OTNONGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Octononagintillion"
    },
    {
        Prefix = "NONONGNTL",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Novemnonagintillion"
    },
    {
        Prefix = "CENT",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Centillion"
    },
    {
        Prefix = "UNCENT",
        Number = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
        Term = "Uncentillion"
    }
}
--Miners haven
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
local autoJump = false
local finding = false
local done_ = true
local legitCoin = true
local PathfindingService = game:GetService("PathfindingService")
local RunService = game:GetService("RunService")
local Players = game:GetService("Players")

local selectedPlayerName = "" -- Variable to store the name of the selected player
local selectedPlayer  -- Variable to store the instance of the selected player
local maxDistance = 10 -- Maximum distance to stay near the selected player

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
        local a, b =
            pcall(
            function()
                humanoidRoot.CFrame = target
            end
        )
        if not a then
            humanoidRoot.Postion = target.Postion
        end
        pathfindingComplete = true
        finding = false
        spawn(
            function()
                wait(time or 1)
                finding = false
            end
        )
        return
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
                if humanoid.MoveToPoint == nil and not pathfindingComplete then
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

function Jump_()
    humanoid.Jump = true
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

game:GetService("RunService").Heartbeat:Connect(v2)
local function CombineCFrameAndVector(cframe, vector)
    return cframe + vector
end
local function BloxFruit()
    loadstring(game:HttpGet("https://raw.githubusercontent.com/Augustzyzx/UraniumMobile/main/UraniumKak.lua"))()
end
local function heal()
    local Locations = {"Backpack", "Character"}
    local f = "Food"
    for i, Location in pairs(Locations) do
        --print(Location)
        for a, b in pairs(game.Players.LocalPlayer[Location]:GetChildren()) do
            if (b.Name == f) then
                print(f)
                for c, d in pairs(b.Script:GetChildren()) do
                    print(d)
                    for g, h in pairs(d:GetChildren()) do
                        print(h)
                    end
                end
            end
        end
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
local function MoveTo(a)
    followPath(a.Position)
    return true
end

local function tp(coin)
    humanoidRoot.CFrame = coin.CFrame
    wait(.55)
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
    local mine = myTeam()
    for _, v in pairs(game:GetService("Players"):GetPlayers()) do
        --print(v)
        local x = v.Character.HumanoidRootPart.Position.X
        local z = v.Character.HumanoidRootPart.Position.Z
        local eTeam = myTeam(v.Character.name)
        --print(v.name)
        --print(x,z,SafeZone1[1]>x,SafeZone1[2]>z,SafeZone2[1]<x,SafeZone2[2]<z)
        --print(mine[1],mine[2],' - ',eTeam[1],eTeam[2])
        pcall(
            function()
                if (SafeZone1[1] > x and SafeZone1[2] > z and SafeZone2[1] < x and SafeZone2[2] < z) then
                    --if(mine)
                    if (mine[2] == nil or v.Character.Humanoid.Health == 0) then
                        InSafe[v.name] = true
                    else
                        if (mine[1] == eTeam[1] or v.Character.Humanoid.Health == 0) then
                            InSafe[v.name] = true
                        else
                            InSafe[v.name] = false
                        end
                    end
                else
                    if (v.Character.Humanoid.Health < 1) then
                        InSafe[v.name] = true
                    else
                        InSafe[v.name] = false
                    end
                end
            end
        )
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
local function MHBox()
    local cf = game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame
    for i, v in pairs(game.Workspace:GetDescendants()) do
        if v:IsA("BasePart") then
            if
                (v.Name:match("Diamond") or v.Name:match("Research") or v.Name:match("Golden") or
                    v.Name:match("Crystal")) and
                    not v.Name:match("overlay") and
                    not v.Name:match("inside") and
                    not v.Name:match("Lava") and
                    not v.Name:match("Mine") and
                    not v.Name:match("Handle") and
                    not v.Name:match("Upgrade") and
                    not v.Name:match("Conv") and
                    not v.Name:match("Hitox") and
                    not v.Name:match("Mesh") and
                    not v.Name:match("Palm") and
                    not v.Name:match("Sphere") and
                    not v.Name:match("Smooth") and
                    not v.Name:match("Grass") and
                    not v.Name:match("Grass") and
                    not v.Name:match("Union") and
                    not v.Name:match("Color") and
                    not v.Name:match("Drop") and
                    not v.Name:match("EGG") and
                    not v.Name:match("Terrain") and
                    not v.Name:match("Rock") and
                    not v.Name:match("Sand") and
                    not v:IsA("Terrain") and
                    not v.Name:match("Part") and
                    not v.Name:match("rock") and
                    not v.Name:match("Wedge") and
                    not v.Name:match("Lights") and
                    not v.Name:match("Tree") and
                    not v.Name:match("Leaf")
             then
                --if v.Name:match("Egg") then
                print("Yes", v.Name)
                wait(0.05)
                cf = game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame
                game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame = v.CFrame
                wait(.5)
                game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame = cf
            else
                if
                    (not v.Name:match("overlay") and not v.Name:match("inside") and not v.Name:match("Lava") and
                        not v.Name:match("Mine") and
                        not v.Name:match("Handle") and
                        not v.Name:match("Upgrade") and
                        not v.Name:match("Conv") and
                        not v.Name:match("Hitox") and
                        not v.Name:match("Mesh") and
                        not v.Name:match("Palm") and
                        not v.Name:match("Sphere") and
                        not v.Name:match("Smooth") and
                        not v.Name:match("Grass") and
                        not v.Name:match("Grass") and
                        not v.Name:match("Union") and
                        not v.Name:match("Color") and
                        not v.Name:match("Drop") and
                        not v.Name:match("EGG") and
                        not v.Name:match("Terrain") and
                        not v.Name:match("Rock") and
                        not v.Name:match("Sand") and
                        not v:IsA("Terrain") and
                        not v.Name:match("Part") and
                        not v.Name:match("rock") and
                        not v.Name:match("Wedge") and
                        not v.Name:match("Lights") and
                        not v.Name:match("Tree") and
                        not v.Name:match("Leaf"))
                 then
                --print('Not',v.Name)
                end
            end
        end
    end
    print("Done!")
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
            game:GetService("ReplicatedStorage").jdskhfsIIIllliiIIIdchgdIiIIIlIlIli:FireServer(p.Humanoid, 1) -- the last arguement is not damage don't bother changin it
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
                    local randomOffsetX = math.random(-15, 15)
                    local randomOffsetY = math.random(-15, 15)
                    local randomOffsetX = math.random(-15, 15)
                    local newPos =
                        player.Character:WaitForChild("HumanoidRootPart").Position +
                        Vector3.new(randomOffsetX, randomOffsetY, randomOffsetZ)
                    game.Players.LocalPlayer.Character:WaitForChild("HumanoidRootPart").CFrame = CFrame.new(newPos)
                    --game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame=player.Character.HumanoidRootPart.CFrame
                    wait(.1)
                    print("Target:", player, player.Character.Humanoid.Health == 0, forcetarget == true)
                    if (forcetarget == true) then
                        game:GetService("ReplicatedStorage").RideEvents.acceptEvent:FireServer(player.Name)
                    end
                    game:GetService("ReplicatedStorage").jdskhfsIIIllliiIIIdchgdIiIIIlIlIli:FireServer(
                        player.Character.Humanoid,
                        1
                    )
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
                        --game:GetService("ReplicatedStorage").jdskhfsIIIllliiIIIdchgdIiIIIlIlIli:FireServer(player[2], 1)
                        print(findClosestPlayer())
                        game:GetService("ReplicatedStorage").jdskhfsIIIllliiIIIdchgdIiIIIlIlIli:FireServer(findClosestPlayer().Character.Humanoid, 1)
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
        title = "Miners Haven",
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

local function findPlr(name)
    for _, v in pairs(game:GetService("Players"):GetPlayers()) do
        if string.find(v.Name, name) then
            return v
        end
    end
    return nil
end

local function damageplayer(player)
    for i, p in pairs(game.Workspace:GetChildren()) do
        if p.Name == player then
            --print("Damaging " .. player)
            game:GetService("ReplicatedStorage").jdskhfsIIIllliiIIIdchgdIiIIIlIlIli:FireServer(p.Humanoid, 1) -- the last arguement is not damage don't bother changin it
            --print("Damaged " .. player)
        end
    end
end

local damagedplayer = nil
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
local collecting
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
Gameplaydiv:addToggle(
    {
        title = "Auto Fight",
        toggled = nil,
        callback = function(value)
            autoFight = not not autoFight
            print("AutoFight:", autoFight)
            while(autoFight)do
            	local target=parsePlayer(findClosestPlayer())
            	wait(0)
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
            _cb1 = value
            local pos = humanoidRoot.CFrame
            while (_cb1) do
                local a, b =
                    pcall(
                    function()
                        return getClosest(Boxes()).CFrame
                    end
                )
                if a then
                    PathfindTo(b)
                    wait(1.2)
                    print("DOne")
                else
                    PathfindTo(pos)
                    wait(1.2)
                end
                wait()
            end
            PathfindTo(pos)
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
            function getItem(name)
                local a, b =
                    pcall(
                    function()
                        return game.ReplicatedStorage.Items[name]
                    end
                )
                if a then
                    return b
                else
                    warn("Failed to find:" .. name)
                    return nil
                end
            end

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
            function getItem(name)
                return game.ReplicatedStorage.Items[name]
            end
            for catalyst, data in pairs(obj) do
                data.Item = getItem(catalyst)
                print("Added:" .. catalyst)
            end
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
            for catalyst, data in pairs(obj) do
                data.Item = getItem(catalyst)
                for item, _ in data.items do
                    data[_] = getItem(_)
                end
                print("Added:" .. catalyst)
            end

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

            function loadLayouts()
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

            --//Auto Rebirth Function
            function farmRebirth()
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
                        print(
                            "IncDMG:",
                            increaseByPercentage(game.Players.LocalPlayer.leaderstats.Level.value, incDMG_),
                            enemy.lvl
                        )
                        if increaseByPercentage(game.Players.LocalPlayer.leaderstats.Level.value, incDMG_) < enemy.lvl then
                            warn(enemy.player.name .. " Is to strong self")
                            return
                        end
                        --print('#info:'..enemy.player.Name)
                        --print('$pos:',enemy.player.Character:WaitForChild("HumanoidRootPart").Position)
                        local randomOffsetX = math.random(-15, 15)
                        local randomOffsetY = 1
                        local randomOffsetX = math.random(-15, 15)
                        local newPos =
                            enemy.player.Character:WaitForChild("HumanoidRootPart").Position +
                            Vector3.new(randomOffsetX, randomOffsetY, randomOffsetZ)
                        useAllFire(enemy.player.Character.HumanoidRootPart);damageplayer(enemy.player.Name);
                        if _G.autoPVP and (not attacking_ or increaseByPercentage(info.lvl, incDMG_)) then
                            attacking_ = true
                        else
                            return nil
                        end
                        local oldpos=game.Players.LocalPlayer.Character:WaitForChild("HumanoidRootPart").Position
                        local cf = game.Players.LocalPlayer.Character:WaitForChild("HumanoidRootPart").CFrame
                        Jump_()
                        autoJump = true
                        repeat
                            wait(0)
                            updated_()
                            pcall(
                                function()
                                    damageplayer(enemy.player.Name)
                                end
                            )
                            pcall(
                                function()
                                    useAllFire(enemy.player.Character.HumanoidRootPart)
                                end
                            )
                            humanoid:MoveTo(enemy.player.Character.HumanoidRootPart.Position)
                        until enemy.player.Character.Humanoid.Health < 1 or not game.Players[enemy.player.name]
                        attacking_ = false
                        autoJump = false
                        moveToTarget(cf)
                        game.Players.LocalPlayer.Character:WaitForChild("HumanoidRootPart").CFrame = cf
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
-- List of select player names
local selectedPlayers = {
    "282475249a7auto","9","Allaboutsuki","DefNotRealMe","Doornextguythat","Little_Puppywolf","ProGammerMove_1","RektBySuki","RektBySukisAlt","Rockyrode112","Rose_altl5","Sakura_Mirai","SimpleDisasters","TheBestAccount_mom","TheFreeAccount_Free1","TheOneMyth","Unicornzzz6109","baby46793","batman_kite","foalsarecut","iwillendUmadaf4","Miner_havennoob","naypolm","naypolm005","naypolm05","naypolm12","naypolm1789","qwertyPCLOL","ll_BANX","xXxnothingxXx274", "dexvilxtails"    -- Add more player names as needed
}
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
local initialHealth = {}

-- Function to log damage taken by selected players
local function LogDamage(player, damageAmount)
	
    if damageAmount<0 then damageAmount=-damageAmount end
    print(player.Name .. " took " .. damageAmount .. " damage")
    local enemy = findDmg(damageAmount)
    if not enemy or not _G.autoPVP then return end
    print(
        "IncDMG:",
        increaseByPercentage(game.Players.LocalPlayer.leaderstats.Level.value, incDMG_),
        enemy.lvl
    )
    if increaseByPercentage(game.Players.LocalPlayer.leaderstats.Level.value, incDMG_) < enemy.lvl then
        warn(enemy.player.name .. " Is to strong self")
        return
    end
    --print('#info:'..enemy.player.Name)
    --print('$pos:',enemy.player.Character:WaitForChild("HumanoidRootPart").Position)
    local randomOffsetX = math.random(-15, 15)
    local randomOffsetY = 1
    local randomOffsetX = math.random(-15, 15)
    local newPos =
        enemy.player.Character:WaitForChild("HumanoidRootPart").Position +
        Vector3.new(randomOffsetX, randomOffsetY, randomOffsetZ)
    useAllFire(enemy.player.Character.HumanoidRootPart);damageplayer(enemy.player.Name)
    if not attacking_ or increaseByPercentage(info.lvl, incDMG_) or not _G.autoPVP then
        attacking_ = true
    else
        return nil
    end
    local oldpos=game.Players.LocalPlayer.Character:WaitForChild("HumanoidRootPart").Position
    local cf = game.Players.LocalPlayer.Character:WaitForChild("HumanoidRootPart").CFrame
    Jump_()
    autoJump = true
    repeat
        wait(0)
        updated_()
        pcall(
            function()
                damageplayer(enemy.player.Name)
            end
        )
        pcall(
            function()
                useAllFire(enemy.player.Character.HumanoidRootPart)
            end
        )
        humanoid:MoveTo(enemy.player.Character.HumanoidRootPart.Position)
    until enemy.player.Character.Humanoid.Health < 1 or not game.Players[enemy.player.name].Character
    attacking_ = false
    autoJump = false
    moveToTarget(cf)
    game.Players.LocalPlayer.Character:WaitForChild("HumanoidRootPart").CFrame = cf
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

