// Enforces: LAW-6.2 (Quality Gates Are Inviolable — pre-commit stage),
//           LAW-2.2 (Formatting via Prettier), Article 2 lint rules.
// See configs/CONFIG-LAW-MAP.md for the full config→law mapping.
module.exports = {
  '*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
