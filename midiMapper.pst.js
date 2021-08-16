//////////////////// DEFINE YOUR MIDI MAPPING AND SETTINGS /////////////////////
var MIDI_MAPPING = ` // Please leave this on line-number 2 to get accurate error-messages

`;

var PASS_THROUGH_INPUT = false; // true or false
var SEND_UNMAPPED_MIDI = true; // true or false

var MIDDLE_C_NUMBER = 4; // corresponds to midi note 60
var NOTE_NAMES = 'c, c#, d, d#, e, f, f#, g, g#, a, a#, b';
	// can be modified, german for example: 'c, cis, d, dis, e, f, fis, g, gis, a, b, h'
	// be careful to not use any of the abbreviations, it might not work


/*////////////////////////////////// MANUAL ////////////////////////////////////

This is hopefully the most advanced and fastest but easy to understand midiMapper for Mainstage.
https://github.com/88thman/mainstageScripts

Short Example: (Go to MIDI_MAPPING = ``; to configure your mapping)

	receive
		channel 1 - 5                 // receives channel 1, 2, 3, 4 and 5
			type continousControl
				number 1, 11            // receives cc1 and cc11
					value any            // receives any value from cc1 and cc11 from channels 1 - 5
	send
		channel 2
			type continousControl
				number input            // in this case either cc1 or cc11
					value input          // send received input value
			type programChange
				number [5, 2, 9, 1 - 3] // Send sequentially 5, 2, 9, 1, 2, 3 and repeat
	

MIDI-Messages: (for receiving and sending)

	channel 1 ... 16, any
	
		Examples:
			channel any   = Any channel
			channel 15    = Channel 15
			channel1,2    = Channel 1 and 2
			channel 3 - 6 = Channels 3, 4, 5 and 6
		
	
	type, number, value:
		+------------------+----------------------------+-----------------+
		|       TYPE       |           NUMBER           |      VALUE      |
		+------------------+----------------------------+-----------------+
		|                  |           pitch            |     velocity    |
		| noteOn           | 1 ... 127, any, <noteName> | 0 ... 127, any  |
		| noteOff          | 1 ... 127, any, <noteName> | 0 ... 127, any  |
		+------------------+----------------------------+-----------------+
		|                  |           pitch            |     pressure    |
		| polyPressure     | 1 ... 127, any, <noteName> | 0 ... 127, any  |
		+------------------+----------------------------+-----------------+
		| continousControl | 0 ... 127, any             | 0 ... 127, any  |
		| programChange    | 0 ... 127, any             | --------------- |
		| channelPressure  | 0 ... 127, any             | --------------- |
		| pitchBend        | -8192 ... 8191, any        | --------------- |
		+------------------+----------------------------+-----------------+
	
		Examples:
			noteOn 60               = Only noteOn 60 (Middle C)
			noteOff g4-a#6          = NotesOff between g4 and a#6 (including those)
			c0, c1, c#7             = NotesOn: c0, c1 and c#7
			polyPressure 1-10       = PolyPressure of notes 1, 2, 3, ..., 10
			polyPressure d#3        = PolyPressure of note d#3
			controlChange any       = Any continous controller
			continousControl 1,4    = Continous controllers 1 and 4
			continousControl1,11-13 = Continous controllers 1, 11, 12 and 13
			programChange 100       = Program change 100
			channelPressure any     = Any number of channelpressure
			pitchBend -2000-2000    = Pitchbends -2000, -1999, -1998, ..., 1999, 2000
			pitchBend -10--5,3      = Pitchbends -10, -9, -8, -7, -6, -5, 3

Send-MIDI-Value:

	<number>                = Send number
	<number1>-<number2>     = Send all numbers between number1 and number2 (including those)
	[<number>,<number>,...] = Send sequence
	input                   = Send input
	input<modification>     = Send modified input
	
	Examples:
		7         = Send 7
		5,10      = Send 5 and 10
		[20,90]   = Toggle between 20 and 90
		[3, 1, 2] = Send sequentially 3, 1, 2 and repeat
		4-7       = Send 4, 5, 6 and 7
		input     = Send input value
		input+2   = Send (input value + 2)
		input-5   = Send (input value - 5)
		input/2-3 = Send ((input value / 2) - 3)
		input*0.2 = Send (input value * 0.2)
		input,input+20,[0,127],3,16 = Send combination of input, seqence and absolute values
	
	Information:
		"input" depends on it's position. (Below are alternatives)

		recieve: channel any; type continousControl; number 113;   value any
		                  |               |                  |            |
		                  V               V                  V            V
		send:   channel input;     type input;      number input; value input

Special Send-MIDI-Values:
	
	To send a different inputValue than the positional, use following, absolute commands:
	
	inputChannel
	inputType
	inputNumber
	inputValue
	
	(these can be modified too)
	

Hierarchy of commands:

	receive -> channel -> type -> number -> value
	-> send -> channel -> type -> number -> value

Abbreviations:
	
	r = rec = receive
	s = snd = send
	ch      = channel
	t = typ = type
	n = nr  = number
	v = val = value
	
	i  = input
	ic = inCh  = inputChannel
	it = inTyp = inputType
	in = inNum = inputNumber
	iv = inVal = inputValue
	
	cc = ctrl = continousControl
	on = nOn  = noteOn
	of = nOff = noteOff
	pp = poPr = polyPressure
	pc = prog = programChange
	cp = chPr = channelPressure
	pb = bend = pitchBend
	
Comments:

	You may want to comment your mapping.
	// comment until the end of line
	
	Example:
		r: ch any; typ cc; nr 7;    val any // Volume
		s: ch  10; typ cc; nr 1,11; val i   // Modulation & Expression

Pro-Tips:

	a) You can use spaces, line breaks and following symbols to beautify your mappings:
		
		;.<>"'={}&|!%^:_@?
		
		Example:
			receive: channel 1; type noteOn; number g#4
			send:    channel 4
			
	b) You can skip command names as long as you stay within the hierarchy.
	   Skipped, recieiving commands will include any incoming channel, type, number and value.
	   Skipped, sending commands will inherit input channel, type, number and value.

		Instead of:
			r ic:16 it:cc in:11 iv:any
			s oc:1  ot:i  on:13 ov:i/2
		you can write:
			r 16 cc 11 any
			s 1  cc 13 i/2
		which means:
			Route cc11 from channel 16 to cc13 in channel 1 with value divided by two

	c) You can skip commands by setting the next channel-command

		Not given input will be handled as any input
		For not given output, input will be sent

		Instead of:
			ic:16 it:cc in:any iv:any
			oc:3  ot:i  on:i   ov:i+2
		you can write:
			rc:16 t:cc
			sc:3 v:i+2
		which means:
			Route controllers from channel 16 to channel 3
			and add 2 to the value
	
	d) Block messages by not defining send command

	e) Combine abbreviations with Tips to write powerful yet short commands
	
		Examples:
			r 6 s 5                   // Receives channel 6, sends to channel 5
			r 2 cc 1-3                // Block cc 1, 2 and 3 from channel 2
			r any pc s i cc 30 [1-5]  // Route programChanges to cc 30 and step through sequence [1, 2, 3, 4, 5]
*/



