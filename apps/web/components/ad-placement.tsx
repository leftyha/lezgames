'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type AdPlacementKind = 'banner' | 'interstitial' | 'reward';

type AdPlacementProps = {
  placement: AdPlacementKind;
  enabled: boolean;
  onServed?: () => void;
  onFailed?: () => void;
};

type AdConfig = {
  provider: 'pemsrv' | 'magsrv';
  src: string;
  className: string;
  zoneId: string;
  label: string;
};

const AD_CONFIGS: Record<AdPlacementKind, AdConfig> = {
  banner: { provider: 'pemsrv', src: 'https://a.pemsrv.com/ad-provider.js', className: 'eas6a97888e33', zoneId: '5580912', label: 'Banner ad' },
  interstitial: { provider: 'magsrv', src: 'https://a.magsrv.com/ad-provider.js', className: 'eas6a97888e17', zoneId: '5579614', label: 'Interstitial ad' },
  reward: { provider: 'magsrv', src: 'https://a.magsrv.com/ad-provider.js', className: 'eas6a97888e37', zoneId: '5666986', label: 'Reward ad' },
};

declare global {
  interface Window {
    AdProvider?: Array<Record<string, unknown>>;
  }
}

export function AdPlacement({ placement, enabled, onServed, onFailed }: AdPlacementProps) {
  const config = AD_CONFIGS[placement];
  const containerId = useMemo(() => `lez-ad-${placement}-${config.zoneId}`, [config.zoneId, placement]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'served' | 'failed' | 'disabled'>('idle');
  const servedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setStatus('disabled');
      return;
    }

    let cancelled = false;
    setStatus('loading');

    const script = document.createElement('script');
    script.async = true;
    script.type = 'application/javascript';
    script.src = config.src;

    script.onload = () => {
      if (cancelled) return;
      try {
        window.AdProvider = window.AdProvider || [];
        window.AdProvider.push({ serve: {} });
        servedRef.current = true;
        setStatus('served');
        onServed?.();
      } catch {
        setStatus('failed');
        onFailed?.();
      }
    };

    script.onerror = () => {
      if (cancelled) return;
      setStatus('failed');
      onFailed?.();
    };

    document.head.appendChild(script);

    return () => {
      cancelled = true;
      script.remove();
    };
  }, [config.src, enabled, onFailed, onServed]);

  if (!enabled) {
    return <div className={`ad-placement ad-${placement} disabled`}><span className="mono">Ads disabled until consent</span></div>;
  }

  return (
    <div className={`ad-placement ad-${placement}`} id={containerId} aria-label={config.label}>
      <ins className={config.className} data-zoneid={config.zoneId} />
      <small className="mono">{config.label} · {status}</small>
    </div>
  );
}
