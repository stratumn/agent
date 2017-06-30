#!/bin/bash

set -e

update-license-header() {
    perl -i -0pe 's/\/\*.*\n.*Copyright.*Stratumn.*\n(.*\n)*\*\/\n/`cat LICENSE_HEADER`/ge' $1
}

for d in "src test"; do
    for f in $(find $d -name '*.js'); do
        update-license-header $f
    done
done
