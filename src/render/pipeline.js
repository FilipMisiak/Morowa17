import * as THREE from 'three';
import { state } from '../core/state.js';
import { LOW_W, LOW_H } from './psx.js';
import { vhsVertex, vhsFragment } from './vhs.js';

/**
 * Renders the 3D scene to a tiny 4:3 target (nearest-neighbour), then draws it
 * letterboxed to the screen through the VHS shader.
 */
export function createPipeline(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap; // blocky shadows suit the look
  renderer.setClearColor(0x000000, 1);

  const target = new THREE.WebGLRenderTarget(LOW_W, LOW_H, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    depthBuffer: true,
  });

  const quadScene = new THREE.Scene();
  const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const material = new THREE.ShaderMaterial({
    vertexShader: vhsVertex,
    fragmentShader: vhsFragment,
    uniforms: {
      tDiffuse: { value: target.texture },
      uRes: { value: new THREE.Vector2(LOW_W, LOW_H) },
      uTime: { value: 0 },
      uMad: { value: 0 },
      uGlitch: { value: 0 },
      uTint: { value: 0 },
    },
    depthTest: false,
    depthWrite: false,
  });
  quadScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  const view = { x: 0, y: 0, w: 1, h: 1, W: 1, H: 1 };
  function resize() {
    const W = window.innerWidth, H = window.innerHeight;
    renderer.setSize(W, H, false);
    const w = Math.min(W, (H * 4) / 3), h = w * 3 / 4;
    Object.assign(view, { x: (W - w) / 2, y: (H - h) / 2, w, h, W, H });
  }
  window.addEventListener('resize', resize);
  resize();

  return {
    renderer,
    /** Convert a pointer event to NDC inside the letterboxed picture (null when on the black bars). */
    pointerToNDC(e) {
      const px = (e.clientX - view.x) / view.w, py = (e.clientY - view.y) / view.h;
      if (px < 0 || px > 1 || py < 0 || py > 1) return null;
      return new THREE.Vector2(px * 2 - 1, -(py * 2 - 1));
    },
    /** `time` is the (possibly stepped) shader clock. */
    render(scene, camera, { time, madness, glitch }) {
      renderer.setRenderTarget(target);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.setScissorTest(false);
      renderer.setViewport(0, 0, view.W, view.H);
      renderer.clear();
      renderer.setViewport(view.x, view.y, view.w, view.h);
      material.uniforms.uTime.value = time;
      material.uniforms.uMad.value = madness;
      material.uniforms.uGlitch.value = glitch;
      material.uniforms.uTint.value = state.tint ?? 0;
      renderer.render(quadScene, quadCam);
    },
  };
}
