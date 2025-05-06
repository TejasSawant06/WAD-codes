document.getElementById('getWeatherBtn').addEventListener('click', function () {
    const cityInput = document.getElementById('cityInput').value.trim();
    const weatherResult = document.getElementById('weatherResult');
  
    if (cityInput === '') {
      showResult('Please enter a city name.');
      return;
    }
  
    // Create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'weather.json', true);
  
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        const cityWeather = data.cities[cityInput];
  
        if (cityWeather) {
          showResult(`
            <p><strong>City:</strong> ${cityInput}</p>
            <p><strong>Temperature:</strong> ${cityWeather.temperature}</p>
            <p><strong>Humidity:</strong> ${cityWeather.humidity}</p>
            <p><strong>Conditions:</strong> ${cityWeather.conditions}</p>
          `);
        } else {
          showResult('City not found in local data.');
        }
      }
    };
  
    xhr.send();
  
    function showResult(content) {
      weatherResult.innerHTML = content;
      weatherResult.style.display = 'block';
    }
  });