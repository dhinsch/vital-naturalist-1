// Carousel Functionality ***************************

const slides = document.querySelectorAll('.slide');
const nextBtn = document.querySelector('#next');
const prevBtn = document.querySelector('#prev');

const nextSlide = () => {
  // Get current class
  const current = document.querySelector('.current');
  // Remove current class
  current.classList.remove('current');
  // Check for next slide
  if (current.nextElementSibling) {
    // Add current to next sibling
    current.nextElementSibling.classList.add('current');
  } else {
    // Add current to start
    slides[0].classList.add('current');
  }
};

const prevSlide = () => {
  // Get current class
  const current = document.querySelector('.current');
  // Remove current class
  current.classList.remove('current');
  // Check for prev slide
  if (current.previousElementSibling) {
    // Add current to prev sibling
    current.previousElementSibling.classList.add('current');
  } else {
    // Add current to last
    slides[slides.length - 1].classList.add('current');
  }
};
/*
// Button events
nextBtn.addEventListener('click', (e) => {
  nextSlide();
});

prevBtn.addEventListener('click', (e) => {
  prevSlide();
});
*/
// Menu Button Functionality ****************************************

//Select DOM items
const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const menuNav = document.querySelector('.menu-nav');
const navItems = document.querySelectorAll('.nav-item');

//Set Initial State of Menu
let showMenu = false;

menuBtn.addEventListener('click', toggleMenu);

//Show Or Hide Menu Items
function toggleMenu() {
  if (!showMenu) {
    menuBtn.classList.add('close');
    menu.classList.add('show');
    menuNav.classList.add('show');
    navItems.forEach((item) => item.classList.add('show'));

    //Set Menu State
    showMenu = true;
  } else {
    menuBtn.classList.remove('close');
    menu.classList.remove('show');
    menuNav.classList.remove('show');
    navItems.forEach((item) => item.classList.remove('show'));

    //Set Menu State
    showMenu = false;
  }
}

// GeoLocation Functionality & Map ******************************************

function findMe() {
  const status = document.querySelector('#status');

  function mapLocation(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    status.textContent = '';

    // Sets up Zoom Level of Map
    const mymap = L.map('mapid').setView([lat, lng], 13);

    // Creates Marker From GeoLocation
    const marker = L.marker([lat, lng]).addTo(mymap);

    // Sets up tiles For Map
    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={MAPBOX_ACCESS_TOKEN}',
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: '{MAPBOX_ACCESS_TOKEN}',
      }
    ).addTo(mymap);
  }

  function error() {
    status.textContent = 'Unable to retrieve your location';
  }

  if (!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser';
  } else {
    // If Navigator Is Allowed, Run Functions For Map
    status.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(mapLocation, error);
  }
}

document.querySelector('#find-me').addEventListener('click', findMe);
