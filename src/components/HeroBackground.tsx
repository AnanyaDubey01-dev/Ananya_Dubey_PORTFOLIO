import { useEffect, useRef } from 'react';

interface HeroBackgroundProps {
  videoSrc: string;
}

export default function HeroBackground({ videoSrc }: HeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const isMouseInSection = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }

    // Vertex Shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        v_uv.y = 1.0 - v_uv.y; // Flip Y for proper image orientation
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader with Liquid Blur Reveal Effect
    const fragmentShaderSource = `
      precision highp float;
      
      varying vec2 v_uv;
      uniform sampler2D u_texture;
      uniform vec2 u_mouse;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_revealRadius;
      uniform float u_blurAmount;
      
      // Simplex noise functions for liquid effect
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
      
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                        + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                                dot(x12.zw, x12.zw)), 0.0);
        m = m * m;
        m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      
      // Multi-sample blur function
      vec4 blur(sampler2D tex, vec2 uv, vec2 resolution, float amount) {
        vec4 color = vec4(0.0);
        float total = 0.0;
        vec2 texelSize = amount / resolution;
        
        // 13-tap blur kernel for smooth blur
        for (float x = -2.0; x <= 2.0; x += 1.0) {
          for (float y = -2.0; y <= 2.0; y += 1.0) {
            float weight = 1.0 - length(vec2(x, y)) * 0.15;
            weight = max(weight, 0.0);
            color += texture2D(tex, uv + vec2(x, y) * texelSize) * weight;
            total += weight;
          }
        }
        
        return color / total;
      }
      
      void main() {
        vec2 uv = v_uv;
        
        // Aspect ratio correction for circular reveal
        vec2 aspectCorrection = vec2(u_resolution.x / u_resolution.y, 1.0);
        vec2 correctedUV = uv * aspectCorrection;
        vec2 correctedMouse = u_mouse * aspectCorrection;
        
        // Calculate distance from mouse with liquid distortion
        float baseDistance = length(correctedUV - correctedMouse);
        
        // Add flowing liquid noise to the edge
        float noise1 = snoise(uv * 6.0 + u_time * 0.3) * 0.03;
        float noise2 = snoise(uv * 12.0 - u_time * 0.2) * 0.015;
        float noise3 = snoise(uv * 3.0 + vec2(u_time * 0.1, -u_time * 0.15)) * 0.02;
        
        float liquidNoise = noise1 + noise2 + noise3;
        float distortedDistance = baseDistance + liquidNoise;
        
        // Create smooth reveal mask with liquid edge
        float revealRadius = u_revealRadius;
        float edgeSoftness = 0.08;
        float reveal = 1.0 - smoothstep(revealRadius - edgeSoftness, revealRadius + edgeSoftness, distortedDistance);
        
        // Add subtle pulsing to the reveal
        float pulse = sin(u_time * 2.0) * 0.005;
        reveal = clamp(reveal + pulse * reveal, 0.0, 1.0);
        
        // Sample sharp and blurred versions
        vec4 sharpColor = texture2D(u_texture, uv);
        vec4 blurredColor = blur(u_texture, uv, u_resolution, u_blurAmount);
        
        // Add subtle chromatic aberration at the reveal edge
        float edgeAmount = smoothstep(revealRadius - 0.1, revealRadius, distortedDistance) 
                         * (1.0 - smoothstep(revealRadius, revealRadius + 0.1, distortedDistance));
        vec2 aberrationOffset = (correctedUV - correctedMouse) * 0.003 * edgeAmount;
        
        vec4 aberratedColor = vec4(
          texture2D(u_texture, uv + aberrationOffset).r,
          texture2D(u_texture, uv).g,
          texture2D(u_texture, uv - aberrationOffset).b,
          sharpColor.a
        );
        
        // Blend sharp with chromatic aberration at edge
        vec4 revealedColor = mix(sharpColor, aberratedColor, edgeAmount * 0.5);
        
        // Final blend between blurred and revealed
        vec4 finalColor = mix(blurredColor, revealedColor, reveal);
        
        // Add subtle vignette
        float vignette = 1.0 - length(uv - 0.5) * 0.3;
        finalColor.rgb *= vignette;
        
        gl_FragColor = finalColor;
      }
    `;

    // Compile shader
    function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    }

    // Create program
    function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
      const program = gl.createProgram();
      if (!program) return null;
      
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      
      return program;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;
    
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    gl.useProgram(program);

    // Create fullscreen quad
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const uniforms = {
      texture: gl.getUniformLocation(program, 'u_texture'),
      mouse: gl.getUniformLocation(program, 'u_mouse'),
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      time: gl.getUniformLocation(program, 'u_time'),
      revealRadius: gl.getUniformLocation(program, 'u_revealRadius'),
      blurAmount: gl.getUniformLocation(program, 'u_blurAmount'),
    };

    // Load video as WebGL texture
    const texture = gl.createTexture();
    const video = videoRef.current;
    if (!video) return;

    video.src = videoSrc;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;

    const initTexture = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };

    initTexture();

    const playVideo = () => {
      video.play().catch(() => {
        // Autoplay may be blocked until user interaction
      });
    };

    video.addEventListener('loadeddata', playVideo);
    playVideo();

    // Handle resize
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Get the hero section (parent of the container)
    const heroSection = containerRef.current?.closest('section') || document.getElementById('hero');

    // Handle mouse move on window level to bypass overlay blocking
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroSection) return;
      
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      // Check if mouse is within hero section bounds
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        isMouseInSection.current = true;
        targetMouseRef.current = {
          x: (x - rect.left) / rect.width,
          y: (y - rect.top) / rect.height,
        };
      } else {
        // Gradually move reveal off-screen when mouse leaves
        if (isMouseInSection.current) {
          isMouseInSection.current = false;
          targetMouseRef.current = { x: -0.5, y: 0.5 };
        }
      }
    };

    // Listen on window to capture mouse events even when overlays are present
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const startTime = Date.now();
    
    const render = () => {
      // Smooth lerp for liquid feel (0.1 = responsive but smooth)
      const lerpFactor = 0.1;
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * lerpFactor;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * lerpFactor;

      const time = (Date.now() - startTime) / 1000;

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      
      // Set uniforms
      gl.uniform2f(uniforms.mouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, time);
      gl.uniform1f(uniforms.revealRadius, 0.22);
      gl.uniform1f(uniforms.blurAmount, 20.0);

      // Update texture from current video frame
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      }
      gl.uniform1i(uniforms.texture, 0);

      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
      gl.deleteTexture(texture);
      video.removeEventListener('loadeddata', playVideo);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [videoSrc]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <video
        ref={videoRef}
        className="absolute w-px h-px opacity-0 pointer-events-none"
        aria-hidden="true"
        muted
        loop
        playsInline
        preload="auto"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
