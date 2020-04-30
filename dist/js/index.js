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
    const iNatUrl = `https://api.inaturalist.org/v1/observations?lat=${lat}&lng=${lng}&radius=10&per_page=10&order=desc&order_by=created_at`;

    status.textContent = '';

    // Sets up Zoom Level of Map
    const mymap = L.map('mapid').setView([lat, lng], 11);

    // Creates Marker From GeoLocation
    const marker = L.marker([lat, lng]).addTo(mymap);

    // Sets up tiles For Map
    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoidml0YWxuYXR1cmFsaXN0IiwiYSI6ImNrOWMydTdrdDAwcTgzeGxkMXc2ZTZmcGIifQ.qzKEhMdBQ7IZn_CEm_D8qg',
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          'pk.eyJ1Ijoidml0YWxuYXR1cmFsaXN0IiwiYSI6ImNrOWMydTdrdDAwcTgzeGxkMXc2ZTZmcGIifQ.qzKEhMdBQ7IZn_CEm_D8qg',
      }
    ).addTo(mymap);

    // Initialize Marker Array
    const allMarkers = [[lat, lng]];

    //iNaturalist Observations ******************************

    fetch(iNatUrl)
      .then((response) => response.json())
      .then(function (data) {
        let observations = data.results;

        return observations.map(function (observation) {
          // Initialize
          const newDiv = document.createElement('div');
          const img = document.createElement('img');
          const observationContainer = document.querySelector(
            '.observation-container'
          );

          const span = document.createElement('span');
          newDiv.classList.add('single-observation');
          span.classList.add('observation-details');

          const link = document.createElement('a');
          link.setAttribute('class', 'iNatUrl');
          link.setAttribute('href', `${observation.uri}`);
          link.textContent = 'See on iNaturalist';

          // Set Image Source from iNaturalist API Request

          img.src = observation.photos[0].url;

          //Set Observation Info

          span.innerText = `
          Name: ${
            observation.species_guess != null
              ? observation.species_guess
              : 'Unknown'
          }
          Date Observed: ${observation.created_at_details.month} / ${
            observation.created_at_details.day
          } / ${observation.created_at_details.year}
          `;

          // Append Observations to Display On Page

          observationContainer.appendChild(newDiv);
          newDiv.appendChild(img);
          newDiv.appendChild(span);
          newDiv.appendChild(link);

          //Add Location Markers to Map

          const locationInfo = observation.location.split(',');

          function createNumArray(item) {
            return parseFloat(item, 10);
          }
          const newMarker = locationInfo.map(createNumArray);

          allMarkers.push(newMarker);
          if (allMarkers.length == 11) {
            // Loop through allMarkers Array
            for (var i = 0; i < allMarkers.length; i++) {
              const marker = new L.marker([
                allMarkers[i][0],
                allMarkers[i][1],
              ]).addTo(mymap);
            }
          }
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function error() {
    status.textContent = 'Unable to retrieve your location';
  }

  if (!navigator.geolocation) {
    status.textContent =
      'Geolocation is not supported by your browser, please enable Geolocation through your settings.';
  } else {
    // If Navigator Is Allowed, Run Functions For Map
    status.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(mapLocation, error);
  }
}

document.querySelector('#find-me').addEventListener('click', findMe);
