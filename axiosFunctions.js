

import axios from "axios";

// Set default headers with your API key
axios.defaults.headers.common["x-api-key"] = API_KEY;

// Axios interceptors
axios.interceptors.request.use(config => {
  // Reset progress bar
  progressBar.style.width = "0%";
  return config;
});

axios.interceptors.response.use(response => {
  const requestTime = new Date(response.config.metadata.startTime);
  const responseTime = new Date();
  const timeDifference = responseTime - requestTime;
  console.log(`Request completed in ${timeDifference} milliseconds`);
  return response;
});

// Function to update progress bar
function updateProgress(event) {
  const progress = (event.loaded / event.total) * 100;
  progressBar.style.width = `${progress}%`;
}

export async function fetchBreeds() {
  try {
    const response = await axios.get("https://api.thecatapi.com/v1/breeds", { 
      metadata: { startTime: new Date() },
      onDownloadProgress: updateProgress // Pass updateProgress function to onDownloadProgress
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching breeds:", error);
    throw error;
  }
}

export async function fetchBreedImages(breedId) {
  try {
    const response = await axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`, { 
      metadata: { startTime: new Date() },
      onDownloadProgress: updateProgress // Pass updateProgress function to onDownloadProgress
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching breed images:", error);
    throw error;
  }
}

export async function favourite(imgId) {
  try {
    // Check if the image is already favorited
    const response = await axios.get(`https://api.thecatapi.com/v1/favourites?image_id=${imgId}`);
    if (response.data.length > 0) {
      // If already favorited, delete the favorite (toggle behavior)
      await axios.delete(`https://api.thecatapi.com/v1/favourites/${response.data[0].id}`);
      console.log(`Unfavorited image with ID: ${imgId}`);
    } else {
      // If not favorited, add it to favorites
      await axios.post("https://api.thecatapi.com/v1/favourites", { image_id: imgId });
      console.log(`Favorited image with ID: ${imgId}`);
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
}

export async function getFavourites() {
  try {
    // Fetch all favorites
    const response = await axios.get("https://api.thecatapi.com/v1/favourites");
    const favorites = response.data;
    
    // Clear the carousel
    Carousel.clear();
    
    // Display favorites
    favorites.forEach(favorite => {
      const carouselItem = Carousel.createCarouselItem(favorite.image.url, favorite.image.breeds[0].name, favorite.image.id);
      Carousel.appendCarousel(carouselItem);
    });
  } catch (error) {
    console.error("Error getting favorites:", error);
    throw error;
  }
}

