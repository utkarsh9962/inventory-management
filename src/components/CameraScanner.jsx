import { useEffect, useRef, useState } from 'react';

export default function CameraScanner({ onScan, onClose }) {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let active = true;

    async function start() {
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/browser');
        const reader = new BrowserMultiFormatReader();
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result) => {
            if (result && active) {
              onScan(result.getText());
            }
          }
        );
        if (active) {
          controlsRef.current = controls;
          setStatus('ready');
        } else {
          controls.stop();
        }
      } catch {
        if (active) setStatus('error');
      }
    }

    start();
    return () => {
      active = false;
      try { controlsRef.current?.stop(); } catch {}
    };
  }, [onScan]);

  return (
    <div style={{ position: 'relative', background: '#000', borderRadius: 12, overflow: 'hidden', minHeight: 180 }}>
      {status === 'loading' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, gap: 8 }}>
          <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Starting camera…
        </div>
      )}
      {status === 'error' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
          <div style={{ color: '#fca5a5', fontSize: 13, fontWeight: 600 }}>Camera not available</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 }}>Please allow camera access in browser settings, or use USB scanner above.</div>
        </div>
      )}
      <video ref={videoRef} style={{ width: '100%', display: status === 'ready' ? 'block' : 'none' }} />

      {/* Scan target overlay */}
      {status === 'ready' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ width: 230, height: 90, border: '2.5px solid #8b5cf6', borderRadius: 8, boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)' }} />
          <div style={{ position: 'absolute', bottom: 10, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Align barcode within the box</div>
        </div>
      )}

      <button
        onClick={onClose}
        style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 30, height: 30, color: 'white', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >✕</button>
    </div>
  );
}
