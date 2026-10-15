import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import test from 'node:test';

const core = readFileSync(new URL('../themes/lazulite/assets/js/theme-core.js', import.meta.url), 'utf8');
const source = readFileSync(new URL('../static/js/theme.js', import.meta.url), 'utf8');

function setup({ stored = null, browser = 'dark', hour = 12, storageFails = false, legacy = false, chromeAttributes = {}, noMetadata = false } = {}) {
  let now = new Date(2026, 9, 15, hour, 0, 0).getTime();
  let persisted = stored;
  let timeout;
  let delay;
  const events = {};
  const windowEvents = {};
  const root = {};
  const chrome = { 'data-light': '#F3F6F9', 'data-dark': '#0B1017', content: '#0B1017', media: '(prefers-color-scheme: dark)', ...chromeAttributes };
  const secondary = { content: '#F3F6F9', media: '(prefers-color-scheme: light)' };
  const metas = noMetadata ? [] : [chrome, secondary];
  const readyAttributes = {};
  const scheme = {};
  const attributeNode = attributes => ({
    getAttribute: name => attributes[name] ?? null,
    remove() { metas.splice(metas.indexOf(attributes), 1); },
    removeAttribute: name => { delete attributes[name]; },
    setAttribute: (name, value) => { attributes[name] = value; },
  });
  const media = ['dark', 'light'].map(value => {
    const result = { matches: browser === value };
    result[legacy ? 'addListener' : 'addEventListener'] = (...args) => {
      result.notify = args.at(-1);
    };
    return result;
  });
  const options = ['system', 'light', 'dark'].map(value => ({
    value,
    getAttribute: () => value,
    matches: () => true,
  }));
  const label = {};
  const menuEvents = {};
  const trigger = { focus() { trigger.focused = true; } };
  const switcher = {
    open: false,
    parentElement: attributeNode(readyAttributes),
    querySelector: selector => selector === 'summary' ? trigger : label,
    querySelectorAll: () => options,
    addEventListener: (name, callback) => { menuEvents[name] = callback; },
    removeAttribute() { switcher.open = false; },
    contains: () => false,
  };
  const document = {
    hidden: false,
    documentElement: attributeNode(root),
    addEventListener: (name, callback) => { events[name] = callback; },
    querySelector: selector => selector.includes('theme-color') ? (metas.length ? attributeNode(metas[0]) : null)
      : selector.includes('color-scheme') ? attributeNode(scheme) : switcher,
    querySelectorAll: selector => selector.includes('theme-color') ? metas.map(attributeNode) : [switcher],
  };
  const window = {
    localStorage: {
      getItem() { if (storageFails) throw Error('blocked'); return persisted; },
      setItem(key, value) { if (storageFails) throw Error('blocked'); persisted = value; },
    },
    addEventListener: (name, callback) => { windowEvents[name] = callback; },
    clearTimeout() { timeout = undefined; delay = undefined; },
    setTimeout(callback, ms) { timeout = callback; delay = ms; return 1; },
  };
  if (browser !== 'unsupported') {
    window.matchMedia = query => media[query.includes('dark') ? 0 : 1];
  }
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
  }
  const context = createContext({ window, document, Date: Clock });
  runInContext(core, context);
  return {
    root, chrome, secondary, metas, scheme, options, switcher, trigger, label, document,
    controller: window.LazuliteTheme,
    get stored() { return persisted; },
    get delay() { return delay; },
    ready() { runInContext(source, context); },
    choose(value) { menuEvents.change({ target: options.find(option => option.value === value) }); },
    browser(value) {
      media.forEach((query, i) => { query.matches = value === ['dark', 'light'][i]; });
      media[0].notify();
    },
    advance(hours) { now += hours * 60 * 60 * 1000; timeout(); },
    returnAt(hour) { now = new Date(2026, 9, 15, hour).getTime(); windowEvents.pageshow(); },
    external(value) { persisted = value; windowEvents.storage({ key: 'lazulite-theme' }); },
    visibility() { events.visibilitychange(); },
    escape() { events.keydown({ key: 'Escape', preventDefault() {} }); },
    outside() { events.click({ target: {} }); },
  };
}

