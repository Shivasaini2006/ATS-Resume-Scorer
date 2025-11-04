import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

/**
 * WaveBackground
 *
 * A Three.js background component that renders two flowing neon particle
 * waves (orange + teal) with connecting lines and intermittent glitter.
 * The effect is shader-driven so it can support high point counts while
 * staying GPU-friendly. The canvas is appended behind the UI and does not
 * interfere with interaction (pointer-events: none).
 *
 * Notes:
 * - Default per-wave particle count is 12000 (total ~24k) to match the
 *   requested density. Reduce this on lower-end devices (3000-8000).
 * - Use the top-level cleanup to dispose of all GL resources when the
 *   component unmounts to avoid leaking GPU memory / contexts.
 */
export default function WaveBackground(){
  const mountRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return

    // ---------- Settings (tweakable) ----------
    // per-wave particle count; 12000–20000 per wave is supported depending on GPU
    const particleCountPerWave = 12000
    const lineSegmentCount = 900
    const spread = 900

    // ---------- Renderer ----------
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.zIndex = '-1' // keep behind UI
    renderer.domElement.style.pointerEvents = 'none'
    mountRef.current.appendChild(renderer.domElement)

    // ---------- Scene & Camera ----------
    const scene = new THREE.Scene()
    // fallback background color matching the visual spec (deep teal)
    scene.background = new THREE.Color(0x002b2b)
    scene.fog = new THREE.FogExp2(0x001717, 0.0008)

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 3000)
    camera.position.set(0, 60, 260)
    camera.lookAt(0, 0, 0)

    // ---------- Composer / Bloom ----------
    const composer = new EffectComposer(renderer)
    composer.setSize(window.innerWidth, window.innerHeight)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.0, 0.6, 0.5)
    bloom.threshold = 0
    bloom.strength = 1.0
    bloom.radius = 0.6
    composer.addPass(bloom)

    // ---------- Particle shaders ----------
    const particleVert = `
      uniform float time;
      uniform float amplitude;
      uniform float wavelength;
      uniform float speed;
      uniform float pixelRatio;
      uniform float pointSize;
      attribute float seed;
      varying float vGlow;
      void main(){
        vec3 pos = position;
        float phase = pos.x / wavelength;
        float y = sin(phase + time * speed) * amplitude;
        y += 0.6 * sin(phase * 2.05 + time * speed * 1.18);
        y += 0.35 * sin(pos.x * 0.135 + time * speed * 2.05);
        pos.x += 8.0 * sin(time * speed * 0.18 + pos.x * 0.003);
        pos.y += y;
        vGlow = 0.4 + 0.6 * sin(seed * 12.345 + time * (0.8 + fract(seed) * 0.9));
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        float size = pointSize * (1.0 / -mv.z);
        gl_PointSize = size * (1.0 / pixelRatio);
      }
    `

    const particleFrag = `
      precision mediump float;
      uniform vec3 color;
      varying float vGlow;
      void main(){
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float core = smoothstep(0.12, 0.0, d);
        float halo = smoothstep(0.5, 0.0, d) - core * 0.6;
        float intensity = mix(0.6, 1.6, vGlow);
        vec3 col = color * intensity;
        gl_FragColor = vec4(col, (core * 0.95 + halo * 0.25) * intensity);
      }
    `

    // ---------- Helpers: particles, lines, glitter ----------
    function makeParticles({ count, color, zOffset, amplitude, wavelength, speed, spreadX }){
      const positions = new Float32Array(count * 3)
      const seeds = new Float32Array(count)
      for (let i = 0; i < count; i++){
        const t = i / (count - 1)
        const x = (t - 0.5) * spreadX + (Math.random() - 0.5) * 6.0
        const y = (Math.random() - 0.5) * 8.0
        positions[i * 3 + 0] = x
        positions[i * 3 + 1] = y
        positions[i * 3 + 2] = zOffset
        seeds[i] = Math.random() * 100.0
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geo.setAttribute('seed', new THREE.BufferAttribute(seeds, 1))
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(color) },
          amplitude: { value: amplitude },
          wavelength: { value: wavelength },
          speed: { value: speed },
          pixelRatio: { value: window.devicePixelRatio },
          pointSize: { value: 64.0 }
        },
        vertexShader: particleVert,
        fragmentShader: particleFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
      const points = new THREE.Points(geo, mat)
      return { points, geo, mat }
    }

    function makeLineStrip({ segments, color, zOffset, amplitude, wavelength, speed, spreadX }){
      const positions = new Float32Array(segments * 3)
      for (let i = 0; i < segments; i++){
        const t = i / (segments - 1)
        const x = (t - 0.5) * spreadX
        positions[i * 3 + 0] = x
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = zOffset
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const mat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending })
      const line = new THREE.Line(geo, mat)
      function update(t){
        const arr = geo.attributes.position.array
        for (let i = 0; i < segments; i++){
          const x = arr[i * 3 + 0]
          const phase = x / wavelength
          let y = Math.sin(phase + t * speed) * amplitude
          y += 0.6 * Math.sin(phase * 2.05 + t * speed * 1.18)
          y += 0.35 * Math.sin(x * 0.135 + t * speed * 2.05)
          arr[i * 3 + 1] = y
        }
        geo.attributes.position.needsUpdate = true
      }
      return { line, update, geo, mat }
    }

    function makeGlitter({ count, color, xMin, xMax, yMin, yMax, zMin, zMax }){
      const positions = new Float32Array(count * 3)
      const seeds = new Float32Array(count)
      for (let i = 0; i < count; i++){
        positions[i * 3 + 0] = xMin + Math.random() * (xMax - xMin)
        positions[i * 3 + 1] = yMin + Math.random() * (yMax - yMin)
        positions[i * 3 + 2] = zMin + Math.random() * (zMax - zMin)
        seeds[i] = Math.random() * 50.0
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geo.setAttribute('seed', new THREE.BufferAttribute(seeds, 1))
      const mat = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, color: { value: new THREE.Color(color) }, pixelRatio: { value: window.devicePixelRatio } },
        vertexShader: `
          uniform float time; attribute float seed; uniform float pixelRatio; varying float vPulse; void main(){ vec3 p = position; p.y += 0.6 * sin(seed * 1.2 + time * 1.6); vPulse = 0.5 + 0.5 * sin(seed * 3.2 + time * 6.0); vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = 10.0 * (1.0 / -mv.z) * (1.0 / pixelRatio); }`,
        fragmentShader: `
          precision mediump float; uniform vec3 color; varying float vPulse; void main(){ vec2 uv = gl_PointCoord - 0.5; float d = length(uv); float a = smoothstep(0.45, 0.0, d); float intensity = 0.6 + 1.0 * vPulse; vec3 col = color * intensity; gl_FragColor = vec4(col, a * intensity); }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
      const points = new THREE.Points(geo, mat)
      return { points, geo, mat }
    }

    // ---------- Instantiate systems ----------
    const orange = makeParticles({ count: particleCountPerWave, color: 0xff8800, zOffset: -18, amplitude: 26.0, wavelength: 120.0, speed: 0.45, spreadX: spread })
    const teal = makeParticles({ count: particleCountPerWave, color: 0x00ffc3, zOffset: 18, amplitude: 22.0, wavelength: 110.0, speed: 0.28, spreadX: spread })
    scene.add(orange.points)
    scene.add(teal.points)

    const orangeLine = makeLineStrip({ segments: lineSegmentCount, color: 0xff8800, zOffset: -18, amplitude: 26.0, wavelength: 120.0, speed: 0.45, spreadX: spread })
    const tealLine = makeLineStrip({ segments: lineSegmentCount, color: 0x00ffc3, zOffset: 18, amplitude: 22.0, wavelength: 110.0, speed: 0.28, spreadX: spread })
    scene.add(orangeLine.line)
    scene.add(tealLine.line)

    const glitterLeft = makeGlitter({ count: Math.floor(particleCountPerWave * 0.06), color: 0xff8800, xMin: -spread*0.6, xMax: -20, yMin: -40, yMax: 40, zMin: -30, zMax: -6 })
    const glitterRight = makeGlitter({ count: Math.floor(particleCountPerWave * 0.06), color: 0x00ffc3, xMin: 20, xMax: spread*0.6, yMin: -40, yMax: 40, zMin: 6, zMax: 30 })
    scene.add(glitterLeft.points)
    scene.add(glitterRight.points)

    const amb = new THREE.AmbientLight(0x88ffef, 0.05)
    scene.add(amb)

    // ---------- Debug panel (dev-only) ----------
    // If you need pixel-perfect matching, open the app with ?bgdebug=1 and
    // tweak parameters live. The panel is removed on cleanup.
    let debugPanel = null
    const params = new URLSearchParams(window.location.search)
    if (params.get('bgdebug') === '1'){
      debugPanel = document.createElement('div')
      debugPanel.style.position = 'fixed'
      debugPanel.style.right = '12px'
      debugPanel.style.top = '12px'
      debugPanel.style.zIndex = '9999'
      debugPanel.style.background = 'rgba(0,0,0,0.6)'
      debugPanel.style.color = '#e6fff6'
      debugPanel.style.padding = '10px'
      debugPanel.style.borderRadius = '8px'
      debugPanel.style.fontFamily = 'system-ui, Arial, sans-serif'
      debugPanel.style.fontSize = '12px'
      debugPanel.style.maxWidth = '320px'
      debugPanel.style.pointerEvents = 'auto'

      function addRange(labelText, min, max, step, initial, onChange){
        const wrap = document.createElement('div')
        wrap.style.marginBottom = '8px'
        const label = document.createElement('label')
        label.textContent = labelText
        label.style.display = 'block'
        label.style.marginBottom = '4px'
        const input = document.createElement('input')
        input.type = 'range'
        input.min = String(min)
        input.max = String(max)
        input.step = String(step)
        input.value = String(initial)
        input.style.width = '100%'
        input.addEventListener('input', () => onChange(parseFloat(input.value)))
        wrap.appendChild(label)
        wrap.appendChild(input)
        debugPanel.appendChild(wrap)
        return input
      }

      addRange('Bloom strength', 0, 2, 0.01, bloom.strength, v => { bloom.strength = v })
      addRange('Orange amplitude', 0, 80, 0.1, 26.0, v => { orange.mat.uniforms.amplitude.value = v })
      addRange('Orange wavelength', 20, 300, 0.1, 120.0, v => { orange.mat.uniforms.wavelength.value = v })
      addRange('Orange speed', 0.01, 2, 0.01, 0.45, v => { orange.mat.uniforms.speed.value = v })
      addRange('Orange pointSize', 4, 160, 1, 64, v => { orange.mat.uniforms.pointSize.value = v })
      addRange('Teal amplitude', 0, 80, 0.1, 22.0, v => { teal.mat.uniforms.amplitude.value = v })
      addRange('Teal wavelength', 20, 300, 0.1, 110.0, v => { teal.mat.uniforms.wavelength.value = v })
      addRange('Teal speed', 0.01, 2, 0.01, 0.28, v => { teal.mat.uniforms.speed.value = v })
      addRange('Teal pointSize', 4, 160, 1, 64, v => { teal.mat.uniforms.pointSize.value = v })

      const close = document.createElement('button')
      close.textContent = 'Close'
      close.style.marginTop = '6px'
      close.style.width = '100%'
      close.onclick = () => debugPanel && debugPanel.remove()
      debugPanel.appendChild(close)
      document.body.appendChild(debugPanel)
    }

    // ---------- Animation loop ----------
    const start = performance.now()
    function animate(){
      const t = (performance.now() - start) * 0.001
      camera.position.x = Math.sin(t * 0.02) * 8
      camera.position.y = 58 + Math.sin(t * 0.012) * 2.2
      camera.lookAt(0, 0, 0)

      orange.mat.uniforms.time.value = t
      teal.mat.uniforms.time.value = t + 0.6
      glitterLeft.mat.uniforms.time.value = t
      glitterRight.mat.uniforms.time.value = t + 0.4

      orangeLine.update(t)
      tealLine.update(t + 0.7)

      composer.render()
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    // ---------- Resize handling ----------
    function onResize(){
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h)
      composer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    // ---------- Cleanup ----------
    return () => {
      window.removeEventListener('resize', onResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      try{ orange.geo.dispose(); orange.mat.dispose(); teal.geo.dispose(); teal.mat.dispose(); }catch(e){}
      try{ orangeLine.geo.dispose(); orangeLine.mat.dispose(); tealLine.geo.dispose(); tealLine.mat.dispose(); }catch(e){}
      try{ glitterLeft.geo.dispose(); glitterLeft.mat.dispose(); glitterRight.geo.dispose(); glitterRight.mat.dispose(); }catch(e){}
      // remove debug panel if present
      try{ if (debugPanel && debugPanel.parentNode) debugPanel.parentNode.removeChild(debugPanel) }catch(e){}
      composer.passes = []
      try{ renderer.forceContextLoss(); renderer.domElement && renderer.domElement.remove(); renderer.dispose() }catch(e){}
    }
  }, [])

  // The wrapper uses the requested deep teal gradient and the canvas sits behind UI
  return (
    <div
      ref={mountRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #002b2b 0%, #001717 100%)',
      }}
    />
  )
}
