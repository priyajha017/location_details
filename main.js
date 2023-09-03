// OpenWeatherMap API Key (Get your own API key from https://openweathermap.org/)
const weatherApiKey = 'fd03700aa4a5cc31d75269adc601e18e';

// Unsplash API Key (Get your own API key from https://unsplash.com/developers)
const unsplashApiKey = 'lx6DRXpXozbFjdPBPbdUNn6TBuccK88R5AAAmaYtgH8';

document.addEventListener('DOMContentLoaded', () => {
    const locationInput = document.getElementById('locationInput');
    const imageContainer = document.getElementById('imageContainer');
    const weatherContainer = document.getElementById('weatherContainer');
    let typingTimer;

    locationInput.addEventListener('input', () => {
        clearTimeout(typingTimer);
        const location = locationInput.value.trim(); // Trim any leading/trailing spaces

        if (location) {
            // Delay fetching data by 1 second after the user stops typing
            typingTimer = setTimeout(() => {
                getImages(location);
                getWeather(location);
            }, 100);
        } else {
            // Clear the containers if the input is empty
            imageContainer.innerHTML = '';
            weatherContainer.innerHTML = '';
        }
    });

    async function getImages(location) {
        try {
            const unsplashResponse = await fetch(`https://api.unsplash.com/search/photos?query=${location}&per_page=6`, {
                headers: {
                    Authorization: `Client-ID ${unsplashApiKey}`,
                },
            });

            if (!unsplashResponse.ok) {
                throw new Error('Failed to fetch images');
            }

            const unsplashData = await unsplashResponse.json();
            if (unsplashData.results && unsplashData.results.length > 0) {
                imageContainer.innerHTML = '';

                unsplashData.results.forEach((result) => {
                    const img = document.createElement('img');
                    img.src = result.urls.regular;

                    // Create a div with a valid class name
                    const imgDiv = document.createElement('div');
                    imgDiv.classList.add('imgDiv1');

                    imgDiv.appendChild(img);
                    imageContainer.appendChild(imgDiv);
                });
            } else {
                imageContainer.innerHTML = 'No images found for this location.';
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            imageContainer.innerHTML = 'An error occurred while fetching images.';
        }
    }

    async function getWeather(location) {
        try {
            const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}`);

            if (!weatherResponse.ok) {
                throw new Error('Failed to fetch weather data');
            }

            const weatherData = await weatherResponse.json();

            if (weatherData.name) {
                weatherContainer.innerHTML = '';

                const temperature = (weatherData.main.temp - 273.15).toFixed(2); // Convert to Celsius
                const weatherInfo = document.createElement('p');
                weatherInfo.textContent = `Weather in ${weatherData.name}: Temperature: ${temperature}°C`;
                weatherContainer.appendChild(weatherInfo);
            } else {
                weatherContainer.innerHTML = 'No weather data found for this location.';
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            weatherContainer.innerHTML = 'An error occurred while fetching weather data.';
        }
    }
});
