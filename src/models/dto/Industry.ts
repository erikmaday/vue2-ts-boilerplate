export interface IndustryType {
  id: number
  key: string
  label: string
  description: string
  companyId?: number
  active: boolean
}

export interface ParentIndustry {
  industryId: number
  label: string
  companyId: number
  active: boolean
  industryTypeId: number
  parentIndustryId: number
  isOther: boolean
  parentIndustry: ParentIndustry
  industryType: IndustryType
  subIndustryIds: number[]
  industries?: Industry[]
}

export interface Industry {
  industryId: number
  label: string
  companyId: number
  active: boolean
  industryTypeId: number
  parentIndustryId: number
  isOther: boolean
  parentIndustry: ParentIndustry
  industryType: IndustryType
  subIndustryIds: number[]
  industries: string
}
