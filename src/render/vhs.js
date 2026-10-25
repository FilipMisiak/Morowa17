// Full-screen VHS / analog-horror post-process. One pass, no EffectComposer needed.
export const vhsVertex = /* glsl */`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export const vhsFragment = /* glsl */`
precision highp float;
uniform sampler2D tDiffuse;
uniform vec2  uRes;       // low-res size
uniform float uTime;      // seconds (stepped by the caller for choppy feel)
uniform float uMad;       // 0..1 madness
uniform float uGlitch;    // 0..1 impulse
uniform float uTint;      // 0 = rotten green, 1 = night blue (ep09 final house)
varying vec2 vUv;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1,0)), c = hash(i + vec2(0,1)), d = hash(i + vec2(1,1));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }

void main() {
  vec2 uv = vUv;
  float mad = uMad;

  // tracking error: a band that slowly crawls down the picture and shears it sideways
  float bandY = fract(uTime * 0.07 + noise(vec2(uTime * 0.3, 1.0)) * 0.2);
  float band = smoothstep(0.06 + 0.05 * mad, 0.0, abs(uv.y - bandY));
  uv.x += band * (0.03 + 0.05 * mad) * (noise(vec2(uv.y * 40.0, uTime * 8.0)) - 0.5) * 2.0;

  // line wobble + glitch tearing
  uv.x += (noise(vec2(uv.y * 6.0, uTime * 1.7)) - 0.5) * 0.004 * (1.0 + 4.0 * mad);
  float tear = step(0.985 - 0.06 * uGlitch, noise(vec2(floor(uv.y * 24.0), floor(uTime * 12.0))));
  uv.x += tear * (hash(vec2(floor(uv.y * 24.0), uTime)) - 0.5) * 0.25 * (0.3 + uGlitch + mad);

  // chromatic aberration grows with madness
  float ab = 0.0015 + 0.010 * mad + 0.02 * uGlitch;
  float r = texture2D(tDiffuse, uv + vec2(ab, 0.0)).r;
  float g = texture2D(tDiffuse, uv).g;
  float b = texture2D(tDiffuse, uv - vec2(ab, 0.0)).b;
  vec3 col = pow(vec3(r, g, b), vec3(1.0 / 2.2)); // render target is linear

  // horizontal colour bleed (cheap chroma smear)
  vec3 bleed = pow(texture2D(tDiffuse, uv - vec2(3.0 / uRes.x, 0.0)).rgb, vec3(1.0 / 2.2));
  col = mix(col, vec3(col.r, bleed.g, bleed.b), 0.35);

  // palette: dirty brown-black -> rotten green -> sepia
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  vec3 c0 = vec3(0.030, 0.025, 0.020);
  vec3 c1 = vec3(0.230, 0.265, 0.120);
  vec3 c2 = vec3(0.650, 0.540, 0.310);
  vec3 graded = lum < 0.5 ? mix(c0, c1, lum * 2.0) : mix(c1, c2, (lum - 0.5) * 2.0);
  col = mix(col * vec3(0.95, 1.0, 0.82), graded, 0.72 + 0.2 * mad);
  float lumT = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(col, vec3(0.05, 0.10, 0.28) + vec3(0.10, 0.22, 0.55) * lumT * 1.6, uTint * 0.85);

  // tape noise + grain
  float grain = hash(vUv * uRes + fract(uTime) * 91.7) - 0.5;
  col += grain * (0.10 + 0.18 * mad + 0.2 * uGlitch);
  float speck = step(0.9985, hash(floor(vUv * uRes * 0.5) + floor(uTime * 15.0)));
  col += speck * 0.5;
  col += band * 0.12 * (0.5 + noise(vUv * uRes * 0.5 + uTime));

  // scanlines
  col *= 0.86 + 0.14 * sin(vUv.y * uRes.y * 3.14159);

  // vignette (tighter with madness)
  vec2 q = vUv - 0.5;
  col *= smoothstep(0.95 - 0.25 * mad, 0.2, length(q * vec2(1.0, 1.1)));

  // posterise + Bayer dither (limited palette feel)
  float levels = 7.0 - 3.0 * mad;
  float d = bayer4(vUv * uRes) - 0.5;
  col = floor(col * levels + d + 0.5) / levels;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
