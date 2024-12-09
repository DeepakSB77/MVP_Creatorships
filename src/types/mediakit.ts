export interface ChartDataPoint {
  name: string
  value: number
}

export interface AudienceDataItem {
  label: string
  percentage: number
}

export interface AudienceData {
  gender: AudienceDataItem[]
  age: AudienceDataItem[]
  interests: AudienceDataItem[]
  location: AudienceDataItem[]
}

export interface Video {
  thumbnail: string
  title: string
  views: string
  date: string
}

export interface Highlight {
  title: string
  subtitle: string
  stats: string
  conversions: string
}

export interface Platform {
  id: string
  icon: React.ComponentType
  label: string
  color: string
  activeColor: string
}

export interface SocialPlatform {
  icon: React.ComponentType
  count: string
  name: string
  username: string
  color: string
} 