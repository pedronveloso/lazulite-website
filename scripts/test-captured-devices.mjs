import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('public catalog contains only valid, unique, sorted device metadata', () => {
  const catalog = JSON.parse(readFileSync(new URL('../static/data/captured-devices.json', import.meta.url), 'utf8'));
  assert.deepEqual(Object.keys(catalog).sort(), ['devices', 'payloadFormatVersion', 'schemaVersion']);
  assert.equal(catalog.schemaVersion, 1);
  assert.equal(catalog.payloadFormatVersion, 2);
  assert.ok(catalog.devices.length > 0);
  const identities = catalog.devices.map(device => {
    assert.deepEqual(Object.keys(device).sort(), ['androidMajor', 'manufacturer', 'model']);
    for (const key of ['manufacturer', 'model']) {
      assert.equal(typeof device[key], 'string');
      assert.ok(device[key].trim().length > 0);
      assert.equal(device[key], device[key].trim());
    }
    assert.ok(Number.isInteger(device.androidMajor) && device.androidMajor > 0);
    return [device.manufacturer.toLowerCase(), device.model.toLowerCase(), device.androidMajor];
  });
  assert.equal(new Set(identities.map(JSON.stringify)).size, identities.length);
  const sorted = [...identities].sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : a[2] - b[2]);
  assert.deepEqual(identities, sorted);
});
