/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}`;
  }

  /**
   * Database Length.
   * (temporary solution for a very stupid problem)
   *
   * You see, cause the server on the port 1337
   * doesn't return amount of restaurants, I have to hardcode it for now.
   * It wouldn't have been an issue if when we use fetchRestaurantById()
   * full database is retrieved and after necessary restaurant is filtered.
   * But, I solved it properly (or so I thought before noticing this).
   * Now (without knowing length) if a user visits any restaurant page
   * before visiting home page, on a home page he or she will see only
   * restaurants from IDB (restaurants which were visited before).
   * Using (records.length === 0) won't work because of described thing.
   * Sadly, I am not seeing better solution at the moment.
   * (I suggest to add length to restaurants/{id} response,
   * so that client can figure out if data any is missing.)
   */
  static get DATABASE_LENGTH() {
    return 10;
  }

  /**
   * IndexedDB
   */
  static get _dbPromise() {
    if (navigator.serviceWorker) {
      return idb.open('restaurants', 1, (upgradeDb) => {
        upgradeDb.createObjectStore('restaurants_data', { 
          keyPath: 'id'
        });
        upgradeDb.createObjectStore('reviews_data', {
          keyPath: 'id'
        })
      });
    }
    return Promise.resolve();
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    DBHelper._dbPromise.then((db) => {
      if (!db) return;
      // Get all restaurants from IDB
      const store = db.transaction('restaurants_data')
        .objectStore('restaurants_data');
      store.getAll().then((records) => {
        // Fetch if not all restaurants are stored locally
        if (records.length < DBHelper.DATABASE_LENGTH) {
          fetch(`${DBHelper.DATABASE_URL}/restaurants`)
            .then(response => {
            return response.json();
          }).then(json_data => {
            // Put restaurants into IDB
            const store = db.transaction('restaurants_data', 'readwrite')
              .objectStore('restaurants_data');
            json_data.forEach(record => {
              store.put(record);
            })
            // Return restaurants from network
            return callback(null, json_data);
          }).catch(error => {
            return callback(error, null);
          });
        }
        // Return restaurants from IDB
        return callback(null, records);
      });
    });
  }


  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    return DBHelper._dbPromise.then((db) => {
      if (!db) return;
      // Get a restaurant from IDB
      return db.transaction('restaurants_data')
        .objectStore('restaurants_data').get(parseInt(id));
    }).then((record) => {
      if (record) {
        // Return a restaurant from IDB
        return callback(null, record);
      }
      // Fetch if restaurant is not in IDB
      fetch(`${DBHelper.DATABASE_URL}/restaurants/${id}`)
        .then(response => {
        return response.json();
      }).then(json_data => {
        // Put a restaurant into IDB
        DBHelper._dbPromise.then((db) => {
          const store = db.transaction('restaurants_data', 'readwrite')
            .objectStore('restaurants_data');
          store.put(json_data);
        });
        // Return a restaurant from network
        console.log('Fetched restaurant');
        return callback(null, json_data);
      }).catch(error => {
        return callback(error, null);
      });
    });
  };

  /**
   * Fetch reviews for a restaurant.
   */
  static fetchReviewByRestaurantId(id, callback) {
    DBHelper._dbPromise.then((db) => {
      if (!db) return;
      // Get all reviews from IDB
      const store = db.transaction('reviews_data')
        .objectStore('reviews_data');
      store.getAll().then((records) => {
        // Filter reviews by restaurant ID
        const results = records.filter(r => r.restaurant_id == id);
        if (results.length > 0) {
          // Return reviews from IDB
          return callback(null, results);
        }
        // Fetch if reviews aren't in IDB
        fetch(`${DBHelper.DATABASE_URL}/reviews/?restaurant_id=${id}`)
          .then(response => {
          return response.json();
        }).then(json_data => {
          // Put reviews into IDB
          const store = db.transaction('reviews_data', 'readwrite')
            .objectStore('reviews_data');
          json_data.forEach(record => {
            store.put(record);
          })
          // Return reviews from network
          return callback(null, json_data);
        }).catch(error => {
          return callback(error, null);
        });
      });
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}_800w.jpg`);
  }

  /**
   * Restaurant image sourses set URLs.
   */
  static imageSrcsetForRestaurant(restaurant) {
    const widths = [262, 376, 469, 580, 800];
    let srcset = [];
    for (const w of widths) {
      srcset.push(`/img/${restaurant.id}_${w}w.jpg ${w}w`)
    }
    return srcset;
  }

  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  } 
  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */

}

