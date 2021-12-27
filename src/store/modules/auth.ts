import { VuexModule, Module, Action } from 'vuex-class-modules'
import axios from 'axios'

import auth from '@/services/auth'
import user from '@/services/user'
import router from '@/router'

import { UserAuthPayload, Role, User } from '@/models/dto'
import { save, load } from '@/utils/localStorage'

@Module({ generateMutationSetters: true })
class AuthModule extends VuexModule {
  // state
  userId: number | null = load('userId') || null
  user: User | null = load('user') || null
  token: string | null = load('token') || null
  isTokenSet = !!load('token')
  roles: Role[] | null = load('roles') || null

  // getters
  get getUser() {
    return this.user
  }
  get getUserId() {
    return this.userId
  }
  get getToken() {
    return this.token
  }
  get getIsTokenSet() {
    return this.isTokenSet
  }
  get getRoles() {
    return this.roles
  }

  // mutations (mutations are autogenerated for each root level state field)

  // actions
  @Action
  async login(payload: UserAuthPayload) {
    const response = await auth.login(payload)
    if (response.data.successful) {
      save('userId', response.data.user.userId)
      save('token', response.data.token)
      this.token = response.data.token
      this.user = response.data.user
      this.isTokenSet = true
      registerBearerToken(response.data.token)
    }
  }

  @Action
  autoLogin() {
    this.user = load('user')
    this.token = load('token')
    this.isTokenSet = true
    if (this.token) {
      registerBearerToken(this.token)
    }
  }

  @Action
  async logout() {
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('user')
    window.localStorage.removeItem('userId')
    window.localStorage.removeItem('roles')
    this.isTokenSet = false
    router.push({
      name: 'login',
    })
  }

  @Action
  async getUserProfile() {
    const response = await auth.getUserProfile()
    if (response.data.successful) {
      save('roles', response.data.userProfile.roles)
      this.roles = response.data.userProfile.roles
    }
  }

  @Action
  async getUserDetail() {
    if (!this.userId) {
      return
    }

    const response = await user.byId(this.userId)

    // Seems like we don't have a `successful` property to check on this response?
    if (response.status === 200) {
      save('user', response.data)
    }
  }
}

//private helpers
function registerBearerToken(token: string): void {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
// register module
import store from '@/store/index'
export default new AuthModule({ store, name: 'auth' })
