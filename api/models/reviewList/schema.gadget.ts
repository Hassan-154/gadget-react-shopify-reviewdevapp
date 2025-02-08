import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "reviewList" model, go to https://reviewdevapp.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "qIvkIDtMVG8H",
  fields: {
    customerEmail: {
      type: "string",
      validations: { required: true },
      storageKey: "9ovL2-w3QSPb",
    },
    customerName: {
      type: "string",
      validations: { required: true },
      storageKey: "rad8MbSCrjdo",
    },
    productId: {
      type: "string",
      validations: { required: true },
      storageKey: "hFqyvIUvkU4X",
    },
    publishStatus: {
      type: "boolean",
      default: false,
      validations: { required: true },
      storageKey: "uZufEccnWkw5",
    },
    qualityRating: {
      type: "number",
      default: 5,
      validations: {
        required: true,
        numberRange: { min: 1, max: 5 },
      },
      storageKey: "FXnR_gFDoxWh",
    },
    reviewFiles: {
      type: "hasMany",
      children: { model: "reviewFiles", belongsToField: "review" },
      storageKey: "BRxFWJq5AF0D",
    },
    reviewId: {
      type: "string",
      validations: { required: true },
      storageKey: "bTguLi6Ka-cy",
    },
    reviewRating: {
      type: "number",
      default: 5,
      validations: {
        required: true,
        numberRange: { min: 1, max: 5 },
      },
      storageKey: "ZzqZjYzKM3Gb",
    },
    reviewTitle: {
      type: "string",
      validations: { required: true },
      storageKey: "9V7Z2RAOdy2d",
    },
    storeURL: {
      type: "string",
      validations: { required: true },
      storageKey: "wq2KZyMqzZnB",
    },
    valueRating: {
      type: "number",
      default: 5,
      validations: {
        required: true,
        numberRange: { min: 1, max: 5 },
      },
      storageKey: "4UUlFzEFD7Y2",
    },
  },
};