/////////////////////////// EXAMPLE (can be deleted) ///////////////////////////
// TODO Put Example in comment section




var MIDI_MAPPING_EXAMPLE = `

	receive
		channel 1 - 5                 // receives channel 1, 2, 3, 4 and 5
			type continousControl
				number 1, 11            // receives cc1 and cc11
					value any            // receives any value from cc1 and cc11 from channels 1 - 5
	send
		channel 2
			type continousControl
				number input            // in this case either cc1 or cc11
					value input          // send received input value
			type programChange
				number [5, 2, 9, 1 - 3] // Send sequentially 5, 2, 9, 1, 2, 3 and repeat

		receive: channel any; type continousControl; number 113;   value any
		send:   channel input;     type input;      number input; value input

		r: ch any; typ cc; nr 7;    val any // Volume
		s: ch  10; typ cc; nr 1,11; val i   // Modulation & Expression

			receive: channel 1; type noteOn; number g#4
			send:    channel 4

			r ch:16 t:cc nr:11 v:any
			s ch:1  t:i  nr:13 v:i/2
	
			r 16 cc 11 any
			s 1  cc 13 i/2

			r ch:16 t:cc nr:any v:any
			s ch:3  t:i  nr:i   v:i+2
			
			r ch:16 t:cc
			s ch:3 v:i+2

			r 6 s 5                   // Receives channel 6, sends to channel 5
			r 2 cc 1-3                // Block cc 1, 2 and 3 from channel 2
			r any pc s i cc 30 [1-5]  // Route programChanges to cc 30 and step through sequence [1, 2, 3, 4, 5]













// [1] Sends all cc7 to channel 1:
	receive
		channel any
			type controlChange
				number 7
					value any
	send
		channel 1
			type controlChange
				number 7
					value input

// [2 Abbreviations] Pass through cc 1 and 11 from channels 2 to 12:
	rec
		ch: 2-12
			typ: cc
				nr: 1, 11
					val: any
	snd
		ch: i
			typ: i
				nr: i
					val: i


// [3 Skipping Commands] Route all MIDI-Messages from channel 16 to channel 5:
	r: ch 16
	s: ch  5

// [4] NoteOns toggle on/off: cc95 with g3 and cc96 with note 70
	rec
		ch: 1
			typ: noteOn
				nr: g3
					val: 127
	send
		ch: 1
			typ: cc
				nr: 95
					val: [0,127]
				
	rec
		ch: any
			typ: noteOn
				number: 70
					val: 127
	send
		ch: 1
			typ: cc
				nr: 96
					val: [0,127]
			
// [5] Block any message from channel 4 and cc1-11 from channel 5:
	r
		ch: 4
	r
		ch: 5
			typ: cc 
				nr: 1-11

// [6] Use value of cc 30 for program change
	r ch: 15; typ: cc; nr: 30; val: any
	s ch: 1; typ: programChange; nr: inVal
`;
//////////////////////////////// END OF EXAMPLE ////////////////////////////////
















