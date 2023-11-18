import { Weather } from './Weather'

const main = document.querySelector('.main') as HTMLElement

const bootstrap = () => {
  new Weather(main)
}
window.addEventListener('DOMContentLoaded', bootstrap)
