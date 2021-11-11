function include(fileName) {
	let script = document.createElement("script");
	script.type = "text/javascript";
	script.src = fileName;
	document.getElementsByTagName("head")[0].appendChild(script);
}


function LiN() {
	this.load = function() {
		include("midi.js");
	}
}
window.addEventListener('load', LiN.load);

LiN.prototype.updateInputs = function (e) {
	while (LiN.inputSelector.firstChild) {
		LiN.inputSelector.removeChild(LiN.inputSelector.firstChild);
	}

	for (var input of Midi.access.inputs) {
		let item = document.createElement("div");
		item.id = input.id;
		item.innerHTML = input.name;
		item.onclick = () => {
			midi.setInput(item.index);
		};
		LiN.inputSelector.addChild();
	}
}


