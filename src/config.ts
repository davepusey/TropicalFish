export const config: IConfig = {
    globalRewardCommands: ['xp add @s 2700 levels'],
    typeRewardCommands: ['xp add @s 2700 points'],
    namedRewardCommands: ['xp add @s 22 points'],
    datapackFormat: 10,
    resourcepackFormat: 9,
    techName: "tropicalfish",
    i18nName: "Tropical Fish",
    jsonMinified: true
}

export interface IConfig {
    globalRewardCommands: string[]
    typeRewardCommands: string[]
    namedRewardCommands: string[]
    datapackFormat: number
    resourcepackFormat: number
    techName: string
    i18nName: string
    jsonMinified: boolean
}