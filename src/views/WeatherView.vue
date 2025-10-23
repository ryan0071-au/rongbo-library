<template>
  <div class="container">
    <div class="header">
      <h1>WEATHER APP</h1>
      <div class="search-bar">
        <input
          type="text"
          v-model="city"
          placeholder="Enter city name"
          class="search-input"
          @keyup.enter="searchByCity"
        />
        <button @click="searchByCity" class="search-button">Search</button>
      </div>
    </div>

    <main>
      <div v-if="weatherData">
        <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
        <div>
          <img :src="iconUrl" alt="Weather Icon" />
          <p>{{ temperature }} °C</p>
        </div>
        <span>{{ weatherData.weather[0].description }}</span>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'

const apikey = '723afda37d2e6e92231706d224185539'.trim()
const BASE = 'https://api.openweathermap.org/data/2.5'

export default {
  name: 'WeatherView',
  data() {
    return {
      city: '',
      weatherData: null,
      hourlyForecast: [],
      dailyForecast: [],
    }
  },
  computed: {
    temperature() {
      return this.weatherData ? Math.round(this.weatherData.main.temp) : null
    },
    iconUrl() {
      return this.weatherData
        ? `https://openweathermap.org/img/wn/${this.weatherData.weather[0].icon}@2x.png`
        : null
    },
  },
  mounted() {
    this.fetchCurrentLocationWeather()
  },
  methods: {
    async searchByCity() {
      const q = this.city.trim()
      if (!q) return
      await this.fetchWeatherData(`${BASE}/weather`, {
        q,
        appid: apikey,
        units: 'metric',
        lang: 'en',
      })
    },

    async fetchCurrentLocationWeather() {
      if (!navigator.geolocation) return
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        await this.fetchWeatherData(`${BASE}/weather`, {
          lat: coords.latitude,
          lon: coords.longitude,
          appid: apikey,
          units: 'metric',
        })
      })
    },

    async fetchWeatherData(url, params) {
      try {
        const { data } = await axios.get(url, { params })
        this.weatherData = data
      } catch (error) {
        console.error(
          'Error fetching weather data:',
          error.response?.status,
          error.response?.data || error.message,
        )
        this.weatherData = null
      }
    },
  },
}
</script>

<style scoped>
.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px;
}
.header {
  text-align: center;
  margin-bottom: 16px;
}
.search-bar {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
}
.search-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-width: 240px;
}
.search-button {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #3b82f6;
  color: #fff;
}
main {
  margin-top: 24px;
  text-align: center;
}
</style>
