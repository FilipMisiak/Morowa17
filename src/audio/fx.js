/** Reusable effect chains. */

export function driveCurve(k = 30, n = 1024) {
  const c = new Float32Array(n);
  for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; c[i] = ((1 + k) * x) / (1 + k * Math.abs(x)); }
  return c;
}

/** Quantising curve = cheap bit-crusher. */
export function crushCurve(levels = 24, n = 2048) {
  const c = new Float32Array(n);
  for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; c[i] = Math.round(x * levels) / levels; }
  return c;
}

/**
 * "Demon through a worn-out tape" chain:
 * highpass -> drive -> bitcrush -> lowpass -> wow/flutter -> feedback echo.
 * Returns { input, output, setMadness(m) }. Build ONE per speaker and reuse it.
 */
export function makeDemonChain(ctx, o = {}) {
  const input = ctx.createGain();
  const output = ctx.createGain();

  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = o.hp ?? 55;
  const drive = ctx.createWaveShaper(); drive.curve = driveCurve(o.drive ?? 28);
  const crush = ctx.createWaveShaper(); crush.curve = crushCurve(o.levels ?? 22);
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = o.lp ?? 1900; lp.Q.value = 2.5;

  const flutter = ctx.createDelay(0.1); flutter.delayTime.value = 0.02;
  const lfo = ctx.createOscillator(); lfo.frequency.value = o.flutterHz ?? 0.8;
  const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.004;
  lfo.connect(lfoGain); lfoGain.connect(flutter.delayTime); lfo.start();

  const echo = ctx.createDelay(1.5); echo.delayTime.value = o.echo ?? 0.18;
  const echoLp = ctx.createBiquadFilter(); echoLp.type = 'lowpass'; echoLp.frequency.value = 1100;
  const fb = ctx.createGain(); fb.gain.value = o.feedback ?? 0.42;
  const wet = ctx.createGain(); wet.gain.value = o.wet ?? 0.55;

  input.connect(hp); hp.connect(drive); drive.connect(crush); crush.connect(lp); lp.connect(flutter);
  flutter.connect(output);
  flutter.connect(echo); echo.connect(echoLp); echoLp.connect(fb); fb.connect(echo);
  echoLp.connect(wet); wet.connect(output);

  const base = { lp: o.lp ?? 1900, fb: o.feedback ?? 0.42 };
  return {
    input, output,
    setMadness(m) {
      const t = ctx.currentTime;
      lp.frequency.setTargetAtTime(base.lp * (1 - 0.55 * m), t, 0.2);
      fb.gain.setTargetAtTime(Math.min(0.72, base.fb + 0.3 * m), t, 0.2);
      lfoGain.gain.setTargetAtTime(0.004 + 0.012 * m, t, 0.2);
    },
  };
}
