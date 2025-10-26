import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DashboardHeader from '@/components/dashboard-header'
import { vi } from 'vitest'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: () => null }),
}))

// Mock current user hook
vi.mock('@/lib/use-current-user', () => ({
  useCurrentUser: () => ({ user: { employeeId: 'not-authorized', fullName: 'Test User' }, isLoading: false, logout: vi.fn() })
}))

describe('DashboardHeader navigation menu', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('navigates to Download Board when clicked', async () => {
    render(<DashboardHeader title="SOCPacked Download Board" recordCount={0} />)

    const menuButton = screen.getByTitle('Menu')
    fireEvent.click(menuButton)

    const downloadItem = await screen.findByText('Download Board')
    fireEvent.click(downloadItem)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/?tab=ZIP%20Upload')
    })
  })

  it('shows Not authorized dialog for Database when user is not authorized', async () => {
    render(<DashboardHeader title="SOCPacked Download Board" recordCount={0} />)

    const menuButton = screen.getByTitle('Menu')
    fireEvent.click(menuButton)

    const dbItem = await screen.findByText('Database')
    fireEvent.click(dbItem)

    const notAuthText = await screen.findByText('You do not have access to the Database feature.')
    expect(notAuthText).toBeInTheDocument()
  })
})
