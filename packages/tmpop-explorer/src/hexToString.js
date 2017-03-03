/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

function bytesToString(array) {
	var result = '';
	for (var i = 0; i < array.length; i++) {
		result += String.fromCharCode(array[i]);
	}
	return result;
}

// Convert a hex string to a byte array
function hexToBytes(hex) {
	for (var bytes = [], c = 0; c < hex.length; c += 2) {
		bytes.push(parseInt(hex.substr(c, 2), 16));
	}
	return bytes;
}

export default function hexToString(hex) {
	return bytesToString(hexToBytes(hex));
}
