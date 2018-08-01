let restaurant;
let reviews;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoiZmFicml0c2l1cyIsImEiOiJjamloZjJ3MDAxYnp1M3BucjkwNXNkZjR3In0.sM0M2AuSFINKkSD6jSGgtw',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'    
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}  
 
// window.initMap = () => {
//    fetchRestaurantFromURL((error, restaurant) => {
//      if (error) { // Got an error!
//        console.error(error);
//      } else {
//        self.map = new google.maps.Map(document.getElementById('map'), {
//          zoom: 16,
//          center: restaurant.latlng,
//          scrollwheel: false
//        });
//        fillBreadcrumb();
//        DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
//      }
//    });
// } 

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
    // Fetch reviews for a restaurant
    DBHelper.fetchReviewByRestaurantId(id, (error, reviews) => {
      self.reviews = reviews;
      if (!reviews) {
        console.log(error);
        return;
      }
      fillReviewsHTML();
    })
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const favorite = document.getElementById('fav-button');
  favorite.setAttribute('tabindex', 0);
  favorite.setAttribute('role', 'checkbox');
  favorite.setAttribute('aria-label', `${restaurant.name} added to favorite restaurants`);
  // at some point boolean value bacomes a string (probably servers fault)
  if (restaurant.is_favorite == 'true') {
    favorite.className = 'isFavorite';
    favorite.setAttribute('aria-checked', 'true');
  } else {
    favorite.setAttribute('aria-checked', 'false');
  }
  favorite.addEventListener('click', () => {
    favorite.classList.toggle('isFavorite');
    if (favorite.classList.contains('isFavorite')) {
      favorite.setAttribute('aria-checked', 'true');
      DBHelper.setFavorite(restaurant, true);
    } else {
      favorite.setAttribute('aria-checked', 'false');
      DBHelper.setFavorite(restaurant, false);
    }
  });

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
  address.setAttribute('tabindex', 0);

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.srcset = DBHelper.imageSrcsetForRestaurant(restaurant);
  image.sizes = [
    '(max-width: 262px) 262px',
    '(max-width: 376px) 376px',
    '(max-width: 469px) 469px',
    '(max-width: 580px) 580px',
    '800px'];
  image.alt = `An image from ${restaurant.name} Restaurant`;
  image.setAttribute('tabindex', 0);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;
  cuisine.setAttribute('tabindex', 0);

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  } else {
    document.getElementById('restaurant-hours').innerHTML = 'Forgotten';
  }
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    day.setAttribute('tabindex', 0);
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    time.setAttribute('tabindex', 0);
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  title.setAttribute('tabindex', 0);
  container.appendChild(title);

  // at first, I though POST request will return multiple reviews
  // this function fills DOM list with reviews
  populate = (list, review_items) => {
    list.innerHTML = '';
    if (!review_items) {
      const noReviews = document.createElement('p');
      noReviews.innerHTML = 'No reviews yet!';
      noReviews.setAttribute('tabindex', 0);
      list.appendChild(noReviews);
      return;
    }
    review_items.forEach(item => {
      list.appendChild(createReviewHTML(item));
    });
  }

  // create a form for new reviews submission
  const reviewForm = createReviewFormHTML();
  reviewForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let review = {"restaurant_id": self.restaurant.id};
    const formData = new FormData(reviewForm);
    for (const [key, value] of formData.entries()) {
      review[key] = value;
    }
    DBHelper.submitReview(review).then(reviewData => {
      const reviewsList = document.getElementById('reviews-list');
      // populate(reviewsList, reviewsData);
      reviewsList.appendChild(createReviewHTML(reviewData));
      reviewForm.reset();
    });
  });
  container.appendChild(reviewForm);
  
  const ul = document.createElement('ul');
  ul.setAttribute('id', 'reviews-list');
  populate(ul, reviews);
  container.appendChild(ul);
}

