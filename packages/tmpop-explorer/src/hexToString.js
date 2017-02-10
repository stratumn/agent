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
