import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tmpop-evidence', 'Integration | Component | tmpop evidence', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{tmpop-evidence evidence='{"currentHeader":{"app_hash":"EIb+VRqWDWLbOj9IwPWzuU3mR6Q=","chain_id":"test-chain-edVg3Z","height":786,"last_block_id":{"hash":"+LSW/FFeuF3Hcpngn/uz/3PCb5A=","parts":{"hash":"Rn3AtRNH+LFETOpxNNEkPDXpc4w=","total":1}},"last_commit_hash":"oarI3zI24I097aRhczXAqh6CyLk=","time":1507036308},"currentProof":{"InnerNodes":[{"Height":1,"Left":"","Right":"hir8WxuV09UcQnguiVdJZCnG5N0=","Size":2}],"LeafHash":"CwGkEzdF7akSo/nnKHk4c+xi0W0=","RootHash":"EIb+VRqWDWLbOj9IwPWzuU3mR6Q="},"originalHeader":{"app_hash":"CwGkEzdF7akSo/nnKHk4c+xi0W0=","chain_id":"test-chain-edVg3Z","height":153,"last_block_id":{"hash":"53aF1EaDjQvFh/IyNCb9W+KPlJY=","parts":{"hash":"TVaHeCUu3Wf5eug5XdHkA7678S0=","total":1}},"last_commit_hash":"Vul7fZjY3cvncF7K3KJjvOafhcY=","time":1506970472},"originalProof":{"InnerNodes":[],"LeafHash":"CwGkEzdF7akSo/nnKHk4c+xi0W0=","RootHash":"CwGkEzdF7akSo/nnKHk4c+xi0W0="},"state":"COMPLETE","transactions":{"[TMPop]:[test-chain-edVg3Z]":"152"}}'}}`);

  assert.equal(0, 0);
});