/**
 * Create review HTML and return it.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const reviewHead = document.createElement('div');
  reviewHead.className = 'review-head';

  const name = document.createElement('p');
  name.innerHTML = review.name;
  name.className = 'review-name';
  name.setAttribute('tabindex', 0);
  reviewHead.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = new Date(review.updatedAt).toDateString();
  date.className = 'review-date';
  date.setAttribute('tabindex', 0);
  reviewHead.appendChild(date);
  li.appendChild(reviewHead);

  const rating = document.createElement('p');
  const ratingData = parseInt(review.rating);
  let ratingTag;
  switch (ratingData) {
    case 1: ratingTag = 'very-bad'; break;
    case 2: ratingTag = 'bad'; break;
    case 3: ratingTag = 'not-bad'; break;
    case 4: ratingTag = 'good'; break;
    case 5: ratingTag = 'very-good'; break;
    default: break;
  }
  rating.innerHTML = `Rating: ${ratingData}`;
  rating.classList.add('review-rating');
  rating.classList.add(ratingTag);
  rating.setAttribute('tabindex', 0);
  li.appendChild(rating);

  const comment = document.createElement('p');
  comment.innerHTML = review.comments;
  comment.className = 'review-comment';
  comment.setAttribute('tabindex', 0);
  li.appendChild(comment);

  return li;
}

/**
 * Create review form HTML and return it.
 */
createReviewFormHTML = () => {
  const form = document.createElement('form');
  form.setAttribute('id', 'review-form');

  // add name field with a label
  const nameBox = document.createElement('div');
  const nameLabel = document.createElement('label');
  nameLabel.setAttribute('for', 'review-form-name');
  nameLabel.className = 'divis-words';
  nameLabel.innerHTML = 'Name';
  nameBox.appendChild(nameLabel);
  const nameInput = document.createElement('input');
  nameInput.setAttribute('id', 'review-form-name');
  nameInput.setAttribute('name', 'name');
  nameInput.setAttribute('type', 'text');
  nameInput.setAttribute('placeholder', 'Your name');
  nameBox.appendChild(nameInput);
  form.appendChild(nameBox);

  // add rating field with a label
  const ratingBox = document.createElement('div');
  const ratingLabel = document.createElement('label');
  ratingLabel.setAttribute('for', 'review-form-rating');
  ratingLabel.className = 'divis-words';
  ratingLabel.innerHTML = 'Restaurant Rating';
  ratingBox.appendChild(ratingLabel);
  const ratingInput = document.createElement('select');
  ratingInput.setAttribute('id', 'review-form-rating');
  ratingInput.setAttribute('name', 'rating');
  for (let i = 1; i <= 5; i++) {
    const ratingOption = document.createElement('option');
    ratingOption.setAttribute('value', i);
    ratingOption.innerHTML = i;
    ratingInput.appendChild(ratingOption);
  }
  ratingInput.lastChild.setAttribute('selected', true);
  ratingBox.appendChild(ratingInput);
  form.appendChild(ratingBox);

  // add comment area and SKIP a label
  const commentBox = document.createElement('div');
  // const commentLabel = document.createElement('label');
  // commentLabel.setAttribute('for', 'review-form-textarea');
  // commentLabel.classList.add('divis-words');
  // commentLabel.classList.add('full-width');
  // commentLabel.innerHTML = 'Comment';
  // commentBox.appendChild(commentLabel);
  const commentInput = document.createElement('textarea');
  commentInput.setAttribute('id', 'review-form-textarea');
  commentInput.setAttribute('name', 'comments');
  commentInput.setAttribute('rows', 2);
  commentInput.setAttribute('aria-label', 'Your comment');
  commentInput.setAttribute('placeholder', 'What do you think about this restaurant?');
  commentBox.appendChild(commentInput);
  form.appendChild(commentBox);

  // add submit button
  const submitBox = document.createElement('div');
  submitBox.setAttribute('id', 'review-form-submit-box');
  const submitBtn = document.createElement('input');
  submitBtn.setAttribute('id', 'review-form-submit');
  submitBtn.setAttribute('type', 'submit');
  submitBtn.setAttribute('value', 'Post your review');
  submitBox.appendChild(submitBtn);
  form.appendChild(submitBox);

  return form;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.setAttribute('aria-current', 'page');
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}