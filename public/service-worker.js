const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/"
    ]),
  );
});

const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

const cacheFirst = async ({ request, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const cacheKeepList = ["v2"];
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
});


// Inside your service worker
self.addEventListener('fetch', function(event) {
  if(event.request.method === 'GET') {
    event.respondWith(
      cacheFirst({
        request: event.request,
        fallbackUrl: '/offline.html'
      })
    );
  }
  if (event.request.method === 'POST') {
    event.respondWith(
      fetch(event.request.clone()).then(function(response) {
        // If the response is successful, return it
        if (response.ok) {
          return response;
        } else {
          // If the response fails, store the failed request in IndexedDB
          storeFailedRequest(event.request.clone());
          return response;
        }
      }).catch(function(error) {
        // If there is a network error, store the failed request in IndexedDB
        storeFailedRequest(event.request.clone());
        throw error;
      })
    );
  }
});

// Register sync event listener
self.addEventListener('sync', function(event) {
  console.log('Sync event fired!');
  if (event.tag === 'syncData') {

    event.waitUntil(processFailedRequests());
  }
});

function storeFailedRequest(request) {
  var requestData = {
    url: request.url,
    method: request.method,
    headers: {},
    body: null // We will store body data if present
  };

  // Extract headers
  request.headers.forEach(function(value, name) {
    requestData.headers[name] = value;
  });

  // Extract and store request body data if present
  if (request.method !== 'GET') {
    request.clone().text().then(function(body) {
      requestData.body = body;
      saveRequestData(requestData);
    });
  } else {
    saveRequestData(requestData);
  }
}

function saveRequestData(requestData) {
  // Open a connection to IndexedDB
  var requestDB = indexedDB.open('failedRequestsDB', 1);

  requestDB.onupgradeneeded = function(event) {
    var db = event.target.result;
    if (!db.objectStoreNames.contains('failedRequests')) {
      db.createObjectStore('failedRequests', { autoIncrement: true });
    }
  };

  // Store the failed request data in IndexedDB
  requestDB.onsuccess = function(event) {
    var db = event.target.result;
    var transaction = db.transaction('failedRequests', 'readwrite');
    var objectStore = transaction.objectStore('failedRequests');
    var requestAdd = objectStore.add(requestData);

    requestAdd.onsuccess = function(event) {
      console.log("Failed request data stored successfully:", event.target.result);
    };

    requestAdd.onerror = function(event) {
      console.error("Error storing failed request data:", event.target.error);
    };
  };

  requestDB.onerror = function(event) {
    console.error("Error opening failedRequestsDB:", event.target.error);
  };
}


function processFailedRequests() {
  console.log("Processing failed requests...");
  return new Promise(function(resolve, reject) {
    // Open a connection to IndexedDB
    var requestDB = indexedDB.open('failedRequestsDB', 1);

    requestDB.onupgradeneeded = function(event) {
      var db = event.target.result;
      if (!db.objectStoreNames.contains('failedRequests')) {
        db.createObjectStore('failedRequests', { autoIncrement: true });
      }
    };

    // Handle connection success
    requestDB.onsuccess = function(event) {
      var db = event.target.result;
      var transaction = db.transaction('failedRequests', 'readwrite');
      var objectStore = transaction.objectStore('failedRequests');

      // Get all keys from the object store
      var keysRequest = objectStore.getAllKeys();

      // Handle successful retrieval of keys
      keysRequest.onsuccess = function(event) {
        var failedRequestKeys = event.target.result;
        var getRequest = objectStore.getAll();

        // Handle successful retrieval of failed requests
        getRequest.onsuccess = function(event) {
          var failedRequests = event.target.result;
          var promises = [];

          // Retry each failed request
          failedRequests.forEach(function(requestData, index) {
            var requestId = failedRequestKeys[index]; // Get the key associated with the request
            var fetchOptions = {
              method: requestData.method,
              headers: new Headers(requestData.headers)
            };

            // Add body data if present
            if (requestData.body) {
              fetchOptions.body = requestData.body;
            }

            // Retry the request
            var fetchPromise = fetch(requestData.url, fetchOptions)
              .then(function(response) {
                // If successful, remove the request from IndexedDB
                if (response.ok) {
                  deleteFailedRequest(requestId);
                }
              });

            promises.push(fetchPromise);
          });

          // Wait for all retry promises to resolve
          Promise.all(promises).then(resolve).catch(reject);
        };

        // Handle errors in retrieving failed requests
        getRequest.onerror = function(event) {
          console.error("Error retrieving failed requests:", event.target.error);
          reject(event.target.error);
        };
      };

      // Handle errors in retrieving keys
      keysRequest.onerror = function(event) {
        console.error("Error retrieving keys from object store:", event.target.error);
        reject(event.target.error);
      };
    };

    // Handle errors in opening IndexedDB
    requestDB.onerror = function(event) {
      console.error("Error opening failedRequestsDB:", event.target.error);
      reject(event.target.error);
    };
  });
}


function deleteFailedRequest(requestId) {
  // Open a connection to IndexedDB
  var requestDB = indexedDB.open('failedRequestsDB', 1);

  requestDB.onupgradeneeded = function(event) {
    var db = event.target.result;
    if (!db.objectStoreNames.contains('failedRequests')) {
      db.createObjectStore('failedRequests', { autoIncrement: true });
    }
  };

  // Delete the failed request from IndexedDB
  requestDB.onsuccess = function(event) {
    var db = event.target.result;
    var transaction = db.transaction('failedRequests', 'readwrite');
    var objectStore = transaction.objectStore('failedRequests');
    var deleteRequest = objectStore.delete(requestId);

    // Handle successful deletion
    deleteRequest.onsuccess = function(event) {
      console.log("Successfully deleted failed request with ID:", requestId);
    };

    // Handle deletion error
    deleteRequest.onerror = function(event) {
      console.error("Error deleting failed request:", event.target.error);
    };
  };
}
