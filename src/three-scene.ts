
import * as THREE from 'three';
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const initScene = (canvasNode: HTMLCanvasElement) => {
  //console.clear();
  gsap.registerPlugin(ScrollTrigger);

  // --- CONSTS
  const COLORS = {
    background: 'white',
    light: '#ffffff',
    sky: '#aaaaff',
    ground: '#88ff88'
  };
  const PI = Math.PI;

  // --- SCENE

  let size = { width: 0, height: 0 };

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.background);
  scene.fog = new THREE.Fog(COLORS.background, 15, 20);

  // --- RENDERER

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasNode,
    antialias: true
  });

  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 5;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // --- CAMERA

  const camera = new THREE.PerspectiveCamera(40, size.width / size.height, 0.1, 100);
  camera.position.set(0, 1, 2);
  let cameraTarget = new THREE.Vector3(0, 1, 0);

  scene.add(camera);

  // --- LIGHTS

  const directionalLight = new THREE.DirectionalLight(COLORS.light, 2);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.far = 10;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.normalBias = 0.05;
  directionalLight.position.set(2, 5, 3);

  scene.add(directionalLight);

  const hemisphereLight = new THREE.HemisphereLight(COLORS.sky, COLORS.ground, 0.5);
  scene.add(hemisphereLight);

  // --- FLOOR

  const plane = new THREE.PlaneGeometry(100, 100);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: COLORS.ground });
  const floor = new THREE.Mesh(plane, floorMaterial);
  floor.receiveShadow = true;
  floor.rotateX(-Math.PI * 0.5);

  scene.add(floor);

  // --- ON RESIZE

  const onResize = () => {
    size.width = canvasNode.clientWidth;
    size.height = canvasNode.clientHeight;

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  window.addEventListener('resize', onResize);
  onResize();

  // --- TICK

  const tick = () => {
    camera.lookAt(cameraTarget);
    renderer.render(scene, camera);
    window.requestAnimationFrame(() => tick());
  };

  tick();



  // CLEANUP FUNCTION
  const cleanup = () => {
    renderer.dispose();
    //renderer.forceContextLoss();
  };
  return cleanup;

};
