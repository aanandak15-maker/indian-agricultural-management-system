import React, { useState } from 'react'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import { Sprout, MapPin, BarChart3, Users } from 'lucide-react'

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)

  const toggleMode = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex">
      {/* Left side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-agri-primary to-green-600 p-12 text-white">
        <div className="max-w-md">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Sprout className="h-8 w-8 mr-3" />
              <h1 className="text-3xl font-bold">Agri Dom</h1>
            </div>
            <p className="text-xl text-green-100">
              The complete agricultural management platform for Indian farmers
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Field Management</h3>
                <p className="text-green-100 text-sm">
                  Track and manage all your agricultural fields with detailed mapping and soil analysis
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Analytics & Reports</h3>
                <p className="text-green-100 text-sm">
                  Get insights into your crop yields, financial performance, and environmental impact
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Community</h3>
                <p className="text-green-100 text-sm">
                  Connect with other farmers and share knowledge about best practices
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white/10 rounded-lg">
            <blockquote className="text-green-100 italic">
              "Agri Dom has transformed how I manage my fields. The insights and tracking features have increased my crop yield by 25%."
            </blockquote>
            <cite className="text-sm text-green-200 mt-2 block">
              - Rajesh Kumar, Punjab Farmer
            </cite>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm onToggleMode={toggleMode} />
          ) : (
            <SignupForm onToggleMode={toggleMode} />
          )}
        </div>
      </div>
    </div>
  )
}
