_G.old_debug_traceback = old_debug_traceback or debug.traceback;
if not _G.tErrorGsub then
	_G.tErrorGsub = {};
end;
debug.traceback = function(error, ...)
	local a = old_debug_traceback(error, ...);
	for k, v in pairs(_G.tErrorGsub) do
		a = string.gsub(a, k, v);
	end;
	print("[debug error]:", a);
	Event:send("报错信息", a);
	return a;
end;
local src = (debug.getinfo(3)).source;
if (src:sub(2)):find("(.*dota 2 beta[\\/]game[\\/]dota_addons[\\/])([^\\/]+)[\\/]") then
	_G.GameDir, _G.AddonName = string.match(src:sub(2), "(.*dota 2 beta[\\/]game[\\/]dota_addons[\\/])([^\\/]+)[\\/]");
	_G.ContentDir = GameDir:gsub("\\game\\dota_addons\\", "\\content\\dota_addons\\");
end;
FindVecByName = function(name)
	local spawnPoint = Entities:FindByName(nil, name);
	if spawnPoint then
		return spawnPoint:GetAbsOrigin();
	else
		debug.traceback("未找到名为:" .. name .. "的实体");
		return Vector(0, 0, 0);
	end;
end;
Bezier3 = function(p, t)
	return (1 - t) ^ 3 * p[1] + 3 * p[2] * t * (1 - t) ^ 2 + 3 * p[3] * t ^ 2 * (1 - t) + p[4] * t ^ 3;
end;
Bezier2 = function(p, t)
	return (1 - t) ^ 2 * p[1] + 2 * t * (1 - t) * p[2] + t ^ 2 * p[3];
end;

 Split=function(str, symbol)
	if str == nil or str == "" or symbol == nil then
	  return
	end
	local tab = {}
	for match in (str .. symbol):gmatch("(.-)" .. symbol) do
	  table.insert(tab, match)
	end
	return tab
  end


GetUnix=function ()
	local dateArr = Split(GetSystemDate(), "/")
	dateArr[3] = "20" .. dateArr[3]
	local timeArr = Split(GetSystemTime(), ":")
	local sec = tonumber(timeArr[3]) + tonumber(timeArr[2]) * 60 + tonumber(timeArr[1]) * 60 * 60 +
		(tonumber(dateArr[2]) - 1) * 60 * 60 * 24
	local year = tonumber(dateArr[3])
	local min = tonumber(dateArr[1]) - 1
	for i = 1, min do
	  if i == 1 or i == 3 or i == 5 or i == 7 or i == 8 or i == 10 or i == 12 then
		sec = sec + 31 * 60 * 60 * 24
	  elseif i == 4 or i == 6 or i == 9 or i == 11 then
		sec = sec + 30 * 60 * 60 * 24
	  else
		if (year % 4 == 0 and year % 100 ~= 0) or (year % 400 == 0) then
		  sec = sec + 29 * 60 * 60 * 24
		else
		  sec = sec + 28 * 60 * 60 * 24
		end
	  end
	end
	local day = 0
	for i = 1970, year - 1 do
	  if (i % 4 == 0 and i % 100 ~= 0) or (i % 400 == 0) then
		day = day + 366
	  else
		day = day + 365
	  end
	end
	sec = sec + day * 60 * 60 * 24
	if IsDedicatedServer() then
		sec = sec + 8 * 3600
	end
	return sec - 8 * 3600
  end


  split = function(str, p)
    local rt = {}
    str:gsub(
        '[^' .. p .. ']+',
        function(w)
            table.insert(rt, w)
        end
    )
    return rt
end