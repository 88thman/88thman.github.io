let LiN = {
  count: "sdf"
};

console.log(LiN.count);
LiN.count = "mopet";
console.log(LiN.count);

LiN.load = function() {
  console.log("loaded");
};
LiN.midi = {
  works: false
};
LiN.midi.init = function (midiAccess) {
  LiN.midi.works = true;
  console.log( "MIDI ready!" );
  listInputsAndOutputs(midiAccess);
}
LiN.midi.noMidi = function (msg) {
  LiN.midi.works = false;
  console.log( "Failed to get MIDI access - " + msg );
}

window.addEventListener('load', LiN.load);
navigator.requestMIDIAccess().then( LiN.midi.init, LiN.midi.noMidi );

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