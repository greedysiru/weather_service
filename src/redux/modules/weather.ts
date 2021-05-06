import { createReducer, createAction, PayloadAction } from '@reduxjs/toolkit';

// 날씨 정보를 관리하는 모듈

// api 가져오기
import { weatherAPI } from '../../shared/api';

// timeActions
import { timeActions } from './time';

// type 선언
// 초기 상태 type
type weatherType = {
  weatherInfo: {
    bigRegion?: {
      bigRegionName: string;
    },
    smallRegion?: {
      smallRegionName: string;
      longitude: string;
      latitude: string;
    }
    ;
    livingHealthWeather?: {
      uvToday: string;
      uvTomorrow: string;
      uvTheDayAfterTomorrow: string;
      oakPollenRiskToday: string;
      oakPollenRiskTomorrow: string;
      oakPollenRiskTheDayAfterTomorrow: string;
      foodPoisonToday: string;
      foodPoisonTomorrow: string;
      foodPoisonTheDayAfterTomorrow: string;
      asthmaToday: string;
      asthmaTomorrow: string;
      asthmaTheDayAfterTomorrow: string;
    };
    weekInfo?: {
      maxTmp: string[];
      minTmp: string[];
      tmp: string[];
      humidity: string[];
      weather: string[];
      weatherDes: string[];
      rainPer: string[];
      windSpeed: string[];
      weatherIcon: string[];
    };
    dayInfo?: {
      tmp: string[];
      weather: string[];
      rainPer: string[];
      weatherDes: string[];
      dailyTime: string[];
      weatherIcon: string[];
    };
    airPollution?: {
      id: number;
      dateTime: string;
      pm10Value: number;
      pm25Value: number;
    };
    corona?: {
      id: number;
      date: string;
      newLocalCaseCount: number;
      newForeignCaseCount: number;
    };
    coronaTotalNewCaseCount?: number;
    dayScoreList?: number[];
  };
  // 날씨 정보 로드 상태
  isLoaded: boolean;
  preference: any;
  //  카드 정보들
  cardsInfo: any;
}



// export const initialState: weatherType = {
//   // 날씨 정보
//   weatherInfo: null,
//   // 날씨 정보 로드 상태
//   isLoaded: false,
//   preference: [],
//   cardsInfo: [],
// }


export const initialState: weatherType = {
  // 날씨 정보
  weatherInfo: null,
  // 날씨 정보 로드 상태
  isLoaded: false,
  preference: [
    { type: "temp", value: 50 },
    { type: "rainPer", value: 50 },
    { type: "weather", value: 50 },
    { type: "humidity", value: 50 },
    { type: "wind", value: 0 },
    { type: "pm10", value: 0 },
    { type: "pm25", value: 0 },
    { type: "corona", value: 0 },
    { type: "uv", value: 0 },
    { type: "pollenRisk", value: 0 },
    { type: "asthma", value: 0 },
    { type: "foodPoison", value: 0 }],
  cardsInfo: [],
}


// 날씨 정보를 받아오는 액션 생성 함수
const setWeatherInfo = createAction<unknown>('weather/SET_WEATHERINFO');
// 로드 상태를 변경하는 액션 생성 함수
const setLoad = createAction<boolean>('weather/SET_LOAD');
// preference를 저장하는 함수
const setPreference = createAction<unknown>('weather/SET_PREFERENCE');
// preference의 순서대로 카드 정보를 가져오는 함수
const setCardsInfo = createAction<unknown>('weather/SET_CARDSINFO');


const weather = createReducer(initialState, {
  [setWeatherInfo.type]: (state: weatherType, action: PayloadAction<unknown>) => {
    state.weatherInfo = action.payload;
  },
  [setLoad.type]: (state: weatherType, action: PayloadAction<boolean>) => {
    state.isLoaded = action.payload;
  },
  [setPreference.type]: (state: weatherType, action: PayloadAction<any>) => {
    state.preference = action.payload;
  },
  [setCardsInfo.type]: (state: weatherType, action: PayloadAction<any>) => {
    state.cardsInfo = action.payload;
  }
})

// 날씨 정보 호출 후 리덕스 state에 저장
const getWeatherInfo = () => async (dispatch) => {
  try {
    const latitude = Number(localStorage.getItem('latitude'));
    const longitude = Number(localStorage.getItem('longitude'));
    const res = await weatherAPI.getWeather(latitude, longitude);

    dispatch(setWeatherInfo(res.data));
    // 현재 시간 기록하기
    dispatch(timeActions.getTimeInfo());

    // 카드 정보 만들기
    dispatch(getCardsInfo());
  }
  catch (error) {
    console.log(error)
  }
};

