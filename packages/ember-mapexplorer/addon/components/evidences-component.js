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
      this.get("evidences").map(e =>
        Object.assign(e, { component: evidenceComponents[e.backend] })
      )
    );
  }
});
