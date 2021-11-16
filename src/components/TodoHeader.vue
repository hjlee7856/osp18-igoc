<style src='../assets/style.css'/>

<template>
    <header>
        <div class='user-wrapper'>
            <div class='user-container'>
                <b class='logout' v-on:click='Logout()'>LOGOUT</b>
            </div>
        </div>

        <div class='info-wrapper'>
            <div class='info-container'>{{ dateInfo }}</div>

            <div class='info-container'>
                <img src='../../static/img/weathers/thunderstorm-rain.png' width='16' height='16' v-if='(weatherInfo >= 200 && weatherInfo <= 202) || (weatherInfo >= 230 && weatherInfo <= 232)'>
                <img src='../../static/img/weathers/thunderstorm.png' width='16' height='16' v-if='(weatherInfo >= 210 && weatherInfo <= 212) || (weatherInfo == 221)'>
                <img src='../../static/img/weathers/drizzle.png' width='16' height='16' v-if='weatherInfo >= 300 && weatherInfo <= 302'>
                <img src='../../static/img/weathers/rain.png' width='16' height='16' v-if='(weatherInfo >= 310 && weatherInfo <= 314) || (weatherInfo == 321) || (weatherInfo >= 500 && weatherInfo <= 504) || (weatherInfo >= 520 && weatherInfo <= 522) || (weatherInfo == 531)'>
                <img src='../../static/img/weathers/snow.png' width='16' height='16' v-if='(weatherInfo == 511) || (weatherInfo >= 600 && weatherInfo <= 602) || (weatherInfo >= 620 && weatherInfo <= 622)'>
                <img src='../../static/img/weathers/sleet.png' width='16' height='16' v-if='(weatherInfo >= 611 && weatherInfo <= 612) || (weatherInfo >= 615 && weatherInfo <= 616)'>
                <img src='../../static/img/weathers/fog.png' width='16' height='16' v-if='(weatherInfo == 701) || (weatherInfo == 711) || (weatherInfo == 721) || (weatherInfo == 741)'>
                <img src='../../static/img/weathers/dust.png' width='16' height='16' v-if='(weatherInfo == 731) || (weatherInfo == 751) || (weatherInfo >= 761 && weatherInfo <= 762)'>
                <img src='../../static/img/weathers/squalls.png' width='16' height='16' v-if='weatherInfo == 771'>
                <img src='../../static/img/weathers/tornado.png' width='16' height='16' v-if='weatherInfo == 781'>
                <img src='../../static/img/weathers/clear.png' width='16' height='16' v-if='weatherInfo == 800'>
                <img src='../../static/img/weathers/few-clouds.png' width='16' height='16' v-if='weatherInfo >= 801 && weatherInfo <= 802'>
                <img src='../../static/img/weathers/overcast-clouds.png' width='16' height='16' v-if='weatherInfo >= 803 && weatherInfo <= 804'>
            </div>
        </div>

        <h1>To-Do</h1>

        <div class='search-wrapper'>
            <input type='text' v-model='searchWord' placeholder='Search'>
        </div>
    </header>
</template>

<script>
import moment from 'moment'

export default {
    data() {
        return {
            dateInfo: '',
            weatherInfo: '',

            searchWord: ''
        }
    },

    created() {
        this.dateInfo = moment(new Date()).format('YYYY-MM-DD');

        navigator.geolocation.getCurrentPosition((location) => {
            this.$http.get('https://api.openweathermap.org/data/2.5/weather?APPID=de10e3c5205646b91ae1211e44bd18f4' + '&lat=' + location.coords.latitude + '&lon=' + location.coords.longitude).then((response) => {
                this.weatherInfo = response.data.weather[0].id;
            });
        });
    },

    watch: {
        searchWord: function () {
            this.$store.dispatch('SearchToDo', { searchWord: this.searchWord });
        }
    },

    methods: {
        Logout() {
            this.$store.dispatch('Logout');
        }
    }
}
</script>