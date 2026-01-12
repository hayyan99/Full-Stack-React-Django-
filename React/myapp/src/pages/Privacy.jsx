import {
  ClipboardList,
  Settings,
  Lock,
  Mail,
  Zap,
  Shield,
  Key,
  BarChart,
  AlertTriangle,
  Scale,
  Phone,
} from "lucide-react";

function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 mt-20">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90 mb-4">
            Your privacy is important to us. Learn how we protect your data.
          </p>
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
            Last updated: December 2024
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <ClipboardList className="text-blue-600 w-5 h-5" />
            </span>
            Information We Collect
          </h2>
          <p className="text-gray-600 mb-6">
            We collect information you provide directly to us, such as when you
            create an account, make a purchase, or contact us for support.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Personal information (name, email, phone number)
            </li>
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Account credentials and preferences
            </li>
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Payment and billing information
            </li>
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Communication history and feedback
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Settings className="text-green-600 w-5 h-5" />
            </span>
            How We Use Your Information
          </h2>
          <p className="text-gray-600 mb-6">
            We use the information we collect to provide, maintain, and improve
            our services:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl ">
              <Lock className="w-10 h-10 mx-auto text-blue-600 mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">
                Security & Authentication
              </h4>
              <p className="text-sm text-gray-600">
                Verify your identity and secure your account
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <Mail className="w-10 h-10 mx-auto text-green-600 mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Communication</h4>
              <p className="text-sm text-gray-600">
                Send important updates and respond to inquiries
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <Zap className="w-10 h-10 mx-auto text-purple-600 mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">
                Service Improvement
              </h4>
              <p className="text-sm text-gray-600">
                Analyze usage patterns to enhance user experience
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <Shield className="text-red-600 w-5 h-5" />
            </span>
            Data Protection
          </h2>
          <p className="text-gray-600 mb-6">
            We implement industry-standard security measures to protect your
            personal information:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <Shield className="text-blue-600 w-6 h-6" />
              <div>
                <h4 className="font-semibold text-gray-800">Encryption</h4>
                <p className="text-sm text-gray-600">
                  All data is encrypted in transit and at rest
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <Key className="text-green-600 w-6 h-6" />
              <div>
                <h4 className="font-semibold text-gray-800">Access Control</h4>
                <p className="text-sm text-gray-600">
                  Strict access controls and authentication
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <BarChart className="text-purple-600 w-6 h-6" />
              <div>
                <h4 className="font-semibold text-gray-800">Regular Audits</h4>
                <p className="text-sm text-gray-600">
                  Continuous monitoring and security assessments
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <AlertTriangle className="text-red-600 w-6 h-6" />
              <div>
                <h4 className="font-semibold text-gray-800">
                  Incident Response
                </h4>
                <p className="text-sm text-gray-600">
                  Rapid response to security incidents
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <Scale className="text-yellow-600 w-5 h-5" />
            </span>
            Your Rights
          </h2>
          <p className="text-gray-600 mb-6">
            You have the following rights regarding your personal data:
          </p>
          <div className="space-y-4">
            {[
              { label: "Access", color: "blue", desc: "Request a copy of your personal data" },
              { label: "Correction", color: "green", desc: "Update or correct inaccurate information" },
              { label: "Deletion", color: "red", desc: "Request deletion of your personal data" },
              { label: "Portability", color: "purple", desc: "Export your data in a structured format" },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 bg-gradient-to-r from-${item.color}-50 to-${item.color}-100 rounded-lg`}
              >
                <span
                  className={`bg-${item.color}-500 text-white px-3 py-1 rounded-full text-sm font-medium`}
                >
                  {item.label}
                </span>
                <span className="text-gray-700">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
              <Phone className="w-5 h-5 text-white" />
            </span>
            Contact Us
          </h2>
          <p className="text-gray-300 mb-6">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-blue-400 font-medium">Email:</span>
              <span className="text-white">privacy@company.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-blue-400 font-medium">Address:</span>
              <span className="text-white">123 Privacy Street, Data City, DC 12345</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
