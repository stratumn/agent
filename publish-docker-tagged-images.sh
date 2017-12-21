#!/bin/bash

echo Please enter the version you want to publish:
read VERSION

echo Triggering agent-sample build...
AGENT_SAMPLE_TOKEN=$(keybase fs read /keybase/team/stratumn_eng/docker_agent_sample_token.dat)
curl -H "Content-Type: application/json" --data '{"source_type": "Tag", "source_name": "@indigoframework/agent-sample@'"$VERSION"'"}' -X POST https://registry.hub.docker.com/u/indigoframework/agent-sample/trigger/"$AGENT_SAMPLE_TOKEN"/

echo Triggering agent-ui build...
AGENT_UI_TOKEN=$(keybase fs read /keybase/team/stratumn_eng/docker_agent_ui_token.dat)
curl -H "Content-Type: application/json" --data '{"source_type": "Tag", "source_name": "@indigoframework/agent-ui@'"$VERSION"'"}' -X POST https://registry.hub.docker.com/u/indigoframework/agent-ui/trigger/"$AGENT_UI_TOKEN"/

echo Triggering agent-js build...
AGENT_JS_TOKEN=$(keybase fs read /keybase/team/stratumn_eng/docker_agent_js_token.dat)
curl -H "Content-Type: application/json" --data '{"source_type": "Tag", "source_name": "@indigoframework/agent@'"$VERSION"'"}' -X POST https://registry.hub.docker.com/u/indigoframework/agent-js/trigger/"$AGENT_JS_TOKEN"/

echo Triggering tmpop-explorer build...
TMPOP_EXPLORER_TOKEN=$(keybase fs read /keybase/team/stratumn_eng/docker_tmpop_explorer_token.dat)
curl -H "Content-Type: application/json" --data '{"source_type": "Tag", "source_name": "@indigoframework/tmpop-explorer@'"$VERSION"'"}' -X POST https://registry.hub.docker.com/u/indigoframework/tmpop-explorer/trigger/"$TMPOP_EXPLORER_TOKEN"/

echo Docker builds successfully triggered