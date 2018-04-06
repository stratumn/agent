#!/bin/bash

set -e

update-license-header() {
	perl -i -0pe 's/\/\*.*\n.*Copyright.*Stratumn.*\n([\s\S]*?)\*\/(\N*)\n/`cat LICENSE_HEADER`.$2/ge' $1
}

directories="src test"
extensions="js less"

for d in $directories; do
	for e in $extensions; do
		for f in $(find packages -regex "packages/[^/]*/$d/.*\.$e"); do
			update-license-header $f
		done
	done
done
