import RegisterForm from '../components/forms/RegisterForm.jsx'

export default function Register() {
  return (
    <div className="container-page py-16">
      <div className="max-w-md mx-auto card p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 mb-6">Sign up to save properties, list your own, and message owners.</p>
        <RegisterForm />
      </div>
    </div>
  )
}
