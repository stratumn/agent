import Component from "@ember/component";
import layout from "../templates/components/evidences-component";

const evidenceComponents = {
  TMPop: "tmpop-evidence",
  bcbatch: "bitcoin-evidence",
  dummy: "dummy-evidence"
};

export default Component.extend({
  layout,

  didReceiveAttrs() {
    this.set(
      "evidences",
      this.get("evidencesObj").map(e => ({
        proof: e.proof,
        provider: e.provider,
        backend: e.backend,
        component: evidenceComponents[e.backend]
      }))
    );
  }
});
