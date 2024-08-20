import React, { useEffect, useState } from 'react'
import './App.css'

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://jsonplaceholder.typicode.com/posts')
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        const data: Post[] = await response.json()
        setPosts(data)
        setError(null)
      } catch (error) {
        setError('Failed to fetch posts')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <div>
      <h1>Posts</h1>
      {error && <p>{error}</p>}
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App