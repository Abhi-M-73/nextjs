
import AppRoutes from './routes/AppRoutes'
import GlobalSnackbar from './components/ui/GlobalSnackbar'
import ScrollToTop from './components/common/ScrollToTop'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <>
      <ScrollToTop />
      <AppRoutes />
       <Toaster />
      <GlobalSnackbar />
    </>
  )
}

export default App
