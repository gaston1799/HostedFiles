-- Creates all UI pages and sections in order
-- Returns a table with references to each page and section
local function setupPages(UI)
    local pages = {}

    pages.Main = UI:addPage({title = "Animal Sim", icon = 887262219})
    pages.Miners = UI:addPage({title = "Miners Haven", icon = 887262219})
    pages.Legends = UI:addPage({title = "LoS", icon = 887262219})
    pages.BloxF = UI:addPage({title = "LoS", icon = 887262219})

    pages.Gameplaydiv = pages.Main:addSection({title = "Gameplay"})
    pages.Fruits = pages.Main:addSection({title = "Scripts/Hubs"})
    pages.Minersdiv = pages.Miners:addSection({title = "Boxes"})
    pages.Orbs = pages.Legends:addSection({title = "Orbs"})

    return pages
end

return setupPages
