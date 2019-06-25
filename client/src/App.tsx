import React from 'react'
import './App.css'
import Todos from './components/Todos'
import Amplify from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react'
const USER_POOL_ID = process.env.REACT_APP_USER_POOL_ID
const USER_POOL_WEB_CLIENT_ID = process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID

Amplify.configure({
  Auth: {
    region: 'ap-northeast-1',
    userPoolId: `${USER_POOL_ID}`,
    userPoolWebClientId: `${USER_POOL_WEB_CLIENT_ID}`,
  }
})

const App: React.FC = () => {
  return (
    <div className="container">
      <Todos />
    </div>
  )
}

export default withAuthenticator(App, true, [])
