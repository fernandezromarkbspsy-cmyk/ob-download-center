import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import DashboardTabs from '@/components/dashboard-tabs'

describe('DashboardTabs', () => {
  it('renders tabs and calls onTabChange when clicked', () => {
    const tabs = [
      { id: 'a', label: 'Tab A' },
      { id: 'b', label: 'Tab B' },
    ]
    const onTabChange = vi.fn()

    render(<DashboardTabs tabs={tabs} activeTab={'a'} onTabChange={onTabChange} />)

    expect(screen.getByText('Tab A')).toBeInTheDocument()
    expect(screen.getByText('Tab B')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Tab B'))
    expect(onTabChange).toHaveBeenCalledWith('b')
  })
})
