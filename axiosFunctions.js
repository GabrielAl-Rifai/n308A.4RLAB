

// Set default headers with your API key
axios.defaults.headers.common["API_KEY"] = "live_JF5nT6Cv74qsWZaigHNZbkS0DvBbK6GUYehW6sHltEDfuhjW8LX8yts5vZy0743k";

// Set default headers with API key
axios.interceptors.request.use(config => {
  // Reset progress bar
  progressBar.style.width = "0%";
  // Set body cursor style to progress
  document.body.style.cursor = "progress";
  return config;
});

axios.interceptors.response.use(response => {
  // Remove progress cursor style from body
  document.body.style.cursor = "default";
  const requestTime = new Date(response.config.metadata.startTime);
  const responseTime = new Date();
  const timeDifference = responseTime - requestTime;
  console.log(`Request completed in ${timeDifference} milliseconds`);
  return response;
});

// Function to update the progress bar based on the download progress of a request
export function updateProgress(event) {
  // Calculate the progress percentage
  const progress = (event.loaded / event.total) * 100;
  // Update the width of the progress bar element
  progressBar.style.width = `${progress}%`;
}

// Function to fetch the list of dog breeds 
export async function fetchBreeds() {
  try {
    // Send a GET request to the API endpoint to fetch the list of breeds
    const response = await axios.get("https://api.thedogapi.com/v1/breeds", { 
      // Add metadata to track the start time of the request
      metadata: { startTime: new Date() },
      // Specify the function to call for updating download progress
      onDownloadProgress: updateProgress
    });
    // Return the data (list of breeds) from the response
    return response.data;
  } catch (error) {
    // If an error occurs during the request, log the error and throw it
    console.error("Error fetching breeds:", error);
    throw error;
  }
}

// Function to fetch images of a specific dog breed 
export async function fetchBreedImages(breedId) {
  try {
    // Send a GET request to the API endpoint to fetch images of the specified breed
    const response = await axios.get(`https://api.thedogapi.com/v1/images/search?breed_ids=${breedId}`, { 
      // Add metadata to track the start time of the request
      metadata: { startTime: new Date() },
      // Specify the function to call for updating download progress
      onDownloadProgress: updateProgress
    });
    // Return the data (list of images) from the response
    return response.data;
  } catch (error) {
    // If an error occurs during the request, log the error and throw it
    console.error("Error fetching breed images:", error);
    throw error;
  }
}

// Function to toggle favorite status of a dog image
export async function favourite(imgId) {
  try {
    // Send a GET request to check if the image is already favorited
    const response = await axios.get(`https://api.thedogapi.com/v1/favourites?image_id=${imgId}`);
    // If the image is already favorited, delete the favorite
    if (response.data.length > 0) {
      await axios.delete(`https://api.thedogapi.com/v1/favourites/${response.data[0].id}`);
      console.log(`Unfavorited image with ID: ${imgId}`);
    } 
    // If the image is not favorited, add it to favorites
    else {
      await axios.post("https://api.thedogapi.com/v1/favourites", { image_id: imgId });
      console.log(`Favorited image with ID: ${imgId}`);
    }
  } catch (error) {
    // If an error occurs during the request, log the error and throw it
    console.error("Error toggling favorite:", error);
    throw error;
  }
}

// Function to fetch and display favorite dog images
export async function getFavourites() {
  try {
    // Fetch all favorites from the API
    const response = await axios.get("https://api.thedogapi.com/v1/favourites");
    const favorites = response.data;
    
    // Clear the carousel to prepare for displaying favorites
    Carousel.clear();
    
    // Iterate over each favorite and display it in the carousel
    favorites.forEach(favorite => {
      const carouselItem = Carousel.createCarouselItem(favorite.image.url, favorite.image.breeds[0].name, favorite.image.id);
      Carousel.appendCarousel(carouselItem);
    });
  } catch (error) {
    // If an error occurs during the request, log the error and throw it
    console.error("Error getting favorites:", error);
    throw error;
  }
}