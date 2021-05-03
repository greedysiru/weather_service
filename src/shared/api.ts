import axios from 'axios';

// axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://54.180.160.165:8080';

type preferenceType = {
  coronaRange: React.SetStateAction<string>,
  pm10Range: React.SetStateAction<string>,
  pm24Range: React.SetStateAction<string>,
  tempRange: React.SetStateAction<string>,
  rainPerRange: React.SetStateAction<string>,
  weatherRange: React.SetStateAction<string>,
  humidityRange: React.SetStateAction<string>,
  windRange: React.SetStateAction<string>,
  uvRange: React.SetStateAction<string>,
  pollenRiskRange: React.SetStateAction<string>,
  asthmaRange: React.SetStateAction<string>,
  foodPoisonRange: React.SetStateAction<string>
}

// 날씨 정보 관련 api
export const weatherAPI = {
  getWeather(latitude: number, longitude: number) {
    axios.defaults.headers.common.token = '';
    return axios.get(`/api/weather/data?longitude=${longitude}&latitude=${latitude}`);
    // return axios.get(`/api/weather/data?longitude=127.0543&latitude=37.5394&temp=0&rainPer=100&weather=0&humidity=0&wind=0&pm10=0&pm25=0&corona=0&uv=0&pollenRisk=0&cold=0&asthma=0&foodPoison=0`)
  },
  fetchPreference(id: string) {
    axios.defaults.headers.common.token = `${id}`;// 여기 들어가는거 괜찮나?
    return axios.get('/api/user/preferences')
  },
  createPreference(id: string, preferece: preferenceType) {
    axios.defaults.headers.common.token = `${id}`;// 여기 들어가는거 괜찮나?
    return axios.post('/api/user/preferences', preferece)
  },
  updatePreference(id: string, preferece: preferenceType) {
    axios.defaults.headers.common.token = `${id}`;// 여기 들어가는거 괜찮나?
    return axios.put('/api/user/preferences', preferece)
  }
}