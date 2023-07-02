/**
 * @name FakeDeafen
 * @author ChloeTheBitch
 * @description Lets you appear deafened while still being able to hear and talk
 * @version 0.1.2
 * @source https://github.com/ChloeTheBitch/FakeDeafenBD
 * @donate https://paypal.me/ArielChloeMann
 */
 
// todo make the UI button an image and not ugly text
// todo make it possible to turn off without restarting Discord

module.exports = class FakeDeafen {
	
	// What the hell kind of coding language doesn't have the stuff defined in the constructor be publicly accesible?
	// Well the answer is JavaScript, so now I have to make the plugin look awful to make it work
	// Fuck you JS
    constructor(meta) 
	{
        this.meta = meta;
		this.mySettings = { shiftKeyRequired: false, triggerKey: "d" };

		this.myButton = document.createElement("button");
		this.myButton.textContent = "Fake Deafen";
		this.myButton.addEventListener("click", () => { this.trigger(); });

		this.myButton.style.width = "20px";
		this.myButton.style.height = "40px";
		this.myButton.style.fontSize = "8px";

		const muteButton = document.querySelector('[aria-label="Mute"]');
		if (muteButton) {
			const buttonContainer = document.createElement("div");
			buttonContainer.classList.add("button-container");
			buttonContainer.appendChild(this.myButton);

			muteButton.parentNode.insertBefore(buttonContainer, muteButton.nextSibling);
		}
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

	// Changes the trigger key to whatever the user presses and notifies the user
	updateTriggerKey() 
	{
		BdApi.showToast("Press the key you want to bind", { type: "info" });
		return new Promise((resolve) => 
		{
			const handleKeyDown = (event) => 
			{
				const newKey = event.key.toLowerCase();
				const ctrlKey = "control";
				const shiftKey = "shift";
				const altKey = "alt";
				const winKey = "meta";
				const tabKey = "tab";
				const capsLockKey = "capslock";

				if (newKey !== this.mySettings.triggerKey && newKey !== ctrlKey && newKey !== shiftKey && newKey !== altKey && newKey !== winKey && newKey !== tabKey && newKey !== capsLockKey) 
				{
					this.mySettings.triggerKey = newKey;
					window.removeEventListener("keydown", handleKeyDown);
					BdApi.showToast(`Changed key to ${newKey}`, { type: "success" });
					BdApi.Data.save(this.meta.name, "settings", this.mySettings);
				}
				else if (newKey === this.mySettings.triggerKey)
				{
					window.removeEventListener("keydown", handleKeyDown);
					BdApi.showToast("This is the same as the old key!", { type: "error" });
				} 
				else if (newKey === ctrlKey || newKey === shiftKey || newKey === altKey || newKey === winKey || newKey === tabKey || newKey === capsLockKey) 
				{
					BdApi.showToast("You can't bind certain keys to the trigger!", { type: "warning" });
				}
				resolve();
			};
			window.addEventListener("keydown", handleKeyDown);
		});
	}

    start() 
	{
		// Load settings
		Object.assign(this.mySettings, BdApi.Data.load(this.meta.name, "settings"));
		
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
			if (this.mySettings.shiftKeyRequired === false)
			{
				if (event.ctrlKey && event.key === this.mySettings.triggerKey || event.ctrlKey && event.key === this.mySettings.triggerKey.toUpperCase()) 
				{
					this.trigger();
				}
            }
			else
			{
				if (event.shiftKey && event.key === this.mySettings.triggerKey || event.shiftKey && event.key === this.mySettings.triggerKey.toUpperCase()) 
				{
					this.trigger();
				}
			}
        });
    }

    stop() 
	{
		this.myButton.remove();
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
		
		
		// Create the shift key setting stuff
        const shiftKeySetting = document.createElement("div");
        shiftKeySetting.classList.add("setting");

        const shiftKeyLabel = document.createElement("span")
        shiftKeyLabel.textContent = "Use shift instead of ctrl";

        const shiftKeyInput = document.createElement("input");
        shiftKeyInput.type = "checkbox";
        shiftKeyInput.name = "shiftKey";
		shiftKeyInput.checked = this.mySettings.shiftKeyRequired;
		
		shiftKeyInput.addEventListener("change", () => {
			this.mySettings.shiftKeyRequired = shiftKeyInput.checked;
			BdApi.Data.save(this.meta.name, "settings", this.mySettings);
		})

        shiftKeySetting.append(shiftKeyLabel, shiftKeyInput);
		
        mySettingsPanel.append(triggerKeySetting, shiftKeySetting);

        return mySettingsPanel;
    }
};