import Globe from 'globe.gl';
import * as THREE from 'https://esm.sh/three';
import getLocationImg from "./modules/icons/getLocationImg";
import {isMobile} from "./helpers/deviceHelper";

// const markerSvg = `<svg viewBox="-4 0 36 36">
//     <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
//     <circle fill="black" cx="14" cy="14" r="7"></circle>
//   </svg>`;

const N = 30;
// const gData = [...Array(N).keys()].map(() => ({
//     lat: (Math.random() - 0.5) * 180,
//     lng: (Math.random() - 0.5) * 360,
//     size: 7 + Math.random() * 30,
//     color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
// }));
const gData = [
    {lat: 51, lng: 9, size: 50, color: '#e1ff0c', borderColor: '#292938'},
    {lat: 38, lng: 22, size: 50, color: '#0f2183', borderColor: '#fce8e8'},
    {lat: 40.42, lng: -3.7, size: 50, color: '#FABD00', borderColor: '#ad1519'},
];
const githubPath = './';

const world = new Globe(document.getElementById('globeViz'), { animateIn: false })
    .globeImageUrl(githubPath + '/assets/img/earth.jpg')
    .bumpImageUrl(githubPath + '/assets/img/earth2.png')
    .backgroundImageUrl(githubPath + '/assets/img/sky.png')
    .htmlElementsData(gData)
    .htmlElement(d => {
        const el = document.createElement('div');
        el.className= 'popup-wrapper';
        el.innerHTML = getLocationImg({color: d.color, borderColor: d.borderColor, size: d.size});
        el.style.transition = 'opacity 250ms';

        el.style['pointer-events'] = 'auto';
        el.style.cursor = 'pointer';
        el.onclick = () => {
            const elements = Array.from(document.querySelectorAll('.popup-wrapper'));
            if(!el.classList.contains('popup-wrapper_active')){
                elements.forEach(item => item.classList.remove('popup-wrapper_active'));
                elements.forEach(item => item !== el && item.classList.add('popup-wrapper_deactive'));
                el.classList.add('popup-wrapper_active');
                world.controls().autoRotate = false;
            } else {
                elements.forEach(item => item.classList.remove('popup-wrapper_deactive'));
                world.controls().autoRotate = true;
                el.classList.remove('popup-wrapper_active');
            }
        }

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

const eventName = isMobile ? 'touchstart' : 'mousedown';
document.querySelector('#globeViz').addEventListener(eventName, e => {
    const target = e.target;
    const elements = Array.from(document.querySelectorAll('.popup-wrapper'));
    if(elements.some(item => item.classList.contains('popup-wrapper_active'))){
        if(!elements.some(item => {
            return item === target || item.contains(target);
        })){
            elements.forEach(item => item.classList.remove('popup-wrapper_active',
                'popup-wrapper_deactive'));
            world.controls().autoRotate = true;
        }
    }
});

// Auto-rotate
world.controls().autoRotate = true;
world.controls().autoRotateSpeed = 0.35;
world.pointOfView({ lat: 30, lng: 30, altitude: 1.9 }, 0);

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

window.addEventListener('resize', () => {
    window.location.href = window.location.href;
});

document.querySelector('.globe__btn').addEventListener('click', () => {
    document.querySelector('.globe__bg').classList.add('globe__bg_hide');
    document.querySelector('.globe__back').classList.add('globe__back_active');
    document.querySelector('.globe__wrapper').scrollIntoView({ behavior: 'smooth' });
})

document.querySelector('.globe__back').addEventListener('click', () => {
    document.querySelector('.globe__bg').classList.remove('globe__bg_hide');
    document.querySelector('.globe__back').classList.remove('globe__back_active');
})