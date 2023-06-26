/**
* @name FakeDeafen
* @author ChloeTheBitch
* @description Lets you appear deafened while still being able to hear and talk
* @version 0.0.4
* @source https://github.com/ChloeTheBitch/FakeDeafenBD
* @donate https://paypal.me/ArielChloeMann
*/

// todo make the settings thingy work (thingy being panel and the settings inside lmao)
// todo make a ui button to trigger it as well as keyboard shortcut
// todo make it possible to turn off without restarting Discord

module.exports = class fakeDeafen
{
	constructor(meta)
	{
		// Set up the settings
		const mySettings = {triggerKey: "d"};
		
		// The actual code that does everything
		function trigger()
		{
			var glob = new TextDecoder("utf-8");
			WebSocket.prototype.original = WebSocket.prototype.send;
			WebSocket.prototype.send = function(data)
			{
				if (Object.prototype.toString.call(data) === "[object ArrayBuffer]") 
				{
					if (glob.decode(data).includes("self_deaf"))
					{
						data = data.replace('"self_mute":false');
					}
				}
				WebSocket.prototype.original.apply(this, [data]);
			}
			window.BdApi.alert("success",`If you want to stop the plugin, restart Discord (CTRL+R)`);
		}
		
		// Function to update the trigger key. Don't think it works but I can't even check because the settings panel won't open lmao
		function updateTriggerKey()
		{
			const newKey = prompt("Enter a new key to trigger the plugin:");
			if (newKey)
			{
				triggerKey = newKey.toLowerCase();
				BdApi.Data.save("FakeDeafen", "settings", mySettings);
			}
		}
	}
	
	start()
	{
		// Check if required library downloaded and download if not
		if (!global.ZeresPluginLibrary)
		{
			BdApi.UI.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`,
			{
				confirmText: "Download Now",
				cancelText: "Cancel",
				onConfirm: () => 
				{
					require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) =>
					{
						if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
						await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
					});
				}
			});
		}
		
		// Trigger the plugin when ctrl + triggerKey are pressed
		document.addEventListener("keydown", function(event)
		{
			if (event.ctrlKey && event.key === triggerKey)
			{
				trigger();
			}
		
		});
	}
	
	stop()
	{
		
	}
	
	// Create the settings panel
	// Does not work at all lol
	getSettingsPanel()
	{
		const mySettingsPanel = document.createElement("div");
        mySettingsPanel.id = "my-settings";

        const triggerKeySetting = document.createElement("div");
        triggerKeySetting.classList.add("setting");

        const triggerKeySettingLabel = document.createElement("span")
        triggerKeySettingLabel.textContent = "Trigger keyboard shortcut";

        const triggerKeySettingButton = document.createElement("button");
		triggerKeySettingButton.textContent = "Change Key";
		triggerKeySettingButton.addEventListener("click", updateTriggerKey);

        triggerKeySetting.appendChild(triggerKeySettingLabel);
		triggerKeySetting.appendChild(triggerKeySettingButton);

        mySettingsPanel.append(triggerKeySetting);
		
        return mySettingsPanel;
	}
}