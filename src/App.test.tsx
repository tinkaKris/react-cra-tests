import { render, screen, waitFor } from '@testing-library/react'
import App from './App'

describe('App component', () => {
  let fetchMock = jest.fn()

  beforeEach(() => {
    fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 1,
            title: 'Test Post 1',
            body: 'Test Body 1',
            userId: 1
          },
          {
            id: 2,
            title: 'Test Post 2',
            body: 'Test Body 2',
            userId: 1
          }
        ])
    })
    global.fetch = fetchMock
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  test('loads and displays posts', async () => {
    render(<App />)
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    const postTitles = await screen.findAllByRole('heading', { name: /Test Post [1-2]/i })
    expect(postTitles.length).toBeGreaterThan(0)

    const postBodies = await screen.findAllByText(/Test Body [1-2]/i)
    expect(postBodies.length).toBeGreaterThan(0)
  })

  test('displays error message on failed fetch', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Failed to fetch posts'))
    render(<App />)
    const errorMessage = await screen.findByText(/Failed to fetch posts/i)
    expect(errorMessage).toBeInTheDocument()
  })

  test('displays loading message while fetching posts', async () => {
    fetchMock.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve([])
              }),
            1000
          )
        )
    )
    render(<App />)
    expect(screen.getByText(/Loading posts\.\.\./i)).toBeInTheDocument()
    jest.advanceTimersByTime(1100)
    await waitFor(() => expect(screen.queryByText(/Loading posts\.\.\./i)).toBeNull(), { timeout: 2000 })
  })
})