<template>
  <div class="download-app">
    <div class="download-app__container">
      <div class="download-app__container__title">
        Please download the
        <CharterUPLogo style="width: 160px" />
        Drivers App
      </div>
      <div class="download-app__container__message">
        Thank you for using CharterUP. Your account is setup to use our mobile
        app, called CharterUP Drivers. This app will allow you to see and
        complete your assigned trips
      </div>
      <div class="download-app__container__buttons">
        <div class="download-app__container__box">
          <img
            class="download-app__container__box__image"
            src="@/assets/images/app-store.png"
          />
        </div>

        <div class="download-app__container__box">
          <img
            class="download-app__container__box__image"
            src="@/assets/images/google-play.png"
          />
        </div>
      </div>
      <div class="download-app__container__logout">
        <v-btn @click="logout" color="primary">Logout</v-btn>
      </div>
    </div>

    <div class="download-app__phone-container">
      <img
        class="download-app__phone-image"
        src="@/assets/images/phone-app.png"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CharterUPLogo from '@/components/CharterUPLogo.vue'
import modules from '@/store/modules'

@Component({
  components: {
    CharterUPLogo,
  },
})
export default class DownloadApp extends Vue {
  async logout(): Promise<void> {
    modules.auth.logout()
  }
}
</script>
<style lang="scss" scoped>
// @mixin icon-bg() {
//   background-image: url('~@/assets/images/icon-bg.svg');
//   background-size: contain;
//   background-position: top center;
//   background-repeat: no-repeat;
// }

.download-app {
  margin-top: 60px;
  padding: 0;
  display: flex;
  justify-content: left;
  align-items: left;
  padding-bottom: 10vh;
  flex-direction: row;
  flex: 1 1 auto;
  //@include icon-bg;

  &__phone-container {
    flex: 0 0 50%;
    padding-left: 5%;
  }

  &__phone-image {
    width: 100%;
    height: auto;
  }

  &__container {
    flex: 0 0 50%;
    padding-left: 15%;

    &__title {
      font-size: 32px;
      margin-bottom: 15px;
    }

    &__message {
      font-size: 16px;
      margin-bottom: 30px;
      line-height: 37px;
    }

    &__buttons {
      display: flex;
      flex: 1 1 auto;
      flex-direction: row;
      justify-content: space-between;
      align-items: stretch;
      background-size: 1px 90%;
      //background-image: linear-gradient($gray, $gray);
      background-repeat: no-repeat;
      background-position: center;
    }

    &__box {
      display: flex;
      flex: 0 0 40%;
      flex-direction: column;
      justify-content: space-around;

      &__image {
        width: 100%;
        height: auto;
      }
    }

    &__logout {
      padding-top: 20px;
    }
  }

  // @media screen and (max-width: 768px) {
  //   flex-direction: column-reverse;

  //   &__container {
  //     padding-left: 0;
  //     margin: 15px;

  //     &__title {
  //       text-align: center;
  //     }

  //     &__message {
  //       text-align: center;
  //     }

  //     &__box {
  //       &__message {
  //         font-size: 9px;
  //       }
  //     }
  //   }

  //   &__phone-container {
  //     margin-bottom: 30px;
  //     margin-top: 30px;
  //     text-align: center;
  //   }
  // }

  // @media screen and (min-width: 768px) {
  //   &__container {
  //     &__br {
  //       display: none;
  //     }
  //     &__box {
  //       &__message {
  //         font-size: 14px;
  //       }
  //     }
  //   }
  // }
}
</style>