test('default follows dark or light browser preference before DOM readiness', () => {
  for (const browser of ['dark', 'light']) {
    const app = setup({ browser });
    assert.equal(app.root['data-theme'], browser);
    assert.equal(app.scheme.content, browser);
    assert.equal(app.chrome.content, app.chrome['data-' + browser]);
    assert.equal(app.delay, undefined);
  }
});

test('saved explicit choices override the browser and survive browser changes', () => {
  for (const stored of ['light', 'dark']) {
    const app = setup({ stored, browser: stored === 'light' ? 'dark' : 'light' });
    app.ready();
    app.browser(stored === 'light' ? 'dark' : 'light');
    assert.equal(app.root['data-theme'], stored);
    assert.equal(app.label.textContent, stored);
  }
});

test('invalid and saved system values follow browser preference', () => {
  for (const stored of ['system', '', 'invalid', 'LIGHT']) {
    const app = setup({ stored, browser: 'light', hour: 23 });
    app.ready();
    assert.equal(app.root['data-theme'], 'light');
    assert.equal(app.label.textContent, 'system');
    assert.equal(app.options[0].checked, true);
  }
});

test('clock fallback handles exact boundaries with missing or unsupported queries', () => {
  for (const browser of ['none', 'unsupported']) {
    for (const [hour, expected] of [[0, 'dark'], [6, 'dark'], [7, 'light'], [18, 'light'], [19, 'dark'], [23, 'dark']]) {
      assert.equal(setup({ browser, hour }).root['data-theme'], expected);
    }
  }
});

test('clock fallback schedules the next boundary including the following morning', () => {
  const morning = setup({ browser: 'none', hour: 6 });
  assert.equal(morning.delay, 60 * 60 * 1000);
  morning.advance(1);
  assert.equal(morning.root['data-theme'], 'light');
  assert.equal(morning.delay, 12 * 60 * 60 * 1000);
  morning.advance(12);
  assert.equal(morning.root['data-theme'], 'dark');
  assert.equal(morning.delay, 12 * 60 * 60 * 1000);
  const night = setup({ browser: 'none', hour: 23 });
  assert.equal(night.delay, 8 * 60 * 60 * 1000);
});

test('page return and visibility re-evaluate automatic themes', () => {
  const app = setup({ browser: 'none', hour: 12 });
  app.returnAt(22);
  assert.equal(app.root['data-theme'], 'dark');
  app.visibility();
  assert.equal(app.root['data-theme'], 'dark');
});

test('system tracks live browser changes, including legacy media listeners', () => {
  for (const legacy of [false, true]) {
    const app = setup({ legacy });
    app.ready();
    app.browser('light');
    assert.equal(app.root['data-theme'], 'light');
    assert.equal(app.label.textContent, 'system');
    app.browser('dark');
    assert.equal(app.root['data-theme'], 'dark');
  }
});

test('choices persist and returning to system immediately resumes automatic behavior', () => {
  const app = setup({ browser: 'dark' });
  app.ready();
  assert.equal(app.switcher.parentElement.getAttribute("data-theme-ready"), "");
  app.choose('light');
  assert.equal(app.stored, 'light');
  assert.equal(app.root['data-theme'], 'light');
  app.choose('system');
  assert.equal(app.stored, 'system');
  assert.equal(app.root['data-theme'], 'dark');
});

test('blocked storage still allows an in-memory selection', () => {
  const app = setup({ storageFails: true });
  app.ready();
  app.choose('light');
  app.browser('dark');
  assert.equal(app.root['data-theme'], 'light');
  assert.equal(app.label.textContent, 'light');
});

test('explicit selection cancels the clock fallback timer', () => {
  const app = setup({ browser: 'none' });
  app.ready();
  app.choose('dark');
  assert.equal(app.delay, undefined);
  app.choose('system');
  assert.equal(app.delay, 7 * 60 * 60 * 1000);
});

test('storage changes synchronize selection across tabs and clearing restores system', () => {
  const app = setup();
  app.ready();
  app.external('light');
  assert.equal(app.root['data-theme'], 'light');
  assert.equal(app.options[1].checked, true);
  app.external(null);
  assert.equal(app.root['data-theme'], 'dark');
  assert.equal(app.options[0].checked, true);
});

