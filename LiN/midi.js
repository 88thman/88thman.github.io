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