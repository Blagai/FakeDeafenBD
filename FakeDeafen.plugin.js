//META{"name":"FakeDeafen", "authorId":"317948923102756865", "website":"https://github.com/ChloeTheBitch/FakeDeafenBD"}*//
//import {DiscordModules as Modules} from "modules";

class FakeDeafen
 {
    
    getName() {return "Fake Deafen";}
    getDescription() {return "Allows you to speak and listen while being deafened";}
    getVersion() {return "0.0.1";}
    getAuthor() {return "ChloeTheBitch";}
	getWebsite() {return "https://github.com/ChloeTheBitch/FakeDeafenBD"}
    



    start() 
	{
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
		window.BdApi.alert("success",`If you want to stop the plugin, turn it off and restart Discord (CTRL+R)`);
    }
    stop()
	{
    }
}