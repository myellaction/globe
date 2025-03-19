import Globe from 'globe.gl';
import * as THREE from 'https://esm.sh/three';

const markerSvg = `<svg viewBox="-4 0 36 36">
    <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
    <circle fill="black" cx="14" cy="14" r="7"></circle>
  </svg>`;

const N = 30;
// const gData = [...Array(N).keys()].map(() => ({
//     lat: (Math.random() - 0.5) * 180,
//     lng: (Math.random() - 0.5) * 360,
//     size: 7 + Math.random() * 30,
//     color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
// }));
const gData = [
    {lat: 51, lng: 9, size: 50, color: '#dcfa1b'}
];
const githubPath = '/globe';

const world = new Globe(document.getElementById('globeViz'), { animateIn: false })
    .globeImageUrl(githubPath + '/assets/img/earth.jpg')
    .bumpImageUrl(githubPath + '/assets/img/earth2.png')
    .backgroundImageUrl(githubPath + '/assets/img/sky.png')
    .htmlElementsData(gData)
    .htmlElement(d => {
        const el = document.createElement('div');
        el.className= 'popup-wrapper';
        el.innerHTML = markerSvg;
        el.style.color = d.color;
        el.style.width = `${d.size}px`;
        el.style.transition = 'opacity 250ms';

        el.style['pointer-events'] = 'auto';
        el.style.cursor = 'pointer';
        el.onclick = () => el.classList.toggle('popup-wrapper_active');

        const div = document.createElement('div');
        div.className = 'popup';
        div.textContent = 'Германия';

        const img = document.createElement('img');
        img.src = githubPath + '/assets/img/Germany.webp';
        div.appendChild(img);

        el.appendChild(div);
        return el;
    })
    .htmlElementVisibilityModifier((el, isVisible) => {
        el.style.opacity = isVisible ? 1 : 0;
    });

// Auto-rotate
//world.controls().autoRotate = true;
world.controls().autoRotateSpeed = 0.35;
world.pointOfView({ lat: 30, lng: 30, altitude: 1.8 }, 0);

// Add clouds sphere
const CLOUDS_IMG_URL = githubPath + '/assets/img/clouds.png';
const CLOUDS_ALT = 0.004;
const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame

new THREE.TextureLoader().load(CLOUDS_IMG_URL, cloudsTexture => {
    const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(world.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
        new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
    );
    world.scene().add(clouds);

    (function rotateClouds() {
        clouds.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
        requestAnimationFrame(rotateClouds);
    })();
});