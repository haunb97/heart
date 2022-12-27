console.clear();

// Create scene objects Scene
const scene = new THREE.Scene();

// Create a perspective camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//  Create a renderer object
const renderer = new THREE.WebGLRenderer({
  antialias: false, //  Whether to perform antialiasing. The default value is false.
});

// set the color and its transparency
renderer.setClearColor(new THREE.Color("rgb(0,0,0)"));

// Resizes the input canvas to (width, height) taking into account the device pixel ratio
// and resizes the viewport to fit starting at (0, 0)
if (window?.innerWidth < 400) {
  // renderer.setSize(320, 700);
  renderer.setSize(window?.innerWidth, window?.innerHeight);
} else {
  renderer.setSize(window?.innerWidth, window?.innerHeight);
}
document.body.appendChild(renderer.domElement);

// represents the local position of the object Vector3, default(0, 0, 0)。
camera.position.z = 1.8;

// trackball controller
const controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.noPan = true;
controls.noRotate = true;
controls.maxDistance = 0.7;
controls.minDistance = -2.5;

// object
const group = new THREE.Group();
scene.add(group);

let heart = null;
let sampler = null;
let originHeart = null;

// OBJ loader
new THREE.OBJLoader().load(
  "https://assets.codepen.io/127738/heart_2.obj",
  (obj) => {
    heart = obj.children[0];
    heart.geometry.rotateX(-Math.PI * 0.5);
    heart.geometry.scale(0.04, 0.04, 0.04, 0.04);
    heart.geometry.translate(0, -0.4, 0, 0.04);
    group.add(heart);

    // base mesh material
    heart.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color("rgb(0,0,0)"),
    });
    originHeart = Array.from(heart.geometry.attributes.position.array);
    // A utility class for sampling weighted random points on a mesh surface.
    sampler = new THREE.MeshSurfaceSampler(heart).build();
    // generate epidermis
    init();
    // Every frame will call
    renderer.setAnimationLoop(render);
  }
);

let positions = [];
let colors = [];
const geometry = new THREE.BufferGeometry();

const material = new THREE.PointsMaterial({
  vertexColors: true, // Let Three.js knows that each point has a different color
  size: 0.009,
});

const particles = new THREE.Points(geometry, material);
group.add(particles);

const simplex = new SimplexNoise();
const pos = new THREE.Vector3();
const palette = [
  new THREE.Color("#FFFAF0"),
  new THREE.Color("#E97E88"),
  new THREE.Color("#E15566"),
  new THREE.Color("#DA2C43"),
];

// new THREE.Color("#ff77fc"),
// new THREE.Color("#ff77ae"),

class SparkPoint {
  constructor() {
    sampler.sample(pos);
    this.color = palette[Math.floor(Math.random() * palette.length)];
    this.rand = Math.random() * 0.03;
    this.pos = pos.clone();
    this.one = null;
    this.two = null;
  }
  update(a) {
    // sampler.sample(pos);
    // this.pos = pos.clone();
    const noise =
      simplex.noise4D(this.pos.x * 1, this.pos.y * 1, this.pos.z * 1, 0.1) +
      1.5;
    const noise2 =
      simplex.noise4D(this.pos.x * 500, this.pos.y * 500, this.pos.z * 500, 1) +
      1;
    this.one = this.pos.clone().multiplyScalar(1.01 + noise * 0.15 * beat.a);
    this.two = this.pos
      .clone()
      .multiplyScalar(1 + noise2 * 1 * (beat.a + 0.4) - beat.a * 1.2);
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }
}

let spikes = [];
function init(a) {
  positions = [];
  colors = [];
  for (let i = 0; i < 10000; i++) {
    const g = new SparkPoint();
    spikes.push(g);
  }
}

const beat = { a: 0 };
gsap
  .timeline({
    repeat: -1,
    repeatDelay: 0.3,
  })
  .to(beat, {
    a: 0.5,
    duration: 0.6,
    ease: "power2.in",
  })
  .to(beat, {
    a: 0.0,
    duration: 0.6,
    ease: "power3.out",
  });

// 0.22954521554974774 -0.22854083083283794
const maxZ = 0.23;
const rateZ = 0.5;

function render(a) {
  positions = [];
  positions2 = [];
  colors2 = [];
  colors = [];
  rotateX = [];
  spikes.forEach((g, i) => {
    // console.log("🔥 - spikes.forEach - g", g);
    g.update(a);
    const rand = g.rand;
    const color = g.color;
    // (x^2+y^2-1)^3-x^2*y^3 = 0;
    if (maxZ * rateZ + rand > g.one.z && g.one.z > -maxZ * rateZ - rand) {
      positions.push(g.one.x, g.one.y, g.one.z);
      colors.push(color.r, color.g, color.b);
    }
    if (
      maxZ * rateZ + rand * 2 > g.one.z &&
      g.one.z > -maxZ * rateZ - rand * 2
    ) {
      positions.push(g.two.x, g.two.y, g.two.z);
      colors.push(color.r, color.g, color.b);
      positions.push(g.two.x, g.two.y, g.two.z);
      colors.push(color.r, color.g, color.b);
    }

    if (i % 2 === 0) {
      rotateX.push("skewX(180deg)");
    } else {
      rotateX.push("skewX(360deg)");
    }
  });
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3)
  );

  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );
  geometry.setAttribute(
    "transform",
    new THREE.BufferAttribute(new Float32Array(rotateX), 3)
  );

  const vs = heart.geometry.attributes.position.array;
  for (let i = 0; i < vs.length; i += 3) {
    const v = new THREE.Vector3(
      originHeart[i],
      originHeart[i + 1],
      originHeart[i + 2]
    );

    const noise =
      simplex.noise4D(
        originHeart[i] * 1.5,
        originHeart[i + 1] * 1.5,
        originHeart[i + 2] * 1.5,
        a * 0.0005
      ) + 1;

    v.multiplyScalar(0 + noise * 0.15 * beat.a);
    vs[i] = v.x;
    vs[i + 1] = v.y;
    vs[i + 2] = v.z;

    // v2.multiplyScalar(1 + noise2 * 0.1 * beat.a);
    // vs2[i] = v2.x * 1.1;
    // vs2[i + 1] = v2.y * 1.1;
    // vs2[i + 2] = v2.z * 1.1;
  }

  heart.geometry.attributes.position.needsUpdate = true;
  // renderer.render(scene, camera);
  controls.update();
}

setInterval(() => {
  renderer.render(scene, camera);
}, 20);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
