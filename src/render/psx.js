import * as THREE from 'three';

export const LOW_W = 384;
export const LOW_H = 288; // 4:3 internal resolution

/**
 * PSX-style vertex snapping: vertices are snapped to the low-res pixel grid in the vertex shader,
 * which gives the characteristic "swimming" geometry. Call on every material that is used in the world.
 */
export function psxify(material, snap = 1) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uSnapRes = { value: new THREE.Vector2((LOW_W / 2) / snap, (LOW_H / 2) / snap) };
    shader.vertexShader = 'uniform vec2 uSnapRes;\n' + shader.vertexShader.replace(
      '#include <project_vertex>',
      `#include <project_vertex>
       gl_Position.xy = floor(gl_Position.xy / gl_Position.w * uSnapRes + 0.5) / uSnapRes * gl_Position.w;`,
    );
  };
  return material;
}
