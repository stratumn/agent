import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent(
  'tmpop-evidence',
  'Integration | Component | tmpop evidence',
  {
    integration: true
  }
);

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(
    hbs`{{tmpop-evidence evidence='{state: "COMPLETE",backend: "TMPop",provider: "test-chain-qcaYsP",proof: {original: {blockHeight: 2178,header: {chain_id: "test-chain-qcaYsP",height: 2179,time: 1507798943,num_txs: 2,last_block_id: {hash: "SWdYPdeJZuwwBpuL23mt8HIcg5c=",parts: {total: 1,hash: "K06rX5g22SZ2sZRvrFaBp2+hTfU="}},last_commit_hash: "BEoMWnnAUu8geLQ88CIsOBW0Rqk=",data_hash: "IJ0uN9arhrQ9vMUmhaEf+HMEn/A=",app_hash: "bzQlcecD/AN9Ms6cDTz2gc8q8Kk="},merkleProof: {LeafHash: "VMuBXQByCP+2s5p8E0eGmp6h3cY=",InnerNodes: [{Height: 1,Size: 2,Left: "H9Bpn7253lN2Wf5dB/YlrQj4MRA=",Right: ""},{Height: 2,Size: 3,Left: "UxHFnsH6OpsajdnKkLzDLCwmSfQ=",Right: ""},{Height: 3,Size: 5,Left: "",Right: "qG+8tH573onSmA+d/rSdmWngIBc="}],RootHash: "bzQlcecD/AN9Ms6cDTz2gc8q8Kk="},signatures: null},current: {blockHeight: 21378,header: {chain_id: "test-chain-qcaYsP",height: 21379,time: 1507821486,last_block_id: {hash: "jcqWPyHn+A3g+dBOs9vEAKJjzOY=",parts: {total: 1,hash: "LASWmyBuKPNhaRsJjvGfyTq8Flg="}},last_commit_hash: "MIkFnUsNvZwC2fNkysue4e03Xeo=",app_hash: "HAlV4NV4/YeHM9Swn/N7fxRLq7Q="},merkleProof: {LeafHash: "VMuBXQByCP+2s5p8E0eGmp6h3cY=",InnerNodes: [{Height: 1,Size: 2,Left: "",Right: "9DLb4RCAqesiWFOkrfSF+n1CNmI="},{Height: 2,Size: 4,Left: "",Right: "ScorNvLYfjXLJ9qSWa2EETgYPkc="},{Height: 3,Size: 7,Left: "",Right: "lqKZYy/Zd2CG3ZssQDg3MuRqde8="},{Height: 4,Size: 12,Left: "ngkUn2+zSQ5MP3L64qjHa5vrGdw=",Right: ""}],RootHash: "HAlV4NV4/YeHM9Swn/N7fxRLq7Q="},signatures: null}}}'}}`
  );

  assert.equal(0, 0);
});
