import LoginForm from '../components/forms/LoginForm.jsx'

export default function Login() {
  return (
    <div className="container-page py-16">
      <div className="max-w-md mx-auto card p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Log in to manage your listings and saved properties.</p>
        <LoginForm />
      </div>
    </div>
  )
}