/////////////////// CODE - DO NOT EDIT (unless you know how) ///////////////////
var noteNames = NOTE_NAMES.replace(/\s/g,'').split(/,/);
var dict = {
	'r':       'receive',
	'rec':     'receive',
	'receive': 'receive',
	's':    'send',
	'snd':  'send',
	'send': 'send',
	'ch':      'channel',
	'channel': 'channel',
	't':    'type',
	'typ':  'type',
	'type': 'type',
	'nr':     'number',
	'number': 'number',
	'v':     'value',
	'val':   'value',
	'value': 'value',

	'i':     'input',
	'input': 'input',
	'ic':           'inputchannel',
	'inch':         'inputchannel',
	'inputchannel': 'inputchannel',
	'it':        'inputtype',
	'intyp':     'inputtype',
	'inputtype': 'inputtype',
	'in':          'inputnumber',
	'innum':       'inputnumber',
	'inputnumber': 'inputnumber',
	'iv':         'inputvalue',
	'inval':      'inputvalue',
	'inputvalue': 'inputvalue',

	'cc':               'continouscontrol',
	'ctrl':             'continouscontrol',
	'controlchange':    'continouscontrol',
	'continouscontrol': 'continouscontrol',
	'on':     'noteon',
	'non':    'noteon',
	'noteon': 'noteon',
	'of':      'noteoff',
	'noff':    'noteoff',
	'noteoff': 'noteoff',
	'pp':           'polypressure',
	'poPr':         'polypressure',
	'polypressure': 'polypressure',
	'pc':            'programchange',
	'prog':          'programchange',
	'programchange': 'programchange',
	'cp':              'channelpressure',
	'chpr':            'channelpressure',
	'channelpressure': 'channelpressure',
	'pb':        'pitchbend',
	'bend':      'pitchbend',
	'pitchbend': 'pitchbend',
	
	'any': 'any'
};