test('Escape restores trigger focus; an outside click closes without stealing focus', () => {
  const app = setup();
  app.ready();
  app.switcher.open = true;
  app.escape();
  assert.equal(app.switcher.open, false);
  assert.equal(app.trigger.focused, true);
  app.trigger.focused = false;
  app.switcher.open = true;
  app.outside();
  assert.equal(app.switcher.open, false);
  assert.equal(app.trigger.focused, false);
});

test('both palettes keep text and focus indicators legible on tonal surfaces', () => {
  const tokens = readFileSync(new URL('../themes/lazulite/assets/sass/utils/_variables.scss', import.meta.url), 'utf8');
  function luminance(hex) {
    const channels = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255)
      .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return channels.reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
  }
  function contrast(a, b) {
    const values = [luminance(a), luminance(b)].sort((x, y) => x - y);
    return (values[1] + 0.05) / (values[0] + 0.05);
  }
  for (const name of ['dark', 'light']) {
    const map = tokens.match(new RegExp('\\$' + name + '-colors: \\(([\\s\\S]*?)\\);'))[1];
    const palette = Object.fromEntries([...map.matchAll(/"([^"]+)":\s*(#[\da-fA-F]{6})/g)].map(match => [match[1], match[2]]));
    for (const surface of ['background', 'surface', 'surface-raised']) {
      for (const text of ['text-primary', 'text-secondary', 'text-muted', 'interactive-text']) {
        assert.ok(contrast(palette[text], palette[surface]) >= 4.5, `${name}: ${text} on ${surface}`);
      }
      assert.ok(contrast(palette['focus-ring'], palette[surface]) >= 3, `${name}: focus on ${surface}`);
    }
    for (const fill of ['accent', 'button-hover']) {
      assert.ok(contrast(palette['on-accent'], palette[fill]) >= 4.5, `${name}: primary button ${fill}`);
    }
  }
});


test('startup and subsequent overrides leave one authoritative browser color', () => {
  const app = setup({ browser: 'light', stored: 'dark' });
  assert.equal(app.metas.length, 1);
  assert.equal(app.chrome.content, '#0B1017');
  assert.equal(app.chrome.media, undefined);
  app.ready();
  app.choose('light');
  assert.equal(app.metas.length, 1);
  assert.equal(app.chrome.content, '#F3F6F9');
});

test('missing and empty color attributes preserve existing valid metadata', () => {
  for (const value of [null, '', '   ']) {
    const app = setup({ browser: 'light', chromeAttributes: { 'data-light': value } });
    assert.equal(app.root['data-theme'], 'light');
    assert.equal(app.metas.length, 2);
    assert.equal(app.chrome.content, '#0B1017');
    assert.equal(app.chrome.media, '(prefers-color-scheme: dark)');
    assert.equal(app.secondary.content, '#F3F6F9');
    app.ready();
    app.choose('dark');
    assert.equal(app.metas.length, 1);
    assert.equal(app.chrome.content, '#0B1017');
  }
});

test('themes still work without any browser color metadata', () => {
  const app = setup({ noMetadata: true });
  app.ready();
  app.choose('light');
  assert.equal(app.root['data-theme'], 'light');
  assert.equal(app.scheme.content, 'light');
});

test('core stays active while menu code is delayed or unavailable', () => {
  const app = setup({ browser: 'dark' });
  assert.equal(app.switcher.parentElement.getAttribute('data-theme-ready'), null);
  app.external('light');
  assert.equal(app.root['data-theme'], 'light');
  app.ready();
  assert.equal(app.label.textContent, 'light');
  assert.equal(app.switcher.parentElement.getAttribute('data-theme-ready'), '');
});

test('controller subscriptions observe preference changes and can unsubscribe', () => {
  const app = setup();
  const observed = [];
  const unsubscribe = app.controller.subscribe(() => observed.push(app.controller.getPreference()));
  app.controller.setPreference('light');
  unsubscribe();
  app.controller.setPreference('dark');
  assert.deepEqual(observed, ['light']);
  assert.equal(app.root['data-theme'], 'dark');
});
