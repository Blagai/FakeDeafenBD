//META{"name":"FakeDeafen", "authorId":"317948923102756865", "website":"https://github.com/ChloeTheBitch/FakeDeafenBD"}*//
//import {DiscordModules as Modules} from "modules";

/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/

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