import { useState } from 'react'
import './App.css'

interface WeatherData {
  temperature: number
  windspeed: number
  weathercode: number
}

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function getWeather() {
    if (!city.trim()) return
    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
      )
      const geoData = await geoRes.json()

      if (!geoData.results || geoData.results.length === 0) {
        setError('City not found. Try another search.')
        setLoading(false)
        return
      }

      const { latitude, longitude, name } = geoData.results[0]

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      )
      const weatherData = await weatherRes.json()

      setWeather(weatherData.current_weather)
      setCity(name)
    } catch (err) {
      setError('Something went wrong fetching the weather.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>Weather Check</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && getWeather()}
        />
        <button onClick={getWeather} disabled={loading}>
  Search
  {loading && <span className="spinner"></span>}
</button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{city}</h2>
          <p className="temp">{weather.temperature}°C</p>
          <p>Wind: {weather.windspeed} km/h</p>
        </div>
      )}
    </div>
  )
}

export default App