export interface WeatherDataTypes {
  cityName: string
  description: string
  temperature: number
  icon: string
}

export class WeatherData {
  public cityName: string
  public description: string
  public temperature: number
  public icon: string

  constructor(cityName: string, description: string, icon: string) {
    this.cityName = cityName
    this.description = description
    this.icon = icon
    this.temperature = 0
  }
}

export const WEATHER_PROXY_HANDLER = {
  get: function (target: WeatherDataTypes, property: string) {
    return Reflect.get(target, property)
  },
  set: function (
    target: WeatherDataTypes,
    property: string,
    value: string | number
  ) {
    const newValue = `${value} °C`
    return Reflect.set(target, property, newValue)
  },
}