// 위도, 경도 정보 가져오는 함수
const getLocation = () => (dispatch) => {

  // GPS를 지원하면
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      // GPS 정보 제공을 허용한 경우
      function (position) {
        // 현재 사용자 위치의 위도, 경도 정보를 가져오기

        const { latitude, longitude } = position.coords
        // localstorage에 저장
        localStorage.setItem('latitude', String(latitude));
        localStorage.setItem('longitude', String(longitude));
        // 현재 위치정보를 기반으로 날씨 정보 불러오기
        dispatch(getWeatherInfo());
      },
      // error
      function (error) {
        alert('위치 정보 제공을 허용해주세요.');
        console.log(error);
      });
  } else {
    alert('GPS를 지원하지 않습니다.')
  }
}


export type preferenceType = {
  coronaRange: string;
  pm10Range: string;
  pm25Range: string;
  tempRange: string;
  rainPerRange: string;
  weatherRange: string;
  humidityRange: string;
  windRange: string;
  uvRange: string;
  pollenRiskRange: string;
  asthmaRange: string;
  foodPoisonRange: string;
}

// preference의 순서대로 카드 정보를 받아오는 함수
const getCardsInfo = () => async (dispatch, getState) => {
  try {
    // weatherInfo
    const {
      weekInfo, livingHealthWeather, coronaTotalNewCaseCount, airPollution,
    } = getState().weather.weatherInfo;
    // preference
    const { preference } = getState().weather;
    // 기본 카드 정보
    const defaultCardData = {
      temp: { label: '기온', value: weekInfo.tmp[0] },
      rainPer: { label: '강수확률', value: weekInfo.rainPer[0] },
      weather: { label: '하늘', value: weekInfo.weather[0] },
      humidity: { label: '습도', value: weekInfo.humidity[0] },
      wind: { label: '바람', value: weekInfo.windSpeed[0] },
      pm10: { label: '미세먼지', value: airPollution.pm10Value },
      pm25: { label: '초미세먼지', value: airPollution.pm25Value },
      corona: { label: '코로나', value: coronaTotalNewCaseCount },
      uv: { label: '자외선', value: livingHealthWeather.uvToday },
      pollenRisk: { label: '꽃가루농도', value: livingHealthWeather.oakPollenRiskToday },
      asthma: { label: '폐질환위험', value: livingHealthWeather.asthmaToday },
      foodPoison: { label: '식중독위험', value: livingHealthWeather.foodPoisonToday }
    }
    // 첫번째, 두번째 슬라이드 카드
    const first = [];
    const second = [];
    // preference를 참조하여 데이터 넣기
    for (let i = 0; i < 12; i += 1) {
      if (i < 4) {
        const { type } = preference[i];
        const { label, value } = defaultCardData[type];
        first.push({ type, label, value })
      } else {
        const { type } = preference[i];
        const { label, value } = defaultCardData[type];
        second.push({ type, label, value })
      }
    }
    // 카드 정보 넣기
    dispatch(setCardsInfo({ first, second }));
    // 로드 상태 ture(로딩 완료)
    dispatch(setLoad(true));
  } catch (error) {
    console.log(error);
  }
}

// setting preference 생성
const fetchPreference = (id: string) => async (dispatch, getState, { history }) => {
  try {
    const res = await weatherAPI.fetchPreference(id)
    const preferectDic = res.data
    // const defaultPreference = [
    //   { type: "temp", value: 50 },
    //   { type: "rainPer", value: 50 },
    //   { type: "weather", value: 50 },
    //   { type: "humidity", value: 50 },
    //   { type: "wind", value: 0 },
    //   { type: "pm10", value: 0 },
    //   { type: "pm25", value: 0 },
    //   { type: "corona", value: 0 },
    //   { type: "uv", value: 0 },
    //   { type: "pollenRisk", value: 0 },
    //   { type: "asthma", value: 0 },
    //   { type: "foodPoison", value: 0 }]
    const defaultPreference = getState().weather.preferece;
    let preference = []

    if (!preferectDic) {
      preference = defaultPreference
    } else {
      Object.keys(preferectDic).forEach((key, idx) => {
        if (key !== 'identification') {
          preference.push({ type: key, value: preferectDic[key] })
        }
      })

      preference.sort((a, b) => {
        return b.value - a.value
      })
    }

    dispatch(setPreference(preference))
  } catch (error) {
    // 에러페이지로 이동?
    console.error(error)
  }
};

const fetchCreatePreference = (id: string, data: preferenceType) => async (dispatch, getState, { history }) => {
  try {
    const res = await weatherAPI.createPreference(id, data);

    dispatch(fetchPreference(id))
    alert('선호도를 저장했습니다 :)')

  } catch (error) {
    // 에러페이지로 이동??
    console.error(error)
  }
};

const fetchUpdatePreference = (id: string, data: preferenceType) => async (dispatch, getState, { history }) => {
  try {
    const res = await weatherAPI.updatePreference(id, data);
    dispatch(fetchPreference(id))
    alert('선호도를 수정했습니다 :)')

  } catch (error) {
    // 에러페이지로 이동?
    console.error(error)
  }
};


export const weatherActions = {
  getWeatherInfo,
  getLocation,
  fetchCreatePreference,
  fetchUpdatePreference,
  fetchPreference,
  getCardsInfo
}

export default weather;
