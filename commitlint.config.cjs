/** @type {import("@commitlint/types").UserConfig} */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      1,
      "always",
      [
        "root",
        "contracts",
        "shared",
        "core",
        "persistence",
        "desktop",
        "ci",
        "deps",
      ],
    ],
    "subject-case": [0],
  },
};
