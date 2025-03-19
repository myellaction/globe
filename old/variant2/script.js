import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let isGlobeClicked = false;

// Создаём сцену
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Добавляем освещение
const light = new THREE.AmbientLight("#000"); // мягкое белое освещение
scene.add(light);
const directionalLight = new THREE.DirectionalLight("#000", 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

scene.background = new THREE.Color("#0e1c48");

// Создание Земли
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('/assets/img/earth.jpg'); // Текстура Земли
const globeRadius = (window.innerHeight * 0.8) / 800 * 10;
const earthGeometry = new THREE.SphereGeometry(globeRadius, 100, 100);
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);


// Установка позиции камеры
camera.position.z = 15;

// Добавляем OrbitControls для вращения
const controls = new OrbitControls(camera, renderer.domElement);

// Функция для анимации
function animate() {
    requestAnimationFrame(animate);
    if (!isGlobeClicked) {
        earth.rotation.y += 0.005; // Постоянное вращение Земли, если не нажато
    }
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Обработка кликов
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    // Преобразование координат мыши в диапазон от -1 до 1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Обновляем луч для проверки пересечений
    raycaster.update();

    // Преобразуем мышь в координаты для луча
    raycaster.setFromCamera(mouse, camera);

    // Находим пересечение с Землёй
    const intersects = raycaster.intersectObject(earth);

    if (intersects.length > 0) {
        // Если есть пересечение, выделяем страну (или участок на глобусе)
        const intersection = intersects[0];
        const countryMesh = intersection.object; // Получаем пересечённый объект
        countryMesh.material.color.set(0xff0000); // Например, меняем цвет на красный
        showFlag(intersection.point); // Показать флаг
    }
});

// Функция для отображения флага
function showFlag(position) {
    const flagGeometry = new THREE.PlaneGeometry(1, 0.7);
    const flagMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
    const flag = new THREE.Mesh(flagGeometry, flagMaterial);

    // Устанавливаем позицию флага
    flag.position.set(position.x, position.y, position.z);
    scene.add(flag);

    // Убираем флаг через 2 секунды
    setTimeout(() => {
        scene.remove(flag);
    }, 2000);
}

// Обработчик изменения размера окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('mouseup', () => {
    isGlobeClicked = false;
});

