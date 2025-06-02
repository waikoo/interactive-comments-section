export interface Comment {
  id: string
  content: string
  createdAt: string
  score: number
  user: User
  replies: Comment[]
  replyingTo?: string
}

export interface Comments {
  comments: Comment[]
  currentUser: User
}

export interface User {
  image: {
    png: string
    webp: string
  }
  username: string
}