function T(t) {
	if (dict[t]) {
		return dict[t];
	} else {
		return undefined;
	}
}

class NoteOff {}
class NoteOn {}
class PolyPressure {}
class ControlChange {}
class ProgramChange {}
class PitchBend {}
class ChannelPressure {}


class Collection {
	constructor(initState) {
		this.items = initState;
	}

	add(item) {
		if (this.array) {
			this.items.push(item);
		} else {
			this.array = true;
			this.items = [item];
		}
	}

	forEach(func) {
		if (this.array) {
			this.items.forEach(item => {
				func(item);
			});
		} else {
			func(this.items);
		}
	}
}
/*
	[
		type: [
			channel: [
				number: [
					value: []
				]
			]
		]
	]
*/

class Message {
	#iterator = 0;

	constructor(initState) {
		this.channels = new Collection(initState);
		this.numbers = new Collection(initState);
		this.values = new Collection(initState);
	}
	
	setChannel(channel) {
		this.event.channel = channel;
	};
	setNumber(number) {
		this.event.number = number;
	};
	setValue(value) {
		this.event.value = value;
	};
	
	create = {
		noteon: function() {
			this.event = new NoteOn;
			this.setNumber = function(pitch) {
				this.event.pitch = pitch;
			};
			this.setValue = function(velocity) {
				this.event.velocity = velocity;
			};
		},
		noteoff: function() {
			this.event = new NoteOff;
			this.setNumber = function(pitch) {
				this.event.pitch = pitch;
			};
			this.setValue = function(velocity) {
				this.event.velocity = velocity;
			};
		},
		polypressure: function() {
			this.event = new PolyPressure;
			this.setNumber = function(pitch) {
				this.event.pitch = pitch;
			};
		},
		continouscontrol: function() {
			this.event = new ControlChange;
		},
		programchange: function() {
			this.event = new ProgramChange;
			this.setValue = this.setNumber;
		},
		channelpressure: function() {
			this.event = new ChannelPressure;
			this.setNumber = function(dummy) {};
		},
		pitchbend: function() {
			this.event = new PitchBend;
			this.setNumber = function(dummy) {};
		}
	}; // create = {
	
