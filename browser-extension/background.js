const BRIDGE = 'http://127.0.0.1:7788';

async function push() {
  const tabs = await chrome.tabs.query({});
  const payload = tabs.map((tab) => ({ id: tab.id, title: tab.title, url: tab.url, active: tab.active }));

  try {
    const res = await fetch(BRIDGE + '/tabs', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) return;
  } catch (err) {
    return;
  }

  try {
    const res = await fetch(BRIDGE + '/');
    const data = await res.json();
    if (data.pending && data.pending.activate) {
      chrome.tabs.update(data.pending.activate, { active: true });
    }
  } catch (err) { /* мост недоступен */ }
}

chrome.alarms.create('sync', { periodInMinutes: 0.05 });
chrome.alarms.onAlarm.addListener(push);
chrome.tabs.onUpdated.addListener(push);
chrome.tabs.onRemoved.addListener(push);
chrome.runtime.onStartup.addListener(push);
push();
