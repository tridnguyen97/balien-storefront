import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'

import type { AppStore, RootState, PreloadedState } from '../../lib/store'
import { setupStore } from '../../lib/store'

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as preloadedState, store.
interface ExtendedRenderOptions
  extends Omit<RenderOptions, 'queries' | 'wrapper'> {
  preloadedState?: PreloadedState
  store?: AppStore
}

export function renderWithProviders(
  ui: React.ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {}
) {
  const {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  )

  // Return an object with the store, user, and all of RTL's query functions
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  }
}