	send() {
		this.channels.forEach(channel => {
			if (Array.isArray(channel)) {
				channel = channel[this.#iterator % channel.length];
			}
			this.setChannel(channel);
			
			this.numbers.forEach(number => {
				if (Array.isArray(number)) {
					number = number[this.#iterator % number.length];
				}
				this.setNumber(number);
				
				this.values.forEach(value => {
					if (Array.isArray(value)) {
						value = value[this.#iterator % value.length];
					}
					this.setValue(value);
					
					this.event.send();
				});
			});
		});
		this.iterator++;
	} // send()
}

var m, mappings = [];

function createMappings() {
	let lastObj;
	let lastCase;
	let lNr = 2;
	MIDI_MAPPING.split(/\n/).forEach(line => {
		line
			.toLowerCase()
			.replace(/\s*\/\/.*/g, '') // remove comments
			.replace(/[;.<>"'={}&|!%^:_@?]/g, ' ') // replace symbols
			.replace(/(\S)any/g, '$1 any') // space any
			.replace(/\b([a-z]+)(?=\s|$)/g, function (m, a) {
				let t = T(a);
				if (t == undefined) {
					throw new InputError('Sorry, I can\'t figure out what "' + a + '" means.', lNr);
				}
				return ' ' + t + ' ';
			})
			.replace(/\b([a-z#]+)(-?[0-9])\b/g, function (m, a, b) {
				let pos = noteNames.indexOf(a);
				if (pos != -1) {
					let nr = pos;
					nr += 12 * (5 - MIDDLE_C_NUMBER + Number(b));
					if (nr < 0 || nr > 127) {
						throw new InputError('Note "' + m + '" (' + nr + ') is out of MIDI-Range [0 ... 127]', lNr);
					} else {
						return nr;
					}
				} else {
					throw new InputError('Couldn\'t find "' + a + '" of "' + m + '" in NOTE_NAMES', lNr);
				}
			})
			.replace(/ *([-+*/,]) */g, '$1') // remove spaces around -+*/,
			.replace(/\s+/g, ' ') // replace whitespaces
			.replace(/\[\s*/g, '[') // remove spaces after [
			.replace(/\s*\]/g, ']') // remove spaces before ]
			.replace(/^ | $/g, '') // remove first and last space
			.split(/ /)
			.forEach(el => {
				if (el == 'receive') {
					lastObj = new Message();
					lastCase = 'channels';
					mappings.push(lastObj);
				} else if (el == 'send') {
					if (lastObj) {
						lastObj = new Message(lastObj);
					} else {
						throw new InputError('No receiving message declared before sending', lNr);
					}
					lastCase = 'channels';
				} else if (el == 'channel') {
					lastCase = 'channels';
				} else if (el == 'type') {
					lastCase = 'type';
				} else if (el == 'number') {
					lastCase = 'numbers';
				} else if (el == 'value') {
					lastCase = 'values';
				} else if (el == 'any') {
					// Do nothing, since all inputs are any
				} else if (lastCase === 'type') {
					if (lastObj.create[el]) {
						lastObj.create[el]();
					} else {
						throw new InputError('Cant find type "' + el + '"', lNr);
					}
					lastCase = 'numbers';
				} else if (m = el.match(/^input.*/)) {
					if (lastObj && lastObj.receiver) {
						lastObj[lastCase].add(m);
					} else {
						throw new InputError('No receiving message declared before sending ' + m, lNr);
					}
				} else {
					el = el.replace(/\[([^\]]+)\]/g, function (m, a) {
						lastObj[lastCase].add(new Sequence(a, lNr));
						return '';
					});
					el = el.replace(/,,/, ',');
					el = el.split(/,/);
					el.forEach(p => {
						let range = p.match(/(-?[0-9]+)-(-?[0-9]+)/);
						if (range) {
							p = new Range(range[1], range[2], lNr);
						}
					});
				}
			});
		++lNr;
	});
}

class InputError extends Error {
  constructor(msg, lNr = 0) {
  	if (lNr) {
    super('[Line: ' + lNr + '] ' + msg);
    } else {
    	super(msg);
    }
    this.name = 'Input Error';
  }
}

class Range {
	constructor (start, end, lNr = 0) {
		if (isNaN(start)) {
			throw new InputError('Range "' + start + '-' + end + '": "' + start + '" is not a number');	
		}else if (isNaN(end)) {
			throw new InputError('Range "' + start + '-' + end + '": "' + end + '" is not a number');
		}else if (Number(start) > Number(end)) {
			throw new InputError('Range "' + start + '-' + end + '": "' + start + '" is greater than "' + end + '"');
		}
		this.start = Number(start);
		this.end = Number(end);
	}

	withinRange(n) {
		return (Number(n) >= this.start && Number(n) <= this.end);
	}
	forEach(func) {
		for (let i = this.start; i <= this.end	; ++i) {
			func(i);	
		}
	}
}

class Sequence {
	constructor(string, lNr = 0) {
		this.iterator = -1;
		this.values = string.split(/,/);
		this.values.forEach(v => {
			let m = v.match(/(-?[^-]+)-(-?[^-])/);
			if (m) {
				v = new Range(m[1], m[2]);
			} else if (isNaN(v)) {
				throw new InputError('Sequence [' + string + ']: "' + v + '" is not a number');
			}
		});
	}

	get get() {
		this.iterator = (this.iterator + 1) % this.values.length;
		return this.values[this.iterator]
	}
}

// DEBUG >>
console.log('Starting to create mapping...');
MIDI_MAPPING = MIDI_MAPPING_EXAMPLE;
// << DEBUG

createMappings();
const mappingKeys = Object.keys(mappings);

function HandleMIDI(event) {
	let key = RegExp(event.toString()
		.replace(/\[[^\]\[]+\]/,'') // remove information in brackets
		.replace(/:(\d+)/g,':(?:\\d+|any)')); // add any to numbers
	let mappings = mappingKeys.filter(function (mapping) {
		return mapping.match(key);
	});
	if (mappings.length) {
		if (PASS_THROUGH_INPUT) {
			event.send();	
		}
		mappings.forEach(messages => {
			messages.forEach(message => {
				message.send();
			});
		}); 
	} else if (SEND_UNMAPPED_MIDI || PASS_THROUGH_INPUT) {
		event.send();
	}
}




/*

[ControlChange channel:1 number:100 [Reg.Par. LSB] value:100]
[NoteOn channel:1 pitch:100 [E6] velocity:100]
[NoteOff channel:1 pitch:100 [E6] velocity:0]
[ProgramChange channel:1 number:1]
[PolyPressure channel:1 pitch:100 [E6] value:0]
[ChannelPressure channel:1 value:0]
[PitchBend channel:1 value:0 [0%]]









var CONTROLLER = 1, PROGRAM_CHANGE = 2, NOTE = 3, CUSTOM = 4, SEQUENCE = 5;
var ABSOLUTE = 1;

var toggleMap =
{
	//0: {cc: 51, val: 0},
	1: {cc: 51, val: 127},
	//2: {cc: 52, val: 0},
	3: {cc: 52, val: 127},
	//4: {cc: 53, val: 0},
	5: {cc: 53, val: 127},
	//6: {cc: 54, val: 0},
	7: {cc: 54, val: 127},
	//8: {cc: 55, val: 0},
	9: {cc: 55, val: 127},
	//10: {cc: 56, val: 0},
	11: {cc: 56, val: 127},
	//12: {cc: 57, val: 0},
	13: {cc: 57, val: 127},
	//14: {cc: 58, val: 0},
	15: {cc: 58, val: 127},
	//16: {cc: 59, val: 0},
	//17: {cc: 59, val: 127} for master mute?
};

var map =
{
	ControlChanges: {
		channel1: {
			cc30: {
				val1: [
					{
						type: CONTROLLER,
						channels: [1],
						ccs: [51],
						values: []
					}
				]
			}
		},
		channel2: {
			cc86: {
				valAbsolute: [
					{
						type: CONTROLLER,
						channels: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
						ccs: [20],
						values: [ABSOLUTE]
					}
				]
			}
		}
	}
}

function 



var toggles = [];
var tempCh, tempNr, tempVal, tempType;

function resolveCCChannel(event) {

}

function HandleMIDI(event)
{
	Trace("######## Incoming Event: " + event.toString() + "########");
	if (event instanceof ControlChange) {
		if (tempCh = map.ControlChanges["channel" + event.channel]) {
			if (tempNr = tempCh["cc" + event.number]) {
				if (tempVal = tempNr["valAbsolute"]) {
					for (let i = 0; i < tempVal.length; ++i) {
						tempType = tempVal[i];
						if (tempType.type == CONTROLLER) {
							for (let iCh = 0; iCh < tempType.channels.length; ++iCh) {
								for (let iCcs = 0; iCcs < tempType.ccs.length; ++iCcs) {
									for (let iValues = 0; iValues < tempType.values.length; ++iValues) {
										let cc = new ControlChange;
										cc.channel = tempType.channels[iCh];
										cc.number = tempType.ccs[iCcs];
										if (tempType.values[iValues] == ABSOLUTE) {
											cc.value = event.value;
										} else {
											cc.value = tempType.values[iValues];
										}
										cc.send();
										cc.trace();
									}
								}
							}
						} else if (temp2[i].type == PROGRAM_CHANGE) {
						
						} else if (temp2[i].type == NOTE) {
						
						} else if (temp2[i].type == CUSTOM) {
						
						} else if (temp2[i].type == SEQUENCE) {
						
						}
					}
				} else if (temp2 = temp1["val" + event.value]) {
				
				}
			}
		}
	}
}



	if (toggleMap[event.value])
	{
		event.number = keyMap[event.value].cc;
		if (toggle[event.number])
		{
			toggle[event.number] = event.value = 0;
		} else
		{
			toggle[event.number] = event.value = 127;
		}
		//event.send();
	}
*/