#!/bin/bash

set -e

update-license-header() {
    perl -i -0pe 's/\/\*.*\n.*Copyright.*Stratumn.*\n(.*\n)*\*\/\n/`cat LICENSE_HEADER`/ge' $1
}

directories="src test"
extensions="js ts css"

for d in $directories; do
	if [ -d "$d" ]; then
		for e in $extensions; do
			for f in $(find $d -name "*.$e"); do
				update-license-header $f
			done
		done
	fi
done

extensions="html"

update-license-header() {
    perl -i -0pe 's/<!--.*\n.*Copyright.*Stratumn.*\n(.*\n)*-->\n/`cat LICENSE_HEADER.html`/ge' $1
}

for d in $directories; do
	if [ -d "$d" ]; then
		for e in $extensions; do
			for f in $(find $d -name "*.$e"); do
				update-license-header $f
			done
		done
	fi
done
