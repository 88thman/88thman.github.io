function include(fileName) {
	let script = document.createElement("script");
	script.type = "text/javascript";
	script.src = fileName;
	document.getElementsByTagName("head")[0].appendChild(script);
}


function LiN() { }
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



/*
function listInputsAndOutputs( midiAccess ) {
	console.log( "List of Ports:" );
	for (var entry of midiAccess.inputs) {
		var input = entry[1];
		console.log( "Input port [type:'" + input.type + "'] id:'" + input.id +
			"' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
			"' version:'" + input.version + "'" );
	}

	for (var entry of midiAccess.outputs) {
		var output = entry[1];
		console.log( "Output port [type:'" + output.type + "'] id:'" + output.id +
			"' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
			"' version:'" + output.version + "'" );
	}
}
*/