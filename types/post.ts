export interface Author {
  id: string
  name: string
  profileImage?: string
  isOwner: boolean
}

export interface Comment {
  id: string
  content: string
  author: Author
  createdAt: string
  mediaUrl?: string
}

export interface VotingOption {
  id: string
  text: string
  count: number
}

export interface Voting {
  question: string
  options: VotingOption[]
  endDate?: string
  isEnded: boolean
  totalVotes: number
  userVoted?: string // ID of the option the user voted for
}

export interface NewsPost {
  id: string
  title: string
  content: string
  author: Author
  createdAt: string
  important: boolean
  pinned: boolean
  categories?: string[]
  mediaUrl?: string
  commentCount: number
  comments?: Comment[]
  hasVoting: boolean
  voting?: Voting
  archived: boolean
}

export interface GeneralPost {
  id: string
  content: string
  author: Author
  createdAt: string
  categories?: string[]
  mediaUrl?: string
  commentCount: number
  comments?: Comment[]
  reactions?: Record<string, number>
  archived: boolean
}

