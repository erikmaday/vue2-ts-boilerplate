import { Action, Module, VuexModule } from 'vuex-class-modules'
import { Route, Location } from 'vue-router/types/router'
import systemParameter from '@/services/systemParameter'
import { filter } from '@/utils/filter'
import { SystemParameter } from '@/models/dto/SystemParameter'

@Module({ generateMutationSetters: true })
class AppModule extends VuexModule {
  // state
  appTitle = 'CharterUP for Operators'
  lastRoute: Location | null = null
  systemParameters: SystemParameter[] = []
  areLoadersEnabled = false

  // getters
  get getAppTitle() {
    return this.appTitle
  }

  get getLastRoute() {
    return this.lastRoute
  }

  get getSystemParameters() {
    return this.systemParameters
  }

  get getAreLoadersEnabled() {
    return this.areLoadersEnabled
  }

  // mutations (mutations are autogenerated for each root level state field)

  // actions
  @Action
  saveLastRoute(route: Route): void {
    this.lastRoute = {
      name: route?.name || undefined,
      path: route?.path,
      hash: route?.hash,
      query: route?.query,
      params: route?.params,
    }
  }

  @Action
  async fetchSystemParameters() {
    const response = await systemParameter.tableView({
      sorts: null,
      filters: null,
      pageSize: -1,
      page: 1,
    })
    this.systemParameters = response.data.resultList
    this.calculateSystemParameters()
  }

  @Action
  calculateSystemParameters() {
    this.areLoadersEnabled = checkIfSkeletonLoadersAreEnabled(
      this.systemParameters
    )
  }
}

// PRIVATE HELPERS
const checkSystemParameter = (
  systemParameters: SystemParameter[],
  systemParameterName: string
): SystemParameter | null => {
  return systemParameters.find(
    (systemParameter) => systemParameter.name === systemParameterName
  )
}

const checkIfSkeletonLoadersAreEnabled = (
  systemParameters: SystemParameter[]
): boolean => {
  const foundParameter = checkSystemParameter(systemParameters, 'cupopsLoaders')
  return foundParameter?.value === 'true'
}

// register module (could be in any file)
import store from '@/store/index'
export default new AppModule({ store, name: 'app' })
