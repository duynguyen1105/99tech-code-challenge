import { PROBLEM_ID, SEVERITY } from './constants'

export type ProblemIdType = (typeof PROBLEM_ID)[keyof typeof PROBLEM_ID]

export type SeverityType = (typeof SEVERITY)[keyof typeof SEVERITY]
