import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { UserModel } from './User';
import { api } from '../services/api';
import { withSetPropAction } from "./helpers/withSetPropAction"


export const AuthenticationStoreModel = types
    .model("AuthenticationStore")
    .props({
      user: types.maybe(UserModel),
      id: types.maybe(types.integer),
      authToken: types.maybe(types.string),
    })
    .views((store) => ({
      get isAuthenticated() {
        return !!store.authToken
      },
      get getUser() {
        return store.user
      },
      get getId() {
        return store.id
      },
      get getAuthToken() {
        return store.authToken
      },
    }))
    .actions(withSetPropAction)
    .actions((store) => ({
      setId(value?: number) {
        store.id = value
      },
      setAuthToken(value?: string) {
        store.authToken = value
      },
      logout() {
        store.id = undefined
        store.authToken = undefined
        store.user = undefined
      },
      async fetchUser() {
        const response = await api.getUser(store.getId, store.getAuthToken)
        if (response.kind === "ok") {
          store.setProp("user", response.user)
        } else {
          console.tron.error(`Error fetching user: ${JSON.stringify(response)}`, [])
        }
      },
      async login(email: string, password: string) {
        const response = await api.getToken(email, password)
        if (response.kind === "ok") {
          store.setProp("id", response.id)
          store.setProp("authToken", response.token)
          await this.fetchUser()
        } else {
          console.tron.error(`Error fetching token: ${JSON.stringify(response)}`, [])
        }
      },
      async createUser(email: string, password: string, favoriteTeam?: string) {
        const response = await api.postUser(email, password, favoriteTeam)
        if (response.kind === "ok") {
          await this.login(email, password)
        } else {
          console.tron.error(`Error fetching token: ${JSON.stringify(response)}`, [])
        }
      },
    }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
