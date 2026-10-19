import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import test, { after } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const temporary = mkdtempSync(join(tmpdir(), 'lazulite-google-ads-'));
const config = readFileSync(join(root, 'config.toml'), 'utf8');
let buildNumber = 0;
after(() => rmSync(temporary, { recursive: true, force: true }));

function build({ domains, missingDomains = false, environment = 'production' } = {}) {
  const destination = join(temporary, `site-${buildNumber++}`);
  const configPath = destination + '.toml';
  let settings = config;
  if (missingDomains || domains !== undefined) {
    settings = settings.replace(/^analyticsDomains\s*=.*$/m,
      missingDomains ? '' : `analyticsDomains = ${JSON.stringify(domains)}`);
  }
  writeFileSync(configPath, settings);
  const result = spawnSync('hugo', [
    '--source', root, '--config', configPath, '--destination', destination,
    '--environment', environment,
  ], { encoding: 'utf8' });
  return { ...result, destination };
}

function successfulBuild(options) {
  const result = build(options);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return result.destination;
}

function initializer(html) {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    .filter(match => match[1].includes('AW-18521711197'));
  assert.equal(scripts.length, 1);
  assert.ok(scripts[0].index < html.indexOf('</head>'));
  return scripts[0][1];
}

function execute(source, { hostname = 'lazulite.app', navigator = {}, existing = false } = {}) {
  const previousLayer = [{ event: 'existing-event' }];
  const previousGtag = () => {};
  const window = { location: { hostname } };
  if (existing) Object.assign(window, { dataLayer: previousLayer, gtag: previousGtag });
  const created = [];
  const appended = [];
  const document = {
    createElement(name) { created.push(name); return {}; },
    head: {
      appendChild(tag) {
        appended.push({
          ...tag,
          commands: Array.from(window.dataLayer, command => Array.from(command)),
        });
      },
    },
  };
  runInNewContext(source, { window, document, navigator });
  return { window, previousLayer, previousGtag, created, appended };
}

const production = successfulBuild();
const html = readFileSync(join(production, 'index.html'), 'utf8');
const source = initializer(html);

test('Google honors either browser privacy signal before touching analytics or loading scripts', () => {
  for (const navigator of [
    { doNotTrack: '1' },
    { globalPrivacyControl: true },
    { globalPrivacyControl: true, doNotTrack: '0' },
    { globalPrivacyControl: false, doNotTrack: '1' },
    { globalPrivacyControl: true, doNotTrack: '1' },
  ]) {
    for (const existing of [false, true]) {
      const app = execute(source, { navigator, existing });
      assert.deepEqual(app.created, []);
      assert.deepEqual(app.appended, []);
      if (existing) {
        assert.equal(app.window.dataLayer, app.previousLayer);
        assert.deepEqual(app.window.dataLayer, [{ event: 'existing-event' }]);
        assert.equal(app.window.gtag, app.previousGtag);
      } else {
        assert.equal(Object.hasOwn(app.window, 'dataLayer'), false);
        assert.equal(Object.hasOwn(app.window, 'gtag'), false);
      }
    }
  }
});

test('absent or inactive privacy signals permit cookieless loading on both production hosts', () => {
  for (const hostname of ['lazulite.app', 'www.lazulite.app']) {
    for (const navigator of [
      {}, { globalPrivacyControl: false }, { doNotTrack: '0' },
      { doNotTrack: 'unspecified' }, { doNotTrack: null },
      { globalPrivacyControl: false, doNotTrack: '0' },
    ]) {
      const app = execute(source, { hostname, navigator });
      assert.deepEqual(app.created, ['script']);
      assert.equal(app.appended.length, 1);
      assert.equal(app.appended[0].async, true);
      assert.equal(app.appended[0].src, 'https://www.googletagmanager.com/gtag/js?id=AW-18521711197');
    }
  }
});

test('exact hostname matching excludes local, preview and lookalike hosts without touching globals', () => {
  for (const hostname of [
    'localhost', '127.0.0.1', '', 'deploy-preview-42--lazulite.netlify.app',
    'lazulite.app.example.com', 'preview.lazulite.app', 'www.lazulite.app.example.com',
  ]) {
    const app = execute(source, { hostname, existing: true });
    assert.deepEqual(app.created, []);
    assert.deepEqual(app.appended, []);
    assert.equal(app.window.dataLayer, app.previousLayer);
    assert.deepEqual(app.window.dataLayer, [{ event: 'existing-event' }]);
    assert.equal(app.window.gtag, app.previousGtag);
  }
});

test('denied consent and redaction precede configuration and loading, preserving queued events', () => {
  const app = execute(source, { existing: true });
  assert.equal(app.window.dataLayer, app.previousLayer);
  assert.deepEqual(app.window.dataLayer[0], { event: 'existing-event' });
  const commands = app.appended[0].commands.slice(1);
  assert.deepEqual(JSON.parse(JSON.stringify(commands.slice(0, 2))), [
    ['consent', 'default', {
      ad_storage: 'denied', analytics_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    }],
    ['set', 'ads_data_redaction', true],
  ]);
  assert.equal(commands.length, 4);
  assert.equal(commands[2][0], 'js');
  assert.ok(Number.isFinite(commands[2][1].getTime()));
  assert.deepEqual(commands[3], ['config', 'AW-18521711197']);
});

test('one shared configured domain list controls both analytics integrations', () => {
  assert.match(html, /data-domains="lazulite\.app,www\.lazulite\.app"/);
  assert.match(html, /data-do-not-track="true"/);
  const domains = ['measurement.example', 'www.measurement.example'];
  const destination = successfulBuild({ domains });
  const changed = readFileSync(join(destination, 'index.html'), 'utf8');
  assert.match(changed, /data-domains="measurement\.example,www\.measurement\.example"/);
  const changedSource = initializer(changed);
  for (const hostname of domains) {
    assert.equal(execute(changedSource, { hostname }).appended.length, 1);
  }
  for (const hostname of ['lazulite.app', 'www.lazulite.app', 'measurement.example.evil']) {
    assert.equal(execute(changedSource, { hostname }).appended.length, 0);
  }
});

test('missing and empty domain configuration fail the Hugo build', () => {
  for (const options of [{ missingDomains: true }, { domains: [] }]) {
    const result = build(options);
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /params\.analyticsDomains must contain at least one production hostname/);
  }
});

test('production pages include the initializer once across all languages; development excludes it', () => {
  for (const language of ['', 'es/', 'it/', 'zh/', 'ja/']) {
    for (const page of ['', 'faq/', 'privacy/', 'whats-new/']) {
      initializer(readFileSync(join(production, language, page, 'index.html'), 'utf8'));
    }
  }
  const development = successfulBuild({ environment: 'development' });
  const pages = readdirSync(development, { recursive: true }).filter(path => path.endsWith('.html'));
  assert.ok(pages.length > 0);
  for (const path of pages) {
    assert.ok(!readFileSync(join(development, path), 'utf8').includes('AW-18521711197'), path);
  }
});
