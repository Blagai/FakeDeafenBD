/**
 * @name FakeDeafen
 * @author ChloeTheBitch
 * @description Lets you appear deafened while still being able to hear and talk
 * @version 0.0.4
 * @source https://github.com/ChloeTheBitch/FakeDeafenBD
 * @donate https://paypal.me/ArielChloeMann
 */

// todo make the setting button do something
// todo make a ui button to trigger it as well as keyboard shortcut
// todo make it possible to turn off without restarting Discord

module.exports = class FakeDeafen {
	
	// What the hell kind of coding language doesn't have the stuff defined in the constructor be publicly accesible?
	// Well the answer is JavaScript, so now I have to make the plugin look awful to make it work
	// Fuck you JS
    constructor(meta) 
	{
        this.meta = meta;
        this.mySettings = { triggerKey: "d" };
    }

	// Main code
    trigger() 
	{
        const glob = new TextDecoder("utf-8");
        WebSocket.prototype.original = WebSocket.prototype.send;
        WebSocket.prototype.send = function (data) {
            if (Object.prototype.toString.call(data) === "[object ArrayBuffer]") 
			{
                if (glob.decode(data).includes("self_deaf")) 
				{
                    data = data.replace('"self_mute":false');
                }
            }
            WebSocket.prototype.original.apply(this, [data]);
        };
        window.BdApi.alert("success", "If you want to stop the plugin, restart Discord (CTRL+R)");
    }

	// Func that gets called when button in settings is pressed
	// Doesn't do anyhthing important rn
    updateTriggerKey() 
	{
        window.BdApi.alert("Func called");
    }

    start() 
	{
		// Check if required library is downloaded and prompt the user to download it if it isn't
        if (!global.ZeresPluginLibrary) 
		{
            BdApi.UI.showConfirmationModal(
                "Library Missing",
                `The library plugin needed for ${this.meta.name} is missing. Please click Download Now to install it.`,
                {
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onConfirm: () => {
                        require("request").get(
                            "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                            async (error, response, body) => {
                                if (error)
                                    return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                                await new Promise((r) =>
                                    require("fs").writeFile(
                                        require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"),
                                        body,
                                        r
                                    )
                                );
                            }
                        );
                    },
                }
            );
        }

		// What's used to trigger the main code
        document.addEventListener("keydown", (event) => 
		{
            if (event.ctrlKey && event.key === this.mySettings.triggerKey) 
			{
                this.trigger();
            }
        });
    }

    stop() 
	{
		// This is sad
	}

	// Create the settings panel
	// Finally works correctly
    getSettingsPanel() 
	{
        const mySettingsPanel = document.createElement("div");
        mySettingsPanel.id = "my-settings";

        const triggerKeySetting = document.createElement("div");
        triggerKeySetting.classList.add("setting");

        const triggerKeySettingLabel = document.createElement("span");
        triggerKeySettingLabel.textContent = "Trigger keyboard shortcut";

		// Create the button that triggers the function that takes user input and updates the trigger key to it. Caused me so much pain.
        const triggerKeySettingButton = document.createElement("button");
        triggerKeySettingButton.textContent = "Change Key";
        triggerKeySettingButton.addEventListener("click", () => 
		{
            this.updateTriggerKey();
        });

        triggerKeySetting.appendChild(triggerKeySettingLabel);
        triggerKeySetting.appendChild(triggerKeySettingButton);

        mySettingsPanel.append(triggerKeySetting);

        return mySettingsPanel;
    }
};