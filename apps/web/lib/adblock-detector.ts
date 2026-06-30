export type AdblockProbeStatus = 'loaded' | 'blocked' | 'timeout';

export type AdblockCheckResult = {
  status: 'clear' | 'blocked' | 'unknown';
  blocked: boolean;
  reasons: string[];
  baitHidden: boolean;
  providerProbeResults: Array<{
    name: string;
    src: string;
    status: AdblockProbeStatus;
  }>;
};

const AD_PROVIDER_PROBES = [
  { name: 'pemsrv', src: 'https://a.pemsrv.com/ad-provider.js' },
  { name: 'magsrv', src: 'https://a.magsrv.com/ad-provider.js' },
];

const AD_ZONE_BAIT = [
  { className: 'eas6a97888e33', zoneId: '5580912' },
  { className: 'eas6a97888e17', zoneId: '5579614' },
  { className: 'eas6a97888e37', zoneId: '5666986' },
  { className: 'eas6a97888e31', zoneId: '5579608' },
];

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function createBaitContainer() {
  const container = document.createElement('div');
  container.setAttribute('aria-hidden', 'true');
  container.style.cssText = 'height:1px;width:1px;position:absolute;left:-10000px;top:-10000px;overflow:hidden;pointer-events:none;';

  const genericBait = document.createElement('div');
  genericBait.className = 'adsbox ad-banner ad-unit text-ad pub_300x250 adsbygoogle ad-placement sponsor-ad';
  genericBait.style.cssText = 'height:1px;width:1px;display:block;';
  container.appendChild(genericBait);

  for (const zone of AD_ZONE_BAIT) {
    const ins = document.createElement('ins');
    ins.className = zone.className;
    ins.setAttribute('data-zoneid', zone.zoneId);
    ins.style.cssText = 'height:1px;width:1px;display:block;';
    container.appendChild(ins);
  }

  document.body.appendChild(container);
  return container;
}

function isElementHidden(element: HTMLElement) {
  const style = window.getComputedStyle(element);
  return element.offsetHeight === 0 || element.offsetWidth === 0 || style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
}

async function detectBaitHidden() {
  const container = createBaitContainer();
  await wait(120);

  const baitElements = Array.from(container.children).filter((element): element is HTMLElement => element instanceof HTMLElement);
  const baitHidden = baitElements.some(isElementHidden) || isElementHidden(container);
  container.remove();
  return baitHidden;
}

function probeScript(name: string, src: string, timeoutMs: number): Promise<{ name: string; src: string; status: AdblockProbeStatus }> {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    let settled = false;

    const cleanup = (status: AdblockProbeStatus) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      script.remove();
      resolve({ name, src, status });
    };

    const timer = window.setTimeout(() => cleanup('timeout'), timeoutMs);
    script.async = true;
    script.type = 'application/javascript';
    script.src = src;
    script.dataset.lezgamezAdblockProbe = name;
    script.onload = () => cleanup('loaded');
    script.onerror = () => cleanup('blocked');
    document.head.appendChild(script);
  });
}

export async function detectAdblock(timeoutMs = 2200): Promise<AdblockCheckResult> {
  if (typeof document === 'undefined') {
    return { status: 'unknown', blocked: false, reasons: ['document_unavailable'], baitHidden: false, providerProbeResults: [] };
  }

  const baitHidden = await detectBaitHidden();
  const providerProbeResults = await Promise.all(AD_PROVIDER_PROBES.map((probe) => probeScript(probe.name, probe.src, timeoutMs)));
  const loadedCount = providerProbeResults.filter((probe) => probe.status === 'loaded').length;
  const failedCount = providerProbeResults.filter((probe) => probe.status !== 'loaded').length;
  const allProviderProbesFailed = providerProbeResults.length > 0 && failedCount === providerProbeResults.length;
  const reasons: string[] = [];

  if (baitHidden) reasons.push('ad_bait_hidden');
  for (const probe of providerProbeResults) {
    if (probe.status !== 'loaded') reasons.push(`${probe.name}_${probe.status}`);
  }

  const blocked = baitHidden || allProviderProbesFailed;
  const status = blocked ? 'blocked' : loadedCount > 0 ? 'clear' : 'unknown';

  return {
    status,
    blocked,
    reasons,
    baitHidden,
    providerProbeResults,
  };
}
