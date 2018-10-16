# Agent


<a name="overview"></a>
## Overview

### Version information
*Version* : 0.3.0




<a name="paths"></a>
## Paths

<a name="get"></a>
### GET /

#### Description
Displays information about this agent.


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Agent Info|[Response 200](#get-response-200)|

<a name="get-response-200"></a>
**Response 200**

|Name|Schema|
|---|---|
|**processes**  <br>*optional*|< string, [Process](#process) > map|


<a name="processes-get"></a>
### GET /processes

#### Description
Returns a list of the processes handled by this agent.


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Process list|< [Process](#process) > array|


<a name="process-remove-get"></a>
### GET /{process}/remove

#### Description
Removes a process from an agent.


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**process**  <br>*required*|Name of the process to be removed|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Process removed|< [Process](#process) > array|
|**404**|Process not found|No Content|


<a name="process-segments-post"></a>
### POST /{process}/segments

#### Description
Creates a new map for a process.


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**process**  <br>*required*|Name of the process|string|
|**Body**|**arguments**  <br>*optional*|Parameters that should be passed on to the init action|object|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Map created|[Segment](#segment)|
|**404**|Process not found|No Content|


<a name="process-segments-get"></a>
### GET /{process}/segments

#### Description
Finds the segments that match the given filter.


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**process**  <br>*required*|Name of the process|string|
|**Query**|**limit**  <br>*optional*|Limit number of returned segments|integer|
|**Query**|**linkHashes**  <br>*optional*|Return segments that match one of the linkHashes|< string > array|
|**Query**|**mapIds**  <br>*optional*|Return segments with specified map ID|< string > array|
|**Query**|**offset**  <br>*optional*|Offset of first returned segment|integer|
|**Query**|**prevLinkHash**  <br>*optional*|Return segments with specified previous link hash|string|
|**Query**|**tags**  <br>*optional*|Return segments that contain all the tags|< string > array|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Segments results|[Response 200](#process-segments-get-response-200)|
|**404**|Process not found|No Content|

<a name="process-segments-get-response-200"></a>
**Response 200**

|Name|Schema|
|---|---|
|**hasMore**  <br>*required*|boolean|
|**offset**  <br>*required*|number|
|**segments**  <br>*required*|< [Segment](#segment) > array|


<a name="process-segments-linkhash-get"></a>
### GET /{process}/segments/{linkHash}

#### Description
Returns the segment with the given linkHash.


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**linkHash**  <br>*required*|linkHash of the parent of the new Segment|string|
|**Path**|**process**  <br>*required*|Name of the process|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Segment|[Segment](#segment)|
|**404**|Segment not found or Process not found|No Content|


<a name="process-segments-linkhash-action-post"></a>
### POST /{process}/segments/{linkHash}/{action}

#### Description
Creates a new segment in a process.


#### Parameters

|Type|Name|Description|Schema|
|---|---|---|---|
|**Path**|**action**  <br>*required*|Name of the action that will be executed|string|
|**Path**|**linkHash**  <br>*required*|linkHash of the parent of the new Segment|string|
|**Path**|**process**  <br>*required*|Name of the process|string|
|**Body**|**arguments**  <br>*optional*|Parameters that should be passed on to the action|object|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Segment created|[Segment](#segment)|
|**403**|Action fordidden by a filter|No Content|
|**404**|Process not found or parent Segment not found|No Content|


<a name="process-upload-post"></a>
### POST /{process}/upload

#### Description
Dynamically uploads a new process to a running agent. This endpoint is only available when the agent is started with `enableProcessUpload` to true.


#### Parameters

|Type|Name|Schema|
|---|---|---|
|**Path**|**process**  <br>*required*|string|
|**Body**|**process**  <br>*required*|[process](#process-upload-post-process)|

<a name="process-upload-post-process"></a>
**process**

|Name|Description|Schema|
|---|---|---|
|**fossilizers**  <br>*optional*|List of fossilizers that should be used|< [fossilizers](#process-upload-post-fossilizers) > array|
|**plugins**  <br>*optional*|List of plugins that should be used|< [plugins](#process-upload-post-plugins) > array|
|**store**  <br>*optional*|Store used to save Segment of this process|[store](#process-upload-post-store)|

<a name="process-upload-post-fossilizers"></a>
**fossilizers**

|Name|Schema|
|---|---|
|**url**  <br>*optional*|string|

<a name="process-upload-post-plugins"></a>
**plugins**

|Name|Schema|
|---|---|
|**id**  <br>*optional*|string|

<a name="process-upload-post-store"></a>
**store**

|Name|Schema|
|---|---|
|**url**  <br>*optional*|string|


#### Responses

|HTTP Code|Description|Schema|
|---|---|---|
|**200**|Process created|< [Process](#process) > array|
|**400**|Process already exists or actions are empty|No Content|




<a name="definitions"></a>
## Definitions

<a name="evidence"></a>
### Evidence

|Name|Description|Schema|
|---|---|---|
|**backend**  <br>*optional*|Type of the evidence (Bitcoin, Tendermint, ...)|string|
|**proof**  <br>*optional*|Actual, objectively verifiable, proof of existence of the Segment|object|
|**provider**  <br>*optional*|Origin of the evidence (Chain, Identifier of the third-party...)|string|
|**state**  <br>*optional*|Current state of the evidence (Pending or Complete)|string|


<a name="process"></a>
### Process

|Name|Description|Schema|
|---|---|---|
|**fossilizersInfo**  <br>*optional*|Information about the fossilizer that will be used for the segments created by this process|< object > array|
|**name**  <br>*optional*|Name of the Process|string|
|**processInfo**  <br>*optional*||[processInfo](#process-processinfo)|
|**storeInfo**  <br>*optional*|Information about the store that will be used for the segments created by this process|object|

<a name="process-processinfo"></a>
**processInfo**

|Name|Description|Schema|
|---|---|---|
|**actions**  <br>*optional*|A map of all available actions in this process along with their arguments|object|
|**pluginsInfo**  <br>*optional*|List of the plugins that have been activated for this process|< [pluginsInfo](#process-pluginsinfo) > array|

<a name="process-pluginsinfo"></a>
**pluginsInfo**

|Name|Schema|
|---|---|
|**description**  <br>*optional*|string|
|**name**  <br>*optional*|string|


<a name="segment"></a>
### Segment

|Name|Schema|
|---|---|
|**link**  <br>*required*|[link](#segment-link)|
|**meta**  <br>*required*|[meta](#segment-meta)|

<a name="segment-link"></a>
**link**

|Name|Description|Schema|
|---|---|---|
|**meta**  <br>*required*|Metadata about the state|object|
|**state**  <br>*required*|Functional variables|object|

<a name="segment-meta"></a>
**meta**

|Name|Description|Schema|
|---|---|---|
|**evidences**  <br>*required*|List of evidences that proves the existence of this segment|< [Evidence](#evidence) > array|
|**linkHash**  <br>*required*|Identifier of this segment. Computed as the hash of its link.|string|





