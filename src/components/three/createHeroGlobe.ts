import {
  AdditiveBlending,
  BackSide,
  BoxGeometry,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshLambertMaterial,
  Object3D,
  Points,
  PointsMaterial,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  type Material,
} from 'three'
import type { ResolvedTheme } from '@/composables/useTheme'

const palettes = {
  light: {
    olive: '#6b1d36',
    earth: '#8b2e4a',
    cyan: '#0e7c7b',
    paper: '#f1e8e4',
    atmosphere: new Color('#0e7c7b'),
  },
  dark: {
    olive: '#e8a0b4',
    earth: '#f0c4d0',
    cyan: '#5eead4',
    paper: '#2a1a20',
    atmosphere: new Color('#5eead4'),
  },
}

function fibonacciSphere(samples: number) {
  const points: Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < samples; i += 1) {
    const y = 1 - (i / (samples - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const theta = golden * i
    points.push(new Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius))
  }
  return points
}

function disposeMaterial(material: Material | Material[]) {
  const list = Array.isArray(material) ? material : [material]
  list.forEach((item) => item.dispose())
}

export function createHeroGlobe() {
  const root = new Group()
  const radius = 1.55
  const landMat = new MeshLambertMaterial({
    color: palettes.light.paper,
    flatShading: true,
  })
  const land = new Mesh(new IcosahedronGeometry(radius, 4), landMat)
  root.add(land)

  const wireMat = new MeshLambertMaterial({
    color: palettes.light.olive,
    wireframe: true,
    transparent: true,
    opacity: 0.28,
  })
  const wire = new Mesh(new IcosahedronGeometry(radius * 1.002, 2), wireMat)
  root.add(wire)

  const meridianMat = new LineBasicMaterial({
    color: palettes.light.earth,
    transparent: true,
    opacity: 0.28,
  })
  const meridians = new LineSegments(
    new EdgesGeometry(new IcosahedronGeometry(radius * 1.004, 2)),
    meridianMat,
  )
  root.add(meridians)

  const atmosphereMat = new ShaderMaterial({
    uniforms: {
      uColor: { value: palettes.light.atmosphere.clone() },
    },
    vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
    fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.2);
          gl_FragColor = vec4(uColor, 1.0) * intensity;
        }
      `,
    blending: AdditiveBlending,
    side: BackSide,
    transparent: true,
    depthWrite: false,
  })
  const atmosphere = new Mesh(new SphereGeometry(radius * 1.12, 48, 48), atmosphereMat)
  root.add(atmosphere)

  const samples = fibonacciSphere(900)
  const positions = new Float32Array(samples.length * 3)
  samples.forEach((point, i) => {
    positions[i * 3] = point.x * (radius + 0.01)
    positions[i * 3 + 1] = point.y * (radius + 0.01)
    positions[i * 3 + 2] = point.z * (radius + 0.01)
  })
  const cloudGeom = new BufferGeometry()
  cloudGeom.setAttribute('position', new Float32BufferAttribute(positions, 3))
  const cloudMat = new PointsMaterial({
    color: palettes.light.olive,
    size: 0.016,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  })
  const cloud = new Points(cloudGeom, cloudMat)
  root.add(cloud)

  const cityCount = 280
  const box = new BoxGeometry(0.018, 0.018, 0.09)
  const cityMat = new MeshLambertMaterial({ color: palettes.light.olive })
  const cities = new InstancedMesh(box, cityMat, cityCount)
  const dummy = new Object3D()
  const color = new Color()
  const cityPoints = fibonacciSphere(cityCount)
  cityPoints.forEach((point, i) => {
    const height = 0.5 + ((i * 17) % 10) * 0.18
    dummy.position.copy(point).multiplyScalar(radius + 0.02)
    dummy.lookAt(0, 0, 0)
    dummy.rotateX(Math.PI / 2)
    dummy.scale.set(1, 1, height)
    dummy.updateMatrix()
    cities.setMatrixAt(i, dummy.matrix)
    color.set(i % 3 === 0 ? palettes.light.earth : i % 3 === 1 ? palettes.light.cyan : palettes.light.olive)
    cities.setColorAt(i, color)
  })
  cities.instanceMatrix.needsUpdate = true
  if (cities.instanceColor) cities.instanceColor.needsUpdate = true
  root.add(cities)

  const ringMat = new MeshLambertMaterial({
    color: palettes.light.earth,
    transparent: true,
    opacity: 0.32,
    wireframe: true,
  })
  const ring = new Mesh(
    new SphereGeometry(radius * 1.45, 64, 12, 0, Math.PI * 2, Math.PI / 2 - 0.04, 0.08),
    ringMat,
  )
  ring.rotation.x = 0.35
  root.add(ring)

  function applyTheme(theme: ResolvedTheme) {
    const palette = palettes[theme]
    landMat.color.set(palette.paper)
    wireMat.color.set(palette.olive)
    meridianMat.color.set(palette.earth)
    atmosphereMat.uniforms.uColor.value.copy(palette.atmosphere)
    cloudMat.color.set(palette.olive)
    cityMat.color.set(palette.olive)
    ringMat.color.set(palette.earth)
    cityPoints.forEach((_, i) => {
      color.set(i % 3 === 0 ? palette.earth : i % 3 === 1 ? palette.cyan : palette.olive)
      cities.setColorAt(i, color)
    })
    if (cities.instanceColor) cities.instanceColor.needsUpdate = true
  }

  const dispose = () => {
    root.traverse((child) => {
      if (child instanceof Mesh || child instanceof LineSegments || child instanceof Points) {
        child.geometry.dispose()
        disposeMaterial(child.material)
      }
    })
  }

  return { root, ring, dispose, applyTheme }
}
