import { Http } from './http.ts'
import {
  WeatherDataTypes,
  WeatherData,
  WEATHER_PROXY_HANDLER,
} from './weather-data.ts'
const apiKey = process.env.VITE_API_KEY

export class Weather {
  private el: HTMLElement
  private searchButton: HTMLButtonElement
  private searchInput: HTMLInputElement
  private weatherContainer: HTMLDivElement
  private weatherDescription: HTMLDivElement
  private weatherCity: HTMLDivElement
  private weatherTemperature: HTMLDivElement
  private weatherIcon: HTMLImageElement
  private loading: HTMLDivElement

  constructor(el: HTMLElement) {
    this.el = el
    this.searchButton = this.el.querySelector(
      '.search-button'
    ) as HTMLButtonElement
    this.searchInput = this.el.querySelector(
      '.search-input'
    ) as HTMLInputElement
    this.loading = this.el.querySelector('.loading') as HTMLDivElement
    this.weatherContainer = this.el.querySelector('.weather') as HTMLDivElement
    this.weatherDescription = this.el.querySelector(
      '.weather-description'
    ) as HTMLDivElement
    this.weatherCity = this.el.querySelector('.weather-city') as HTMLDivElement
    this.weatherTemperature = this.el.querySelector(
      '.weather-temperature'
    ) as HTMLDivElement
    this.weatherIcon = this.el.querySelector(
      '.weather-icon'
    ) as HTMLImageElement

    this.searchWeather = this.searchWeather.bind(this)
    this.focusOnEnter = this.focusOnEnter.bind(this)
    this.init()
  }

  private focusOnEnter = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      this.searchButton.focus()
    }
  }

  private searchWeather() {
    const cityName = this.searchInput.value.trim()
    if (cityName.length === 0) {
      return alert('Please enter a city name')
    }
    this.loading.style.display = 'block'
    this.weatherContainer.style.display = 'none'
    const URL = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
    Http.fetchData(URL)
      .then((res: any) => {
        const weatherData = new WeatherData(
          cityName,
          res.weather[0].description,
          res.weather[0].icon
        )
        const weatherProxy = new Proxy(weatherData, WEATHER_PROXY_HANDLER)
        const temp = res.main.temp
        weatherProxy.temperature = temp
        this.updateWeather(weatherProxy)
      })
      .catch((error) => alert(error))
    this.searchInput.value = ''
  }

  private capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  private updateWeather(weatherData: WeatherDataTypes) {
    const { cityName, description, temperature, icon } = weatherData

    this.weatherCity.textContent = this.capitalizeFirstLetter(cityName)
    this.weatherDescription.textContent =
      this.capitalizeFirstLetter(description)
    this.weatherTemperature.textContent = temperature.toString()
    this.weatherIcon.setAttribute(
      'src',
      `https://openweathermap.org/img/wn/${icon}.png`
    )
    this.weatherIcon.setAttribute('alt', `${description}-icon`)

    this.loading.style.display = 'none'
    this.weatherContainer.style.display = 'grid'
  }

  private init() {
    this.searchButton.addEventListener('click', this.searchWeather)
    this.searchInput.addEventListener('keydown', this.focusOnEnter)
  }

  public destroy() {
    this.searchButton.removeEventListener('click', this.searchWeather)
    this.searchInput.removeEventListener('keydown', this.focusOnEnter)
  }
}
