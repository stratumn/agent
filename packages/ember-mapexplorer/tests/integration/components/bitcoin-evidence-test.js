import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bitcoin-evidence', 'Integration | Component | bitcoin evidence', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{bitcoin-evidence evidence='{"state": "COMPLETE","merkleRoot": "42dfd584f34ceb61397edf026ebcc467020fd5a5a1b2893990776fbc2934762a","merklePath": [{"left": "189138da5ce8e1126f5e5d9c53635df89c1b34ef0ac5cc3dbd5b3bb87d3e72c3","right": "7e43821a402e017352bf64c2a2668fde1fb9c46b543a42c346173461b9786948","parent": "e7f55ff823676da4d7a38a18ee3f4b61c55b12351036d0571bf9bd15eab073f1"},{"left": "45a7c974b306ee2b4dca75b1e97682d7bead9746c107d1fc16e5592f5213bcfa","right": "e7f55ff823676da4d7a38a18ee3f4b61c55b12351036d0571bf9bd15eab073f1","parent": "4de5ee7189a3a6ead321af15f7d22bb13eddd0763bcf42e32f379f22cc1b9582"},{"left": "4de5ee7189a3a6ead321af15f7d22bb13eddd0763bcf42e32f379f22cc1b9582","right": "c643f64c2131c574cd25acedf6f70db42e022a2eb999f6d0c22714c4404a1cef","parent": "42dfd584f34ceb61397edf026ebcc467020fd5a5a1b2893990776fbc2934762a"}],"transactions": {"bitcoin:main": "7b7fd668dad4635971a147eea2d67101774f4392fe3557636c9de16c909bfa57"}}'}}`);

  assert.equal(this.$().text().trim(), 'State');
});
