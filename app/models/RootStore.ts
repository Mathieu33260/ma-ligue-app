import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore"
import { LeagueStoreModel } from "./LeagueStore"
import { EpisodeStoreModel } from "./EpisodeStore"
import { TeamStoreModel } from './TeamStore';

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  leagueStore: types.optional(LeagueStoreModel, {}),
  teamStore: types.optional(TeamStoreModel, {}),
  episodeStore: types.optional(EpisodeStoreModel, {}), // @demo remove-current-line
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
