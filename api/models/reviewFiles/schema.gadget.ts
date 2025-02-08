import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "reviewFiles" model, go to https://reviewdevapp.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "LwQT5FdY3WZf",
  fields: {
    file: {
      type: "file",
      allowPublicAccess: true,
      storageKey: "2N0CfwbTgcoD",
    },
    review: {
      type: "belongsTo",
      parent: { model: "reviewList" },
      storageKey: "arTCwyDTpRIv",
    },
  },
};
