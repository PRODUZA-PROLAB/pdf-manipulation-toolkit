// Shim entry point: guarantees `node --test test/` executes the smoke tests
// even on setups where *.test.mjs files are not auto-discovered.
import './smoke.test.mjs';
