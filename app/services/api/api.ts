/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import {
  ApiResponse, // @demo remove-current-line
  ApisauceInstance,
  create,
} from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem" // @demo remove-current-line
import type {
  ApiConfig,
  ApiFeedResponse, // @demo remove-current-line
} from "./api.types"
import type { EpisodeSnapshotIn } from "../../models/Episode"
import { LeagueSnapshotIn } from '../../models/League';
import { UserSnapshotIn } from '../../models/User';
import {useStores} from '../../models';
import {TeamSnapshotIn} from '../../models/Team';

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/ld+json",
      },
    })
  }

  async getLeagues(): Promise<{ kind: "ok"; leagues: LeagueSnapshotIn[] } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
        `/api/leagues?season=2022`,
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data['hydra:member']

      // This is where we transform the data into the shape we expect for our MST model.
      const leagues: LeagueSnapshotIn[] = rawData.map((raw) => ({
            ...raw
          }
      ))

      return { kind: "ok", leagues }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async getTeams(leagueId: number): Promise<{ kind: "ok"; teams: TeamSnapshotIn[] } | GeneralApiProblem> {

    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
        `/api/standings?league.id=${leagueId}`,
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data['hydra:member']

      // This is where we transform the data into the shape we expect for our MST model.
      const teams: TeamSnapshotIn[] = rawData.map((raw) => ({
            ...raw.team
          }
      ))

      return { kind: "ok", teams }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async getUser(): Promise<{ kind: "ok"; user: UserSnapshotIn } | GeneralApiProblem> {

    const {
      authenticationStore: {
          authToken,
          id,
      },
    } = useStores()

    this.apisauce.setHeader('Authorization', `Bearer ${authToken}`)
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
        `/api/users/${id}`,
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const user: UserSnapshotIn = response.data

      return { kind: "ok", user }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async getToken(email: string, password: string): Promise<{ kind: "ok"; id: number, token: string} | GeneralApiProblem> {

    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
        `/authentication_token`,
        {
          email,
          password,
        }
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data

      return { kind: "ok", id: rawData.id, 'token': rawData.token }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async postUser(email: string, password: string, favoriteTeam?: string): Promise<{ kind: "ok" } | GeneralApiProblem> {

    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
        `/api/users`,
        {
          email,
          password,
          favoriteTeam,
        }
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data

      return { kind: "ok" }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeSnapshotIn[] } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
    )
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data
      // This is where we transform the data into the shape we expect for our MST model.
      const episodes: EpisodeSnapshotIn[] = rawData.items.map((raw) => ({
        ...raw,
      }))

      return { kind: "ok", episodes }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
  // @demo remove-block-end
}

// Singleton instance of the API for convenience
export const api = new Api()
