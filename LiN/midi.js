function Midi() {}
Midi.access = null;

Midi.prototype.load = function (midiAccess) {
	Midi.access = midiAccess;
	midiAccess.onstatechange = LiN.updateInputs;
	LiN.updateInputs(null);
}
Midi.prototype.setInput = function (inputIndex) {
	this.inputIndex = inputIndex;

}

let midi = new Midi();
navigator.requestMIDIAccess().then(Midi.load, () => { });


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