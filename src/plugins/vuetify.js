import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const tunisiaTheme = {
  dark: false,
  colors: {
    primary: '#E07A2F',
    secondary: '#1B6B93',
    accent: '#D4A76A',
    background: '#FAF8F5',
    surface: '#FFFFFF',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'tunisiaTheme',
    themes: { tunisiaTheme },
  },
  defaults: {
    VCard: { rounded: 'lg', elevation: 2 },
    VBtn: { rounded: 'lg' },
    VTextField: { variant: 'outlined', density: 'comfortable' },
    VSelect: { variant: 'outlined', density: 'comfortable' },
  },
})
